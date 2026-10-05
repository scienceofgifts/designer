import {
  PromptOptions,
  ProductImagePromptTemplate,
  ProductOrientation,
} from '../types';
import { buildMasterPhotographyPrompt } from '../shared/options';

function getHoodieOrientationText(orientation: ProductOrientation): string {
  switch (orientation) {
    case 'folded':
      return 'Expertly folded in a high-end editorial knitwear presentation—sleeves neatly tucked, hood softly framed around the top, and the central chest artwork fully legible.';
    case 'flat-lay':
      return 'Overhead flat-lay arrangement shot from 90 degrees above, displaying balanced symmetry across the shoulders, pocket, and chest artwork.';
    case 'naturally-arranged':
      return 'Naturally arranged with relaxed, organic styling—gentle textile ripples, relaxed sleeves with soft wrist folds, and hood resting organically.';
    case 'upright':
    default:
      return 'Upright presentation with natural body and authentic fabric drape, highlighting chest artwork and pocket construction.';
  }
}

export function generateHoodiePrompt(options: PromptOptions): string {
  return buildMasterPhotographyPrompt(options, {
    productTypeName: 'Apparel / Hoodie',
    productDescription: 'A premium hooded sweatshirt displaying the exact fleece construction, hood architecture, kangaroo pocket, and printed artwork from the reference garment.',
    productOrientationText: getHoodieOrientationText(options.orientation),
    productFidelityDirectives: [
      'PRESERVE GARMENT CONSTRUCTION: Preserve the exact double-layer hood shape, drawstring cords and eyelet grommets, kangaroo pouch pocket, wide ribbed cuffs, and hem waistband.',
      'PRESERVE PRINTED ARTWORK & GRAPHICS: Faithfully retain the graphic design, typography, brand emblems, or chest/back print from the reference image with authentic scale, font sharpness, and color accuracy.',
      'ACCURATE FABRIC WEIGHT: Depict substantial 400+ GSM heavyweight french terry or brushed fleece, showing tactile substance and rich matte fabric density.',
      'NATURAL HOOD DRAPE: Keep the hood softly resting in an organic, deliberate editorial shape behind the neck without looking crumpled or rigid.',
      'EXCLUDE HUMAN MODELS & MANNEQUINS: Render the hoodie strictly as a standalone styled product without human models, phantom necks, or artificial props.',
    ],
    productSpecificExclusions: [
      'Exclude human models, headless mannequins, and plastic hangers',
      'Do not flatten or crumple the hood into an unnatural lump',
    ],
  });
}

export const hoodiePromptTemplate: ProductImagePromptTemplate = {
  productType: 'hoodie',
  displayName: 'Hoodie',
  uiGuidance: 'Preserves fleece weight, hood drape, drawstrings, kangaroo pocket, and printed/embroidered graphics.',
  generatePrompt: generateHoodiePrompt,
};
