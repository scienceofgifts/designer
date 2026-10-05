/**
 * Client-side Image Normalization Utility
 *
 * Normalizes all image types (procedural/starter SVGs, uploaded SVGs, PNG, JPEG, WEBP, etc.)
 * into valid raster base64 payloads suitable for Gemini API `inlineData`.
 *
 * Requirements:
 * - Detect format
 * - Rasterize SVGs client-side onto an HTML5 Canvas into high-res PNG
 * - Extract pure base64 image data without `data:image/...;base64,` prefixes
 * - Determine accurate MIME types (e.g. image/png, image/jpeg, image/webp)
 * - Zero server-side or third-party image processing dependencies
 */

export interface NormalizedImageData {
  base64Data: string;
  mimeType: string;
}

/**
 * Parses and rasterizes SVG markup or SVG data URLs into a PNG base64 string using an in-memory Canvas.
 */
export async function convertSvgToPngBase64(
  svgStringOrDataUrl: string,
  minDimension: number = 800
): Promise<NormalizedImageData> {
  return new Promise((resolve, reject) => {
    try {
      let rawSvg = '';

      if (svgStringOrDataUrl.startsWith('data:image/svg+xml;utf8,')) {
        rawSvg = decodeURIComponent(svgStringOrDataUrl.slice('data:image/svg+xml;utf8,'.length));
      } else if (svgStringOrDataUrl.startsWith('data:image/svg+xml;base64,')) {
        const base64Part = svgStringOrDataUrl.slice('data:image/svg+xml;base64,'.length);
        rawSvg = decodeURIComponent(escape(atob(base64Part)));
      } else if (svgStringOrDataUrl.startsWith('data:image/svg+xml')) {
        // Generic data URL prefix
        const commaIdx = svgStringOrDataUrl.indexOf(',');
        if (commaIdx !== -1) {
          const payload = svgStringOrDataUrl.slice(commaIdx + 1);
          try {
            rawSvg = decodeURIComponent(payload);
          } catch {
            rawSvg = atob(payload);
          }
        } else {
          rawSvg = svgStringOrDataUrl;
        }
      } else {
        rawSvg = svgStringOrDataUrl;
      }

      // Parse XML to validate markup and inspect viewBox / dimensions
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawSvg, 'image/svg+xml');
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        throw new Error(`SVG Parse Error: ${parserError.textContent?.slice(0, 100) || 'Invalid XML'}`);
      }

      const svgElem = doc.querySelector('svg');
      if (!svgElem) {
        throw new Error('No <svg> root element found in provided markup.');
      }

      // Compute natural canvas dimensions from viewBox or attributes
      let naturalWidth = 800;
      let naturalHeight = 800;

      const viewBox = svgElem.getAttribute('viewBox');
      if (viewBox) {
        const parts = viewBox.trim().split(/[\s,]+/).map(Number);
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
          naturalWidth = Math.round(parts[2]);
          naturalHeight = Math.round(parts[3]);
        }
      } else {
        const attrW = parseFloat(svgElem.getAttribute('width') || '');
        const attrH = parseFloat(svgElem.getAttribute('height') || '');
        if (attrW > 0 && attrH > 0) {
          naturalWidth = Math.round(attrW);
          naturalHeight = Math.round(attrH);
        }
      }

      // Upscale if below minDimension to preserve crisp detail for AI vision
      let renderWidth = naturalWidth;
      let renderHeight = naturalHeight;
      if (renderWidth < minDimension || renderHeight < minDimension) {
        const scaleFactor = Math.max(minDimension / renderWidth, minDimension / renderHeight);
        renderWidth = Math.round(renderWidth * scaleFactor);
        renderHeight = Math.round(renderHeight * scaleFactor);
      }

      // Ensure explicit width/height in SVG XML so headless image rasterizer has exact dimensions
      svgElem.setAttribute('width', String(renderWidth));
      svgElem.setAttribute('height', String(renderHeight));
      if (!svgElem.getAttribute('xmlns')) {
        svgElem.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      }

      const serializer = new XMLSerializer();
      const processedSvg = serializer.serializeToString(svgElem);

      const blob = new Blob([processedSvg], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);

      const img = new Image();
      img.crossOrigin = 'anonymous';

      let cleanedUp = false;
      const cleanup = () => {
        if (!cleanedUp) {
          cleanedUp = true;
          URL.revokeObjectURL(blobUrl);
        }
      };

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = renderWidth;
          canvas.height = renderHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            cleanup();
            reject(new Error('Unable to acquire 2D canvas context for SVG rendering.'));
            return;
          }

          // Draw the loaded SVG vector onto canvas
          ctx.drawImage(img, 0, 0, renderWidth, renderHeight);
          cleanup();

          // Export as PNG
          const pngDataUrl = canvas.toDataURL('image/png');
          const base64Data = pngDataUrl.replace(/^data:image\/png;base64,/, '');

          if (!base64Data || base64Data.length === 0) {
            reject(new Error('Canvas export produced empty base64 string.'));
            return;
          }

          resolve({
            base64Data,
            mimeType: 'image/png',
          });
        } catch (err: any) {
          cleanup();
          reject(err);
        }
      };

      img.onerror = (e) => {
        cleanup();
        reject(new Error('Browser failed to render SVG into Image object: ' + (e instanceof Event ? e.type : 'error')));
      };

      img.src = blobUrl;
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Normalizes any reference image (SVG data URL, base64 data URL, blob URL, external URL)
 * into a pure base64 payload and MIME type suitable for Gemini `inlineData`.
 */
