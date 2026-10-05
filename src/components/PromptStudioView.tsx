import React, { useState, useMemo } from 'react';
import {
  Wand2,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Dna,
  Layers,
  Minus,
  Palette,
  Type,
  Layout,
  Lightbulb,
  Package,
  Compass,
  Bookmark,
  Shirt,
  FileText,
  Coffee,
  Quote,
  Award,
  Sparkle,
  SlidersHorizontal,
} from 'lucide-react';
import {
  PromptStudioSelections,
  DesignDna,
  DesignItem,
  GeneratedPromptResult,
} from '../types';
import { generateDeterministicPrompt } from '../utils/promptGenerator';
import { ReferenceSelectorModal } from './ReferenceSelectorModal';

interface PromptStudioViewProps {
  selections: PromptStudioSelections;
  onUpdateSelections: (selections: PromptStudioSelections) => void;
  dna: DesignDna | null;
  designs: DesignItem[];
  lastResult: GeneratedPromptResult | null;
  onSaveResult: (result: GeneratedPromptResult | null) => void;
  onEnhanceWithAi: (structuredPrompt: string) => Promise<any>;
  isEnhancing: boolean;
}

const PRODUCTS = [
  'T-shirt',
  'Hoodie',
  'Sweatshirt',
  'Poster',
  'Mug',
  'Water Bottle',
  'Tumbler',
  'Journal',
  'Notebook',
  'Other',
];

const CATEGORIES = [
  { name: 'Typography', icon: <Type className="w-3 h-3" /> },
  { name: 'Definition', icon: <FileText className="w-3 h-3" /> },
  { name: 'Quote', icon: <Quote className="w-3 h-3" /> },
  { name: 'Badge / Emblem', icon: <Award className="w-3 h-3" /> },
  { name: 'Illustration', icon: <Palette className="w-3 h-3" /> },
  { name: 'Graphic', icon: <Layout className="w-3 h-3" /> },
  { name: 'Minimalist', icon: <Minus className="w-3 h-3" /> },
  { name: 'Vintage', icon: <Compass className="w-3 h-3" /> },
  { name: 'Retro', icon: <Compass className="w-3 h-3" /> },
  { name: 'Text + Illustration', icon: <Layers className="w-3 h-3" /> },
  { name: 'Pattern', icon: <Layout className="w-3 h-3" /> },
  { name: 'Symbolic', icon: <Sparkle className="w-3 h-3" /> },
  { name: 'Academic / Collegiate', icon: <Bookmark className="w-3 h-3" /> },
  { name: 'Identity / Statement', icon: <Check className="w-3 h-3" /> },
  { name: 'Infographic', icon: <SlidersHorizontal className="w-3 h-3" /> },
];

const VISUAL_STYLES = [
  'Minimalist',
  'Vintage',
  'Retro',
  'Editorial',
  'Modern',
  'Classic',
  'Academic',
  'Industrial',
  'Luxury',
  'Playful',
  'Brutalist',
  'Americana',
  'Mid-century',
];

const TREATMENTS = [
  'Line Art',
  'Engraving',
  'Etching',
  'Woodcut',
  'Screen Print',
  'Distressed',
  'Hand-drawn',
];

const TYPE_CHARACTERS = [
  { label: 'Serif', previewStyle: 'font-serif-heading font-medium', description: 'Literary & Archival' },
  { label: 'Sans Serif', previewStyle: 'font-sans font-medium', description: 'Clean & Modern' },
  { label: 'Condensed', previewStyle: 'font-mono tracking-tighter uppercase font-bold', description: 'Impact & Tight' },
  { label: 'Display', previewStyle: 'font-display font-semibold uppercase', description: 'Titular Lead' },
  { label: 'Hand Lettered', previewStyle: 'font-serif-heading italic', description: 'Artisan & Script' },
  { label: 'Decorative', previewStyle: 'font-serif-heading tracking-widest uppercase font-medium', description: 'Ornamental' },
];

const TYPE_HIERARCHIES = [
  'Single statement',
  'Headline + subtitle',
  'Headline + supporting text',
  'Multi-level hierarchy',
];

const TYPE_TREATMENTS = [
  'Bold',
  'Clean',
  'Vintage',
  'Distressed',
  'Editorial',
  'Decorative',
];

