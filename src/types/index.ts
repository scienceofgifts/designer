export type DesignSource = 'My Design' | 'Inspiration';
export type InfluenceLevel = 'Low' | 'Medium' | 'High';
export type AnalysisStatus = 'unanalyzed' | 'analyzing' | 'analyzed' | 'error';

export interface VisualCharacteristics {
  typography: string;
  composition: string;
  colorPalette: string;
  illustration: string;
  layout: string;
  visualHierarchy: string;
  negativeSpace: string;
  symmetry: string;
  density: string;
}

export interface ConceptualCharacteristics {
  subject: string;
  concept: string;
  tone: string;
  humor: string;
  emotionalQuality: string;
  intendedAudience: string;
  communicationApproach: string;
}

export interface DesignAnalysis {
  designType: string;
  visualCharacteristics: VisualCharacteristics;
  conceptualCharacteristics: ConceptualCharacteristics;
  techniques: string[];
  whyItWorks: string;
  distinctiveCharacteristics: string[];
  analyzedAt: string;
}

export interface DesignItem {
  id: string;
  name: string;
  category: string; // T-shirt, Hoodie, Poster, Mug, Journal, Emblem, etc.
  type: string;     // Apparel, Print, Merchandise, Brand Identity, etc.
  source: DesignSource;
  tags: string[];
  influence: InfluenceLevel;
  imageUrl: string;
  analysisStatus: AnalysisStatus;
  analysis?: DesignAnalysis;
  createdAt: string;
  errorMessage?: string;
}

export interface DnaPrinciple {
  id: string;
  trait: string;
  strength: string;
  observation: string;
}

export interface DesignDna {
  typography: DnaPrinciple[];
  composition: DnaPrinciple[];
  color: DnaPrinciple[];
  concepts: DnaPrinciple[];
  tone: DnaPrinciple[];
  techniques: DnaPrinciple[];
  philosophy: string;
  avoid: string[];
  lastUpdated?: string;
  basedOnCount?: number;
}

export interface ReferenceSelection {
  designId: string;
  borrowedAspects: ('Overall aesthetic' | 'Composition' | 'Typography' | 'Color' | 'Concept' | 'Layout')[];
}

export interface PromptStudioSelections {
  product: string;
  categories: string[];
  visualStyles: string[];
  treatments: string[];
  typeCharacter: string[];
  typeHierarchy: string;
  typeTreatment: string[];
  composition: string[];
  colorStrategy: string;
  palette: string;
  customColorNotes: string;
  concepts: string[];
  subject: string;
  additionalComments?: string;
  useDesignDna: boolean;
  dnaInfluence: 'Subtle' | 'Balanced' | 'Strong';
  references: ReferenceSelection[];
}

export interface EnhancedPromptOutput {
  enhancedPrompt: string;
  artisticDirection: string;
  negativeGuidance: string;
  executionNotes: string;
}

export interface GeneratedPromptResult {
  deterministicPrompt: string;
  enhancedResult?: EnhancedPromptOutput;
  generatedAt: string;
}

export interface BackupPayload {
  format: 'designdna-backup';
  version: 1;
  app: 'DesignDNA Studio';
  exportedAt: string;
  designs: DesignItem[];
  designDna: DesignDna | null;
  promptSelections?: PromptStudioSelections | null;
  lastPromptResult?: GeneratedPromptResult | null;
}

export type BackupImportMode = 'merge' | 'replace';

export interface BackupValidationResult {
  isValid: boolean;
  error?: string;
  payload?: BackupPayload;
  designsCount?: number;
  analyzedCount?: number;
  hasDesignDna?: boolean;
  exportedAt?: string;
}

export interface BackupImportSummary {
  mode: BackupImportMode;
  totalInBackup: number;
  addedCount: number;
  updatedCount: number;
  preservedCount: number;
  totalFinalCount: number;
  dnaRestored: boolean;
}
