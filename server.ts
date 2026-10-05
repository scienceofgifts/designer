import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

// Generous payload limit for high-res base64 image uploads
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set. Please configure it in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. Analyze an uploaded design image
app.post('/api/analyze-design', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/png', name = 'Untitled Design', source = 'My Design', category = 'Apparel' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 in request body.' });
    }

    // Optional development test simulator for testing error resilience
    const simError = req.headers['x-test-simulated-error'] || req.query.simulateError;
    if (simError === '503') {
      const simErr: any = new Error('{"error":{"code":503,"message":"This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.","status":"UNAVAILABLE"}}');
      simErr.status = 503;
      throw simErr;
    } else if (simError === '400') {
      const simErr: any = new Error('{"error":{"code":400,"message":"Invalid argument: image payload is malformed or corrupted.","status":"INVALID_ARGUMENT"}}');
      simErr.status = 400;
      throw simErr;
    }

    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '').trim();
    const cleanMimeType = (mimeType || 'image/png').replace(/^data:/, '').split(';')[0].trim() || 'image/png';

    const ai = getGeminiClient();

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

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: cleanMimeType,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            designType: {
              type: Type.STRING,
              description: 'Primary product or design format (e.g., T-shirt, Hoodie, Poster, Mug, Emblem, Journal).',
            },
            visualCharacteristics: {
              type: Type.OBJECT,
              properties: {
                typography: { type: Type.STRING, description: 'Typeface classifications, weights, serif/sans treatment, and lettering details.' },
                composition: { type: Type.STRING, description: 'Spatial arrangement, focal anchors, and structural alignment.' },
                colorPalette: { type: Type.STRING, description: 'Specific color tones, contrast ratio, ink characteristics, and background interplay.' },
                illustration: { type: Type.STRING, description: 'Illustration style, linework weight, shading, or texture technique.' },
                layout: { type: Type.STRING, description: 'Placement on the canvas or garment.' },
                visualHierarchy: { type: Type.STRING, description: 'Ordering of focal attention (primary lead, secondary context, tertiary details).' },
                negativeSpace: { type: Type.STRING, description: 'Degree and role of breathing room and margins.' },
                symmetry: { type: Type.STRING, description: 'Symmetrical, asymmetrical, balanced off-center, or radial.' },
                density: { type: Type.STRING, description: 'Information density: minimal, disciplined, moderate, or dense.' },
              },
              required: ['typography', 'composition', 'colorPalette', 'illustration', 'layout', 'visualHierarchy', 'negativeSpace', 'symmetry', 'density'],
            },
            conceptualCharacteristics: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING, description: 'The overt subject matter or thematic topic.' },
                concept: { type: Type.STRING, description: 'The underlying intellectual or creative premise.' },
                tone: { type: Type.STRING, description: 'The psychological and emotional tone.' },
                humor: { type: Type.STRING, description: 'Presence and subtlety of irony, humor, or earnest gravity.' },
                emotionalQuality: { type: Type.STRING, description: 'Atmosphere or sentiment projected.' },
                intendedAudience: { type: Type.STRING, description: 'Target cultural or interest demographic.' },
                communicationApproach: { type: Type.STRING, description: 'Rhetorical vehicle (e.g. definition, manifesto, emblem, subtle nod).' },
              },
              required: ['subject', 'concept', 'tone', 'humor', 'emotionalQuality', 'intendedAudience', 'communicationApproach'],
            },
            techniques: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 to 6 design techniques utilized.',
            },
            whyItWorks: {
              type: Type.STRING,
              description: 'A 2-3 sentence creative evaluation explaining why the design is effective.',
            },
            distinctiveCharacteristics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2 to 4 unique signature markers of this design.',
            },
          },
          required: ['designType', 'visualCharacteristics', 'conceptualCharacteristics', 'techniques', 'whyItWorks', 'distinctiveCharacteristics'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({ success: true, analysis: parsed });
  } catch (error: any) {
    console.error('Error analyzing design:', error);

    let cleanMessage = error?.message || 'Failed to analyze design image with Gemini.';
    let statusCode = error?.status || error?.statusCode || 500;
    let geminiStatus = 'ERROR';

    // Parse if error.message is serialized JSON from GoogleGenAI SDK
    try {
      const parsed = typeof cleanMessage === 'string' ? JSON.parse(cleanMessage) : cleanMessage;
      if (parsed?.error) {
        if (parsed.error.code) statusCode = parsed.error.code;
        if (parsed.error.status) geminiStatus = parsed.error.status;
        if (parsed.error.message) cleanMessage = parsed.error.message;
      }
    } catch {
      // Keep original cleanMessage
    }

    const isUnavailable =
      statusCode === 503 ||
      geminiStatus === 'UNAVAILABLE' ||
      cleanMessage.includes('503') ||
      cleanMessage.toLowerCase().includes('high demand') ||
      cleanMessage.toLowerCase().includes('spikes in demand') ||
      cleanMessage.toLowerCase().includes('unavailable') ||
      cleanMessage.toLowerCase().includes('overloaded');

    if (isUnavailable) {
      statusCode = 503;
      geminiStatus = 'UNAVAILABLE';
    }

    const httpCode = statusCode >= 400 && statusCode < 600 ? statusCode : 500;

    return res.status(httpCode).json({
      success: false,
      error: cleanMessage,
      statusCode: httpCode,
      geminiStatus,
      isTemporary: isUnavailable || httpCode === 503 || httpCode === 429,
      rawError: typeof error?.message === 'string' ? error.message : undefined,
    });
  }
});

