import {
  PromptOptions,
  ProductImagePromptTemplate,
  ProductOrientation,
} from '../types';
import { buildMasterPhotographyPrompt } from '../shared/options';

function getGlassOrientationText(orientation: ProductOrientation): string {
  switch (orientation) {
    case 'upright':
      return 'Standing upright on its heavy glass base at an eye-level studio perspective (10-15 degree downward angle), catching clean rim highlights and showing printed artwork legibly.';
    case 'naturally-arranged':
      return 'Naturally styled at a subtle quarter-angle, allowing light to transmit through the clear glass walls and highlight both front and translucent back planes.';
    case 'flat-lay':
      return 'Stylized flat-lay or top-down rim orientation with balanced shadows and crisp silhouette definition.';
    case 'folded':
    default:
      return 'Upright presentation in clean editorial studio alignment.';
  }
}

export function generateGlassPrompt(options: PromptOptions): string {
  return buildMasterPhotographyPrompt(options, {
    productTypeName: 'Glassware',
    productDescription: 'A premium glassware tumbler or drinking glass faithfully reproducing the physical silhouette, glass clarity, and printed artwork from the reference image.',
    productOrientationText: getGlassOrientationText(options.orientation),
    productFidelityDirectives: [
      'PRESERVE EXACT PHYSICAL FORM: Preserve the precise cylindrical or tapered silhouette, base sham weight, wall thickness, and polished rim contour from the reference glass.',
      'PRESERVE PRINTED & ETCHED ARTWORK: Faithfully replicate all screen-printed graphics, enamel typography, frosted etchings, measurements, and logos with razor-sharp precision and correct curvature wrap around the glass.',
      'NO UNINVITED ADDITIONS: Do NOT add handles, lids, straws, ice cubes, fruit slices, or beverages unless explicitly specified.',
      'OPTICAL REFRACTION & CAUSTICS: Render realistic optical light refraction, subtle crystal-clear highlights, genuine glass transparency, and soft caustic light pooling on the surface beneath.',
      'CLEAN SURFACE: The glass should appear pristine, polished, lint-free, and fingerprint-free, reflecting soft diffused studio lightboxes.',
    ],
    productSpecificExclusions: [
      'Do NOT add handles, lids, straws, ice cubes, fruit slices, or beverages unless explicitly specified',
      'No fingerprints, dust specks, or murky liquid reflections',
    ],
  });
}

export const glassPromptTemplate: ProductImagePromptTemplate = {
  productType: 'glass',
  displayName: 'Glass',
  uiGuidance: 'Preserves optical glass clarity, physical silhouette, and printed/etched artwork with caustic reflections.',
  generatePrompt: generateGlassPrompt,
};