const COMPOSITION_DIAGRAMS: Record<string, React.ReactNode> = {
  Centered: (
    <div className="w-4 h-4 border border-current rounded-xs flex items-center justify-center p-0.5">
      <div className="w-2 h-2 bg-current rounded-xs" />
    </div>
  ),
  Symmetrical: (
    <div className="w-4 h-4 border border-current rounded-xs flex items-center justify-center gap-0.5 p-0.5">
      <div className="w-1 h-2.5 bg-current rounded-xs" />
      <div className="w-1 h-2.5 bg-current rounded-xs" />
    </div>
  ),
  Asymmetrical: (
    <div className="w-4 h-4 border border-current rounded-xs flex items-end justify-start p-0.5">
      <div className="w-2 h-2.5 bg-current rounded-xs" />
    </div>
  ),
  'Large graphic': (
    <div className="w-4 h-4 border border-current rounded-xs flex items-center justify-center p-0.5">
      <div className="w-3 h-3 bg-current/60 rounded-xs" />
    </div>
  ),
  'Small emblem': (
    <div className="w-4 h-4 border border-current rounded-xs flex items-start justify-center pt-0.5">
      <div className="w-1.5 h-1.5 rounded-full bg-current" />
    </div>
  ),
  'Chest print': (
    <div className="w-4 h-4 border border-current rounded-xs flex items-start justify-start p-0.5">
      <div className="w-1.5 h-1.5 bg-current rounded-xs" />
    </div>
  ),
  'Full front': (
    <div className="w-4 h-4 border border-current rounded-xs flex items-center justify-center p-0.5">
      <div className="w-2.5 h-3 bg-current/70 rounded-xs" />
    </div>
  ),
  'Badge composition': (
    <div className="w-4 h-4 border border-current rounded-xs flex items-center justify-center">
      <div className="w-3 h-3 rounded-full border border-current flex items-center justify-center">
        <div className="w-1 h-1 bg-current rounded-full" />
      </div>
    </div>
  ),
  Vertical: (
    <div className="w-4 h-4 border border-current rounded-xs flex items-center justify-center">
      <div className="w-1 h-3 bg-current rounded-xs" />
    </div>
  ),
  Horizontal: (
    <div className="w-4 h-4 border border-current rounded-xs flex items-center justify-center">
      <div className="w-3 h-1 bg-current rounded-xs" />
    </div>
  ),
  Dense: (
    <div className="w-4 h-4 border border-current rounded-xs flex flex-col justify-between p-0.5">
      <div className="w-full h-0.5 bg-current" />
      <div className="w-full h-0.5 bg-current" />
      <div className="w-full h-0.5 bg-current" />
    </div>
  ),
  'Generous negative space': (
    <div className="w-4 h-4 border border-current rounded-xs flex items-center justify-center">
      <div className="w-1 h-1 bg-current rounded-xs" />
    </div>
  ),
};

const COMPOSITIONS = [
  'Centered',
  'Symmetrical',
  'Asymmetrical',
  'Large graphic',
  'Small emblem',
  'Chest print',
  'Full front',
  'Badge composition',
  'Vertical',
  'Horizontal',
  'Dense',
  'Generous negative space',
];

const COLOR_STRATEGIES = ['Monochrome', 'Two-tone', 'Limited palette', 'Full color'];

const PRESET_PALETTES = [
  { name: 'Black + Cream', swatches: ['#0F172A', '#F1F5F9'] },
  { name: 'Navy + Cream', swatches: ['#1E293B', '#F1F5F9'] },
  { name: 'Earth tones', swatches: ['#78350F', '#D97706', '#A16207'] },
  { name: 'Muted vintage', swatches: ['#64748B', '#94A3B8', '#E2E8F0'] },
  { name: 'Blue', swatches: ['#1D4ED8', '#60A5FA'] },
  { name: 'Green', swatches: ['#15803D', '#86EFAC'] },
  { name: 'Red', swatches: ['#B91C1C', '#FCA5A5'] },
  { name: 'Neutral', swatches: ['#475569', '#CBD5E1'] },
  { name: 'Custom', swatches: [] },
];

const CONCEPTS = [
  'Identity',
  'Humor',
  'Educational',
  'Pride',
  'Nostalgia',
  'Inside joke',
  'Definition',
  'Quote',
  'Historical reference',
  'Wordplay',
  'Symbolism',
];

