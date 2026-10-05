import React, { useState } from 'react';
import { X, CheckSquare, Square } from 'lucide-react';
import { DesignItem, ReferenceSelection } from '../types';

interface ReferenceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  designs: DesignItem[];
  currentReferences: ReferenceSelection[];
  onSaveReferences: (refs: ReferenceSelection[]) => void;
}

const BORROWABLE_ASPECTS: ReferenceSelection['borrowedAspects'][number][] = [
  'Overall aesthetic',
  'Composition',
  'Typography',
  'Color',
  'Concept',
  'Layout',
];

export const ReferenceSelectorModal: React.FC<ReferenceSelectorModalProps> = ({
  isOpen,
  onClose,
  designs,
  currentReferences,
  onSaveReferences,
}) => {
  if (!isOpen) return null;

  const [selections, setSelections] = useState<Map<string, ReferenceSelection['borrowedAspects']>>(
    () => {
      const map = new Map<string, ReferenceSelection['borrowedAspects']>();
      currentReferences.forEach((r) => {
        map.set(r.designId, [...r.borrowedAspects]);
      });
      return map;
    }
  );

  const toggleDesignSelected = (id: string) => {
    setSelections((prev) => {
      const next = new Map(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.set(id, ['Overall aesthetic']);
      }
      return next;
    });
  };

  const toggleAspect = (designId: string, aspect: ReferenceSelection['borrowedAspects'][number]) => {
    setSelections((prev) => {
      const next = new Map(prev);
      const current = next.get(designId) || [];
      if (current.includes(aspect)) {
        const filtered = current.filter((a) => a !== aspect);
        next.set(designId, filtered.length > 0 ? filtered : ['Overall aesthetic']);
      } else {
        next.set(designId, [...current, aspect]);
      }
      return next;
    });
  };

  const handleApply = () => {
    const result: ReferenceSelection[] = [];
    selections.forEach((borrowedAspects, designId) => {
      result.push({ designId, borrowedAspects });
    });
    onSaveReferences(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-[#CBD5E1] w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-[#2563EB]">
                STYLISTIC GROUNDING
              </span>
            </div>
            <h2 className="text-base font-semibold text-[#0F172A]">
              Select Reference Designs
            </h2>
            <p className="text-xs text-[#475569]">
              Borrow structural rules and visual grammar. The prompt explicitly instructs models not to copy literal artwork.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3 bg-[#F8FAFC]">
          {designs.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#64748B] bg-white rounded-xl border border-dashed border-[#CBD5E1] p-8">
              No designs currently in library. Upload references first to enable grounding.
            </div>
          ) : (
            designs.map((design) => {
              const isSelected = selections.has(design.id);
              const aspects = selections.get(design.id) || [];

              return (
                <div
                  key={design.id}
                  onClick={() => toggleDesignSelected(design.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? 'border-2 border-[#2563EB] bg-[#EFF6FF] shadow-xs'
                      : 'border border-[#CBD5E1] bg-white hover:border-[#94A3B8]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDesignSelected(design.id);
                      }}
                      className="text-[#2563EB] cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-[#2563EB]" />
                      ) : (
                        <Square className="w-5 h-5 text-[#94A3B8]" />
                      )}
                    </button>

                    <div className="w-12 h-12 rounded-lg bg-white overflow-hidden border border-[#CBD5E1] shrink-0 p-1 shadow-2xs">
                      <img
                        src={design.imageUrl}
                        alt={design.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#0F172A] truncate">
                          {design.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#475569] px-2 py-0.5 bg-[#F1F5F9] rounded border border-[#CBD5E1]">
                          {design.category}
                        </span>
                        <span className="text-[10px] font-mono text-[#64748B]">
                          {design.source}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#475569] line-clamp-1 mt-0.5">
                        {design.analysis?.whyItWorks || 'Reference piece stored in library.'}
                      </p>
                    </div>
                  </div>

                  {/* Borrowed Aspects Selectors if Selected */}
                  {isSelected && (
                    <div
                      className="mt-3 pt-3 border-t border-[#BFDBFE] pl-8 space-y-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#1D4ED8] block font-semibold">
                        Borrow which visual traits?
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {BORROWABLE_ASPECTS.map((aspect) => {
                          const isAspectActive = aspects.includes(aspect);
                          return (
                            <button
                              key={aspect}
                              type="button"
                              onClick={() => toggleAspect(design.id, aspect)}
                              className={`px-2.5 py-1 text-xs rounded-md transition-all cursor-pointer shadow-2xs ${
                                isAspectActive
                                  ? 'bg-[#2563EB] text-white font-medium shadow-xs'
                                  : 'bg-white text-[#334155] hover:bg-[#F8FAFC] border border-[#CBD5E1]'
                              }`}
                            >
                              {isAspectActive ? `✓ ${aspect}` : `+ ${aspect}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-[#475569]">
            {selections.size} {selections.size === 1 ? 'reference' : 'references'} selected
          </span>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-[#475569] hover:text-[#0F172A] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              Apply Grounding
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