// 2. Synthesize Design DNA across all analyzed designs
app.post('/api/synthesize-dna', async (req, res) => {
  try {
    const { designs } = req.body;

    if (!Array.isArray(designs) || designs.length === 0) {
      return res.status(400).json({ error: 'At least one analyzed design is required to synthesize Design DNA.' });
    }

    const ai = getGeminiClient();

    const designsSummary = designs.map((d: any, index: number) => ({
      index: index + 1,
      name: d.name,
      source: d.source,
      category: d.category,
      designType: d.analysis?.designType,
      visual: d.analysis?.visualCharacteristics,
      conceptual: d.analysis?.conceptualCharacteristics,
      techniques: d.analysis?.techniques,
      distinctive: d.analysis?.distinctiveCharacteristics,
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
2. strength: An empirical frequency/strength statement showing observed recurrence (e.g., "Observed across ${Math.min(totalCount, Math.max(1, Math.round(totalCount * 0.75)))} of ${totalCount} analyzed designs" or "High consistency across personal works").
3. observation: Concise explanation of how the creator executes this trait.

Also provide:
- philosophy: A rich 2-3 sentence synthesis of the overarching creative philosophy that ties their work together.
- avoid: 4 to 6 specific anti-patterns that directly contradict this creator's aesthetic (e.g., "Avoid glossy bevels or neon drop shadows", "Avoid crowded edge-to-edge layouts").

Return strictly in the specified JSON schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            typography: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  trait: { type: Type.STRING },
                  strength: { type: Type.STRING },
                  observation: { type: Type.STRING },
                },
                required: ['trait', 'strength', 'observation'],
              },
            },
            composition: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  trait: { type: Type.STRING },
                  strength: { type: Type.STRING },
                  observation: { type: Type.STRING },
                },
                required: ['trait', 'strength', 'observation'],
              },
            },
            color: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  trait: { type: Type.STRING },
                  strength: { type: Type.STRING },
                  observation: { type: Type.STRING },
                },
                required: ['trait', 'strength', 'observation'],
              },
            },
            concepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  trait: { type: Type.STRING },
                  strength: { type: Type.STRING },
                  observation: { type: Type.STRING },
                },
                required: ['trait', 'strength', 'observation'],
              },
            },
            tone: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  trait: { type: Type.STRING },
                  strength: { type: Type.STRING },
                  observation: { type: Type.STRING },
                },
                required: ['trait', 'strength', 'observation'],
              },
            },
            techniques: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  trait: { type: Type.STRING },
                  strength: { type: Type.STRING },
                  observation: { type: Type.STRING },
                },
                required: ['trait', 'strength', 'observation'],
              },
            },
            philosophy: {
              type: Type.STRING,
              description: 'Synthesis of the creator\'s design philosophy.',
            },
            avoid: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Patterns to avoid.',
            },
          },
          required: ['typography', 'composition', 'color', 'concepts', 'tone', 'techniques', 'philosophy', 'avoid'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({ success: true, dna: parsed });
  } catch (error: any) {
    console.error('Error synthesizing Design DNA:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to synthesize Design DNA with Gemini.',
    });
  }
});

