import {
  ProductType,
  ProductOrientation,
  BackgroundStyle,
  SurfaceStyle,
  PropsStyle,
  AspectRatio,
  PromptOptions,
  PhotographyTheme,
  ProductPosition,
  ProductPresentation,
  ShotType,
  CameraAngle,
  CameraPerspective,
  FocalLengthCharacter,
  DepthOfField,
  CompositionStyle,
  NegativeSpaceDirection,
  LightingStyle,
  ShadowCharacter,
  PropLevel,
  PropFamily,
  PropPlacement,
  ColorPalette,
  VariationLevel,
  VariationToggles,
} from './prompts/types';

export * from './prompts/types';
export * from './prompts/image';
export * from './prompts/writing';

export interface GenerationSettings {
  productType: ProductType;
  customProductType?: string;
  orientation: ProductOrientation;
  background: BackgroundStyle;
  surface: SurfaceStyle;
  props: PropsStyle;
  aspectRatio: AspectRatio;
  additionalInstructions: string;

  // New Creative Direction Controls
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

export interface SampleProduct {
  id: string;
  title: string;
  category: ProductType;
  description: string;
  imageUrl: string;
  recommendedSettings: Partial<GenerationSettings>;
}
