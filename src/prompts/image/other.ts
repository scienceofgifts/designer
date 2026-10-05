import {
  PromptOptions,
  ProductImagePromptTemplate,
  ProductOrientation,
} from '../types';
import { buildMasterPhotographyPrompt } from '../shared/options';

function getOtherOrientationText(orientation: ProductOrientation): string {
  switch (orientation) {
    case 'upright':
      return 'Standing upright on its base at an eye-level / 15-degree studio perspective, presenting its primary face with dignity and clarity.';
    case 'flat-lay':
      return 'Overhead 90-degree flat-lay composition, laid flat on the surface with balanced negative space around all sides.';
    case 'naturally-arranged':
      return 'Naturally arranged in an organic editorial staging position, showing depth, authentic materials, and dimensional form.';
    case 'folded':
      return 'Neatly arranged or folded according to the item’s natural construction, highlighting signature details and craftsmanship.';
    default:
      return 'Upright hero staging in balanced editorial lighting.';
  }
}

export function generateOtherPrompt(options: PromptOptions): string {
  const customLabel = options.customProductType?.trim() || 'specialty boutique product';

  return buildMasterPhotographyPrompt(options, {
    productTypeName: customLabel,
    productDescription: `A premium ${customLabel} faithfully reproducing the exact physical construction, materials, colors, logos, and artwork from the reference image.`,
    productOrientationText: getOtherOrientationText(options.orientation),
    productFidelityDirectives: [
      'PRESERVE EXACT PHYSICAL IDENTITY: The reference product is the definitive source of truth. Preserve the exact physical shape, proportions, dimensions, geometry, and structural construction.',
      'PRESERVE ARTWORK & BRANDING: All printed artwork, logos, typography, graphics, surface textures, and color values must be reproduced with absolute fidelity without redesign or artistic reinterpretation.',
      'ZERO REDESIGN: Do not alter the form factor, do not invent extra features, buttons, handles, or decorative accoutrements not present on the actual physical product.',
      'AUTHENTIC MATERIAL TEXTURE: Accurately render the natural physical material (wood, metal, ceramic, leather, paper, textile, or resin) with genuine tactile fidelity and appropriate light interaction.',
      'RESTRAINED EDITORIAL CONTEXT: The product must remain the absolute focal hero of the photograph, supported by clean negative space and natural shadows.',
    ],
  });
}

export const otherPromptTemplate: ProductImagePromptTemplate = {
  productType: 'other',
  displayName: 'Other',
  uiGuidance: 'Treats uploaded product as the definitive source of truth. Zero redesign of artwork, logos, or construction.',
  generatePrompt: generateOtherPrompt,
};
