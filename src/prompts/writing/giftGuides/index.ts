export * from './types';
export * from './introduction';
export * from './productCopy';
export * from './moreGifts';
export * from './howToChoose';
export * from './faq';
export * from './titleMeta';

import { GiftGuideCompositeState } from './types';
import { generateGiftGuideIntroPrompt } from './introduction';
import { generateGiftGuideProductCopyPrompt } from './productCopy';
import { generateGiftGuideMoreGiftsPrompt } from './moreGifts';
import { generateGiftGuideHowToChoosePrompt } from './howToChoose';
import { generateGiftGuideFaqPrompt } from './faq';
import { generateGiftGuideTitleMetaPrompt } from './titleMeta';
import { WritingStylesConfig } from '../styles';

/**
 * Dispatches to the appropriate section prompt generator based on the activeSection.
 * Supports optional dynamic style overrides from the Style Library.
 */
export function generateGiftGuideSectionPrompt(
  state: GiftGuideCompositeState,
  styles?: Partial<WritingStylesConfig>
): string {
  switch (state.activeSection) {
    case 'introduction':
      return generateGiftGuideIntroPrompt(
        {
          guideTitle: state.guideTitle,
          recipient: state.recipient,
          primaryKeyword: state.primaryKeyword,
          additionalInstructions: state.additionalInstructions,
          desiredAngle: state.introAngle,
          tone: state.introTone,
        },
        styles
      );

    case 'product-copy':
      return generateGiftGuideProductCopyPrompt(
        {
          guideTitle: state.guideTitle,
          recipient: state.recipient,
          primaryKeyword: state.primaryKeyword,
          additionalInstructions: state.additionalInstructions,
          productName: state.productName,
          productType: state.productType,
          productUrl: state.productUrl,
          productFeatures: state.productFeatures,
          whyItFits: state.whyItFits,
          tone: state.productTone,
          desiredLength: state.productLength,
        },
        styles
      );

    case 'more-gifts':
      return generateGiftGuideMoreGiftsPrompt(
        {
          guideTitle: state.guideTitle,
          recipient: state.recipient,
          primaryKeyword: state.primaryKeyword,
          additionalInstructions: state.additionalInstructions,
          sectionName: state.moreGiftsSectionName,
          productsIncluded: state.moreGiftsProductsIncluded,
          tone: state.moreGiftsTone,
          desiredLength: state.moreGiftsLength,
        },
        styles
      );

    case 'how-to-choose':
      return generateGiftGuideHowToChoosePrompt(
        {
          guideTitle: state.guideTitle,
          recipient: state.recipient,
          primaryKeyword: state.primaryKeyword,
          additionalInstructions: state.additionalInstructions,
          importantConsiderations: state.howToChooseConsiderations,
          tone: state.howToChooseTone,
          desiredLength: state.howToChooseLength,
        },
        styles
      );

    case 'faq':
      return generateGiftGuideFaqPrompt(
        {
          guideTitle: state.guideTitle,
          recipient: state.recipient,
          primaryKeyword: state.primaryKeyword,
          additionalInstructions: state.additionalInstructions,
          questionsToAnswer: state.faqQuestionsToAnswer,
          numberOfQuestions: state.faqNumberOfQuestions,
          tone: state.faqTone,
        },
        styles
      );

    case 'title-meta':
      return generateGiftGuideTitleMetaPrompt(
        {
          guideTitle: state.guideTitle,
          recipient: state.recipient,
          primaryKeyword: state.primaryKeyword,
          additionalInstructions: state.additionalInstructions,
          secondaryKeywords: state.titleMetaSecondaryKeywords,
          searchIntent: state.titleMetaSearchIntent,
        },
        styles
      );

    default:
      return generateGiftGuideIntroPrompt(
        {
          guideTitle: state.guideTitle,
          recipient: state.recipient,
          primaryKeyword: state.primaryKeyword,
          additionalInstructions: state.additionalInstructions,
          desiredAngle: state.introAngle,
          tone: state.introTone,
        },
        styles
      );
  }
}
