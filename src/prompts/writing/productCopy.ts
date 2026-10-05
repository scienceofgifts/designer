import {
  ProductCopyOptions,
  ProductCopyTone,
} from './types';
import { composeWritingStyleBlocks } from '../../utils/styleManager';
import { WritingStylesConfig } from './styles';

function formatProductCopyTone(tone: ProductCopyTone): string {
  switch (tone) {
    case 'sophisticated-editorial':
      return 'Sophisticated Editorial — Poetic, tactile, and intellectually grounded. Emphasizes material craftsmanship, quiet luxury, and understated distinction.';
    case 'warm-approachable':
      return 'Warm and Approachable — Inviting, conversational, and genuine. Feels like a personal recommendation from a discerning shopkeeper who loves the object.';
    case 'playfully-cerebral':
      return 'Playfully Cerebral — Witty, smart, and scientifically curious. Weaves in clever physics, astronomy, or mathematical easter eggs with a charming light touch.';
    case 'minimalist-luxury':
      return 'Minimalist Luxury — Sparse, confident, and direct. Focuses purely on form, materials, function, and enduring elegance without unnecessary adjectives.';
    case 'practical-informative':
      return 'Practical & Informative — Clear specs, real-world utility, dimensions, durability, and daily rituals.';
    default:
      return 'Polished boutique product copy.';
  }
}

/**
 * Builds the complete prompt for writing high-converting, publication-grade Product Page Copy.
 * Automatically incorporates Global + Copy writing styles.
 */
export function generateProductCopyPrompt(
  options: ProductCopyOptions,
  styles?: Partial<WritingStylesConfig>
): string {
  const name = options.productName.trim() || 'Sidereus Nuncius Celestial Hardcover Notebook';
  const type = options.productType.trim() || 'Archival Stationery / Journal';
  const customer = options.targetCustomer.trim() || 'Stargazers, historians, writers, and thoughtful gift seekers';
  const concept = options.productConcept.trim() || 'Inspired by Galileo Galilei’s 1610 astronomical sketches of the lunar surface and Jupiter’s moons';
  const features = options.keyFeatures.trim() || '160 pages of 120 GSM fountain pen-friendly paper, debossed gold foil constellation map, silk ribbon bookmark, lay-flat thread binding, elastic closure';
  const toneDesc = formatProductCopyTone(options.tone);

  const additionalSection = options.additionalInstructions?.trim()
    ? `\nADDITIONAL PRODUCT BRIEFING:\n${options.additionalInstructions.trim()}\n`
    : '';

  const styleSection = composeWritingStyleBlocks(
    { includeGlobal: true, includeCopy: true },
    styles
  );

  return `E-Commerce Editorial Product Copy Prompt — Science of Gifts

ROLE & OBJECTIVE:
Act as a master luxury copywriter for "Science of Gifts", a boutique purveyor of scientifically and historically inspired goods.

Your objective is to craft complete, evocative, high-converting product page copy for a new flagship item. The copy must clearly explain what the item is, celebrate its concept and materials, and connect emotionally with the target customer—without slipping into generic marketing hyperbole.

PRODUCT BRIEF:
• Product Name: ${name}
• Product Type / Category: ${type}
• Target Customer / Recipient: ${customer}
• Conceptual Foundation / Narrative: ${concept}
• Materials & Key Features:
${features.split('\n').map(f => `  - ${f}`).join('\n')}
• Brand Voice & Tone: ${toneDesc}

REQUIRED COPY DELIVERABLES:
1. Product Title & Editorial Sub-Heading:
   - Provide a clean, memorable primary product title.
   - Include a 1-sentence poetic standfirst capturing the product's soul (e.g. "A daily companion for field notes, midnight reflections, and celestial observations").

2. The Editorial Narrative / Story Section (120–180 words):
   - Transport the customer into the origin of the design: the historical era, astronomical phenomenon, or mathematical beauty that inspired it.
   - Explain what makes this design meaningful, not just decorative.

3. "Why You'll Love It" / Sensory Details (3–4 Short Bullet Points):
   - Translate physical features into tactile benefits (e.g., how the paper feels under a nib, how the ceramic feels in hands on a brisk morning, how the glaze catches lamplight).
   - Use evocative, sensory language without exaggeration.

4. Specifications & Craftsmanship Breakdown:
   - Clean, organized technical specifications (dimensions, materials, origin, care, packaging).

5. The Gifting Note (60–90 words):
   - Describe why this item makes an unforgettable gift and who would cherish receiving it. Include a suggested handwritten gift-card sentiment.
${additionalSection}
${styleSection}
OUTPUT FORMAT:
Provide the complete product page copy in clean Markdown with distinct section headers, bullet lists, and polished formatting ready to paste into Shopify or a luxury catalog.`;
}
