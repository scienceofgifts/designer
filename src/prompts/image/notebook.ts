import {
  PromptOptions,
  ProductImagePromptTemplate,
  ProductOrientation,
} from '../types';
import { buildMasterPhotographyPrompt } from '../shared/options';

function getNotebookOrientationText(orientation: ProductOrientation): string {
  switch (orientation) {
    case 'flat-lay':
      return 'Overhead 90-degree flat-lay, lying flat on the surface with generous negative space, highlighting the full planar geometry of the front cover and its artwork.';
    case 'upright':
      return 'Standing upright or gently propped at a soft 20-degree angle, displaying the cover face prominently alongside the clean spine edge.';
    case 'naturally-arranged':
      return 'Naturally resting on the surface at a graceful 15-degree editorial perspective, with soft ribbon marker gently trailing alongside.';
    case 'folded':
    default:
      return 'Cleanly placed on the surface in an editorial still-life composition, emphasizing cover texture and crisp book corners.';
  }
}

export function generateNotebookPrompt(options: PromptOptions): string {
  return buildMasterPhotographyPrompt(options, {
    productTypeName: 'Notebook / Journal',
    productDescription: 'A premium hardcover or softcover notebook / journal faithfully showcasing the exact cover artwork, typography, and bookbinding construction from the reference product.',
    productOrientationText: getNotebookOrientationText(options.orientation),
    productFidelityDirectives: [
      'PRESERVE EXACT COVER ARTWORK & TITLES: Faithfully reproduce the complete cover illustration, celestial/scientific chart, title typography, author/collection text, foil stamping, debossing, and exact background color from the reference notebook.',
      'ELASTIC CLOSURE & RIBBON MARKER FIDELITY: If visible in the reference image, accurately preserve the elastic closure band (its width, placement, tension, and color) and the silk/satin ribbon page marker extending gracefully from the binding.',
      'NEVER INVENT A SPINE CREASE OR FOLD: Absolutely do NOT invent a fold, spine bend, or artificial crease along the book spine. The notebook structure and spine must remain true to its authentic bookbinding construction (flat, crisp, and intact).',
      'ACCURATE BOOK EDGES & BINDING: Show crisp, clean book block edges (plain, gilded, or stained matching the reference) with precise bookboard corner radii.',
      'NO RANDOM STATIONERY CLUTTER: Do not scatter pens, sticky notes, or paper clips unless explicitly requested in props.',
    ],
    productSpecificExclusions: [
      'DO NOT invent a fold, spine bend, or artificial crease along the book spine',
      'Do not scatter random pens, sticky notes, paper clips, or stationery clutter unless explicitly requested',
    ],
  });
}

export const notebookPromptTemplate: ProductImagePromptTemplate = {
  productType: 'notebook',
  displayName: 'Notebook',
  uiGuidance: 'Preserves exact cover artwork, elastic closure & ribbon marker. Strictly forbids inventing spine folds or creases.',
  generatePrompt: generateNotebookPrompt,
};
