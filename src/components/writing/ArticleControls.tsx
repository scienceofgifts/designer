import React from 'react';
import {
  FileText,
  Sparkles,
  Users,
  Tag,
  Compass,
  Sliders,
  Search,
} from 'lucide-react';
import {
  ArticleOptions,
  ArticleType,
  ArticleTone,
  ArticleSearchIntent,
} from '../../prompts/writing/types';
import { WritingStyleKey } from '../../prompts/writing/styles';

interface ArticleControlsProps {
  options: ArticleOptions;
  onChange: (options: ArticleOptions) => void;
  onGenerate: () => void;
  onOpenStyleLibrary?: (tab?: WritingStyleKey) => void;
}

export const ArticleControls: React.FC<ArticleControlsProps> = ({
  options,
  onChange,
  onGenerate,
  onOpenStyleLibrary,
}) => {
  const updateOption = <K extends keyof ArticleOptions>(
    key: K,
    value: ArticleOptions[K]
  ) => {
    onChange({
      ...options,
      [key]: value,
    });
  };

  const articleTypes: { id: ArticleType; label: string; desc: string }[] = [
    { id: 'informational', label: 'Informational', desc: 'Deep dive into history, craft & science' },
    { id: 'how-to', label: 'How-to', desc: 'Sequential, beautiful practical guidance' },
    { id: 'explainer', label: 'Explainer', desc: 'Demystifying psychology & mechanics' },
    { id: 'advice', label: 'Advice', desc: 'Empathetic counsel on nuanced dilemmas' },
    { id: 'etiquette', label: 'Etiquette', desc: 'Contemporary gifting customs & manners' },
    { id: 'problem-solving', label: 'Problem-Solving', desc: 'Actionable solutions for real friction' },
  ];

  const tones: { id: ArticleTone; label: string }[] = [
    { id: 'conversational-editorial', label: 'Conversational Editorial' },
    { id: 'warm-helpful', label: 'Warm & Helpful' },
    { id: 'witty-refined', label: 'Witty but Refined' },
    { id: 'practical', label: 'Practical & Grounded' },
    { id: 'informational', label: 'Informational & Scholarly' },
    { id: 'authoritative', label: 'Authoritative Cultural Essay' },
  ];

  const searchIntents: { id: ArticleSearchIntent; label: string }[] = [
    { id: 'informational', label: 'Informational (Learning)' },
    { id: 'commercial-investigation', label: 'Commercial Investigation (Comparison)' },
    { id: 'how-to-guide', label: 'How-To Guide (Execution)' },
    { id: 'inspiration-ideas', label: 'Inspiration & Ideas (Browsing)' },
  ];

  return (
    <div className="space-y-6 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
      {/* Tool Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0f172a]">
              Editorial Article Generator
            </h2>
            <p className="text-[11px] text-[#64748b]">
              Produce deep, original magazine features, essays & how-to articles free of robotic SEO fluff
            </p>
          </div>
        </div>
      </div>

      {/* Active Style Directives Banner */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#f0fdfa] border border-[#ccfbf1] text-xs">
        <div className="flex items-center gap-2 text-[#0f766e]">
          <Sliders className="w-3.5 h-3.5 text-[#0f766e] flex-shrink-0" />
          <span className="text-[11px]">
            Active Style Rules: <strong className="font-semibold text-[#0f172a]">Global + Editorial Directives</strong>
          </span>
        </div>
        {onOpenStyleLibrary && (
          <button
            type="button"
            onClick={() => onOpenStyleLibrary('editorial')}
            className="text-[11px] font-semibold text-[#0f766e] hover:text-[#0d9488] underline underline-offset-2 transition-colors cursor-pointer"
          >
            Edit Rules
          </button>
        )}
      </div>

      {/* 1. Topic */}
      <div>
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
          <span className="w-5 h-5 rounded-full bg-[#e0f2fe] text-[#0284c7] text-[11px] font-bold flex items-center justify-center">1</span>
          Article Topic / Title Idea
        </label>
        <input
          type="text"
          value={options.topic}
          onChange={(e) => updateOption('topic', e.target.value)}
          placeholder="e.g. The Architecture of Memory: Why Physical Keepsakes Matter in a Digital Age"
          className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] text-[#1e293b]"
        />
      </div>

      {/* 2. Intended Reader */}
      <div>
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
          <span className="w-5 h-5 rounded-full bg-[#e0f2fe] text-[#0284c7] text-[11px] font-bold flex items-center justify-center">2</span>
          Intended Reader / Target Demographic
        </label>
        <input
          type="text"
          value={options.intendedReader}
          onChange={(e) => updateOption('intendedReader', e.target.value)}
          placeholder="e.g. Design-conscious intellectuals, culture writers, intentional shoppers"
          className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] text-[#1e293b]"
        />
      </div>

      {/* 3. Article Type Grid */}
      <div>
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Compass className="w-3.5 h-3.5 text-[#0284c7]" />
          Article Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {articleTypes.map((t) => {
            const isSelected = options.articleType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => updateOption('articleType', t.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#0284c7] bg-[#f0f9ff] ring-1 ring-[#0284c7]'
                    : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                }`}
              >
                <p className={`text-xs font-bold ${isSelected ? 'text-[#0369a1]' : 'text-[#1e293b]'}`}>
                  {t.label}
                </p>
                <p className="text-[10px] text-[#64748b] mt-0.5 leading-tight">
                  {t.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Tone & Search Intent */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#f1f5f9]">
        <div>
          <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#0284c7]" />
            Tone
          </label>
          <select
            value={options.tone}
            onChange={(e) => updateOption('tone', e.target.value as ArticleTone)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] bg-white text-[#1e293b]"
          >
            {tones.map((tone) => (
              <option key={tone.id} value={tone.id}>
                {tone.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Search className="w-3.5 h-3.5 text-[#0284c7]" />
            Search Intent
          </label>
          <select
            value={options.searchIntent}
            onChange={(e) => updateOption('searchIntent', e.target.value as ArticleSearchIntent)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] bg-white text-[#1e293b]"
          >
            {searchIntents.map((intent) => (
              <option key={intent.id} value={intent.id}>
                {intent.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. SEO Keywords */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#f1f5f9]">
        <div>
          <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Tag className="w-3.5 h-3.5 text-[#0284c7]" />
            Primary Keyword
          </label>
          <input
            type="text"
            value={options.primaryKeyword}
            onChange={(e) => updateOption('primaryKeyword', e.target.value)}
            placeholder="e.g. mindful gift giving"
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] text-[#1e293b]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Tag className="w-3.5 h-3.5 text-[#0284c7]" />
            Secondary Keywords
          </label>
          <input
            type="text"
            value={options.secondaryKeywords}
            onChange={(e) => updateOption('secondaryKeywords', e.target.value)}
            placeholder="e.g. heirloom keepsakes, intentional gifts"
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] text-[#1e293b]"
          />
        </div>
      </div>

      {/* 6. Additional Instructions */}
      <div className="pt-4 border-t border-[#f1f5f9]">
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
          <FileText className="w-3.5 h-3.5 text-[#0284c7]" />
          Additional Instructions (Optional)
        </label>
        <textarea
          rows={3}
          value={options.additionalInstructions || ''}
          onChange={(e) => updateOption('additionalInstructions', e.target.value)}
          placeholder="e.g. Include a historical reference to early Victorian curiosity cabinets, emphasize psychological studies on relational gratitude..."
          className="w-full p-3 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] text-[#1e293b] placeholder-[#94a3b8] resize-y"
        />
      </div>

      {/* Generate Prompt Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onGenerate}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2.5 text-sm bg-gradient-to-r from-[#0284c7] via-[#0f766e] to-[#0d9488] hover:from-[#0369a1] hover:to-[#0f766e] hover:shadow-lg active:scale-[0.99] cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-sky-200" />
          <span>Generate Article Prompt</span>
        </button>
        <p className="text-center text-[11px] text-[#64748b] mt-2">
          Creates an intellectually rich prompt structured like a Kinfolk or New Yorker essay
        </p>
      </div>
    </div>
  );
};
