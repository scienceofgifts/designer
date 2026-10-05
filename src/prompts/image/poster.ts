import {
  PromptOptions,
  ProductImagePromptTemplate,
  ProductOrientation,
} from '../types';
import { buildMasterPhotographyPrompt } from '../shared/options';

function getPosterOrientationText(orientation: ProductOrientation): string {
  switch (orientation) {
    case 'flat-lay':
      return 'Overhead 90-degree flat-lay, lying flat and square to the camera with generous negative space framing all four outer margins evenly.';
    case 'upright':
      return 'Standing upright against the backdrop or lightly propped in a subtle architectural lean, catching gentle raking light across the archival paper texture.';
    case 'naturally-arranged':
      return 'Naturally arranged at a soft 15-degree angle resting on the editorial surface, with gentle natural paper weight and subtle contact shadows.';
    case 'folded':
    default:
      return 'Planar flat presentation highlighting crisp typographic details and balanced margins.';
  }
}

export function generatePosterPrompt(options: PromptOptions): string {
  return buildMasterPhotographyPrompt(options, {
    productTypeName: 'Art Poster / Fine Art Print',
    productDescription: 'A fine art poster or archival scientific print faithfully reproducing the entire graphic layout, typography, borders, illustrations, and paper craftsmanship from the reference image.',
    productOrientationText: getPosterOrientationText(options.orientation),
    productFidelityDirectives: [
      'PRESERVE COMPLETE ARTWORK & LAYOUT: Faithfully retain the entire composition, margins, borders, typography, diagrams, star charts, scientific annotations, and color palette from the reference poster.',
      'NO ARBITRARY CROPPING OR REDESIGN: Do not crop out edges, do not alter fonts, do not re-draw illustrations, and do not introduce new text or decorative elements.',
      'AUTHENTIC PAPER TEXTURE & WEIGHT: Depict heavyweight 310 GSM archival cotton rag, matte velvet fine-art paper, or smooth museum-grade stock with subtle natural paper tooth and realistic tactile presence.',
      'EDGE FIDELITY: Show crisp, clean paper edges without artificial tears, creases, or curling unless explicitly requested.',
      'PRESENTATION PURITY: Display either cleanly resting flat on the staging surface or in a minimal thin gallery frame (if requested), avoiding distracting clips or oversized furniture.',
    ],
    productSpecificExclusions: [
      'Do not crop out margins, do not alter poster fonts, and do not invent new decorative borders',
      'No artificial paper tears, bent dog-eared corners, or distracting binder clips unless explicitly requested',
    ],
  });
}

export const posterPromptTemplate: ProductImagePromptTemplate = {
  productType: 'poster',
  displayName: 'Poster',
  uiGuidance: 'Preserves complete poster layout, margins, typography, and paper texture with authentic paper weight.',
  generatePrompt: generatePosterPrompt,
};
