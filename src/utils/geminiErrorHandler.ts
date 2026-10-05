/**
 * Gemini Error Classification & Resilience Handler
 *
 * Classifies API and network errors into clear user-facing categories:
 * - TEMPORARY_BUSY (HTTP 503, UNAVAILABLE, High Demand) -> retryable
 * - NETWORK_FAILURE (Connection issues, timeout, offline) -> retryable
 * - AUTH_CONFIG (401/403, missing/invalid GEMINI_API_KEY) -> non-retryable
 * - INVALID_IMAGE (Normalization error, 400 invalid argument) -> non-retryable
 * - UNKNOWN (unexpected failures) -> non-retryable
 */

export type GeminiErrorCategory =
  | 'TEMPORARY_BUSY'
  | 'NETWORK_FAILURE'
  | 'AUTH_CONFIG'
  | 'INVALID_IMAGE'
  | 'UNKNOWN';

export interface ClassifiedError {
  category: GeminiErrorCategory;
  title: string;
  message: string;
  isRetryable: boolean;
  statusCode?: number;
  geminiStatus?: string;
  technicalDetails: string;
}

/**
 * Extracts and classifies an error from any stage of the Gemini request pipeline.
 */
export function classifyGeminiError(error: any, rawResponse?: any): ClassifiedError {
  // 1. Gather all potential message strings
  let rawMsg = '';
  if (typeof error === 'string') {
    rawMsg = error;
  } else if (error?.rawMessage && typeof error.rawMessage === 'string') {
    rawMsg = error.rawMessage;
  } else if (error?.message && typeof error.message === 'string') {
    rawMsg = error.message;
  } else if (rawResponse?.error && typeof rawResponse.error === 'string') {
    rawMsg = rawResponse.error;
  }

  // 2. Extract structured fields if message is serialized JSON
  let extractedMessage = rawMsg;
  let parsedStatus: number | undefined;
  let parsedCode: string | undefined;

  try {
    const parsed = typeof rawMsg === 'string' && rawMsg.startsWith('{') ? JSON.parse(rawMsg) : null;
    if (parsed) {
      if (parsed.error && typeof parsed.error === 'object') {
        if (parsed.error.code) parsedStatus = Number(parsed.error.code);
        if (parsed.error.status) parsedCode = String(parsed.error.status);
        if (parsed.error.message) extractedMessage = String(parsed.error.message);
      } else if (parsed.message) {
        extractedMessage = String(parsed.message);
      }
      if (parsed.code) parsedCode = String(parsed.code);
      if (parsed.statusCode) parsedStatus = Number(parsed.statusCode);
    }
  } catch {
    // Keep rawMsg
  }

  const statusCode =
    error?.status ||
    rawResponse?.statusCode ||
    rawResponse?.status ||
    parsedStatus;

  const geminiStatus =
    error?.geminiStatus ||
    rawResponse?.geminiStatus ||
    parsedCode ||
    (statusCode === 503 ? 'UNAVAILABLE' : undefined);

  const combined = `${rawMsg} ${extractedMessage} ${geminiStatus || ''} ${JSON.stringify(rawResponse || '')}`.toLowerCase();

  // 3. Detect Temporary Model Availability / 503 / UNAVAILABLE / High Demand
  const is503 =
    statusCode === 503 ||
    geminiStatus === 'UNAVAILABLE' ||
    rawResponse?.isTemporary === true ||
    error?.isTemporary === true ||
    combined.includes('503') ||
    combined.includes('unavailable') ||
    combined.includes('high demand') ||
    combined.includes('spikes in demand') ||
    combined.includes('overloaded') ||
    combined.includes('resource_exhausted') ||
    combined.includes('rate limit') ||
    combined.includes('429');

  if (is503) {
    const displayDetails =
      extractedMessage && !extractedMessage.startsWith('{')
        ? extractedMessage
        : 'This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.';

    return {
      category: 'TEMPORARY_BUSY',
      title: 'Gemini is temporarily busy',
      message: 'Gemini is currently experiencing high demand. Please try again in a moment.',
      isRetryable: true,
      statusCode: 503,
      geminiStatus: 'UNAVAILABLE',
      technicalDetails: `HTTP 503 · UNAVAILABLE\n\n${displayDetails}`,
    };
  }

  // 4. Detect Network / Connection Failure
  const isNetwork =
    combined.includes('failed to fetch') ||
    combined.includes('networkerror') ||
    combined.includes('econnreset') ||
    combined.includes('etimedout') ||
    combined.includes('connection refused') ||
    combined.includes('offline');

  if (isNetwork) {
    return {
      category: 'NETWORK_FAILURE',
      title: 'Connection problem',
      message: 'Gemini could not be reached. Check your connection and try again.',
      isRetryable: true,
      statusCode: 0,
      technicalDetails: `Connection Problem\n\n${rawMsg || 'Failed to establish connection to the server or Gemini API.'}`,
    };
  }

  // 5. Detect API Key / Authentication Failure (401 / 403)
  const isAuth =
    statusCode === 401 ||
    statusCode === 403 ||
    geminiStatus === 'PERMISSION_DENIED' ||
    geminiStatus === 'UNAUTHENTICATED' ||
    combined.includes('api_key_invalid') ||
    combined.includes('api key') ||
    combined.includes('gemini_api_key') ||
    combined.includes('unauthenticated') ||
    combined.includes('permission_denied') ||
    combined.includes('unauthorized');

  if (isAuth) {
    return {
      category: 'AUTH_CONFIG',
      title: 'Gemini configuration problem',
      message: 'Your Gemini API configuration could not be authenticated. Please check your GEMINI_API_KEY.',
      isRetryable: false,
      statusCode: statusCode || 401,
      geminiStatus: geminiStatus || 'UNAUTHENTICATED',
      technicalDetails: `HTTP ${statusCode || 401} · ${geminiStatus || 'UNAUTHENTICATED'}\n\n${extractedMessage || 'API key authentication failed. Please verify your GEMINI_API_KEY environment variable.'}`,
    };
  }

  // 6. Detect Invalid Image or Payload / 400
  const isInvalid =
    statusCode === 400 ||
    geminiStatus === 'INVALID_ARGUMENT' ||
    combined.includes('could not be prepared') ||
    combined.includes('normalization') ||
    combined.includes('invalid argument') ||
    combined.includes('unsupported image') ||
    combined.includes('svg parse') ||
    combined.includes('canvas export');

  if (isInvalid) {
    return {
      category: 'INVALID_IMAGE',
      title: 'Unable to analyze this image',
      message: 'The image could not be prepared for Gemini analysis.',
      isRetryable: false,
      statusCode: 400,
      geminiStatus: geminiStatus || 'INVALID_ARGUMENT',
      technicalDetails: `HTTP 400 · INVALID_ARGUMENT\n\n${extractedMessage || 'The image could not be prepared or verified for Gemini analysis.'}`,
    };
  }

  // 7. Fallback - preserve technical error rather than discarding it!
  const fallbackMessage =
    extractedMessage && !extractedMessage.startsWith('{')
      ? extractedMessage
      : 'Something unexpected prevented the analysis from completing.';

  return {
    category: 'UNKNOWN',
    title: 'Analysis failed',
    message: fallbackMessage,
    isRetryable: false,
    statusCode: statusCode || 500,
    technicalDetails: `HTTP ${statusCode || 500}\n\n${rawMsg || fallbackMessage}`,
  };
}