// 3. Enhance Prompt with AI
app.post('/api/enhance-prompt', async (req, res) => {
  try {
    const { structuredPrompt, designDna, dnaInfluence = 'Balanced', references } = req.body;

    if (!structuredPrompt) {
      return res.status(400).json({ error: 'Missing structuredPrompt in request body.' });
    }

    const ai = getGeminiClient();

    const promptText = `You are a master creative director and prompt engineer specializing in world-class image generation for apparel, merchandise, and editorial graphic design (e.g. Midjourney v6, Imagen 3, Flux 1.1 Pro).

The user has constructed the following structured creative brief using deterministic selections:

--- STRUCTURED BRIEF START ---
${structuredPrompt}
--- STRUCTURED BRIEF END ---

${
  designDna
    ? `The user has enabled their personal "Design DNA" with ${dnaInfluence} influence:
- Overarching Philosophy: ${designDna.philosophy || 'N/A'}
- Key Typographic Rules: ${designDna.typography?.map((t: any) => `${t.trait} (${t.observation})`).join('; ') || 'N/A'}
- Composition Habits: ${designDna.composition?.map((t: any) => `${t.trait} (${t.observation})`).join('; ') || 'N/A'}
- Color Habits: ${designDna.color?.map((t: any) => `${t.trait} (${t.observation})`).join('; ') || 'N/A'}
- Elements to Avoid: ${designDna.avoid?.join(', ') || 'N/A'}`
    : 'No Design DNA active.'
}

${
  references && references.length > 0
    ? `Reference designs selected for inspiration (CRITICAL: Borrow principles and visual grammar only; do not copy copyrighted elements or distinct artworks directly):
${references.map((r: any) => `- "${r.name}": Borrowing [${(r.borrowedAspects || []).join(', ')}]`).join('\n')}`
    : ''
}

YOUR MISSION:
Synthesize this brief into an elevated, production-ready final prompt for high-end image generation.
The enhanced prompt must:
1. Transform raw parameter lists into vivid, coherent art direction prose with lighting, garment or surface texture (e.g., heavyweight 280gsm ring-spun combed cotton, tactile screen printed plastisol or discharge ink, crisp serigraph registration), typography treatments, and compositional balance.
2. Emphasize craftsmanship, editorial restraint, and clean visual execution.
3. Explicitly weave in the Design DNA rules (calibrated to the ${dnaInfluence} influence setting).
4. Strictly honor the "Important Constraints" and "Avoid" directives.
5. Provide a cohesive output that includes:
   - Full master prompt ready for one-click copy and pasting into image models.
   - A brief breakdown of artistic direction notes and negative constraints.

Return the response strictly adhering to the JSON schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            enhancedPrompt: {
              type: Type.STRING,
              description: 'The complete, polished master image generation prompt in fluid artistic prose.',
            },
            artisticDirection: {
              type: Type.STRING,
              description: 'Concise summary of the creative strategy and visual aesthetic direction.',
            },
            negativeGuidance: {
              type: Type.STRING,
              description: 'Explicit negative prompt parameters and banned tropes.',
            },
            executionNotes: {
              type: Type.STRING,
              description: 'Recommended rendering flags, aspect ratios, or model tips (e.g. --ar 4:5, crisp flat vector print).',
            },
          },
          required: ['enhancedPrompt', 'artisticDirection', 'negativeGuidance', 'executionNotes'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error('Error enhancing prompt:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to enhance prompt with Gemini.',
    });
  }
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`DesignDNA Studio server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
