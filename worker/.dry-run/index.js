var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.ts
var DEFAULT_MODEL = "gemini-2.5-flash";
function getCorsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const headers = new Headers();
  if (env.ALLOWED_ORIGINS) {
    const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
    if (allowed.includes(origin) || allowed.includes("*")) {
      headers.set("Access-Control-Allow-Origin", origin || "*");
    } else {
      headers.set("Access-Control-Allow-Origin", allowed[0]);
    }
  } else {
    headers.set("Access-Control-Allow-Origin", origin || "*");
  }
  headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-test-simulated-error");
  headers.set("Access-Control-Max-Age", "86400");
  headers.set("Vary", "Origin");
  return headers;
}
__name(getCorsHeaders, "getCorsHeaders");
function jsonResponse(data, status = 200, corsHeaders) {
  const headers = new Headers(corsHeaders);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), { status, headers });
}
__name(jsonResponse, "jsonResponse");
var src_default = {
  async fetch(request, env) {
    const corsHeaders = getCorsHeaders(request, env);
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "");
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }
    if (path === "" || path === "/" || path === "/api/health" || path === "/api") {
      return jsonResponse(
        {
          status: "ok",
          service: "DesignDNA Studio Gemini API Worker",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        },
        200,
        corsHeaders
      );
    }
    const apiEndpoints = ["/api/analyze-design", "/api/synthesize-dna", "/api/enhance-prompt"];
    if (apiEndpoints.includes(path)) {
      if (request.method !== "POST") {
        const errorHeaders = new Headers(corsHeaders);
        errorHeaders.set("Allow", "POST, OPTIONS");
        return jsonResponse(
          {
            success: false,
            error: `Method Not Allowed: ${request.method}. This endpoint requires HTTP POST with a JSON payload.`,
            statusCode: 405
          },
          405,
          errorHeaders
        );
      }
    }
    if (!env.GEMINI_API_KEY) {
      return jsonResponse(
        {
          success: false,
          error: "GEMINI_API_KEY is not configured in the Cloudflare Worker environment. Please add it as a secret.",
          statusCode: 500,
          geminiStatus: "UNAUTHENTICATED"
        },
        500,
        corsHeaders
      );
    }
    const modelName = env.GEMINI_MODEL || DEFAULT_MODEL;
    try {
      if (path === "/api/analyze-design") {
        const body = await request.json().catch(() => ({}));
        const { imageBase64, mimeType = "image/png", name = "Untitled Design", source = "My Design", category = "Apparel" } = body;
        if (!imageBase64 || typeof imageBase64 !== "string") {
          return jsonResponse(
            {
              success: false,
              error: "Missing or invalid imageBase64 in request body.",
              statusCode: 400
            },
            400,
            corsHeaders
          );
        }
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "").trim();
        const cleanMimeType = (mimeType || "image/png").replace(/^data:/, "").split(";")[0].trim() || "image/png";
        const promptText = `You are a world-class graphic designer, art director, and apparel design analyst.
Perform an in-depth, structured design analysis of this design titled "${name}" (Source: ${source}, Category: ${category}).

Analyze both visual mechanics and conceptual intent. Be precise, objective, and analytical rather than generic.
Identify:
1. Exact design type and medium.
2. Visual characteristics: typography (serif/sans/condensed/weights), composition & balance, color palette & ink shades, illustration style & line weights, spatial layout, visual hierarchy, negative space discipline, symmetry/asymmetry, and information density.
3. Conceptual characteristics: subject, intellectual hook/concept, tone (e.g. deadpan, scholarly, subversive, quiet luxury), humor or seriousness, emotional resonance, intended audience archetype, communication approach.
4. Specific design techniques utilized (e.g., dictionary definition format, vintage screen print distress, heraldic crest badge, Swiss modernist grid, typographic hierarchy).
5. Why the design works: concise creative strategy behind its aesthetic and conceptual success.
6. Distinctive characteristics: 2 to 4 signature traits that make this design standout and memorable.

Return the response strictly adhering to the JSON schema.`;
        const geminiRequestBody = {
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: cleanMimeType,
                    data: cleanBase64
                  }
                },
                {
                  text: promptText
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                designType: {
                  type: "STRING",
                  description: "Primary product or design format (e.g., T-shirt, Hoodie, Poster, Mug, Emblem, Journal)."
                },
                visualCharacteristics: {
                  type: "OBJECT",
                  properties: {
                    typography: { type: "STRING", description: "Typeface classifications, weights, serif/sans treatment, and lettering details." },
                    composition: { type: "STRING", description: "Spatial arrangement, focal anchors, and structural alignment." },
                    colorPalette: { type: "STRING", description: "Specific color tones, contrast ratio, ink characteristics, and background interplay." },
                    illustration: { type: "STRING", description: "Illustration style, linework weight, shading, or texture technique." },
                    layout: { type: "STRING", description: "Placement on the canvas or garment." },
                    visualHierarchy: { type: "STRING", description: "Ordering of focal attention (primary lead, secondary context, tertiary details)." },
                    negativeSpace: { type: "STRING", description: "Degree and role of breathing room and margins." },
                    symmetry: { type: "STRING", description: "Symmetrical, asymmetrical, balanced off-center, or radial." },
                    density: { type: "STRING", description: "Information density: minimal, disciplined, moderate, or dense." }
                  },
                  required: ["typography", "composition", "colorPalette", "illustration", "layout", "visualHierarchy", "negativeSpace", "symmetry", "density"]
                },
                conceptualCharacteristics: {
                  type: "OBJECT",
                  properties: {
                    subject: { type: "STRING", description: "The overt subject matter or thematic topic." },
                    concept: { type: "STRING", description: "The underlying intellectual or creative premise." },
                    tone: { type: "STRING", description: "The psychological and emotional tone." },
                    humor: { type: "STRING", description: "Presence and subtlety of irony, humor, or earnest gravity." },
                    emotionalQuality: { type: "STRING", description: "Atmosphere or sentiment projected." },
                    intendedAudience: { type: "STRING", description: "Target cultural or interest demographic." },
                    communicationApproach: { type: "STRING", description: "Rhetorical vehicle (e.g. definition, manifesto, emblem, subtle nod)." }
                  },
                  required: ["subject", "concept", "tone", "humor", "emotionalQuality", "intendedAudience", "communicationApproach"]
                },
                techniques: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                  description: "3 to 6 design techniques utilized."
                },
                whyItWorks: {
                  type: "STRING",
                  description: "A 2-3 sentence creative evaluation explaining why the design is effective."
                },
                distinctiveCharacteristics: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                  description: "2 to 4 unique signature markers of this design."
                }
              },
              required: ["designType", "visualCharacteristics", "conceptualCharacteristics", "techniques", "whyItWorks", "distinctiveCharacteristics"]
            }
          }
        };
        const geminiRes = await callGeminiApi(modelName, env.GEMINI_API_KEY, geminiRequestBody);
        if (!geminiRes.ok) {
          return handleGeminiApiError(geminiRes, corsHeaders);
        }
        const geminiData = await geminiRes.json();
        const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        const parsed = JSON.parse(rawText.trim() || "{}");
        return jsonResponse(
          {
            success: true,
            analysis: parsed
          },
          200,
          corsHeaders
        );
      }
      if (path === "/api/synthesize-dna") {
        const body = await request.json().catch(() => ({}));
        const { designs } = body;
        if (!Array.isArray(designs) || designs.length === 0) {
          return jsonResponse(
            {
              success: false,
              error: "At least one analyzed design is required to synthesize Design DNA.",
              statusCode: 400
            },
            400,
            corsHeaders
          );
        }
        const designsSummary = designs.map((d, index) => ({
          index: index + 1,
          name: d.name,
          source: d.source,
          category: d.category,
          designType: d.analysis?.designType,
          visual: d.analysis?.visualCharacteristics,
          conceptual: d.analysis?.conceptualCharacteristics,
          techniques: d.analysis?.techniques,
          distinctive: d.analysis?.distinctiveCharacteristics
        }));
        const totalCount = designs.length;
        const promptText = `You are an elite creative director and design system architect.
Synthesize the recurring "Design DNA" across ${totalCount} analyzed designs from this creator's reference library.

Here is the structured data of all ${totalCount} analyzed designs:
${JSON.stringify(designsSummary, null, 2)}

Your task:
Analyze recurring patterns, shared stylistic rules, consistent color habits, dominant typographic choices, conceptual tropes, and structural habits.
For each category (typography, composition, color, concepts, tone, techniques), identify 2 to 4 strong recurring principles.
Crucially, for each principle, provide:
1. trait: A clear, memorable title (e.g., "Disciplined Serif & Sans Hierarchy", "Generous Asymmetrical Negative Space", "Subdued Warm Monochrome Palette").
2. strength: An empirical frequency/strength statement showing observed recurrence.
3. observation: Concise explanation of how the creator executes this trait.

Also provide:
- philosophy: A rich 2-3 sentence synthesis of the overarching creative philosophy that ties their work together.
- avoid: 4 to 6 specific anti-patterns that directly contradict this creator's aesthetic.

Return strictly in the specified JSON schema.`;
        const geminiRequestBody = {
          contents: [
            {
              parts: [{ text: promptText }]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                typography: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      trait: { type: "STRING" },
                      strength: { type: "STRING" },
                      observation: { type: "STRING" }
                    },
                    required: ["trait", "strength", "observation"]
                  }
                },
                composition: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      trait: { type: "STRING" },
                      strength: { type: "STRING" },
                      observation: { type: "STRING" }
                    },
                    required: ["trait", "strength", "observation"]
                  }
                },
                color: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      trait: { type: "STRING" },
                      strength: { type: "STRING" },
                      observation: { type: "STRING" }
                    },
                    required: ["trait", "strength", "observation"]
                  }
                },
                concepts: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      trait: { type: "STRING" },
                      strength: { type: "STRING" },
                      observation: { type: "STRING" }
                    },
                    required: ["trait", "strength", "observation"]
                  }
                },
                tone: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      trait: { type: "STRING" },
                      strength: { type: "STRING" },
                      observation: { type: "STRING" }
                    },
                    required: ["trait", "strength", "observation"]
                  }
                },
                techniques: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      trait: { type: "STRING" },
                      strength: { type: "STRING" },
                      observation: { type: "STRING" }
                    },
                    required: ["trait", "strength", "observation"]
                  }
                },
                philosophy: {
                  type: "STRING",
                  description: "Synthesis of the creator's design philosophy."
                },
                avoid: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                  description: "Patterns to avoid."
                }
              },
              required: ["typography", "composition", "color", "concepts", "tone", "techniques", "philosophy", "avoid"]
            }
          }
        };
        const geminiRes = await callGeminiApi(modelName, env.GEMINI_API_KEY, geminiRequestBody);
        if (!geminiRes.ok) {
          return handleGeminiApiError(geminiRes, corsHeaders);
        }
        const geminiData = await geminiRes.json();
        const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        const parsed = JSON.parse(rawText.trim() || "{}");
        return jsonResponse(
          {
            success: true,
            dna: parsed
          },
          200,
          corsHeaders
        );
      }
      if (path === "/api/enhance-prompt") {
        const body = await request.json().catch(() => ({}));
        const { structuredPrompt, designDna, dnaInfluence = "Balanced", references } = body;
        if (!structuredPrompt) {
          return jsonResponse(
            {
              success: false,
              error: "Missing structuredPrompt in request body.",
              statusCode: 400
            },
            400,
            corsHeaders
          );
        }
        const promptText = `You are a master creative director and prompt engineer specializing in world-class image generation for apparel, merchandise, and editorial graphic design.

The user has constructed the following structured creative brief using deterministic selections:

--- STRUCTURED BRIEF START ---
${structuredPrompt}
--- STRUCTURED BRIEF END ---

${designDna ? `The user has enabled their personal "Design DNA" with ${dnaInfluence} influence:
- Overarching Philosophy: ${designDna.philosophy || "N/A"}
- Key Typographic Rules: ${designDna.typography?.map((t) => `${t.trait} (${t.observation})`).join("; ") || "N/A"}
- Composition Habits: ${designDna.composition?.map((t) => `${t.trait} (${t.observation})`).join("; ") || "N/A"}
- Color Habits: ${designDna.color?.map((t) => `${t.trait} (${t.observation})`).join("; ") || "N/A"}
- Elements to Avoid: ${designDna.avoid?.join(", ") || "N/A"}` : "No Design DNA active."}

${references && references.length > 0 ? `Reference designs selected for inspiration (Borrow principles and visual grammar only):
${references.map((r) => `- "${r.name}": Borrowing [${(r.borrowedAspects || []).join(", ")}]`).join("\n")}` : ""}

YOUR MISSION:
Synthesize this brief into an elevated, production-ready final prompt for high-end image generation.
1. Transform raw parameter lists into vivid, coherent art direction prose with texture, typography treatments, and compositional balance.
2. Emphasize craftsmanship, editorial restraint, and clean visual execution.
3. Explicitly weave in the Design DNA rules (calibrated to the ${dnaInfluence} influence setting).
4. Strictly honor the "Important Constraints" and "Avoid" directives.
5. Provide a cohesive output adhering to the JSON schema.`;
        const geminiRequestBody = {
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                enhancedPrompt: {
                  type: "STRING",
                  description: "The complete, polished master image generation prompt in fluid artistic prose."
                },
                artisticDirection: {
                  type: "STRING",
                  description: "Concise summary of the creative strategy and visual aesthetic direction."
                },
                negativeGuidance: {
                  type: "STRING",
                  description: "Explicit negative prompt parameters and banned tropes."
                },
                executionNotes: {
                  type: "STRING",
                  description: "Recommended rendering flags, aspect ratios, or model tips."
                }
              },
              required: ["enhancedPrompt", "artisticDirection", "negativeGuidance", "executionNotes"]
            }
          }
        };
        const geminiRes = await callGeminiApi(modelName, env.GEMINI_API_KEY, geminiRequestBody);
        if (!geminiRes.ok) {
          return handleGeminiApiError(geminiRes, corsHeaders);
        }
        const geminiData = await geminiRes.json();
        const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        const parsed = JSON.parse(rawText.trim() || "{}");
        return jsonResponse(
          {
            success: true,
            result: parsed
          },
          200,
          corsHeaders
        );
      }
      return jsonResponse(
        {
          success: false,
          error: `Endpoint not found: ${path}`,
          statusCode: 404
        },
        404,
        corsHeaders
      );
    } catch (err) {
      return jsonResponse(
        {
          success: false,
          error: err?.message || "Unexpected error processing request in Cloudflare Worker.",
          statusCode: 500
        },
        500,
        corsHeaders
      );
    }
  }
};
async function callGeminiApi(model, apiKey, body) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "DesignDNA-Cloudflare-Worker/1.0"
    },
    body: JSON.stringify(body)
  });
}
__name(callGeminiApi, "callGeminiApi");
async function handleGeminiApiError(geminiRes, corsHeaders) {
  const errorData = await geminiRes.json().catch(() => ({}));
  const errorObj = errorData?.error || {};
  let message = errorObj?.message || `Gemini API returned HTTP ${geminiRes.status}`;
  let statusCode = errorObj?.code || geminiRes.status;
  let geminiStatus = errorObj?.status || "ERROR";
  const isUnavailable = statusCode === 503 || geminiStatus === "UNAVAILABLE" || message.toLowerCase().includes("high demand") || message.toLowerCase().includes("spikes in demand") || message.toLowerCase().includes("unavailable") || message.toLowerCase().includes("overloaded");
  if (isUnavailable) {
    statusCode = 503;
    geminiStatus = "UNAVAILABLE";
  }
  const httpCode = statusCode >= 400 && statusCode < 600 ? statusCode : 500;
  return jsonResponse(
    {
      success: false,
      error: message,
      statusCode: httpCode,
      geminiStatus,
      isTemporary: isUnavailable || httpCode === 503 || httpCode === 429
    },
    httpCode,
    corsHeaders
  );
}
__name(handleGeminiApiError, "handleGeminiApiError");
export {
  src_default as default
};
//# sourceMappingURL=index.js.map
