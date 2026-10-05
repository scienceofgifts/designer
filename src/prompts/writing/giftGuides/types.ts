export type GiftGuideSectionType =
  | 'introduction'
  | 'product-copy'
  | 'more-gifts'
  | 'how-to-choose'
  | 'faq'
  | 'title-meta';

export type GiftGuideTone =
  | 'conversational-editorial'
  | 'warm-helpful'
  | 'witty-refined'
  | 'practical'
  | 'informational';

export type GiftGuideAngle =
  | 'general-gift-guide'
  | 'specific-recipient'
  | 'hobby-interest'
  | 'by-budget'
  | 'problem-solving'
  | 'occasion-based';

export type SectionLength = 'concise' | 'standard' | 'detailed';

export interface GiftGuideBaseOptions {
  guideTitle: string;
  recipient: string;
  primaryKeyword?: string;
  additionalInstructions?: string;
}

export interface GiftGuideIntroOptions extends GiftGuideBaseOptions {
  desiredAngle: GiftGuideAngle;
  tone: GiftGuideTone;
}

export interface GiftGuideProductCopyOptions extends GiftGuideBaseOptions {
  productName: string;
  productType: string;
  productUrl?: string;
  productFeatures: string;
  whyItFits: string;
  tone: GiftGuideTone;
  desiredLength: 'concise' | 'balanced' | 'detailed';
}

export interface GiftGuideMoreGiftsOptions extends GiftGuideBaseOptions {
  sectionName: string;
  productsIncluded: string;
  tone: GiftGuideTone;
  desiredLength: 'short' | 'standard' | 'expanded';
}

export interface GiftGuideHowToChooseOptions extends GiftGuideBaseOptions {
  importantConsiderations: string;
  tone: GiftGuideTone;
  desiredLength: 'concise' | 'standard' | 'comprehensive';
}

export interface GiftGuideFaqOptions extends GiftGuideBaseOptions {
  questionsToAnswer?: string;
  numberOfQuestions: number | string;
  tone: GiftGuideTone;
}

export interface GiftGuideTitleMetaOptions extends GiftGuideBaseOptions {
  secondaryKeywords?: string;
  searchIntent?: string;
}

export interface GiftGuideCompositeState {
  activeSection: GiftGuideSectionType;
  // Shared fields
  guideTitle: string;
  recipient: string;
  primaryKeyword: string;
  additionalInstructions: string;

  // Introduction specific
  introAngle: GiftGuideAngle;
  introTone: GiftGuideTone;

  // Product Copy specific
  productName: string;
  productType: string;
  productUrl: string;
  productFeatures: string;
  whyItFits: string;
  productTone: GiftGuideTone;
  productLength: 'concise' | 'balanced' | 'detailed';

  // More Gifts specific
  moreGiftsSectionName: string;
  moreGiftsProductsIncluded: string;
  moreGiftsTone: GiftGuideTone;
  moreGiftsLength: 'short' | 'standard' | 'expanded';

  // How to Choose specific
  howToChooseConsiderations: string;
  howToChooseTone: GiftGuideTone;
  howToChooseLength: 'concise' | 'standard' | 'comprehensive';

  // FAQ specific
  faqQuestionsToAnswer: string;
  faqNumberOfQuestions: number | string;
  faqTone: GiftGuideTone;

  // Title & Meta specific
  titleMetaSecondaryKeywords: string;
  titleMetaSearchIntent: string;
}
