/**
 * DesignDNA Studio - Frontend Gemini API Client
 *
 * Calls the Cloudflare Worker API (or local server in dev mode)
 * Base URL is configured via VITE_GEMINI_API_URL environment variable.
 */

// Resolves the API base URL cleanly:
// - If VITE_GEMINI_API_URL is set (e.g. "https://designdna-worker.your-subdomain.workers.dev"), use it.
// - If empty/unset, defaults to relative "" (which routes to /api/* on the same origin / dev proxy).
export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_GEMINI_API_URL;
  if (typeof envUrl === 'string' && envUrl.trim() !== '') {
    // Strip trailing slash if present
    return envUrl.trim().replace(/\/+$/, '');
  }
  return '';
}

export interface AnalyzeDesignRequest {
  imageBase64: string;
  mimeType?: string;
  name?: string;
  source?: string;
  category?: string;
}

export interface AnalyzeDesignResponse {
  success: boolean;
  analysis?: any;
  error?: string;
  statusCode?: number;
  geminiStatus?: string;
  isTemporary?: boolean;
}

export interface SynthesizeDnaResponse {
  success: boolean;
  dna?: any;
  error?: string;
  statusCode?: number;
}

export interface EnhancePromptResponse {
  success: boolean;
  result?: any;
  error?: string;
  statusCode?: number;
}

/**
 * Call the Cloudflare Worker / backend API to analyze a design image.
 */
export async function analyzeDesignApi(payload: AnalyzeDesignRequest): Promise<AnalyzeDesignResponse> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/analyze-design`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    const errorMsg = data.error || `HTTP ${response.status}: Failed to analyze image with Gemini.`;
    const errObj = new Error(errorMsg);
    (errObj as any).status = data.statusCode || response.status;
    (errObj as any).geminiStatus = data.geminiStatus || (response.status === 503 ? 'UNAVAILABLE' : undefined);
    (errObj as any).data = data;
    (errObj as any).rawMessage = data.error;
    throw errObj;
  }

  return data;
}

/**
 * Call the Cloudflare Worker / backend API to synthesize Design DNA from analyzed designs.
 */
export async function synthesizeDnaApi(designs: any[]): Promise<SynthesizeDnaResponse> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/synthesize-dna`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ designs }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.error || `HTTP ${response.status}: Failed to synthesize Design DNA.`);
  }

  return data;
}

/**
 * Call the Cloudflare Worker / backend API to enhance a prompt with AI art direction.
 */
export async function enhancePromptApi(payload: {
  structuredPrompt: string;
  designDna: any | null;
  dnaInfluence?: string;
  references?: Array<{ name: string; borrowedAspects: string[] }>;
}): Promise<EnhancePromptResponse> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/enhance-prompt`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.error || `HTTP ${response.status}: Failed to enhance prompt.`);
  }

  return data;
}
