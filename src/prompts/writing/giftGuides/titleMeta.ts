import { GiftGuideTitleMetaOptions } from './types';
import { composeWritingStyleBlocks } from '../../../utils/styleManager';
import { WritingStylesConfig } from '../styles';

/**
 * Builds a prompt specifically for generating SEO Title, Meta Description, and Page Excerpt.
 * Automatically incorporates SEO writing style only (Global, Editorial, and Copy are not applied).
 */
export function generateGiftGuideTitleMetaPrompt(
  options: GiftGuideTitleMetaOptions,
  styles?: Partial<WritingStylesConfig>
): string {
  const guideTitle = options.guideTitle.trim() || 'Curated Gift Guide';
  const recipient = options.recipient.trim() || 'The intended recipient';
  const primaryKw = options.primaryKeyword?.trim() || '';
  const secondaryKws = options.secondaryKeywords?.trim() || '';
  const searchIntent = options.searchIntent?.trim() || 'Commercial investigation & curated gift discovery';

  const primarySection = primaryKw
    ? `• Primary Focus Keyword: "${primaryKw}"`
    : '• Primary Focus Keyword: Focus on natural topical authority';

  const secondarySection = secondaryKws
    ? `• Secondary Keywords / Variations: ${secondaryKws}`
    : '• Secondary Keywords: Natural semantic variations';

  const additionalSection = options.additionalInstructions?.trim()
    ? `\nADDITIONAL INSTRUCTIONS:\n${options.additionalInstructions.trim()}\n`
    : '';

  const styleSection = composeWritingStyleBlocks(
    { includeSeo: true },
    styles
  );

  return `Gift Guide Title, Meta Description & Excerpt Prompt — Science of Gifts

ROLE & TASK:
Act as a seasoned digital publisher and SEO editor for "Science of Gifts". Your task is to write high-converting, strictly accurate metadata for a curated gift guide.

SCOPE CONSTRAINT:
Generate ONLY the metadata elements (SEO Title options, Meta Description options, and a Short Page Excerpt). Do NOT write article body content or product listings.

GIFT GUIDE CONTEXT:
• Gift Guide Topic / Subject: "${guideTitle}"
• Target Recipient / Audience: ${recipient}
• Reader Search Intent: ${searchIntent}
${primarySection}
${secondarySection}

METADATA DIRECTIVES:
1. SEO Titles (50–60 characters each):
   - Provide 4 distinct title formulas:
     - Option 1: Editorial & Sophisticated (captures elegance and curiosity)
     - Option 2: Search-Optimized & Direct (natural keyword front-loaded, under 60 chars)
     - Option 3: Benefit / Recipient-Focused (solves the gifting dilemma clearly)
     - Option 4: Intriguing & Conversational (sparks click-through curiosity)
   - Must never look like spammy keyword lists or generic templates ("Best Gifts 2026: Top 10 Ideas").

2. Meta Descriptions (145–155 characters each):
   - Provide 3 distinct meta description options.
   - Accurately represent what is on the page (curated items, craftsmanship, thoughtful recommendations).
   - Include a natural call to curiosity/action that drives high organic CTR without clickbait.
   - Include the primary keyword seamlessly within the first 100 characters if possible.

3. Short Page Excerpt / Standfirst (40–60 words):
   - A single, polished introductory summary to display on category index pages, social cards, or above the fold.
${additionalSection}
${styleSection}
OUTPUT FORMAT:
Return clean Markdown with clear sections for:
1. SEO Title Options (with character counts)
2. Meta Description Options (with character counts)
3. Social Share / Page Excerpt Subtitle`;
}
