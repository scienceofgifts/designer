import { GiftGuideIntroOptions, GiftGuideAngle, GiftGuideTone } from './types';
import { composeWritingStyleBlocks } from '../../../utils/styleManager';
import { WritingStylesConfig } from '../styles';

function formatToneDescription(tone: GiftGuideTone): string {
  switch (tone) {
    case 'conversational-editorial':
      return 'Conversational Editorial — Smart, warm, and engaging with varied prose cadence.';
    case 'warm-helpful':
      return 'Warm and Helpful — Supportive, empathetic, and reassuring without condescension.';
    case 'witty-refined':
      return 'Witty but Refined — Elegant wit and subtle intellectual charm without slang or forced humor.';
    case 'practical':
      return 'Practical & Grounded — Direct, focused on utility, value, and solving real gifting dilemmas.';
    case 'informational':
      return 'Informational & Curious — Grounded in craftsmanship, history, and intellectual wonder.';
    default:
      return 'Editorial and thoughtful.';
  }
}

function formatAngleDescription(angle: GiftGuideAngle): string {
  switch (angle) {
    case 'general-gift-guide':
      return 'General Curated Showcase — Celebrating craftsmanship, curiosity, and standout design.';
    case 'specific-recipient':
      return 'Specific Recipient Persona — Deeply tuned to this recipient’s specific daily rituals, habits, and taste.';
    case 'hobby-interest':
      return 'Deep Enthusiast Angle — Respects the genuine nuance and depth of the passion, avoiding beginner clichés.';
    case 'by-budget':
      return 'Value Across Budgets — Explaining how thoughtfulness matters far more than arbitrary price tags.';
    case 'problem-solving':
      return 'Problem-Solving / Dilemma — Solving real friction (e.g., "for the person who already has everything" or "meaningful clutter-free gifts").';
    case 'occasion-based':
      return 'Occasion-Tied — Reflecting the emotional cadence and celebration of the occasion.';
    default:
      return 'Curated editorial angle.';
  }
}

/**
 * Builds a prompt specifically for generating the Introduction section of a gift guide.
 * Does NOT generate the full gift guide.
 * Automatically incorporates Global + Editorial writing styles.
 */
export function generateGiftGuideIntroPrompt(
  options: GiftGuideIntroOptions,
  styles?: Partial<WritingStylesConfig>
): string {
  const title = options.guideTitle.trim() || 'Curated Gift Guide';
  const recipient = options.recipient.trim() || 'Thoughtful gift recipients';
  const keywordSection = options.primaryKeyword?.trim()
    ? `• Primary Keyword: "${options.primaryKeyword.trim()}" (Weave naturally into the opening thoughts; do NOT force or repeat awkwardly)`
    : '• Primary Keyword: None specified (prioritize natural readability)';
  const angleDesc = formatAngleDescription(options.desiredAngle);
  const toneDesc = formatToneDescription(options.tone);
  const additionalSection = options.additionalInstructions?.trim()
    ? `\nADDITIONAL CURATOR INSTRUCTIONS:\n${options.additionalInstructions.trim()}\n`
    : '';

  const styleSection = composeWritingStyleBlocks(
    { includeGlobal: true, includeEditorial: true },
    styles
  );

  return `Gift Guide Introduction Prompt — Science of Gifts

ROLE & TASK:
Act as a seasoned cultural and lifestyle essayist writing specifically the INTRODUCTION SECTION for a gift guide published by "Science of Gifts".

SCOPE CONSTRAINT:
Write ONLY the introductory section (approximately 150–250 words). Do NOT generate the product list, headings for other sections, or the full gift guide. Your output must strictly be the opening narrative of the article.

GIFT GUIDE CONTEXT:
• Gift Guide Title / Topic: "${title}"
• Target Recipient / Audience: ${recipient}
• Editorial Angle: ${angleDesc}
• Tone of Voice: ${toneDesc}
${keywordSection}

OBJECTIVES FOR THIS INTRODUCTION:
1. Establish the Topic Naturally:
   - Hook the reader immediately with an authentic observation, a relatable truth about gifting, or a captivating historical/scientific insight related to the topic.
   - Avoid generic platitudes and hollow openings like "Finding the perfect gift is hard" or "In today's fast-paced world".

2. Clarify Who This Guide is For:
   - Clearly identify the recipient persona (${recipient}) and acknowledge their particular tastes, quirks, and standards.
   - Explain why thoughtful curation matters here, cutting through the noise of mass-market generic items.

3. Build Anticipation & Credibility:
   - Set up the collection ahead with taste, warmth, and discernment.
   - Smoothly transition the reader into the first curated item without awkward segue formulas like "Without further ado, let's dive into the list".
${additionalSection}
${styleSection}
OUTPUT FORMAT:
Provide 2 distinct introduction variations:
- Option A: Conversational & Narrative (warm, engaging storytelling hook)
- Option B: Sleek & Editorial (refined, concise, and punchy)
Followed by a suggested 1-sentence transition line leading into the guide's first product.`;
}
