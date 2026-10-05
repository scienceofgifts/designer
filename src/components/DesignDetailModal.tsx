import React, { useState } from 'react';
import {
  X,
  Sparkles,
  RefreshCw,
  Trash2,
  Check,
  AlertCircle,
  Edit3,
  Compass,
  CheckCircle2,
  CircleDashed,
} from 'lucide-react';
import { DesignItem, DesignSource, InfluenceLevel } from '../types';
import { parseErrorMessage } from '../utils/geminiErrorHandler';

interface DesignDetailModalProps {
  design: DesignItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (designId: string) => Promise<void>;
  onUpdateDesign: (designId: string, updates: Partial<DesignItem>) => void;
  onDeleteDesign: (designId: string) => void;
  isAnalyzing: boolean;
  analysisProgressMessage?: string | null;
}

export const DesignDetailModal: React.FC<DesignDetailModalProps> = ({
  design,
  isOpen,
  onClose,
  onAnalyze,
  onUpdateDesign,
  onDeleteDesign,
  isAnalyzing,
  analysisProgressMessage,
}) => {
  if (!isOpen || !design) return null;

  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [name, setName] = useState(design.name);
  const [category, setCategory] = useState(design.category);
  const [source, setSource] = useState<DesignSource>(design.source);
  const [influence, setInfluence] = useState<InfluenceLevel>(design.influence);
  const [tagsInput, setTagsInput] = useState(design.tags.join(', '));
  const [activeTab, setActiveTab] = useState<'visual' | 'conceptual' | 'techniques'>('visual');

  const handleSaveMetadata = () => {
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    onUpdateDesign(design.id, {
      name: name.trim() || 'Untitled Design',
      category,
      source,
      influence,
      tags: parsedTags,
    });
    setIsEditingMetadata(false);
  };

  const hasAnalysis = !!design.analysis;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-[#CBD5E1] w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border shadow-2xs font-medium ${
                design.source === 'My Design'
                  ? 'bg-[#0F172A] text-white border-[#0F172A]'
                  : 'bg-white text-[#334155] border-[#CBD5E1]'
              }`}
            >
              {design.source}
            </span>
            <span className="text-[#94A3B8] text-xs">/</span>
            <h2 className="text-base font-semibold text-[#0F172A] truncate max-w-md">
              {design.name}
            </h2>
            <span className="text-[#94A3B8] text-xs">/</span>
            <span className="text-xs text-[#64748B] font-mono">{design.category}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (confirm('Delete this design from your library?')) {
                  onDeleteDesign(design.id);
                  onClose();
                }
              }}
              className="p-1.5 text-[#64748B] hover:text-[#DC2626] rounded-lg hover:bg-[#FEE2E2] transition-colors cursor-pointer"
              title="Delete reference"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E2E8F0]">
          {/* Left Column: Image Canvas & Metadata */}
          <div className="lg:col-span-5 p-6 bg-[#F8FAFC] flex flex-col space-y-5">
            {/* Visual Canvas Box */}
            <div className="aspect-square w-full rounded-xl overflow-hidden border border-[#CBD5E1] bg-white flex items-center justify-center relative p-4 shadow-xs">
              <img
                src={design.imageUrl}
                alt={design.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />

              {/* Status Badge in corner */}
              <div className="absolute top-2.5 left-2.5 bg-white px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 border border-[#CBD5E1] shadow-xs">
                {hasAnalysis ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488]" />
                    <span className="text-[#0D9488] font-semibold">Analyzed</span>
                  </>
                ) : (
                  <>
                    <CircleDashed className="w-3 h-3 text-[#94A3B8]" />
                    <span className="text-[#64748B]">Unanalyzed</span>
                  </>
                )}
              </div>
            </div>

            {/* Metadata Card */}
            <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[10px] font-mono font-medium text-[#64748B] uppercase tracking-[0.2em]">
                  Metadata & Parameters
                </span>
                {!isEditingMetadata ? (
                  <button
                    onClick={() => setIsEditingMetadata(true)}
                    className="flex items-center gap-1 text-xs text-[#2563EB] hover:text-[#1D4ED8] font-semibold cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditingMetadata(false)}
                      className="text-xs text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveMetadata}
                      className="flex items-center gap-1 text-xs text-[#2563EB] font-bold hover:underline cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  </div>
                )}
              </div>

              {!isEditingMetadata ? (
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Provenance</span>
                    <span className="font-semibold text-[#0F172A]">{design.source}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Category</span>
                    <span className="font-semibold text-[#0F172A]">{design.category}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-[#64748B]">Influence Weight</span>
                    <span className="font-semibold text-[#0F172A]">{design.influence}</span>
                  </div>
                  <div className="pt-1.5">
                    <span className="text-[#64748B] block mb-1 font-mono text-[10px] uppercase font-semibold">Tags</span>
                    <div className="flex flex-wrap gap-1">
                      {design.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-mono text-[#334155] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#CBD5E1] shadow-2xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs pt-1">
                  <div>
                    <label className="text-[10px] font-mono text-[#64748B] uppercase block mb-0.5 font-medium">Title</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#CBD5E1] rounded-md text-xs focus:outline-none focus:border-[#2563EB] bg-white text-[#0F172A]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-[#64748B] uppercase block mb-0.5 font-medium">Source</label>
                      <select
                        value={source}
                        onChange={(e) => setSource(e.target.value as DesignSource)}
                        className="w-full px-2 py-1.5 border border-[#CBD5E1] rounded-md text-xs bg-white text-[#0F172A]"
                      >
                        <option value="My Design">My Design</option>
                        <option value="Inspiration">Inspiration</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-[#64748B] uppercase block mb-0.5 font-medium">Influence</label>
                      <select
                        value={influence}
                        onChange={(e) => setInfluence(e.target.value as InfluenceLevel)}
                        className="w-full px-2 py-1.5 border border-[#CBD5E1] rounded-md text-xs bg-white text-[#0F172A]"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[#64748B] uppercase block mb-0.5 font-medium">Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#CBD5E1] rounded-md text-xs focus:outline-none focus:border-[#2563EB] bg-white text-[#0F172A]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[#64748B] uppercase block mb-0.5 font-medium">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#CBD5E1] rounded-md text-xs focus:outline-none focus:border-[#2563EB] bg-white text-[#0F172A]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* AI Action Button */}
            <div className="pt-1">
              <button
                onClick={() => onAnalyze(design.id)}
                disabled={isAnalyzing}
                className="w-full py-3 px-4 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer group"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FDE68A]" />
                    <span className="truncate">
                      {analysisProgressMessage || 'Analyzing Design with Gemini...'}
                    </span>
                  </>
                ) : hasAnalysis ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300" />
                    <span>Analyze Again</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
                    <span>Analyze Design</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-[#64748B] text-center mt-2 font-medium">
                {isAnalyzing && analysisProgressMessage
                  ? analysisProgressMessage
                  : hasAnalysis
                  ? 'Cached locally in browser database. Re-running will overwrite structured observations.'
                  : 'Gemini is only invoked when you click this button. Zero background calls.'}
              </p>
            </div>
          </div>

          {/* Right Column: Structured Analysis Observations */}
          <div className="lg:col-span-7 p-6 flex flex-col space-y-5 bg-white">
            {design.errorMessage && (() => {
              const err = parseErrorMessage(design.errorMessage);
              return (
                <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-xs space-y-2.5 shadow-2xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-[#DC2626] text-xs">{err.title}</p>
                        <p className="text-[#991B1B] mt-0.5 leading-relaxed">{err.message}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onAnalyze(design.id)}
                      disabled={isAnalyzing}
                      className="px-3.5 py-1.5 bg-white hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] rounded-lg font-semibold text-xs shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                      <span>Try Again</span>
                    </button>
                  </div>

                  {/* Technical details disclosure */}
                  {err.technical && (
                    <details className="pt-2 border-t border-[#FCA5A5]/40 text-[11px]">
                      <summary className="cursor-pointer text-[#991B1B] hover:text-[#7F1D1D] font-mono text-[10px] select-none inline-flex items-center gap-1">
                        Technical details
                      </summary>
                      <pre className="mt-1.5 p-2 bg-white rounded border border-[#FECACA] font-mono text-[10px] text-[#7F1D1D] overflow-x-auto whitespace-pre-wrap max-h-32">
                        {err.technical}
                      </pre>
                    </details>
                  )}
                </div>
              );
            })()}

            {!hasAnalysis ? (
              /* Empty Analysis State */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#CBD5E1] rounded-lg bg-[#F8FAFC]">
                <div className="w-12 h-12 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] mb-3 shadow-2xs">
                  <Compass className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-semibold text-[#0F172A]">
                  No Analysis Stored Yet
                </h3>
                <p className="text-xs text-[#475569] max-w-sm mt-1 mb-4 leading-relaxed">
                  Click the <strong>Analyze Design</strong> button to extract structured visual
                  mechanics, typography classifications, color palettes, and conceptual hooks with Gemini.
                </p>
                <button
                  onClick={() => onAnalyze(design.id)}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-[#0F172A] text-white rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-[#1E293B] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
                  <span>Analyze Design Now</span>
                </button>
              </div>
            ) : (
              /* Populated Structured Analysis State */
              <div className="space-y-5">
                {/* Executive Creative Strategy Banner */}
                <div className="p-4 sm:p-5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-[#BFDBFE]/80 pb-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#1D4ED8]">
                      Creative Strategy & Effectiveness
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-[#1D4ED8] bg-white px-2.5 py-0.5 rounded border border-[#BFDBFE] shadow-2xs">
                      Format: {design.analysis?.designType}
                    </span>
                  </div>
                  <p className="text-sm text-[#0F172A] leading-relaxed font-serif-heading italic">
                    "{design.analysis?.whyItWorks}"
                  </p>
                </div>

                {/* Signature Characteristics */}
                {design.analysis?.distinctiveCharacteristics &&
                  design.analysis.distinctiveCharacteristics.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-[0.2em] block">
                        Signature Distinctive Traits
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {design.analysis.distinctiveCharacteristics.map((trait, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg border border-[#CBD5E1] bg-white text-xs text-[#0F172A] flex items-start gap-2.5 shadow-2xs"
                          >
                            <span className="text-[#2563EB] font-mono text-[10px] mt-0.5 font-bold shrink-0">
                              0{idx + 1}.
                            </span>
                            <span className="leading-snug">{trait}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Sub-tabs */}
                <div className="border-b border-[#E2E8F0] flex gap-6 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('visual')}
                    className={`pb-2.5 transition-colors relative cursor-pointer ${
                      activeTab === 'visual'
                        ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    Visual Language
                  </button>
                  <button
                    onClick={() => setActiveTab('conceptual')}
                    className={`pb-2.5 transition-colors relative cursor-pointer ${
                      activeTab === 'conceptual'
                        ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    Concept & Audience
                  </button>
                  <button
                    onClick={() => setActiveTab('techniques')}
                    className={`pb-2.5 transition-colors relative cursor-pointer ${
                      activeTab === 'techniques'
                        ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    Techniques ({design.analysis?.techniques.length || 0})
                  </button>
                </div>

                {/* Tab 1: Visual Language */}
                {activeTab === 'visual' && design.analysis && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block font-medium">
                        Typography
                      </span>
                      <p className="text-[#0F172A] leading-normal">
                        {design.analysis.visualCharacteristics.typography}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block font-medium">
                        Composition & Grid
                      </span>
                      <p className="text-[#0F172A] leading-normal">
                        {design.analysis.visualCharacteristics.composition}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block font-medium">
                        Color Palette
                      </span>
                      <p className="text-[#0F172A] leading-normal">
                        {design.analysis.visualCharacteristics.colorPalette}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block font-medium">
                        Illustration & Line
                      </span>
                      <p className="text-[#0F172A] leading-normal">
                        {design.analysis.visualCharacteristics.illustration}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block font-medium">
                        Visual Hierarchy
                      </span>
                      <p className="text-[#0F172A] leading-normal">
                        {design.analysis.visualCharacteristics.visualHierarchy}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block font-medium">
                        Negative Space
                      </span>
                      <p className="text-[#0F172A] leading-normal">
                        {design.analysis.visualCharacteristics.negativeSpace}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block font-medium">
                        Symmetry
                      </span>
                      <p className="text-[#0F172A] leading-normal">
                        {design.analysis.visualCharacteristics.symmetry}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block font-medium">
                        Information Density
                      </span>
                      <p className="text-[#0F172A] leading-normal">
                        {design.analysis.visualCharacteristics.density}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 2: Concept & Audience */}
                {activeTab === 'conceptual' && design.analysis && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block font-medium">
                        Core Subject
                      </span>
                      <p className="text-[#0F172A] leading-normal">
                        {design.analysis.conceptualCharacteristics.subject}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block font-medium">
                        Underlying Concept
                      </span>
                      <p className="text-[#0F172A] leading-normal">
                        {design.analysis.conceptualCharacteristics.concept}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block font-medium">
                        Tone of Voice
                      </span>
                      <p className="text-[#0F172A] leading-normal">
                        {design.analysis.conceptualCharacteristics.tone}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block font-medium">
                        Humor / Irony
                      </span>
                      <p className="text-[#0F172A] leading-normal">
                        {design.analysis.conceptualCharacteristics.humor}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block font-medium">
                        Emotional Resonance
                      </span>
                      <p className="text-[#0F172A] leading-normal">
                        {design.analysis.conceptualCharacteristics.emotionalQuality}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block font-medium">
                        Intended Audience
                      </span>
                      <p className="text-[#0F172A] leading-normal">
                        {design.analysis.conceptualCharacteristics.intendedAudience}
                      </p>
                    </div>

                    <div className="sm:col-span-2 p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748B] block font-medium">
                        Communication Approach
                      </span>
                      <p className="text-[#0F172A] leading-normal">
                        {design.analysis.conceptualCharacteristics.communicationApproach}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 3: Design Techniques */}
                {activeTab === 'techniques' && design.analysis && (
                  <div className="space-y-2.5">
                    <p className="text-xs text-[#475569]">
                      Identified graphic devices and physical production methodologies:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {design.analysis.techniques.map((tech, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] flex items-start gap-2 text-xs text-[#0F172A]"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                          <span className="font-medium leading-snug">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Telemetry */}
                <div className="text-[11px] font-mono text-[#64748B] pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between">
                  <span>
                    Analyzed:{' '}
                    {design.analysis?.analyzedAt
                      ? new Date(design.analysis.analyzedAt).toLocaleString()
                      : 'Recently'}
                  </span>
                  <span className="flex items-center gap-1 text-[#0D9488]">
                    <CheckCircle2 className="w-3 h-3" />
                    IndexedDB Cache
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
