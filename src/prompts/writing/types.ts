export type StudioCategory = 'image' | 'writing';

export type StudioToolId =
  | 'product-photography'
  | 'gift-guide'
  | 'article'
  | 'product-copy'
  | 'product-data';

export * from './giftGuides/types';

// ==========================================
// 1. Article Types
// ==========================================
export type ArticleType =
  | 'informational'
  | 'how-to'
  | 'explainer'
  | 'advice'
  | 'etiquette'
  | 'problem-solving';

export type ArticleTone =
  | 'conversational-editorial'
  | 'warm-helpful'
  | 'witty-refined'
  | 'practical'
  | 'informational'
  | 'authoritative';

export type ArticleSearchIntent =
  | 'informational'
  | 'commercial-investigation'
  | 'how-to-guide'
  | 'inspiration-ideas';

export interface ArticleOptions {
  topic: string;
  intendedReader: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  searchIntent: ArticleSearchIntent;
  tone: ArticleTone;
  articleType: ArticleType;
  additionalInstructions?: string;
}

// ==========================================
// 2. Product Copy Types (Standalone Product Page Copy)
// ==========================================
export type ProductCopyTone =
  | 'sophisticated-editorial'
  | 'warm-approachable'
  | 'playfully-cerebral'
  | 'minimalist-luxury'
  | 'practical-informative';

export interface ProductCopyOptions {
  productName: string;
  productType: string;
  targetCustomer: string;
  productConcept: string;
  keyFeatures: string;
  tone: ProductCopyTone;
  additionalInstructions?: string;
}

// ==========================================
// 3. Product Data Types (Catalog Metadata Record)
// ==========================================
export type ProductDataPriceMode = 'extract' | 'provided';

export type ProductDataAffiliateType =
  | 'affiliate'
  | 'direct'
  | 'sponsored'
  | 'not-sponsored';

export type ProductDataEditorialPositioning =
  | 'none'
  | 'broad-appeal'
  | 'enthusiast-niche'
  | 'practical-gift'
  | 'conversation-piece'
  | 'collector-enthusiast'
  | 'novelty-gift';

export type ProductDataEditorialTone =
  | 'standard'
  | 'practical'
  | 'playful'
  | 'sophisticated';

export interface ProductDataOptions {
  productUrl: string;
  productType: string;
  category: string;
  affiliateType: ProductDataAffiliateType;
  priceMode: ProductDataPriceMode;
  providedPrice?: string;
  editorialPositioning?: ProductDataEditorialPositioning;
  editorialTone: ProductDataEditorialTone;
  additionalInstructions?: string;
  hasImage?: boolean;
  imageName?: string;
}
