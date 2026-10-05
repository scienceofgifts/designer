import { GiftGuideHowToChooseOptions, GiftGuideTone } from './types';
import { composeWritingStyleBlocks } from '../../../utils/styleManager';
import { WritingStylesConfig } from '../styles';

function formatToneDescription(tone: GiftGuideTone): string {
  switch (tone) {
    case 'conversational-editorial':
      return 'Conversational Editorial — Smart, thoughtful advice delivered with warmth, clarity, and real-world empathy.';
    case 'warm-helpful':
      return 'Warm & Helpful — Reassuring, supportive, and practical, easing decision anxiety for the gift-giver.';
    case 'witty-refined':
      return 'Witty but Refined — Sharp, clever insights with good humor about shopping dilemmas.';
    case 'practical':
      return 'Practical & Actionable — Clear criteria, decision checklists, and concrete dos and don’ts.';
    case 'informational':
      return 'Informational & Scholarly — Grounded in craftsmanship nuances, material standards, and connoisseur details.';
    default:
      return 'Editorial and helpful.';
  }
}

function formatLengthDirective(length: 'concise' | 'standard' | 'comprehensive'): string {
  switch (length) {
    case 'concise':
      return 'Concise (3 key guidelines, ~120–150 words) — Quick, punchy rules of thumb.';
    case 'standard':
      return 'Standard (4–5 structured points, ~200–300 words) — Balanced advice covering taste, utility, and common pitfalls.';
    case 'comprehensive':
      return 'Comprehensive Guide (~350–450 words) — In-depth breakdown with concrete scenarios, questions to ask yourself, and presentation tips.';
    default:
      return 'Standard (4–5 structured points).';
  }
}

/**
 * Builds a prompt specifically for generating the "How to Choose the Right Gift" advice section.
 * Does NOT generate the entire gift guide.
 * Automatically incorporates Global + Editorial writing styles.
 */
export function generateGiftGuideHowToChoosePrompt(
  options: GiftGuideHowToChooseOptions,
  styles?: Partial<WritingStylesConfig>
): string {
  const guideTitle = options.guideTitle.trim() || 'Curated Gift Guide';
  const recipient = options.recipient.trim() || 'The intended recipient';
  const considerations = options.importantConsiderations.trim() || 'Quality of materials, level of interest/expertise, display space, and personal aesthetics';
  const toneDesc = formatToneDescription(options.tone);
  const lengthDesc = formatLengthDirective(options.desiredLength);

  const keywordSection = options.primaryKeyword?.trim()
    ? `• Target Keyword: "${options.primaryKeyword.trim()}" (Weave naturally into advice if organic)`
    : '';

  const additionalSection = options.additionalInstructions?.trim()
    ? `\nADDITIONAL CURATOR INSTRUCTIONS:\n${options.additionalInstructions.trim()}\n`
    : '';

  const styleSection = composeWritingStyleBlocks(
    { includeGlobal: true, includeEditorial: true },
    styles
  );

  return `Gift Guide "How to Choose the Right Gift" Section Prompt — Science of Gifts

ROLE & TASK:
Act as a seasoned gifting advisor and cultural curator for "Science of Gifts" writing the buyer's guidance section titled "How to Choose the Right Gift" (or a thematic variation) for a specific gift guide.

SCOPE CONSTRAINT:
Generate ONLY this advice section. Do NOT write the entire gift guide, product lists, or full article.

PARENT GIFT GUIDE CONTEXT:
• Overall Guide Title / Topic: "${guideTitle}"
• Target Recipient / Audience: ${recipient}
${keywordSection}

BUYER GUIDANCE SPECIFICATIONS:
• Core Considerations to Address:
${considerations.split('\n').map(c => `  - ${c}`).join('\n')}
• Tone of Voice: ${toneDesc}
• Desired Length: ${lengthDesc}

SECTION WRITING OBJECTIVES:
1. Provide Genuinely Useful Decision Criteria:
   - Give the reader concrete mental models to decide between different options (e.g., beginner vs. enthusiast, heirloom display piece vs. daily functional utility, subtle vs. bold designs).
   - Address common gifting pitfalls specific to "${guideTitle}" (e.g. buying cheap novelty gimmicks that end up in landfills, duplicate tools, or patronizing beginner gear).

2. Make the Advice Topic-Specific:
   - Avoid generic advice like "think about what they like" or "set a budget". Every tip must feel tailor-made for ${recipient} in the domain of "${guideTitle}".
   - Provide concrete clues to look for (e.g., what’s already on their bookshelf, what they talk about during weekend downtime, their aesthetic preferences).
${additionalSection}
${styleSection}
OUTPUT FORMAT:
Provide:
1. An Inviting H2 Heading (e.g. "How to Choose the Perfect Gift for [Recipient]")
2. A Short Introductory Framing Paragraph (2–3 sentences)
3. 3–5 Actionable Advice Points with bold takeaway titles and clear explanatory prose.`;
}
