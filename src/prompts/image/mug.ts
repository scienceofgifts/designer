import {
  PromptOptions,
  ProductImagePromptTemplate,
  ProductOrientation,
} from '../types';
import { buildMasterPhotographyPrompt } from '../shared/options';

function getMugOrientationText(orientation: ProductOrientation): string {
  switch (orientation) {
    case 'upright':
      return 'Standing upright on its base at a dignified eye-level perspective (15-degree slight downward tilt), showcasing the frontal printed artwork and handle profile clearly.';
    case 'flat-lay':
      return 'Overhead flat-lay composition, captured from a direct 90-degree bird’s-eye perspective, accentuating the circular rim geometry and top opening with balanced negative space.';
    case 'naturally-arranged':
      return 'Naturally arranged at a 30-degree quarter-turn angle, allowing both the primary printed artwork and the sculpted contour of the handle to be viewed in harmonious balance.';
    case 'folded':
    default:
      return 'Upright presentation angled to showcase the printed graphic design in optimal editorial light.';
  }
}

export function generateMugPrompt(options: PromptOptions): string {
  return buildMasterPhotographyPrompt(options, {
    productTypeName: 'Ceramic Drinkware / Mug',
    productDescription: 'A premium ceramic mug featuring the exact graphic artwork, typography, colors, and physical silhouette from the reference product.',
    productOrientationText: getMugOrientationText(options.orientation),
    productFidelityDirectives: [
      'PRESERVE EXACT PHYSICAL FORM: Maintain the precise cylindrical proportions, outer diameter, wall thickness, rim profile, and base curve from the reference image.',
      'HANDLE ACCURACY: Faithfully preserve the exact shape, attachment points, and curve of the handle. Do NOT invent a different handle style, and do NOT add handles if none exist in the reference.',
      'PRESERVE ARTWORK & TYPOGRAPHY: All printed graphics, illustrations, scientific equations, lettering, logos, and brand marks must be reproduced with exact scale, placement, crisp typography, and precise color registration.',
      'NO UNINVITED ACCESSORIES: Do NOT add lids, spoons, coasters, saucers, tea bags, or steam unless explicitly requested.',
      'GLAZE & FINISH: Render authentic semi-gloss or matte ceramic glaze with natural, soft specular highlights and subtle reflections without cartoonish plastic sheen.',
    ],
    productSpecificExclusions: [
      'Do not add handles, lids, spoons, coasters, saucers, tea bags, or steam unless explicitly requested',
    ],
  });
}

export const mugPromptTemplate: ProductImagePromptTemplate = {
  productType: 'mug',
  displayName: 'Mug',
  uiGuidance: 'Preserves cylindrical form, rim contour, handle curvature, and printed artwork. Forbids extra handles or lids.',
  generatePrompt: generateMugPrompt,
};
