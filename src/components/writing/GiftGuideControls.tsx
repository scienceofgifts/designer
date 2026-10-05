import React from 'react';
import {
  Gift,
  BookOpen,
  ShoppingBag,
  Layers,
  HelpCircle,
  FileQuestion,
  Search,
  Sparkles,
  Tag,
  Compass,
  Sliders,
  AlignLeft,
  FileText,
  Link,
  CheckCircle,
} from 'lucide-react';
import {
  GiftGuideSectionType,
  GiftGuideCompositeState,
  GiftGuideTone,
  GiftGuideAngle,
} from '../../prompts/writing/giftGuides/types';
import { WritingStyleKey } from '../../prompts/writing/styles';

interface GiftGuideControlsProps {
  state: GiftGuideCompositeState;
  onChange: (state: GiftGuideCompositeState) => void;
  onGenerate: () => void;
  onOpenStyleLibrary?: (tab?: WritingStyleKey) => void;
}

export const GiftGuideControls: React.FC<GiftGuideControlsProps> = ({
  state,
  onChange,
  onGenerate,
  onOpenStyleLibrary,
}) => {
  const updateField = <K extends keyof GiftGuideCompositeState>(
    field: K,
    value: GiftGuideCompositeState[K]
  ) => {
    onChange({
      ...state,
      [field]: value,
    });
  };

  const sectionStyleKeyMap: Record<GiftGuideSectionType, WritingStyleKey> = {
    introduction: 'editorial',
    'product-copy': 'copy',
    'more-gifts': 'copy',
    'how-to-choose': 'editorial',
    faq: 'editorial',
    'title-meta': 'seo',
  };

  const sectionStyleLabelMap: Record<GiftGuideSectionType, string> = {
    introduction: 'Global + Editorial Directives',
    'product-copy': 'Global + Copy Directives',
    'more-gifts': 'Global + Editorial + Copy Directives',
    'how-to-choose': 'Global + Editorial Directives',
    faq: 'Global + Editorial Directives',
    'title-meta': 'SEO Directives (Global excluded)',
  };

  const sections: {
    id: GiftGuideSectionType;
    label: string;
    icon: React.ReactNode;
    desc: string;
  }[] = [
    {
      id: 'introduction',
      label: 'Introduction',
      icon: <BookOpen className="w-4 h-4" />,
      desc: 'Editorial hook, theme & recipient context',
    },
    {
      id: 'product-copy',
      label: 'Product Copy',
      icon: <ShoppingBag className="w-4 h-4" />,
      desc: 'Single product entry within the guide',
    },
    {
      id: 'more-gifts',
      label: 'More Gifts Section',
      icon: <Layers className="w-4 h-4" />,
      desc: 'Sub-category or themed product cluster',
    },
    {
      id: 'how-to-choose',
      label: 'How to Choose',
      icon: <HelpCircle className="w-4 h-4" />,
      desc: 'Buyer guidance & decision criteria',
    },
    {
      id: 'faq',
      label: 'FAQ Section',
      icon: <FileQuestion className="w-4 h-4" />,
      desc: 'Real gifting questions & clear answers',
    },
    {
      id: 'title-meta',
      label: 'Title & Meta',
      icon: <Search className="w-4 h-4" />,
      desc: 'SEO title, meta description & excerpt',
    },
  ];

  const tones: { id: GiftGuideTone; label: string; desc: string }[] = [
    { id: 'conversational-editorial', label: 'Conversational Editorial', desc: 'Smart, cultured & rhythmic' },
    { id: 'warm-helpful', label: 'Warm & Helpful', desc: 'Supportive, gracious & reassuring' },
    { id: 'witty-refined', label: 'Witty but Refined', desc: 'Clever literary & intellectual wit' },
    { id: 'practical', label: 'Practical', desc: 'Clear utility & value without fluff' },
    { id: 'informational', label: 'Informational', desc: 'History, craft & scientific curiosity' },
  ];

  const introAngles: { id: GiftGuideAngle; label: string; desc: string }[] = [
    { id: 'general-gift-guide', label: 'General Curated', desc: 'Eclectic celebration of curiosity' },
    { id: 'specific-recipient', label: 'Specific Recipient', desc: 'Deeply tuned to exact persona' },
    { id: 'hobby-interest', label: 'Hobby / Passion', desc: 'Respects genuine enthusiast nuance' },
    { id: 'by-budget', label: 'By Budget Tier', desc: 'High thoughtfulness at every price' },
    { id: 'problem-solving', label: 'Problem-Solving', desc: 'For those who have everything' },
    { id: 'occasion-based', label: 'Occasion-Based', desc: 'Tied to celebratory traditions' },
  ];

  const activeSectionInfo = sections.find((s) => s.id === state.activeSection) || sections[0];

  return (
    <div className="space-y-6 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-[#f1f5f9]">
        <div className="w-8 h-8 rounded-xl bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center font-bold">
          <Gift className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0f172a]">
            Gift Guide Section Prompt Generator
          </h2>
          <p className="text-[11px] text-[#64748b]">
            Generate modular, section-by-section prompts for human-authored gift guides
          </p>
        </div>
      </div>

      {/* 1. SECTION SELECTOR (The 6 Section Types) */}
      <div>
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#ccfbf1] text-[#0f766e] text-[11px] font-bold flex items-center justify-center">1</span>
            Select Guide Section to Generate
          </span>
          <span className="text-[11px] font-semibold text-[#0f766e] lowercase">
            {activeSectionInfo.label}
          </span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {sections.map((sec) => {
            const isSelected = state.activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => updateField('activeSection', sec.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#0f766e] bg-[#f0fdfa] ring-1 ring-[#0f766e] shadow-2xs'
                    : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={isSelected ? 'text-[#0f766e]' : 'text-[#64748b]'}>
                    {sec.icon}
                  </span>
                  <p className={`text-xs font-bold ${isSelected ? 'text-[#0f766e]' : 'text-[#1e293b]'}`}>
                    {sec.label}
                  </p>
                </div>
                <p className="text-[10px] text-[#64748b] leading-tight">
                  {sec.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Section Style Rules Indicator */}
        <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl bg-[#f0fdfa] border border-[#ccfbf1] text-xs">
          <div className="flex items-center gap-2 text-[#0f766e]">
            <Sliders className="w-3.5 h-3.5 text-[#0f766e] flex-shrink-0" />
            <span className="text-[11px]">
              Active Style Rules: <strong className="font-semibold text-[#0f172a]">{sectionStyleLabelMap[state.activeSection]}</strong>
            </span>
          </div>
          {onOpenStyleLibrary && (
            <button
              type="button"
              onClick={() => onOpenStyleLibrary(sectionStyleKeyMap[state.activeSection])}
              className="text-[11px] font-semibold text-[#0f766e] hover:text-[#0d9488] underline underline-offset-2 transition-colors cursor-pointer"
            >
              Edit Rules
            </button>
          )}
        </div>
      </div>

      {/* 2. COMMON GIFT GUIDE INFORMATION */}
      <div className="pt-4 border-t border-[#f1f5f9] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#ccfbf1] text-[#0f766e] text-[11px] font-bold flex items-center justify-center">2</span>
            Gift Guide Context
          </h3>
          <span className="text-[11px] text-[#64748b]">Shared across sections</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#334155] block mb-1">
              Gift Guide Title / Topic
            </label>
            <input
              type="text"
              value={state.guideTitle}
              onChange={(e) => updateField('guideTitle', e.target.value)}
              placeholder="e.g. 10 Thoughtful Gifts for Amateur Astronomers & Stargazers"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] text-[#1e293b]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#334155] block mb-1">
              Recipient / Intended Audience
            </label>
            <input
              type="text"
              value={state.recipient}
              onChange={(e) => updateField('recipient', e.target.value)}
              placeholder="e.g. Astronomy enthusiasts, science teachers, stargazers"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] text-[#1e293b]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5 mb-1">
            <Tag className="w-3.5 h-3.5 text-[#0f766e]" />
            Primary Keyword (Optional)
          </label>
          <input
            type="text"
            value={state.primaryKeyword}
            onChange={(e) => updateField('primaryKeyword', e.target.value)}
            placeholder="e.g. astronomy gifts, stargazing gifts"
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] text-[#1e293b]"
          />
        </div>
      </div>

      {/* 3. SECTION-SPECIFIC CONTROLS */}
      <div className="pt-4 border-t border-[#f1f5f9] space-y-4">
        <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-[#ccfbf1] text-[#0f766e] text-[11px] font-bold flex items-center justify-center">3</span>
          {activeSectionInfo.label} Specifications
        </h3>

        {/* SECTION A: INTRODUCTION */}
        {state.activeSection === 'introduction' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5 mb-1.5">
                <Compass className="w-3.5 h-3.5 text-[#0f766e]" />
                Desired Angle
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {introAngles.map((a) => {
                  const isSelected = state.introAngle === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => updateField('introAngle', a.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0f766e] bg-[#f0fdfa] ring-1 ring-[#0f766e]'
                          : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                      }`}
                    >
                      <p className={`text-xs font-bold ${isSelected ? 'text-[#0f766e]' : 'text-[#1e293b]'}`}>
                        {a.label}
                      </p>
                      <p className="text-[10px] text-[#64748b] mt-0.5 leading-tight">
                        {a.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5 mb-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#0f766e]" />
                Tone of Voice
              </label>
              <select
                value={state.introTone}
                onChange={(e) => updateField('introTone', e.target.value as GiftGuideTone)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] bg-white text-[#1e293b]"
              >
                {tones.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label} — {t.desc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* SECTION B: PRODUCT COPY (WITHIN GUIDE) */}
        {state.activeSection === 'product-copy' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#334155] block mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={state.productName}
                  onChange={(e) => updateField('productName', e.target.value)}
                  placeholder="e.g. Celestial Atlas Hardcover Journal"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] text-[#1e293b]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#334155] block mb-1">
                  Product Type / Category
                </label>
                <input
                  type="text"
                  value={state.productType}
                  onChange={(e) => updateField('productType', e.target.value)}
                  placeholder="e.g. Hardcover Journal / Archival Stationery"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] text-[#1e293b]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#334155] flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5 text-[#0f766e]" />
                  Product URL (Optional Reference Link)
                </span>
                <span className="text-[10px] text-[#64748b]">Passed as text reference, not scraped</span>
              </label>
              <input
                type="url"
                value={state.productUrl}
                onChange={(e) => updateField('productUrl', e.target.value)}
                placeholder="e.g. https://scienceofgifts.com/products/celestial-journal"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] text-[#1e293b]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#334155] block mb-1">
                Product Features & Materials
              </label>
              <textarea
                rows={2}
                value={state.productFeatures}
                onChange={(e) => updateField('productFeatures', e.target.value)}
                placeholder="e.g. 160 pages of 120 GSM fountain pen-friendly paper, debossed gold constellation map, lay-flat binding"
                className="w-full p-2.5 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] text-[#1e293b] resize-y"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#334155] block mb-1">
                Why It Specifically Fits the Recipient & Topic
              </label>
              <textarea
                rows={2}
                value={state.whyItFits}
                onChange={(e) => updateField('whyItFits', e.target.value)}
                placeholder="e.g. Ideal for late-night observing logs, sketching planetary transits, and quiet intellectual reflection"
                className="w-full p-2.5 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] text-[#1e293b] resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5 mb-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#0f766e]" />
                  Tone
                </label>
                <select
                  value={state.productTone}
                  onChange={(e) => updateField('productTone', e.target.value as GiftGuideTone)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] bg-white text-[#1e293b]"
                >
                  {tones.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5 mb-1.5">
                  <AlignLeft className="w-3.5 h-3.5 text-[#0f766e]" />
                  Desired Length
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['concise', 'balanced', 'detailed'] as const).map((len) => (
                    <button
                      key={len}
                      type="button"
                      onClick={() => updateField('productLength', len)}
                      className={`py-1.5 text-xs rounded-lg border text-center font-medium capitalize transition-all cursor-pointer ${
                        state.productLength === len
                          ? 'border-[#0f766e] bg-[#f0fdfa] text-[#0f766e] font-bold'
                          : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white text-[#475569]'
                      }`}
                    >
                      {len}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION C: MORE GIFTS SECTION */}
        {state.activeSection === 'more-gifts' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#334155] block mb-1">
                Section / Category Heading
              </label>
              <input
                type="text"
                value={state.moreGiftsSectionName}
                onChange={(e) => updateField('moreGiftsSectionName', e.target.value)}
                placeholder="e.g. More Astronomy T-Shirts, More World War II Gifts, More Gifts for Stargazers"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] text-[#1e293b]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#334155] block mb-1">
                Products or Product Types Included
              </label>
              <textarea
                rows={3}
                value={state.moreGiftsProductsIncluded}
                onChange={(e) => updateField('moreGiftsProductsIncluded', e.target.value)}
                placeholder="e.g. Vintage Apollo 11 schematic tee&#10;James Webb deep field graphic tee&#10;Historical telescope patent illustration tee"
                className="w-full p-2.5 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] text-[#1e293b] resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5 mb-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#0f766e]" />
                  Tone
                </label>
                <select
                  value={state.moreGiftsTone}
                  onChange={(e) => updateField('moreGiftsTone', e.target.value as GiftGuideTone)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] bg-white text-[#1e293b]"
                >
                  {tones.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5 mb-1.5">
                  <AlignLeft className="w-3.5 h-3.5 text-[#0f766e]" />
                  Desired Length
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['short', 'standard', 'expanded'] as const).map((len) => (
                    <button
                      key={len}
                      type="button"
                      onClick={() => updateField('moreGiftsLength', len)}
                      className={`py-1.5 text-xs rounded-lg border text-center font-medium capitalize transition-all cursor-pointer ${
                        state.moreGiftsLength === len
                          ? 'border-[#0f766e] bg-[#f0fdfa] text-[#0f766e] font-bold'
                          : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white text-[#475569]'
                      }`}
                    >
                      {len}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION D: HOW TO CHOOSE THE RIGHT GIFT */}
        {state.activeSection === 'how-to-choose' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#334155] block mb-1">
                Important Buyer Considerations
              </label>
              <textarea
                rows={3}
                value={state.howToChooseConsiderations}
                onChange={(e) => updateField('howToChooseConsiderations', e.target.value)}
                placeholder="e.g. Beginner vs advanced equipment, display space for charts vs portable field gear, archival paper quality, avoiding cheap plastic novelty gimmicks"
                className="w-full p-2.5 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] text-[#1e293b] resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5 mb-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#0f766e]" />
                  Tone
                </label>
                <select
                  value={state.howToChooseTone}
                  onChange={(e) => updateField('howToChooseTone', e.target.value as GiftGuideTone)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] bg-white text-[#1e293b]"
                >
                  {tones.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5 mb-1.5">
                  <AlignLeft className="w-3.5 h-3.5 text-[#0f766e]" />
                  Desired Length
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['concise', 'standard', 'comprehensive'] as const).map((len) => (
                    <button
                      key={len}
                      type="button"
                      onClick={() => updateField('howToChooseLength', len)}
                      className={`py-1.5 text-xs rounded-lg border text-center font-medium capitalize transition-all cursor-pointer ${
                        state.howToChooseLength === len
                          ? 'border-[#0f766e] bg-[#f0fdfa] text-[#0f766e] font-bold'
                          : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white text-[#475569]'
                      }`}
                    >
                      {len}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION E: FREQUENTLY ASKED QUESTIONS */}
        {state.activeSection === 'faq' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#334155] block mb-1">
                  Number of Questions
                </label>
                <div className="flex items-center gap-2">
                  {[3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => updateField('faqNumberOfQuestions', num)}
                      className={`flex-1 py-1.5 text-xs rounded-lg border text-center font-bold transition-all cursor-pointer ${
                        Number(state.faqNumberOfQuestions) === num
                          ? 'border-[#0f766e] bg-[#f0fdfa] text-[#0f766e]'
                          : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white text-[#475569]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5 mb-1">
                  <Sliders className="w-3.5 h-3.5 text-[#0f766e]" />
                  Tone
                </label>
                <select
                  value={state.faqTone}
                  onChange={(e) => updateField('faqTone', e.target.value as GiftGuideTone)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] bg-white text-[#1e293b]"
                >
                  {tones.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#334155] block mb-1">
                Specific Questions to Answer (Optional)
              </label>
              <textarea
                rows={3}
                value={state.faqQuestionsToAnswer}
                onChange={(e) => updateField('faqQuestionsToAnswer', e.target.value)}
                placeholder="Leave blank to let the model generate natural questions, or specify:&#10;What if they already own a telescope?&#10;How do I know what size t-shirt to buy?&#10;What is a reasonable budget for an astronomy gift?"
                className="w-full p-2.5 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] text-[#1e293b] resize-y"
              />
            </div>
          </div>
        )}

        {/* SECTION F: TITLE & META */}
        {state.activeSection === 'title-meta' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5 mb-1">
                <Tag className="w-3.5 h-3.5 text-[#0f766e]" />
                Secondary Keywords (Optional)
              </label>
              <input
                type="text"
                value={state.titleMetaSecondaryKeywords}
                onChange={(e) => updateField('titleMetaSecondaryKeywords', e.target.value)}
                placeholder="e.g. stargazing gifts, astronomy journal, best gifts for telescope owners"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] text-[#1e293b]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5 mb-1">
                <Search className="w-3.5 h-3.5 text-[#0f766e]" />
                Search Intent
              </label>
              <input
                type="text"
                value={state.titleMetaSearchIntent}
                onChange={(e) => updateField('titleMetaSearchIntent', e.target.value)}
                placeholder="e.g. Commercial investigation & curated gift discovery for science lovers"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] text-[#1e293b]"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. ADDITIONAL CONTEXT / INSTRUCTIONS (COMMON) */}
      <div className="pt-4 border-t border-[#f1f5f9]">
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
          <FileText className="w-3.5 h-3.5 text-[#0f766e]" />
          Additional Curator Context / Instructions (Optional)
        </label>
        <textarea
          rows={2}
          value={state.additionalInstructions}
          onChange={(e) => updateField('additionalInstructions', e.target.value)}
          placeholder="e.g. Mention that items should feel heirloom-quality, emphasize tactile physical beauty..."
          className="w-full p-2.5 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] text-[#1e293b] placeholder-[#94a3b8] resize-y"
        />
      </div>

      {/* 5. GENERATE PROMPT BUTTON */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onGenerate}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2.5 text-sm bg-gradient-to-r from-[#0f766e] via-[#0284c7] to-[#0369a1] hover:from-[#0d9488] hover:to-[#0284c7] hover:shadow-lg active:scale-[0.99] cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Generate {activeSectionInfo.label} Prompt</span>
        </button>
        <p className="text-center text-[11px] text-[#64748b] mt-2">
          Outputs a focused, section-specific brief to paste into your LLM
        </p>
      </div>
    </div>
  );
};
