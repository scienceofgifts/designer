import { GiftGuideMoreGiftsOptions, GiftGuideTone } from './types';
import { composeWritingStyleBlocks } from '../../../utils/styleManager';
import { WritingStylesConfig } from '../styles';

function formatToneDescription(tone: GiftGuideTone): string {
  switch (tone) {
    case 'conversational-editorial':
      return 'Conversational Editorial — Smart, inviting, and cultured, offering curated sub-category inspiration.';
    case 'warm-helpful':
      return 'Warm & Helpful — Encouraging and supportive, guiding the reader toward specific themed options.';
    case 'witty-refined':
      return 'Witty but Refined — Clever, charming, with subtle intellectual humor.';
    case 'practical':
      return 'Practical & Actionable — Direct, organized, and focused on utility and clear category distinction.';
    case 'informational':
      return 'Informational & Curious — Highlighting sub-niche history, craft, and themes.';
    default:
      return 'Editorial and curated.';
  }
}

function formatLengthDirective(length: 'short' | 'standard' | 'expanded'): string {
  switch (length) {
    case 'short':
      return 'Short (~75–100 words) — Quick transitional intro and concise spotlight on sub-category items.';
    case 'standard':
      return 'Standard (~120–180 words) — Engaging thematic introduction followed by structured mini-descriptions for the items.';
    case 'expanded':
      return 'Expanded (~200–250 words) — Rich editorial narrative explaining the appeal of this specific sub-category with tailored gifting suggestions.';
    default:
      return 'Standard (~120–180 words).';
  }
}

/**
 * Builds a prompt specifically for generating a "More Gifts" / category spotlight section.
 * Does NOT generate the entire gift guide.
 * Automatically incorporates Global + Editorial + Copy writing styles.
 */
export function generateGiftGuideMoreGiftsPrompt(
  options: GiftGuideMoreGiftsOptions,
  styles?: Partial<WritingStylesConfig>
): string {
  const guideTitle = options.guideTitle.trim() || 'Curated Gift Guide';
  const recipient = options.recipient.trim() || 'The intended recipient';
  const sectionName = options.sectionName.trim() || 'More Curated Gifts';
  const productsIncluded = options.productsIncluded.trim() || 'Thematic accessories, related books, and functional keepsakes';
  const toneDesc = formatToneDescription(options.tone);
  const lengthDesc = formatLengthDirective(options.desiredLength);

  const keywordSection = options.primaryKeyword?.trim()
    ? `• Target Keyword: "${options.primaryKeyword.trim()}" (Include organically in the section framing if natural)`
    : '';

  const additionalSection = options.additionalInstructions?.trim()
    ? `\nADDITIONAL CURATOR INSTRUCTIONS:\n${options.additionalInstructions.trim()}\n`
    : '';

  const styleSection = composeWritingStyleBlocks(
    { includeGlobal: true, includeEditorial: true, includeCopy: true },
    styles
  );

  return `Gift Guide "More Gifts" Sub-Category Section Prompt — Science of Gifts

ROLE & TASK:
Act as an editorial curator for "Science of Gifts" writing a dedicated "MORE GIFTS" sub-category section (e.g. "${sectionName}") to be placed within the larger guide.

SCOPE CONSTRAINT:
Generate ONLY this specific sub-category section. Do NOT generate the entire gift guide, introduction, or unrelated sections.

PARENT GIFT GUIDE CONTEXT:
• Overall Guide Title / Topic: "${guideTitle}"
• Target Recipient / Audience: ${recipient}
${keywordSection}

SECTION PARAMETERS:
• Section / Category Heading: "${sectionName}"
  (Examples: "More History T-Shirts", "More World War II Gifts", "More Gifts for History Teachers")
• Products or Product Types Featured in This Section:
${productsIncluded.split('\n').map(p => `  - ${p}`).join('\n')}
• Desired Length: ${lengthDesc}
• Tone of Voice: ${toneDesc}

SECTION GOALS:
1. Provide a Short, Engaging Section Introduction:
   - Establish why this particular sub-theme or category is worth exploring for ${recipient}.
   - Explain what sets these items apart from the main list (e.g. hyper-specific interests, playful apparel, or daily desk staples).

2. Helpful, Non-Repetitive Product Mentions:
   - Highlight the featured items in an organic, narrative-driven manner rather than reading like a dry inventory database.
   - Group or contrast items by personality nuance, occasion, or style so the reader instantly understands which one fits their recipient best.
${additionalSection}
${styleSection}
OUTPUT FORMAT:
Provide:
1. Editorial H2 Section Header
2. Engaging Sub-Category Introduction Paragraph
3. Curated Descriptions for the items with highlighted product names and concise, persuasive reasons to give each.`;
}
