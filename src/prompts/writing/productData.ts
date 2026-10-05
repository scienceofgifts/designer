import {
  ProductDataOptions,
  ProductDataAffiliateType,
  ProductDataEditorialPositioning,
  ProductDataEditorialTone,
} from './types';

function formatAffiliateType(type: ProductDataAffiliateType): string {
  switch (type) {
    case 'affiliate':
      return 'Affiliate link (sponsored: true, rel: "nofollow sponsored")';
    case 'direct':
      return 'Direct product link (sponsored: false, rel: "nofollow")';
    case 'sponsored':
      return 'Sponsored product link (sponsored: true, rel: "nofollow sponsored")';
    case 'not-sponsored':
      return 'Non-sponsored direct link (sponsored: false, rel: "")';
    default:
      return 'Direct product link';
  }
}

function formatEditorialPositioning(pos?: ProductDataEditorialPositioning): string {
  switch (pos) {
    case 'broad-appeal':
      return 'Broad appeal — Accessible, universal gift for general curious minds';
    case 'enthusiast-niche':
      return 'Enthusiast / Niche interest — Tailored for deep domain passion and subject expertise';
    case 'practical-gift':
      return 'Practical gift — High utility, daily ritual focus, functional excellence';
    case 'conversation-piece':
      return 'Conversation piece — Striking visual design, historical mystery or scientific curiosity';
    case 'collector-enthusiast':
      return 'Collector / Enthusiast — Rare, archival, heirloom quality or limited edition';
    case 'novelty-gift':
      return 'Novelty gift — Clever, witty, lighthearted science charm';
    case 'none':
    default:
      return 'Default / Unspecified editorial positioning';
  }
}

function formatEditorialTone(tone: ProductDataEditorialTone): string {
  switch (tone) {
    case 'standard':
      return 'Standard Science of Gifts — Eloquent, intellectually curious, tactile, and warmly authoritative.';
    case 'practical':
      return 'More Practical — Focus heavily on specs, everyday utility, durability, and practical gift value.';
    case 'playful':
      return 'More Playful — Witty, lighthearted, with clever scientific humor or charming historical anecdotes.';
    case 'sophisticated':
      return 'More Sophisticated — Poetic, quiet luxury, understated craft, and high aesthetic distinction.';
    default:
      return 'Standard Science of Gifts';
  }
}

/**
 * Builds the complete prompt for generating structured Science of Gifts YAML Product Records.
 */
export function generateProductDataPrompt(options: ProductDataOptions): string {
  const url = options.productUrl.trim() || 'https://example.com/product';
  const type = options.productType.trim() || 'Journal / Notebook';
  const category = options.category.trim() || 'Astronomy & Stargazing';
  const affiliateDesc = formatAffiliateType(options.affiliateType);
  const toneDesc = formatEditorialTone(options.editorialTone);

  const priceInfo =
    options.priceMode === 'provided' && options.providedPrice?.trim()
      ? `Provided Price: ${options.providedPrice.trim()}`
      : 'Extract exact price and price range from the source URL';

  const positioningBlock =
    options.editorialPositioning && options.editorialPositioning !== 'none'
      ? `• Editorial Positioning: ${formatEditorialPositioning(options.editorialPositioning)}\n`
      : '';

  const additionalBlock = options.additionalInstructions?.trim()
    ? `\nADDITIONAL INSTRUCTIONS & PRODUCT BRIEF:\n${options.additionalInstructions.trim()}\n`
    : '';

  const imageBlock = options.hasImage
    ? `• Attached Product Image: ${options.imageName || 'Product Image Attached'}\n  Instruction: Examine the attached product image to verify physical materials, color, design graphics, artwork, and visual features.`
    : '• Product Image: Please examine the attached product image alongside this prompt to verify physical design, graphics, and materials.';

  const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'general-science';

  return `Science of Gifts — Product Data Catalog Record Prompt

OBJECTIVE:
Act as a senior data analyst and catalog editor for "Science of Gifts". Your task is to research the product at the supplied URL and examine the attached product image to generate a complete, factually accurate Science of Gifts YAML product record.

INPUT DATA & CONTEXT:
• Source / Product URL: ${url}
• Product Type: ${type}
• Subject / Category: ${category}
• Affiliate / Link Configuration: ${affiliateDesc}
• Price Instructions: ${priceInfo}
${positioningBlock}• Brand Voice & Tone: ${toneDesc}
${imageBlock}
${additionalBlock}
RESEARCH & FACTUAL ACCURACY INSTRUCTIONS:
1. Examine the attached product image to understand the physical product, construction, artwork, and visual characteristics.
2. Research the supplied product/source URL as the authority for factual information.
3. Preserve strict factual accuracy: Never invent product specifications, materials, dimensions, prices, features, or other factual details.
4. Write original Science of Gifts editorial copy for review fields rather than copying vendor marketing language.
5. Use existing Science of Gifts taxonomy values where provided, and avoid inventing new taxonomy values when an appropriate existing value is available.

COMPLETE SCIENCE OF GIFTS PRODUCT SCHEMA:

Fill in every field according to these schema rules:

id: "unique-lowercase-kebab-case-identifier" # e.g. galileo-moon-phase-mug
title: "Actual Product Title" # Clean product title from vendor
image: "${options.imageName || 'product-image.jpg'}" # Supplied image path or filename
imageType: "photo | illustration | rendering" # Visual classification
price: "$XX.XX" # Display price string with currency symbol
priceNumber: XX.XX # Pure numeric price float
priceRange: "under-25 | 25-50 | 50-100 | 100-200 | over-200" # Site price convention
vendor: "Vendor or Brand Name" # Manufacturer or brand
vendorUrl: "${url}" # Verified canonical source URL
affiliate:
  sponsored: true # or false based on link type
  rel: "nofollow sponsored" # rel attribute for link
category: "${categorySlug}" # Primary category identifier
badgeLabel: "Staff Pick | Heirloom Quality | Editor's Choice | null" # Optional badge or null
recipients:
  - "stargazers"
  - "science-teachers" # Relevant recipient taxonomy keys
interests:
  - "astronomy"
  - "history-of-science" # Relevant interest taxonomy keys
occasions:
  - "birthdays"
  - "holidays" # Relevant occasion taxonomy keys
ageRanges:
  - "adults"
  - "teens" # Relevant age range taxonomy keys
personalityStyles:
  - "curious-mind"
  - "history-buff" # Relevant personality taxonomy keys
tags:
  - "tag-1"
  - "tag-2" # Search tags
editorialReview: |
  Original 80-150 word editorial overview celebrating the concept, history, and tactile craftsmanship of the item.
whyItMakesAGreatGift: |
  2-3 sentence explanation highlighting why this item makes an unforgettable, meaningful gift.
idealFor: |
  Specific description of the exact persona who will treasure this gift.
whatMakesItStandOut: |
  Distinctive design details, historical provenance, or material quality.
thingsToConsider: |
  Honest, balanced buyer considerations (care instructions, sizing, display requirements).
specs:
  - label: "Material"
    value: "High-fired ceramic / 120 GSM paper / etc."
  - label: "Dimensions"
    value: "Verified dimensions from source"
  - label: "Care Instructions"
    value: "Verified care requirements"
tagline: "Short, evocative one-sentence tagline summarizing the item's soul."

RETURN ONLY THE COMPLETED YAML PRODUCT OBJECT.
Do not wrap it in Markdown code fences.
Do not explain the result.
Do not omit fields.
Do not invent unavailable factual information.`;
}
