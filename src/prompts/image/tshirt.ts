import {
  PromptOptions,
  ProductImagePromptTemplate,
  ProductOrientation,
} from '../types';
import { buildMasterPhotographyPrompt } from '../shared/options';

function getTshirtOrientationText(orientation: ProductOrientation): string {
  switch (orientation) {
    case 'folded':
      return 'Elegantly and neatly folded in a boutique retail presentation with soft, natural fabric folds, positioning the central printed graphic artwork prominently on top.';
    case 'flat-lay':
      return 'Architectural top-down 90-degree flat-lay, smoothed neatly with subtle organic fabric contours and balanced sleeve placement.';
    case 'naturally-arranged':
      return 'Naturally arranged with gentle editorial movement—relaxed torso drape, soft rolled sleeve cuff, and organic fabric ripples that convey soft tactile luxury.';
    case 'upright':
    default:
      return 'Formally laid out or lightly pinned upright with soft natural body and realistic fabric gravity, displaying the complete frontal print without distortion.';
  }
}

export function generateTshirtPrompt(options: PromptOptions): string {
  return buildMasterPhotographyPrompt(options, {
    productTypeName: 'Apparel / T-shirt',
    productDescription: 'A premium apparel t-shirt faithfully showcasing the exact fabric tone, neckline construction, and printed graphic artwork from the reference garment.',
    productOrientationText: getTshirtOrientationText(options.orientation),
    productFidelityDirectives: [
      'PRESERVE ACTUAL GARMENT & FABRIC: Retain the authentic garment silhouette, ring-spun combed cotton knit texture, ribbed crewneck or v-neck collar ribbing, shoulder taping, and hem stitching.',
      'PRESERVE EXACT PRINTED ARTWORK: The graphic illustration, typography, screen print, embroidery, or front design must match the reference image exactly in proportion, placement across the chest, font styling, and color palette.',
      'NO WARPING OF ARTWORK: Textile folds should organically interact with the artwork without illegibly mutilating, stretching, or altering the text or graphics.',
      'NO GHOST MANNEQUIN OR DISTRACTING MODELS: No human bodies, visible mannequins, hands, or hangers unless explicitly requested; style as a standalone physical product.',
      'AUTHENTIC TEXTILE WEIGHT: Render genuine cotton jersey weight, micro-weave texture, natural soft drape, and realistic fabric ambient shadows.',
    ],
    productSpecificExclusions: [
      'No human models, no visible necks, no mannequins, no wooden hangers unless explicitly requested',
      'Do NOT warp or stretch the printed graphic illegibly across textile folds',
    ],
  });
}

export const tshirtPromptTemplate: ProductImagePromptTemplate = {
  productType: 'tshirt',
  displayName: 'T-shirt',
  uiGuidance: 'Preserves actual garment, fabric weave, collar construction, color, and printed artwork without warping.',
  generatePrompt: generateTshirtPrompt,
};