export async function normalizeImageForAnalysis(imageInput: string): Promise<NormalizedImageData> {
  if (!imageInput || typeof imageInput !== 'string') {
    throw new Error('Invalid or missing image input.');
  }

  const trimmed = imageInput.trim();

  // Case 1: Raw SVG markup string
  if (trimmed.startsWith('<svg') || trimmed.includes('<svg xmlns=')) {
    return await convertSvgToPngBase64(trimmed);
  }

  // Case 2: SVG Data URL (utf8 or base64)
  if (trimmed.startsWith('data:image/svg+xml')) {
    return await convertSvgToPngBase64(trimmed);
  }

  // Case 3: Raster Data URL (PNG, JPEG, WEBP, etc.)
  const dataUrlMatch = trimmed.match(/^data:([^;,]+)(?:;[a-zA-Z0-9=-]+)*;base64,(.+)$/s);
  if (dataUrlMatch) {
    const rawMime = dataUrlMatch[1].toLowerCase().trim();
    const rawBase64 = dataUrlMatch[2].trim();

    if (rawMime.includes('svg')) {
      return await convertSvgToPngBase64(trimmed);
    }

    // Supported standard raster formats
    return {
      mimeType: rawMime,
      base64Data: rawBase64,
    };
  }

  // Case 4: Remote or Blob URL (e.g. blob:..., http:..., https:..., /assets/...)
  if (trimmed.startsWith('blob:') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    const res = await fetch(trimmed);
    if (!res.ok) {
      throw new Error(`Failed to fetch image source: HTTP ${res.status}`);
    }
    const blob = await res.blob();
    const blobType = blob.type.toLowerCase();

    if (blobType.includes('svg') || trimmed.endsWith('.svg')) {
      const svgText = await blob.text();
      return await convertSvgToPngBase64(svgText);
    }

    // Convert raster Blob to Base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const match = result.match(/^data:([^;,]+)(?:;[a-zA-Z0-9=-]+)*;base64,(.+)$/s);
        if (match) {
          resolve({
            mimeType: match[1].toLowerCase().trim(),
            base64Data: match[2].trim(),
          });
        } else {
          reject(new Error('Failed to extract base64 from image blob.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image blob into base64.'));
      reader.readAsDataURL(blob);
    });
  }

  // Fallback: If it's pure base64 without prefix
  if (/^[A-Za-z0-9+/=]+$/.test(trimmed) && trimmed.length > 50) {
    return {
      mimeType: 'image/png',
      base64Data: trimmed,
    };
  }

  throw new Error('Unsupported image format or unrecognized image URI.');
}
