export type ProductType =
  | 'mug'
  | 'tshirt'
  | 'hoodie'
  | 'notebook'
  | 'glass'
  | 'waterBottle'
  | 'tumbler'
  | 'poster'
  | 'other';

export type ProductOrientation =
  | 'upright'
  | 'folded'
  | 'flat-lay'
  | 'naturally-arranged';

export type BackgroundStyle =
  | 'neutral-editorial'
  | 'science-gradient'
  | 'gradient-wall-neutral-surface'
  | 'blue-wall-neutral-surface'
  | 'mint-wall-neutral-surface'
  | 'branded-editorial-environment'
  | 'dark-editorial'
  // Expanded neutral backgrounds
  | 'warm-ivory'
  | 'alabaster'
  | 'pale-stone'
  | 'soft-warm-gray'
  | 'pale-blue-gray'
  // Expanded Science of Gifts backgrounds
  | 'blue-dominant-gradient'
  | 'mint-dominant-gradient'
  | 'soft-blue-tonal'
  | 'soft-mint-tonal'
  | 'blue-ivory-gradient'
  | 'mint-ivory-gradient'
  // Expanded Editorial backgrounds
  | 'pale-architectural-studio'
  | 'soft-tonal-studio'
  | 'warm-editorial'
  // Expanded Physical gradients
  | 'gradient-cyclorama'
  | 'gradient-curved-wall'
  | 'custom';

export type SurfaceStyle =
  | 'editorial-tabletop'
  | 'light-stone'
  | 'light-limestone'
  | 'travertine'
  | 'light-wood'
  | 'dark-matte'
  | 'soft-fabric'
  | 'paper-archival'
  | 'warm-ivory-surface'
  | 'blue-gray-surface'
  | 'no-visible-surface'
  | 'naturally-implied';

export type PropsStyle =
  | 'none'
  | 'minimal-subtle'
  | 'subtle-historical'
  | 'books-ephemera'
  | 'seasonal-subtle';

export type AspectRatio = '1:1' | '4:5' | '3:2' | '16:9';

// ==========================================
// Expanded Creative Direction Types
// ==========================================

export type PhotographyTheme =
  | 'clean-catalog'
  | 'editorial-still-life'
  | 'quiet-luxury'
  | 'intellectual'
  | 'scientific'
  | 'archival'
  | 'contemporary'
  | 'warm-minimal'
  | 'sophisticated-dark'
  | 'seasonal-editorial'
  | 'natural-editorial';

export type ProductPosition =
  | 'centered'
  | 'slightly-left'
  | 'slightly-right'
  | 'upper-composition'
  | 'lower-composition'
  | 'naturally-positioned';

export type ProductPresentation =
  | 'clean-hero'
  | 'editorial'
  | 'catalog'
  | 'lifestyle-still-life'
  | 'naturally-arranged';

export type ShotType =
  | 'hero-product'
  | 'standard-catalog'
  | 'editorial-still-life'
  | 'detail-oriented'
  | 'environmental-product'
  | 'close-product-portrait';

export type CameraAngle =
  | 'straight-on'
  | 'slightly-elevated'
  | 'slightly-lowered'
  | 'three-quarter'
  | 'high-three-quarter'
  | 'gentle-overhead'
  | 'near-eye-level'
  | 'natural-perspective';

export type CameraPerspective =
  | 'natural'
  | 'slightly-compressed'
  | 'moderate-perspective'
  | 'intimate-close';

export type FocalLengthCharacter =
  | 'normal-editorial'
  | 'short-telephoto'
  | 'portrait-like'
  | 'macro-detail'
  | 'longer-compressed';

export type DepthOfField =
  | 'deep-clarity'
  | 'moderate-depth'
  | 'gentle-falloff'
  | 'shallow-editorial';

export type CompositionStyle =
  | 'centered'
  | 'slightly-offset'
  | 'left-weighted'
  | 'right-weighted'
  | 'symmetrical'
  | 'asymmetric-editorial'
  | 'generous-negative-space'
  | 'tight-crop'
  | 'medium-framing'
  | 'hero-composition'
  | 'natural-arrangement';

export type NegativeSpaceDirection =
  | 'balanced'
  | 'left'
  | 'right'
  | 'above'
  | 'below'
  | 'natural-adaptive';

export type LightingStyle =
  | 'large-soft-studio'
  | 'soft-daylight'
  | 'gentle-window'
  | 'side-lit-editorial'
  | 'soft-top-left'
  | 'diffused-frontal'
  | 'sculpted-studio'
  | 'quiet-dramatic'
  | 'bright-catalog'
  | 'warm-editorial'
  | 'natural-directional';

export type ShadowCharacter =
  | 'very-soft'
  | 'soft'
  | 'moderate'
  | 'defined-natural';

export type PropLevel =
  | 'none'
  | 'single-accent'
  | 'minimal'
  | 'sparse'
  | 'small-curated-grouping';

export type PropFamily =
  | 'none'
  | 'historical-archival'
  | 'scientific'
  | 'writing-desk'
  | 'film-cinema'
  | 'literary'
  | 'natural-botanical'
  | 'architectural'
  | 'seasonal'
  | 'category-aware'
  | 'neutral-decorative';

export type PropPlacement =
  | 'background-only'
  | 'beside-product'
  | 'foreground-accent'
  | 'edge-of-frame'
  | 'asymmetric'
  | 'naturally-arranged'
  | 'adaptive';

export type ColorPalette =
  | 'science-blue-mint'
  | 'powder-blue'
  | 'seafoam-mint'
  | 'blue-ivory'
  | 'mint-ivory'
  | 'warm-ivory'
  | 'pale-blue-gray'
  | 'neutral-editorial'
  | 'deep-editorial'
  | 'charcoal-ivory';

export type VariationLevel =
  | 'consistent'
  | 'subtle'
  | 'moderate'
  | 'strong';

export interface VariationToggles {
  cameraAngle?: boolean;
  productRotation?: boolean;
  cropFraming?: boolean;
  propSelection?: boolean;
  propPlacement?: boolean;
  lightingDirection?: boolean;
  backgroundGradient?: boolean;
}

export interface PromptOptions {
  productType: ProductType;
  customProductType?: string;
  orientation: ProductOrientation;
  background: BackgroundStyle;
  surface: SurfaceStyle;
  props: PropsStyle;
  aspectRatio: AspectRatio;
  additionalInstructions?: string;
  hasReferenceImage?: boolean;
  referenceImageName?: string;

  // New Expanded Creative Direction Controls
  theme?: PhotographyTheme;
  productPosition?: ProductPosition;
  productPresentation?: ProductPresentation;

  shotType?: ShotType;
  cameraAngle?: CameraAngle;
  perspective?: CameraPerspective;
  focalLength?: FocalLengthCharacter;
  depthOfField?: DepthOfField;

  compositionStyle?: CompositionStyle;
  negativeSpace?: NegativeSpaceDirection;

  lightingStyle?: LightingStyle;
  shadowCharacter?: ShadowCharacter;

  propLevel?: PropLevel;
  propFamily?: PropFamily;
  propPlacement?: PropPlacement;

  colorPalette?: ColorPalette;

  variationLevel?: VariationLevel;
  variationToggles?: VariationToggles;
}

// Alias for backwards compatibility
export type PromptTemplateContext = PromptOptions;

export interface ProductImagePromptTemplate {
  productType: ProductType;
  displayName: string;
  uiGuidance: string;
  generatePrompt: (options: PromptOptions) => string;
}