/**
 * Parses an errorMessage string stored on a design item.
 * Supports serialized ClassifiedError objects, serialized Gemini errors, or plain strings.
 */
export function parseErrorMessage(errorString?: string): {
  title: string;
  message: string;
  technical: string;
  category: GeminiErrorCategory;
} {
  if (!errorString) {
    return {
      title: 'Analysis failed',
      message: 'Something unexpected prevented the analysis from completing.',
      technical: '',
      category: 'UNKNOWN',
    };
  }

  try {
    const parsed = JSON.parse(errorString);
    if (parsed && typeof parsed === 'object') {
      // 1. If it's a serialized ClassifiedError
      if (parsed.title && parsed.message) {
        return {
          title: parsed.title,
          message: parsed.message,
          technical: parsed.technicalDetails || parsed.technical || parsed.message,
          category: parsed.category || 'UNKNOWN',
        };
      }

      // 2. If it's a serialized raw Gemini response { error: { message: "...", code: 503 } }
      const reclassified = classifyGeminiError(parsed.error?.message || parsed.message || parsed, parsed);
      return {
        title: reclassified.title,
        message: reclassified.message,
        technical: reclassified.technicalDetails,
        category: reclassified.category,
      };
    }
  } catch {
    // Not serialized JSON, parse as string
  }

  const classified = classifyGeminiError(errorString);
  return {
    title: classified.title,
    message: classified.message,
    technical: classified.technicalDetails,
    category: classified.category,
  };
}
