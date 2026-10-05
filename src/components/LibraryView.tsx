import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  RefreshCw,
  RefreshCcw,
  Eye,
  Compass,
  AlertTriangle,
  FolderOpen,
  ArrowRight,
  Shirt,
  FileText,
  Coffee,
  Palette,
  Upload,
  RotateCcw,
  Tag,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  CircleDashed,
} from 'lucide-react';
import { DesignItem, DesignSource, AnalysisStatus } from '../types';

interface LibraryViewProps {
  designs: DesignItem[];
  onSelectDesign: (design: DesignItem) => void;
  onOpenUpload: () => void;
  onAnalyzeDesign: (designId: string) => Promise<void>;
  analyzingId: string | null;
  onResetSamples: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  designs,
  onSelectDesign,
  onOpenUpload,
  onAnalyzeDesign,
  analyzingId,
  onResetSamples,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'All' | DesignSource>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'analyzed' | 'unanalyzed'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);

  // Extract unique categories & tags
  const categories = useMemo(() => {
    const set = new Set<string>();
    designs.forEach((d) => {
      if (d.category) set.add(d.category);
    });
    return Array.from(set).sort();
  }, [designs]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    designs.forEach((d) => {
      (d.tags || []).forEach((t) => set.add(t));
    });
    return Array.from(set).sort();
  }, [designs]);

  // Initial tag limit before showing "+ X more"
  const INITIAL_TAG_LIMIT = 14;
  const hasMoreTags = allTags.length > INITIAL_TAG_LIMIT;

  const visibleTags = useMemo(() => {
    if (isTagsExpanded || !hasMoreTags) return allTags;
    const initialSlice = allTags.slice(0, INITIAL_TAG_LIMIT);
    if (selectedTag !== 'All' && !initialSlice.includes(selectedTag)) {
      return [...initialSlice, selectedTag];
    }
    return initialSlice;
  }, [allTags, isTagsExpanded, hasMoreTags, selectedTag]);

  // Filtering
  const filteredDesigns = useMemo(() => {
    return designs.filter((d) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = d.name.toLowerCase().includes(q);
        const matchCategory = d.category.toLowerCase().includes(q);
        const matchTags = d.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchCategory && !matchTags) return false;
      }
      if (sourceFilter !== 'All' && d.source !== sourceFilter) return false;
      if (statusFilter === 'analyzed' && d.analysisStatus !== 'analyzed') return false;
      if (statusFilter === 'unanalyzed' && d.analysisStatus === 'analyzed') return false;
      if (categoryFilter !== 'All' && d.category !== categoryFilter) return false;
      if (selectedTag !== 'All' && !d.tags.includes(selectedTag)) return false;
      return true;
    });
  }, [designs, searchQuery, sourceFilter, statusFilter, categoryFilter, selectedTag]);

  const analyzedCount = designs.filter((d) => d.analysisStatus === 'analyzed').length;

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('shirt') || cat.includes('hoodie')) return <Shirt className="w-3.5 h-3.5 text-[#64748B]" />;
    if (cat.includes('poster') || cat.includes('print')) return <FileText className="w-3.5 h-3.5 text-[#64748B]" />;
    if (cat.includes('mug') || cat.includes('bottle')) return <Coffee className="w-3.5 h-3.5 text-[#64748B]" />;
    return <Palette className="w-3.5 h-3.5 text-[#64748B]" />;
  };

  const getInfluencePips = (influence: string) => {
    const count = influence === 'High' ? 3 : influence === 'Medium' ? 2 : 1;
    return (
      <div className="flex items-center gap-1" title={`Influence: ${influence}`}>
        {[1, 2, 3].map((pip) => (
          <span
            key={pip}
            className={`w-1 h-2 rounded-xs transition-colors ${
              pip <= count ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 01 REFERENCE COLLECTION Header Panel */}
      <div className="bg-white rounded-xl border border-[#CBD5E1] p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                01 REFERENCE ARCHIVE
              </span>
              <span className="text-[#94A3B8] text-xs">/</span>
              <span className="font-mono text-xs text-[#475569] font-medium">
                {designs.length} designs cataloged
              </span>
              <span className="text-[#94A3B8] text-xs">/</span>
              <span className="font-mono text-xs text-[#0D9488] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {analyzedCount} analyzed for DNA
              </span>
            </div>
            <h1 className="font-serif-heading text-2xl sm:text-3xl text-[#0F172A] font-normal tracking-tight">
              Design Reference Collection
            </h1>
            <p className="text-xs sm:text-sm text-[#334155] max-w-2xl leading-relaxed">
              Organize visual references and apparel graphics. Inspect details and trigger on-demand
              Gemini extraction to synthesize your recurring design language.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onResetSamples}
              className="px-3.5 py-2 text-xs font-medium text-[#334155] hover:text-[#0F172A] border border-[#CBD5E1] hover:border-[#94A3B8] bg-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Reset library to default curated design set"
            >
              <RefreshCcw className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Reset Samples</span>
            </button>
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#1E293B] rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload References</span>
            </button>
          </div>
        </div>

        {/* 02 FILTER & ORGANIZE Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[#64748B]">
              02 FILTER & ORGANIZE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search Box */}
            <div className="lg:col-span-4 relative">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-[#94A3B8] pointer-events-none" />
              <input
                type="text"
                placeholder="Search reference titles, categories, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white text-[#0F172A] placeholder:text-[#94A3B8] shadow-2xs"
              />
            </div>

            {/* Source Filter Segmented Buttons */}
            <div className="lg:col-span-3 flex items-center gap-1 p-1 bg-[#E2E8F0]/70 rounded-lg border border-[#CBD5E1]">
              {(['All', 'My Design', 'Inspiration'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSourceFilter(s)}
                  className={`flex-1 py-1.5 px-2.5 text-xs font-medium rounded-md transition-all whitespace-nowrap text-center cursor-pointer ${
                    sourceFilter === s
                      ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Status Filter Segmented Buttons */}
            <div className="lg:col-span-3 flex items-center gap-1 p-1 bg-[#E2E8F0]/70 rounded-lg border border-[#CBD5E1]">
              {(['All', 'analyzed', 'unanalyzed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`flex-1 py-1.5 px-2.5 text-xs font-medium rounded-md transition-all whitespace-nowrap text-center capitalize cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Category Dropdown */}
            <div className="lg:col-span-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full py-2 px-3 text-xs border border-[#CBD5E1] rounded-lg bg-white text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] cursor-pointer shadow-2xs font-medium"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Wrapping Filter Shelf */}
          {allTags.length > 0 && (
            <div className="pt-3 border-t border-[#F1F5F9] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#64748B]">
                  <Tag className="w-3 h-3 text-[#2563EB]" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium">
                    Filter by tag
                  </span>
                  {selectedTag !== 'All' && (
                    <span className="text-[10px] font-mono text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-1.5 py-0.2 rounded font-medium">
                      1 active
                    </span>
                  )}
                </div>

                {hasMoreTags && (
                  <button
                    type="button"
                    onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                    className="text-[11px] font-mono text-[#475569] hover:text-[#0F172A] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>{isTagsExpanded ? 'Show less' : `+ ${allTags.length - INITIAL_TAG_LIMIT} more`}</span>
                    {isTagsExpanded ? (
                      <ChevronUp className="w-3 h-3 text-[#64748B]" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-[#64748B]" />
                    )}
                  </button>
                )}
              </div>

              {/* Natural multi-line wrapping tag shelf */}
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Distinct "All" filter button */}
                <button
                  type="button"
                  onClick={() => setSelectedTag('All')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-[color,background-color,border-color,box-shadow] duration-150 ease-out cursor-pointer flex items-center justify-center ${
                    selectedTag === 'All'
                      ? 'bg-[#0F172A] text-white border border-[#0F172A] font-semibold shadow-xs'
                      : 'bg-white text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A] border border-[#CBD5E1] hover:border-[#94A3B8] shadow-2xs font-medium'
                  }`}
                >
                  <span>All {designs.length}</span>
                </button>

                {/* Individual tags */}
                {visibleTags.map((tag) => {
                  const isSelected = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(isSelected ? 'All' : tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-[color,background-color,border-color,box-shadow] duration-150 ease-out cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#0F172A] text-white border border-[#0F172A] font-semibold shadow-xs'
                          : 'bg-white text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A] border border-[#CBD5E1] hover:border-[#94A3B8] shadow-2xs font-medium'
                      }`}
                    >
                      <span>{tag}</span>
                    </button>
                  );
                })}

                {/* Inline expand / collapse control */}
                {!isTagsExpanded && hasMoreTags && (
                  <button
                    type="button"
                    onClick={() => setIsTagsExpanded(true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-[#334155] hover:text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] transition-all duration-150 cursor-pointer flex items-center gap-1 font-medium"
                  >
                    <span>+ {allTags.length - INITIAL_TAG_LIMIT} more</span>
                    <ChevronDown className="w-3 h-3 text-[#64748B]" />
                  </button>
                )}

                {isTagsExpanded && hasMoreTags && (
                  <button
                    type="button"
                    onClick={() => setIsTagsExpanded(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-[#64748B] hover:text-[#0F172A] bg-transparent hover:bg-[#F1F5F9] border border-dashed border-[#CBD5E1] hover:border-[#0F172A] transition-all duration-150 cursor-pointer flex items-center gap-1 font-medium"
                  >
                    <span>Show less</span>
                    <ChevronUp className="w-3 h-3 text-[#64748B]" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid View */}
      {designs.length === 0 ? (
        /* Empty Library State with prominent Upload action */
        <div className="bg-white rounded-xl border border-dashed border-[#CBD5E1] p-16 text-center shadow-xs">
          <div className="w-12 h-12 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-center text-[#0F172A] mx-auto mb-4 shadow-2xs">
            <FolderOpen className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-serif-heading font-medium text-[#0F172A] mb-1">
            Build Your Visual Library
          </h2>
          <p className="text-xs text-[#475569] max-w-md mx-auto mb-6 leading-relaxed">
            Upload images of your past designs, merchandise prototypes, or inspirational pieces to
            begin extracting your personal design knowledge.
          </p>
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload References</span>
          </button>
        </div>
      ) : filteredDesigns.length === 0 ? (
        /* No Search Matches State */
        <div className="bg-white rounded-xl border border-dashed border-[#CBD5E1] p-12 text-center shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-center text-[#64748B] mx-auto mb-3 shadow-2xs">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-base font-serif-heading font-medium text-[#0F172A] mb-1">
            No Matching References
          </h3>
          <p className="text-xs text-[#475569] max-w-sm mx-auto mb-4 leading-relaxed">
            No designs match your active search filters. Try clearing your filters or changing keywords.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSourceFilter('All');
              setStatusFilter('All');
              setCategoryFilter('All');
              setSelectedTag('All');
            }}
            className="px-3.5 py-2 text-xs font-medium text-[#0F172A] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        /* Curated Reference Plate Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredDesigns.map((design) => {
            const isAnalyzed = design.analysisStatus === 'analyzed';
            const isCurrentlyAnalyzing = analyzingId === design.id;

            return (
              <div
                key={design.id}
                onClick={() => onSelectDesign(design)}
                className="group bg-white rounded-xl border border-[#CBD5E1] overflow-hidden shadow-xs hover:border-[#2563EB] hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer relative"
              >
                {/* Visual Thumbnail Area */}
                <div className="aspect-square bg-[#F8FAFC] relative overflow-hidden flex items-center justify-center p-4.5 border-b border-[#E2E8F0]">
                  <img
                    src={design.imageUrl}
                    alt={design.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  />

                  {/* Clean Status & Source Indicators */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    {/* Status Badge */}
                    <div
                      className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 border shadow-xs ${
                        isAnalyzed
                          ? 'bg-white text-[#0D9488] border-[#99F6E4]'
                          : design.errorMessage
                          ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                          : 'bg-white text-[#475569] border-[#CBD5E1]'
                      }`}
                    >
                      {isCurrentlyAnalyzing ? (
                        <>
                          <RefreshCw className="w-2.5 h-2.5 animate-spin text-[#D97706]" />
                          <span className="font-medium">Analyzing...</span>
                        </>
                      ) : isAnalyzed ? (
                        <>
                          <CheckCircle2 className="w-2.5 h-2.5 text-[#0D9488]" />
                          <span className="font-semibold">Analyzed</span>
                        </>
                      ) : design.errorMessage ? (
                        <>
                          <AlertTriangle className="w-2.5 h-2.5 text-[#DC2626]" />
                          <span className="font-medium">Failed</span>
                        </>
                      ) : (
                        <>
                          <CircleDashed className="w-2.5 h-2.5 text-[#94A3B8]" />
                          <span className="font-medium">Unanalyzed</span>
                        </>
                      )}
                    </div>

                    {/* Source Pill */}
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border shadow-xs ${
                        design.source === 'My Design'
                          ? 'bg-[#0F172A] text-white border-[#0F172A] font-medium'
                          : 'bg-white text-[#334155] border-[#CBD5E1] font-medium'
                      }`}
                    >
                      {design.source}
                    </span>
                  </div>

                  {/* Hover Action Overlay */}
                  <div className="absolute inset-0 bg-[#0F172A]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDesign(design);
                      }}
                      className="px-3.5 py-2 bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAnalyzeDesign(design.id);
                      }}
                      disabled={isCurrentlyAnalyzing}
                      className="px-3.5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-1.5 border border-white/20 cursor-pointer"
                      title={isAnalyzed ? 'Analyze again with Gemini' : 'Extract visual intelligence with Gemini'}
                    >
                      {isAnalyzed ? <RefreshCw className="w-3 h-3" /> : <Sparkles className="w-3 h-3 text-[#FDE68A]" />}
                      <span>{isAnalyzed ? 'Re-analyze' : 'Analyze'}</span>
                    </button>
                  </div>
                </div>

                {/* Card Editorial Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Metadata line */}
                    <div className="flex items-center justify-between text-xs text-[#475569] mb-1">
                      <div className="flex items-center gap-1 text-[11px] font-mono text-[#475569] font-medium">
                        {getCategoryIcon(design.category)}
                        <span>{design.category}</span>
                      </div>
                      {getInfluencePips(design.influence)}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-sm text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-1 leading-snug">
                      {design.name}
                    </h3>

                    {/* Compact Tags */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {design.tags.slice(0, 3).map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-mono text-[#475569] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#CBD5E1]">
                          #{tag}
                        </span>
                      ))}
                      {design.tags.length > 3 && (
                        <span className="text-[10px] font-mono text-[#64748B] self-center">
                          +{design.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Line */}
                  <div className="pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-[11px]">
                    <span className="text-[#64748B] font-mono font-medium">
                      {isAnalyzed ? 'DNA Extracted' : 'Ready for Analysis'}
                    </span>
                    <span className="text-[#2563EB] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      View details
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
