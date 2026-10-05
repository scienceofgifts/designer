import { ProductType, ProductImagePromptTemplate, PromptOptions } from '../types';
import { mugPromptTemplate, generateMugPrompt } from './mug';
import { tshirtPromptTemplate, generateTshirtPrompt } from './tshirt';
import { hoodiePromptTemplate, generateHoodiePrompt } from './hoodie';
import { notebookPromptTemplate, generateNotebookPrompt } from './notebook';
import { glassPromptTemplate, generateGlassPrompt } from './glass';
import { waterBottlePromptTemplate, generateWaterBottlePrompt } from './waterBottle';
import { tumblerPromptTemplate, generateTumblerPrompt } from './tumbler';
import { posterPromptTemplate, generatePosterPrompt } from './poster';
import { otherPromptTemplate, generateOtherPrompt } from './other';

export const imagePromptTemplates: Record<ProductType, ProductImagePromptTemplate> = {
  mug: mugPromptTemplate,
  tshirt: tshirtPromptTemplate,
  hoodie: hoodiePromptTemplate,
  notebook: notebookPromptTemplate,
  glass: glassPromptTemplate,
  waterBottle: waterBottlePromptTemplate,
  tumbler: tumblerPromptTemplate,
  poster: posterPromptTemplate,
  other: otherPromptTemplate,
};

/**
 * Builds the complete photography prompt according to the selected product type and options.
 */
export function buildImagePrompt(options: PromptOptions): string {
  const template = imagePromptTemplates[options.productType] || imagePromptTemplates.other;
  return template.generatePrompt(options);
}

// Backwards-compatible alias
export const buildProductPhotoPrompt = buildImagePrompt;

export {
  mugPromptTemplate,
  generateMugPrompt,
  tshirtPromptTemplate,
  generateTshirtPrompt,
  hoodiePromptTemplate,
  generateHoodiePrompt,
  notebookPromptTemplate,
  generateNotebookPrompt,
  glassPromptTemplate,
  generateGlassPrompt,
  waterBottlePromptTemplate,
  generateWaterBottlePrompt,
  tumblerPromptTemplate,
  generateTumblerPrompt,
  posterPromptTemplate,
  generatePosterPrompt,
  otherPromptTemplate,
  generateOtherPrompt,
};