export const PromptStudioView: React.FC<PromptStudioViewProps> = ({
  selections,
  onUpdateSelections,
  dna,
  designs,
  lastResult,
  onSaveResult,
  onEnhanceWithAi,
  isEnhancing,
}) => {
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [outputTab, setOutputTab] = useState<'prompt' | 'enhanced'>('prompt');
  const [enhanceError, setEnhanceError] = useState<string | null>(null);

  // Toggle helper supporting "Unspecified" handling
  const toggleArrayItem = (field: keyof PromptStudioSelections, item: string) => {
    const list = (selections[field] as string[]) || [];

    if (item === 'Unspecified' || item === 'Any / Unspecified') {
      const isCurrentlyUnspecified = list.length === 0 || list.includes('Unspecified');
      onUpdateSelections({
        ...selections,
        [field]: isCurrentlyUnspecified ? [] : ['Unspecified'],
      });
      return;
    }

    const withoutUnspecified = list.filter((i) => i !== 'Unspecified' && i !== 'Any / Unspecified');
    const exists = withoutUnspecified.includes(item);
    const updated = exists
      ? withoutUnspecified.filter((i) => i !== item)
      : [...withoutUnspecified, item];

    onUpdateSelections({
      ...selections,
      [field]: updated,
    });
  };

  const setSingleField = (field: keyof PromptStudioSelections, value: any) => {
    onUpdateSelections({
      ...selections,
      [field]: value,
    });
  };

  // Deterministic prompt generation - No AI call
  const handleGeneratePrompt = () => {
    const deterministic = generateDeterministicPrompt(selections, dna, designs);
    onSaveResult({
      deterministicPrompt: deterministic,
      generatedAt: new Date().toISOString(),
    });
    setOutputTab('prompt');
    setEnhanceError(null);
  };

  // Optional AI enhancement - Explicit user action
  const handleEnhance = async () => {
    const promptToEnhance =
      lastResult?.deterministicPrompt ||
      generateDeterministicPrompt(selections, dna, designs);

    setEnhanceError(null);
    try {
      const enhancedOutput = await onEnhanceWithAi(promptToEnhance);
      if (enhancedOutput) {
        onSaveResult({
          deterministicPrompt: promptToEnhance,
          enhancedResult: enhancedOutput,
          generatedAt: new Date().toISOString(),
        });
        setOutputTab('enhanced');
      }
    } catch (err: any) {
      setEnhanceError(err?.message || 'Failed to enhance prompt with AI.');
    }
  };

  const handleCopyPrompt = () => {
    const textToCopy =
      outputTab === 'enhanced' && lastResult?.enhancedResult
        ? lastResult.enhancedResult.enhancedPrompt
        : lastResult?.deterministicPrompt || '';

    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearSelections = () => {
    if (confirm('Reset selections to studio defaults?')) {
      onUpdateSelections({
        product: 'T-shirt',
        categories: ['Typography', 'Minimalist'],
        visualStyles: ['Vintage'],
        treatments: ['Screen Print'],
        typeCharacter: ['Serif'],
        typeHierarchy: 'Single statement',
        typeTreatment: ['Clean'],
        composition: ['Centered', 'Generous negative space'],
        colorStrategy: 'Limited palette',
        palette: 'Black + Cream',
        customColorNotes: '',
        concepts: ['Identity'],
        subject: '',
        useDesignDna: false,
        dnaInfluence: 'Balanced',
        references: [],
      });
      onSaveResult(null);
    }
  };

  const activePromptText =
    outputTab === 'enhanced' && lastResult?.enhancedResult
      ? lastResult.enhancedResult.enhancedPrompt
      : lastResult?.deterministicPrompt || '';

  const wordCount = useMemo(() => {
    if (!activePromptText) return 0;
    return activePromptText.trim().split(/\s+/).filter(Boolean).length;
  }, [activePromptText]);

  const charCount = activePromptText ? activePromptText.length : 0;

  // Active compiled rules summary
  const activeRulesList = useMemo(() => {
    const rules: string[] = [];
    if (selections.product && selections.product !== 'Unspecified') rules.push(selections.product);
    selections.categories.filter((c) => c !== 'Unspecified').forEach((c) => rules.push(c));
    selections.visualStyles.filter((s) => s !== 'Unspecified').forEach((s) => rules.push(s));
    selections.treatments.filter((t) => t !== 'Unspecified').forEach((t) => rules.push(t));
    selections.typeCharacter.filter((t) => t !== 'Unspecified').forEach((t) => rules.push(`Type: ${t}`));
    selections.composition.filter((c) => c !== 'Unspecified').forEach((c) => rules.push(c));
    if (selections.colorStrategy && selections.colorStrategy !== 'Unspecified') rules.push(selections.colorStrategy);
    if (selections.palette && selections.palette !== 'Unspecified') rules.push(selections.palette);
    if (selections.useDesignDna) rules.push(`DNA: ${selections.dnaInfluence}`);
    if (selections.references && selections.references.length > 0) rules.push(`${selections.references.length} Grounding Refs`);
    return rules;
  }, [selections]);

  const getProductIcon = (prod: string) => {
    const p = prod.toLowerCase();
    if (p.includes('shirt') || p.includes('hoodie') || p.includes('sweatshirt')) return <Shirt className="w-3.5 h-3.5" />;
    if (p.includes('poster')) return <FileText className="w-3.5 h-3.5" />;
    if (p.includes('mug') || p.includes('bottle') || p.includes('tumbler')) return <Coffee className="w-3.5 h-3.5" />;
    if (p.includes('journal') || p.includes('notebook')) return <BookOpen className="w-3.5 h-3.5" />;
    return <Package className="w-3.5 h-3.5" />;
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Panel */}
      <div className="bg-white rounded-xl border border-[#CBD5E1] p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
              CREATIVE CONTROL SURFACE
            </span>
            <span className="text-[#94A3B8] text-xs">/</span>
            <span className="font-mono text-xs text-[#475569] font-medium">Deterministic Parameter Synthesis</span>
          </div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl text-[#0F172A] font-normal tracking-tight">
            Prompt Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#334155] max-w-2xl leading-relaxed">
            Configure structured creative parameters to generate an artisanal creative brief for
            image models. Optionally weave in your personal Design DNA or visual reference principles.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleClearSelections}
            className="px-3.5 py-2 text-xs font-medium text-[#334155] hover:text-[#0F172A] border border-[#CBD5E1] hover:border-[#94A3B8] rounded-lg hover:bg-[#F8FAFC] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleGeneratePrompt}
            className="px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Generate Prompt</span>
          </button>
        </div>
      </div>

      {/* Control Surface & Output Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Flowing Numbered Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#CBD5E1] p-6 sm:p-8 shadow-xs divide-y divide-[#E2E8F0] space-y-6">
          {/* 01 PRODUCT & SUBSTRATE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#2563EB]">01</span>
                <span className="text-[#94A3B8]">/</span>
                <h3 className="font-mono text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Product & Substrate
                </h3>
              </div>
              <span className="text-[11px] text-[#64748B] font-mono">Select target format</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSingleField('product', 'Unspecified')}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-[color,background-color,border-color,box-shadow] duration-150 ease-out flex items-center gap-1.5 cursor-pointer ${
                  selections.product === 'Unspecified'
                    ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                    : 'border border-[#CBD5E1] bg-white text-[#334155] hover:border-[#94A3B8] hover:bg-[#F8FAFC] shadow-2xs'
                }`}
              >
                <Minus className="w-3 h-3 text-[#64748B]" />
                <span>Any / Unspecified</span>
              </button>

              {PRODUCTS.map((prod) => {
                const isSelected = selections.product === prod;
                return (
                  <button
                    key={prod}
                    type="button"
                    onClick={() => setSingleField('product', prod)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-[color,background-color,border-color,box-shadow] duration-150 ease-out flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                        : 'border border-[#CBD5E1] bg-white text-[#334155] hover:border-[#94A3B8] hover:bg-[#F8FAFC] shadow-2xs'
                    }`}
                  >
                    {getProductIcon(prod)}
                    <span>{prod}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 02 SUBJECT & THEMATIC HOOK */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#2563EB]">02</span>
                <span className="text-[#94A3B8]">/</span>
                <h3 className="font-mono text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Subject & Thematic Hook
                </h3>
              </div>
              <span className="text-[11px] text-[#64748B] font-mono">Narrative topic</span>
            </div>

            <div>
              <input
                type="text"
                placeholder="e.g. Roman history, Alpine botanicals, Desert motorcycle endurance..."
                value={selections.subject}
                onChange={(e) => setSingleField('subject', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white text-[#0F172A] placeholder:text-[#94A3B8] shadow-2xs"
              />
              <span className="text-[11px] text-[#64748B] block mt-1.5">
                Enter your narrative subject. If empty, the prompt focuses on abstract formal graphic balance.
              </span>
            </div>
          </div>

          {/* 03 DESIGN MODE & FRAMEWORK */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#2563EB]">03</span>
                <span className="text-[#94A3B8]">/</span>
                <h3 className="font-mono text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Design Mode & Framework
                </h3>
              </div>
              <span className="text-[11px] text-[#64748B] font-mono">Genre & layout archetype</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => toggleArrayItem('categories', 'Unspecified')}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-[color,background-color,border-color,box-shadow] duration-150 ease-out flex items-center gap-1.5 cursor-pointer ${
                  selections.categories.length === 0 || selections.categories.includes('Unspecified')
                    ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                    : 'border border-[#CBD5E1] bg-white text-[#334155] hover:border-[#94A3B8] hover:bg-[#F8FAFC] shadow-2xs'
                }`}
                title="No preference: leave layout framework unconstrained"
              >
                <Minus className="w-3 h-3 text-[#64748B]" />
                <span>Any / Unspecified</span>
              </button>

              {CATEGORIES.map((cat) => {
                const isSelected = selections.categories.includes(cat.name);
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => toggleArrayItem('categories', cat.name)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-[color,background-color,border-color,box-shadow] duration-150 ease-out flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                        : 'border border-[#CBD5E1] bg-white text-[#334155] hover:border-[#94A3B8] hover:bg-[#F8FAFC] shadow-2xs'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 04 VISUAL STYLE & LINEAGE */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#2563EB]">04</span>
                <span className="text-[#94A3B8]">/</span>
                <h3 className="font-mono text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Visual Style & Physical Treatment
                </h3>
              </div>
              <span className="text-[11px] text-[#64748B] font-mono">Aesthetics & ink craft</span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block mb-1.5 font-medium">
                  Aesthetic Lineage
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleArrayItem('visualStyles', 'Unspecified')}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-[color,background-color,border-color,box-shadow] duration-150 ease-out flex items-center gap-1 cursor-pointer ${
                      selections.visualStyles.length === 0 || selections.visualStyles.includes('Unspecified')
                        ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                        : 'border border-[#CBD5E1] bg-white text-[#334155] hover:border-[#94A3B8] hover:bg-[#F8FAFC] shadow-2xs'
                    }`}
                  >
                    <Minus className="w-3 h-3 text-[#64748B]" />
                    <span>Any / Unspecified</span>
                  </button>

                  {VISUAL_STYLES.map((style) => {
                    const isSelected = selections.visualStyles.includes(style);
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => toggleArrayItem('visualStyles', style)}
                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-[color,background-color,border-color,box-shadow] duration-150 ease-out flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                            : 'border border-[#CBD5E1] bg-white text-[#334155] hover:border-[#94A3B8] hover:bg-[#F8FAFC] shadow-2xs'
                        }`}
                      >
                        <span>{style}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block mb-1.5 font-medium">
                  Physical Printing & Substrate Treatments
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleArrayItem('treatments', 'Unspecified')}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-[color,background-color,border-color,box-shadow] duration-150 ease-out flex items-center gap-1 cursor-pointer ${
                      selections.treatments.length === 0 || selections.treatments.includes('Unspecified')
                        ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                        : 'border border-[#CBD5E1] bg-white text-[#334155] hover:border-[#94A3B8] hover:bg-[#F8FAFC] shadow-2xs'
                    }`}
                  >
                    <Minus className="w-3 h-3 text-[#64748B]" />
                    <span>Any / Unspecified</span>
                  </button>

                  {TREATMENTS.map((treat) => {
                    const isSelected = selections.treatments.includes(treat);
                    return (
                      <button
                        key={treat}
                        type="button"
                        onClick={() => toggleArrayItem('treatments', treat)}
                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-[color,background-color,border-color,box-shadow] duration-150 ease-out flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                            : 'border border-[#CBD5E1] bg-white text-[#334155] hover:border-[#94A3B8] hover:bg-[#F8FAFC] shadow-2xs'
                        }`}
                      >
                        <span>{treat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 05 TYPOGRAPHY ARCHITECTURE */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#2563EB]">05</span>
                <span className="text-[#94A3B8]">/</span>
                <h3 className="font-mono text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Typography Architecture
                </h3>
              </div>
              <span className="text-[11px] text-[#64748B] font-mono">Letterform discipline</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] font-medium">
                  Letterform Character
                </span>
                <button
                  type="button"
                  onClick={() => setSingleField('typeCharacter', [])}
                  className={`text-[11px] font-mono px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                    selections.typeCharacter.length === 0
                      ? 'text-[#2563EB] font-semibold'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Any / Unspecified
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TYPE_CHARACTERS.map((typeObj) => {
                  const isSelected = selections.typeCharacter.includes(typeObj.label);
                  return (
                    <button
                      key={typeObj.label}
                      type="button"
                      onClick={() => toggleArrayItem('typeCharacter', typeObj.label)}
                      className={`p-3 rounded-lg border text-left transition-[color,background-color,border-color,box-shadow] duration-150 ease-out cursor-pointer shadow-2xs ${
                        isSelected
                          ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                          : 'border border-[#CBD5E1] bg-white text-[#0F172A] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="mb-0.5">
                        <span className={`text-sm ${typeObj.previewStyle} ${isSelected ? 'text-[#1D4ED8]' : 'text-[#0F172A]'}`}>
                          {typeObj.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#64748B] font-mono block">
                        {typeObj.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hierarchy */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block mb-1.5 font-medium">
                Hierarchical Depth
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TYPE_HIERARCHIES.map((h) => {
                  const isSelected = selections.typeHierarchy === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() =>
                        setSingleField('typeHierarchy', isSelected ? 'Unspecified' : h)
                      }
                      className={`p-2.5 rounded-lg border text-xs text-left transition-[color,background-color,border-color,box-shadow] duration-150 ease-out flex items-center justify-between cursor-pointer shadow-2xs ${
                        isSelected
                          ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                          : 'border border-[#CBD5E1] bg-white text-[#334155] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <span>{h}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Surface Treatment */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block mb-1.5 font-medium">
                Typographic Treatment
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => toggleArrayItem('typeTreatment', 'Unspecified')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-[color,background-color,border-color,box-shadow] duration-150 ease-out flex items-center gap-1 cursor-pointer ${
                    selections.typeTreatment.length === 0 || selections.typeTreatment.includes('Unspecified')
                      ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                      : 'border border-[#CBD5E1] bg-white text-[#334155] hover:border-[#94A3B8] hover:bg-[#F8FAFC] shadow-2xs'
                  }`}
                >
                  <Minus className="w-3 h-3 text-[#64748B]" />
                  <span>Any / Unspecified</span>
                </button>

                {TYPE_TREATMENTS.map((treat) => {
                  const isSelected = selections.typeTreatment.includes(treat);
                  return (
                    <button
                      key={treat}
                      type="button"
                      onClick={() => toggleArrayItem('typeTreatment', treat)}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-[color,background-color,border-color,box-shadow] duration-150 ease-out flex items-center gap-1 cursor-pointer ${
                        isSelected
                          ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                          : 'border border-[#CBD5E1] bg-white text-[#334155] hover:border-[#94A3B8] hover:bg-[#F8FAFC] shadow-2xs'
                      }`}
                    >
                      <span>{treat}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 06 COMPOSITION & SPATIAL GRID */}
          <div className="pt-6 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#2563EB]">06</span>
                <span className="text-[#94A3B8]">/</span>
                <h3 className="font-mono text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Composition & Spatial Grid
                </h3>
              </div>
              <span className="text-[11px] text-[#64748B] font-mono">Bounding and balance</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => toggleArrayItem('composition', 'Unspecified')}
                className={`p-2.5 rounded-lg border text-xs text-left transition-[color,background-color,border-color,box-shadow] duration-150 ease-out flex items-center gap-2 cursor-pointer shadow-2xs ${
                  selections.composition.length === 0 || selections.composition.includes('Unspecified')
                    ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                    : 'border border-[#CBD5E1] bg-white text-[#64748B] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                }`}
              >
                <Minus className="w-3.5 h-3.5 text-[#64748B]" />
                <span className="truncate">Any / Unspecified</span>
              </button>

              {COMPOSITIONS.map((comp) => {
                const isSelected = selections.composition.includes(comp);
                return (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => toggleArrayItem('composition', comp)}
                    className={`p-2.5 rounded-lg border text-xs text-left transition-[color,background-color,border-color,box-shadow] duration-150 ease-out flex items-center gap-2 cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                        : 'border border-[#CBD5E1] bg-white text-[#334155] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className={isSelected ? 'text-[#2563EB]' : 'text-[#64748B]'}>
                      {COMPOSITION_DIAGRAMS[comp] || <Layout className="w-4 h-4" />}
                    </div>
                    <span className="truncate text-xs">{comp}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 07 COLOR & PIGMENT PALETTE */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#2563EB]">07</span>
                <span className="text-[#94A3B8]">/</span>
                <h3 className="font-mono text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Color & Pigment Palette
                </h3>
              </div>
              <span className="text-[11px] text-[#64748B] font-mono">Substrate separation</span>
            </div>

            {/* Strategy Segments */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block mb-1.5 font-medium">
                Color Strategy
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSingleField('colorStrategy', 'Unspecified')}
                  className={`py-2 px-2 text-xs rounded-lg border text-center transition-[color,background-color,border-color,box-shadow] duration-150 ease-out cursor-pointer shadow-2xs ${
                    selections.colorStrategy === 'Unspecified'
                      ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                      : 'border border-[#CBD5E1] bg-white text-[#64748B] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                  }`}
                >
                  Unspecified
                </button>
                {COLOR_STRATEGIES.map((strat) => {
                  const isSelected = selections.colorStrategy === strat;
                  return (
                    <button
                      key={strat}
                      type="button"
                      onClick={() => setSingleField('colorStrategy', strat)}
                      className={`py-2 px-2 text-xs rounded-lg border text-center transition-[color,background-color,border-color,box-shadow] duration-150 ease-out cursor-pointer shadow-2xs ${
                        isSelected
                          ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                          : 'border border-[#CBD5E1] bg-white text-[#334155] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {strat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Palettes with real swatches */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block mb-1.5 font-medium">
                Palette Choices
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSingleField('palette', 'Unspecified')}
                  className={`p-2.5 rounded-lg border text-left transition-[color,background-color,border-color,box-shadow] duration-150 ease-out flex items-center justify-between cursor-pointer shadow-2xs ${
                    selections.palette === 'Unspecified'
                      ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                      : 'border border-[#CBD5E1] bg-white text-[#64748B] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <span className="text-xs">Any / Unspecified</span>
                  <Minus className="w-3 h-3 text-[#64748B]" />
                </button>

                {PRESET_PALETTES.map((pal) => {
                  const isSelected = selections.palette === pal.name;
                  return (
                    <button
                      key={pal.name}
                      type="button"
                      onClick={() => setSingleField('palette', pal.name)}
                      className={`p-2.5 rounded-lg border text-left transition-[color,background-color,border-color,box-shadow] duration-150 ease-out flex items-center justify-between cursor-pointer shadow-2xs ${
                        isSelected
                          ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                          : 'border border-[#CBD5E1] bg-white hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <span className="text-xs text-[#0F172A] truncate font-medium">{pal.name}</span>
                      {pal.swatches.length > 0 && (
                        <div className="flex items-center -space-x-1 shrink-0 ml-1.5">
                          {pal.swatches.map((color, sIdx) => (
                            <span
                              key={sIdx}
                              className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom ink notes */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block mb-1 font-medium">
                Custom Ink / Substrate Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Washed charcoal discharge ink on unbleached bone cotton ground"
                value={selections.customColorNotes}
                onChange={(e) => setSingleField('customColorNotes', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#2563EB] bg-white text-[#0F172A] shadow-2xs"
              />
            </div>
          </div>

          {/* 08 CONCEPTUAL RESONANCE */}
          <div className="pt-6 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#2563EB]">08</span>
                <span className="text-[#94A3B8]">/</span>
                <h3 className="font-mono text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Conceptual Resonance
                </h3>
              </div>
              <span className="text-[11px] text-[#64748B] font-mono">Rhetorical hook</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => toggleArrayItem('concepts', 'Unspecified')}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-[color,background-color,border-color,box-shadow] duration-150 ease-out flex items-center gap-1 cursor-pointer ${
                  selections.concepts.length === 0 || selections.concepts.includes('Unspecified')
                    ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                    : 'border border-[#CBD5E1] bg-white text-[#334155] hover:border-[#94A3B8] hover:bg-[#F8FAFC] shadow-2xs'
                }`}
              >
                <Minus className="w-3 h-3 text-[#64748B]" />
                <span>Any / Unspecified</span>
              </button>

              {CONCEPTS.map((concept) => {
                const isSelected = selections.concepts.includes(concept);
                return (
                  <button
                    key={concept}
                    type="button"
                    onClick={() => toggleArrayItem('concepts', concept)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-[color,background-color,border-color,box-shadow] duration-150 ease-out flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'border border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB] shadow-xs'
                        : 'border border-[#CBD5E1] bg-white text-[#334155] hover:border-[#94A3B8] hover:bg-[#F8FAFC] shadow-2xs'
                    }`}
                  >
                    <span>{concept}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 09 PERSONAL DESIGN DNA */}
          <div className="pt-6 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#2563EB]">09</span>
                <span className="text-[#94A3B8]">/</span>
                <h3 className="font-mono text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Personal Design DNA
                </h3>
              </div>
              <span className="text-[11px] text-[#64748B] font-mono">Codified studio intelligence</span>
            </div>

            <div className="p-4.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0F172A] uppercase tracking-[0.15em] font-mono">
                    USE MY DESIGN DNA
                  </span>
                  <p className="text-[11px] text-[#475569] mt-0.5">
                    {selections.useDesignDna
                      ? 'Your established design principles will actively govern and calibrate this brief.'
                      : 'Disabled. Prompt will only reflect your explicit selections above.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSingleField('useDesignDna', !selections.useDesignDna)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                    selections.useDesignDna ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-xs ${
                      selections.useDesignDna ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {selections.useDesignDna && (
                <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <span className="text-xs font-medium text-[#334155]">Calibration Influence:</span>
                  <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-[#CBD5E1] shadow-2xs">
                    {(['Subtle', 'Balanced', 'Strong'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSingleField('dnaInfluence', lvl)}
                        className={`px-3 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                          selections.dnaInfluence === lvl
                            ? 'bg-[#0F172A] text-white font-semibold shadow-xs'
                            : 'text-[#475569] hover:text-[#0F172A]'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 10 REFERENCE GROUNDING */}
          <div className="pt-6 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#2563EB]">10</span>
                <span className="text-[#94A3B8]">/</span>
                <h3 className="font-mono text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Reference Grounding
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsReferenceModalOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-[#0F172A] bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#94A3B8] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{selections.references.length > 0 ? 'Manage References' : '+ Select References'}</span>
              </button>
            </div>

            {selections.references.length === 0 ? (
              <p className="text-xs text-[#64748B] italic py-1">
                No reference designs attached. Click "+ Select References" to ground your prompt in existing library works.
              </p>
            ) : (
              <div className="space-y-2.5">
                {selections.references.map((ref) => {
                  const item = designs.find((d) => d.id === ref.designId);
                  return (
                    <div
                      key={ref.designId}
                      className="p-3.5 rounded-xl border border-[#CBD5E1] bg-white hover:border-[#94A3B8] flex items-center justify-between text-xs shadow-xs transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-lg bg-[#F8FAFC] overflow-hidden border border-[#CBD5E1] shrink-0 p-1 shadow-2xs">
                          {item?.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                        <div className="truncate">
                          <span className="font-semibold text-sm text-[#0F172A] truncate block">
                            {item?.name || 'Reference Design'}
                          </span>
                          <span className="text-[11px] text-[#475569] font-mono">
                            Borrowing: {ref.borrowedAspects.join(' · ')}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const filtered = selections.references.filter(
                            (r) => r.designId !== ref.designId
                          );
                          setSingleField('references', filtered);
                        }}
                        className="text-xs font-medium text-[#64748B] hover:text-[#DC2626] px-2.5 py-1 rounded-md hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Artifact Output & Enhancement Panel (5 cols, sticky - Level 3 Elevated Surface) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <div className="bg-white rounded-xl border-2 border-[#CBD5E1] p-6 sm:p-7 shadow-md ring-1 ring-slate-900/5 space-y-5">
            {/* Output Header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3.5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#2563EB]">
                  ARTIFACT OUTPUT
                </span>
                <h3 className="font-serif-heading font-normal text-xl text-[#0F172A]">
                  Generated Creative Brief
                </h3>
                {lastResult && (
                  <span className="text-[11px] font-mono text-[#64748B] block mt-0.5 font-medium">
                    {wordCount.toLocaleString()} words · {charCount.toLocaleString()} chars · Ready to copy
                  </span>
                )}
              </div>

              {lastResult && (
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] transition-colors cursor-pointer shadow-2xs"
                  title="Copy prompt text to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#0D9488]" /> : <Copy className="w-3.5 h-3.5 text-[#64748B]" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={handleGeneratePrompt}
                className="py-2.5 px-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Generate Prompt</span>
              </button>

              <button
                onClick={handleEnhance}
                disabled={isEnhancing}
                className="py-2.5 px-3.5 bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
                title="Elevate structured brief into a production-ready master prompt using Gemini"
              >
                {isEnhancing ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin text-[#D97706]" />
                    <span>Enhancing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Enhance with AI</span>
                  </>
                )}
              </button>
            </div>

            {enhanceError && (
              <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg text-xs text-[#DC2626] font-medium">
                {enhanceError}
              </div>
            )}

            {/* Output Sub-Tabs when AI enhanced output exists */}
            {lastResult?.enhancedResult && (
              <div className="flex border-b border-[#E2E8F0] text-xs font-medium">
                <button
                  onClick={() => setOutputTab('enhanced')}
                  className={`pb-2 px-3.5 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    outputTab === 'enhanced'
                      ? 'border-b-2 border-[#2563EB] text-[#2563EB] font-bold'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>AI Master Prompt</span>
                </button>
                <button
                  onClick={() => setOutputTab('prompt')}
                  className={`pb-2 px-3.5 transition-colors cursor-pointer ${
                    outputTab === 'prompt'
                      ? 'border-b-2 border-[#2563EB] text-[#2563EB] font-bold'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Structured Brief
                </button>
              </div>
            )}

            {/* Output Display Area */}
            {!lastResult ? (
              <div className="p-8 border-2 border-dashed border-[#CBD5E1] rounded-xl text-center bg-[#F8FAFC] space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#2563EB] mx-auto shadow-2xs">
                  <Wand2 className="w-5 h-5 stroke-[1.75]" />
                </div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  Creative Control Surface Ready
                </p>
                <p className="text-xs text-[#475569] max-w-xs mx-auto leading-relaxed">
                  Adjust creative parameters on the left and click <strong>Generate Prompt</strong> to compile your design brief.
                </p>
              </div>
            ) : outputTab === 'enhanced' && lastResult.enhancedResult ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl space-y-1 shadow-2xs">
                  <span className="text-[10px] font-mono font-bold text-[#D97706] uppercase tracking-[0.2em] block">
                    Artistic Direction
                  </span>
                  <p className="text-xs text-[#0F172A] font-serif-heading italic leading-relaxed">
                    "{lastResult.enhancedResult.artisticDirection}"
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-[0.2em]">
                      Production Master Prompt
                    </span>
                    <span className="text-[10px] font-mono text-[#0D9488] font-bold">AI Optimized</span>
                  </div>
                  <div className="p-4 bg-[#0F172A] text-white rounded-xl font-mono text-xs leading-relaxed max-h-72 overflow-y-auto select-all whitespace-pre-wrap shadow-inner">
                    {lastResult.enhancedResult.enhancedPrompt}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 bg-white border border-[#CBD5E1] rounded-xl shadow-2xs">
                    <span className="text-[10px] font-mono text-[#DC2626] font-bold block mb-1 uppercase tracking-wider">
                      Negative Directives
                    </span>
                    <p className="text-[11px] text-[#475569] leading-snug">
                      {lastResult.enhancedResult.negativeGuidance}
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-[#CBD5E1] rounded-xl shadow-2xs">
                    <span className="text-[10px] font-mono text-[#0F172A] font-bold block mb-1 uppercase tracking-wider">
                      Execution Notes
                    </span>
                    <p className="text-[11px] text-[#475569] leading-snug">
                      {lastResult.enhancedResult.executionNotes}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl max-h-96 overflow-y-auto font-mono text-xs leading-relaxed whitespace-pre-wrap text-[#0F172A] select-all shadow-inner">
                  {lastResult.deterministicPrompt}
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-1">
                  <span>Compiled deterministically</span>
                  <span>{new Date(lastResult.generatedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            )}

            {/* Section: Active Rules Summary Row */}
            {activeRulesList.length > 0 && (
              <div className="pt-3.5 border-t border-[#E2E8F0] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#64748B] block">
                  Active Rules
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeRulesList.map((rule, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-[10px] font-mono bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] rounded-md font-medium shadow-2xs"
                    >
                      {rule}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reference Selection Modal */}
      <ReferenceSelectorModal
        isOpen={isReferenceModalOpen}
        onClose={() => setIsReferenceModalOpen(false)}
        designs={designs}
        currentReferences={selections.references}
        onSaveReferences={(refs) => setSingleField('references', refs)}
      />
    </div>
  );
};
