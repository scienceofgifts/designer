import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  ShieldAlert,
  Type,
  Layout,
  Palette,
  Lightbulb,
  MessageSquare,
  Wrench,
  Quote,
  CheckCircle2,
  Sliders,
  Layers,
} from 'lucide-react';
import { DesignDna, DnaPrinciple, DesignItem } from '../types';

interface DesignDnaViewProps {
  dna: DesignDna | null;
  designs: DesignItem[];
  onUpdateDna: () => Promise<void>;
  onSaveDna: (dna: DesignDna) => void;
  isUpdating: boolean;
}

type DnaCategory = 'typography' | 'composition' | 'color' | 'concepts' | 'tone' | 'techniques';

export const DesignDnaView: React.FC<DesignDnaViewProps> = ({
  dna,
  designs,
  onUpdateDna,
  onSaveDna,
  isUpdating,
}) => {
  const analyzedDesigns = designs.filter((d) => d.analysisStatus === 'analyzed' && d.analysis);
  const analyzedCount = analyzedDesigns.length;

  const [isEditMode, setIsEditMode] = useState(false);

  // Principle editing
  const [editingPrincipleId, setEditingPrincipleId] = useState<string | null>(null);
  const [editTrait, setEditTrait] = useState('');
  const [editStrength, setEditStrength] = useState('');
  const [editObservation, setEditObservation] = useState('');

  // Add principle state
  const [addingCategory, setAddingCategory] = useState<DnaCategory | null>(null);
  const [newTrait, setNewTrait] = useState('');
  const [newStrength, setNewStrength] = useState('');
  const [newObservation, setNewObservation] = useState('');

  // Philosophy editing
  const [isEditingPhilosophy, setIsEditingPhilosophy] = useState(false);
  const [philosophyDraft, setPhilosophyDraft] = useState(dna?.philosophy || '');

  // Avoid list editing
  const [newAvoidItem, setNewAvoidItem] = useState('');

  const startEditPrinciple = (p: DnaPrinciple) => {
    setEditingPrincipleId(p.id);
    setEditTrait(p.trait);
    setEditStrength(p.strength);
    setEditObservation(p.observation);
  };

  const saveEditPrinciple = (category: DnaCategory) => {
    if (!dna || !editingPrincipleId) return;
    const updatedList = (dna[category] || []).map((p) =>
      p.id === editingPrincipleId
        ? { ...p, trait: editTrait.trim() || 'Untitled', strength: editStrength, observation: editObservation }
        : p
    );
    onSaveDna({
      ...dna,
      [category]: updatedList,
    });
    setEditingPrincipleId(null);
  };

  const deletePrinciple = (category: DnaCategory, id: string) => {
    if (!dna) return;
    const updatedList = (dna[category] || []).filter((p) => p.id !== id);
    onSaveDna({
      ...dna,
      [category]: updatedList,
    });
  };

  const addPrinciple = (category: DnaCategory) => {
    if (!dna || !newTrait.trim()) return;
    const newPrinciple: DnaPrinciple = {
      id: 'dna_custom_' + Date.now(),
      trait: newTrait.trim(),
      strength: newStrength.trim() || `Observed across ${analyzedCount} designs`,
      observation: newObservation.trim() || 'Manually added to Design DNA.',
    };
    onSaveDna({
      ...dna,
      [category]: [...(dna[category] || []), newPrinciple],
    });
    setAddingCategory(null);
    setNewTrait('');
    setNewObservation('');
  };

  const savePhilosophy = () => {
    if (!dna) return;
    onSaveDna({
      ...dna,
      philosophy: philosophyDraft.trim(),
    });
    setIsEditingPhilosophy(false);
  };

  const addAvoidItem = () => {
    if (!dna || !newAvoidItem.trim()) return;
    onSaveDna({
      ...dna,
      avoid: [...(dna.avoid || []), newAvoidItem.trim()],
    });
    setNewAvoidItem('');
  };

  const removeAvoidItem = (index: number) => {
    if (!dna) return;
    const updated = (dna.avoid || []).filter((_, i) => i !== index);
    onSaveDna({
      ...dna,
      avoid: updated,
    });
  };

  const getCategoryIcon = (cat: DnaCategory) => {
    switch (cat) {
      case 'typography':
        return <Type className="w-4 h-4 text-[#2563EB]" />;
      case 'composition':
        return <Layout className="w-4 h-4 text-[#2563EB]" />;
      case 'color':
        return <Palette className="w-4 h-4 text-[#2563EB]" />;
      case 'concepts':
        return <Lightbulb className="w-4 h-4 text-[#2563EB]" />;
      case 'tone':
        return <MessageSquare className="w-4 h-4 text-[#2563EB]" />;
      case 'techniques':
        return <Wrench className="w-4 h-4 text-[#2563EB]" />;
    }
  };

  const renderStrengthIndicator = (strength: string) => {
    const isHigh =
      strength.toLowerCase().includes('strong') ||
      strength.toLowerCase().includes('all') ||
      strength.toLowerCase().includes('2 of 2') ||
      strength.toLowerCase().includes('3 of 3') ||
      strength.toLowerCase().includes('4 of 4') ||
      strength.toLowerCase().includes('high');

    const filledCount = isHigh ? 4 : 3;

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.75" title={`Frequency: ${strength}`}>
          {[1, 2, 3, 4, 5].map((idx) => (
            <span
              key={idx}
              className={`w-2 h-1 rounded-xs transition-colors ${
                idx <= filledCount ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] font-mono text-[#64748B] truncate">{strength}</span>
      </div>
    );
  };

  const renderPillarCard = (
    title: string,
    categoryKey: DnaCategory,
    principles: DnaPrinciple[] = []
  ) => {
    return (
      <div className="bg-white rounded-xl border border-[#CBD5E1] p-6 shadow-xs space-y-4 hover:border-[#2563EB]/70 hover:shadow-sm transition-all flex flex-col justify-between">
        <div className="space-y-3.5">
          {/* Pillar Header */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
                {getCategoryIcon(categoryKey)}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#0F172A]">{title}</h3>
                <span className="text-[10px] font-mono text-[#475569] font-medium">
                  {principles.length} documented {principles.length === 1 ? 'rule' : 'rules'}
                </span>
              </div>
            </div>

            {isEditMode && (
              <button
                onClick={() => {
                  setAddingCategory(categoryKey);
                  setNewTrait('');
                  setNewStrength(`Observed across ${analyzedCount} analyzed designs`);
                  setNewObservation('');
                }}
                className="text-[11px] font-medium text-[#0F172A] hover:bg-[#F8FAFC] px-2.5 py-1 rounded-md border border-[#CBD5E1] transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3 h-3" />
                <span>Add Rule</span>
              </button>
            )}
          </div>

          {/* Adding Form inline */}
          {addingCategory === categoryKey && (
            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-2 text-xs">
              <span className="font-mono text-[10px] font-semibold text-[#0F172A] uppercase tracking-wider block">
                Add Rule to {title}
              </span>
              <input
                type="text"
                placeholder="Rule Title (e.g. Symmetrical Heraldic Enclosure)"
                value={newTrait}
                onChange={(e) => setNewTrait(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#E2E8F0] rounded bg-white text-xs focus:outline-none focus:border-[#2563EB]"
              />
              <input
                type="text"
                placeholder="Observed Frequency / Strength"
                value={newStrength}
                onChange={(e) => setNewStrength(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#E2E8F0] rounded bg-white text-xs focus:outline-none focus:border-[#2563EB]"
              />
              <textarea
                placeholder="Observation notes explaining execution..."
                rows={2}
                value={newObservation}
                onChange={(e) => setNewObservation(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#E2E8F0] rounded bg-white text-xs focus:outline-none focus:border-[#2563EB]"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setAddingCategory(null)}
                  className="px-2.5 py-1 text-xs text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addPrinciple(categoryKey)}
                  className="px-3 py-1 bg-[#0F172A] text-white text-xs font-medium rounded hover:bg-[#1E293B] cursor-pointer"
                >
                  Save Rule
                </button>
              </div>
            </div>
          )}

          {/* Principle Items */}
          {principles.length === 0 ? (
            <p className="text-xs text-[#64748B] italic py-2">No specific principles recorded yet.</p>
          ) : (
            <div className="space-y-2.5">
              {principles.map((p) => {
                const isEditing = editingPrincipleId === p.id;
                if (isEditing) {
                  return (
                    <div
                      key={p.id}
                      className="p-3 bg-[#F8FAFC] border border-[#2563EB] rounded-lg space-y-2 text-xs"
                    >
                      <input
                        type="text"
                        value={editTrait}
                        onChange={(e) => setEditTrait(e.target.value)}
                        className="w-full px-2 py-1 border border-[#E2E8F0] rounded bg-white text-xs font-semibold text-[#0F172A]"
                      />
                      <input
                        type="text"
                        value={editStrength}
                        onChange={(e) => setEditStrength(e.target.value)}
                        className="w-full px-2 py-1 border border-[#E2E8F0] rounded bg-white text-xs text-[#475569]"
                      />
                      <textarea
                        rows={2}
                        value={editObservation}
                        onChange={(e) => setEditObservation(e.target.value)}
                        className="w-full px-2 py-1 border border-[#E2E8F0] rounded bg-white text-xs"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingPrincipleId(null)}
                          className="px-2 py-1 text-xs text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEditPrinciple(categoryKey)}
                          className="px-3 py-1 bg-[#0F172A] text-white text-xs font-medium rounded cursor-pointer"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#CBD5E1] transition-all group space-y-2 relative shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-[#0F172A] leading-snug">{p.trait}</h4>
                      {isEditMode && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditPrinciple(p)}
                            className="p-1 text-[#64748B] hover:text-[#0F172A] rounded cursor-pointer"
                            title="Edit rule"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deletePrinciple(categoryKey, p.id)}
                            className="p-1 text-[#64748B] hover:text-[#DC2626] rounded cursor-pointer"
                            title="Delete rule"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {renderStrengthIndicator(p.strength)}

                    <p className="text-xs text-[#334155] leading-relaxed pt-0.5">
                      {p.observation}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tool Header Panel */}
      <div className="bg-white rounded-xl border border-[#CBD5E1] p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
              CREATIVE INTELLIGENCE PROFILE
            </span>
            <span className="text-[#94A3B8] text-xs">/</span>
            <span className="font-mono text-xs text-[#0D9488] flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active System
            </span>
          </div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl text-[#0F172A] font-normal tracking-tight">
            Personal Design DNA
          </h1>
          <p className="text-xs sm:text-sm text-[#334155] max-w-2xl leading-relaxed">
            The codified visual grammar of your personal aesthetic language. Synthesized on demand from
            your analyzed reference library, and fully customizable by you.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
              isEditMode
                ? 'bg-[#0F172A] text-white border-[#0F172A]'
                : 'bg-white text-[#0F172A] border-[#CBD5E1] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{isEditMode ? 'Done Editing' : 'Edit Design DNA'}</span>
          </button>

          <button
            onClick={onUpdateDna}
            disabled={isUpdating || analyzedCount === 0}
            className="px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FDE68A]" />
                <span>Synthesizing DNA...</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Update Design DNA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Warning if no analyzed designs */}
      {analyzedCount === 0 && (
        <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl flex items-start gap-3 text-xs text-[#D97706] shadow-2xs">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#D97706]" />
          <div>
            <p className="font-semibold">No Analyzed Reference Designs</p>
            <p className="mt-0.5 text-[#78350F]">
              Head to the <strong>Library</strong> and click <strong>Analyze Design</strong> on your
              references so Gemini can synthesize cross-design patterns and generate your Design DNA.
            </p>
          </div>
        </div>
      )}

      {dna && (
        <div className="space-y-6">
          {/* Section: 01 DESIGN PHILOSOPHY MANIFESTO (Level 3 Elevated Surface) */}
          <div className="bg-white rounded-xl border-2 border-[#CBD5E1] p-7 sm:p-8 shadow-sm relative overflow-hidden ring-1 ring-slate-900/5">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#2563EB]" />
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3.5 mb-5">
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-[#2563EB]" />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0F172A]">
                  01 DESIGN PHILOSOPHY MANIFESTO
                </span>
              </div>

              {isEditMode && !isEditingPhilosophy && (
                <button
                  onClick={() => {
                    setPhilosophyDraft(dna.philosophy);
                    setIsEditingPhilosophy(true);
                  }}
                  className="text-xs text-[#2563EB] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Manifesto</span>
                </button>
              )}
            </div>

            {!isEditingPhilosophy ? (
              <blockquote className="space-y-3 max-w-4xl">
                <p className="font-serif-heading text-lg sm:text-xl text-[#0F172A] italic leading-relaxed">
                  "{dna.philosophy}"
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-[#64748B] pt-2 border-t border-[#F8FAFC]">
                  <span>Synthesized from {dna.basedOnCount || analyzedCount} analyzed design profiles</span>
                  <span className="text-[#CBD5E1]">/</span>
                  <span>Personal creative constitution</span>
                </div>
              </blockquote>
            ) : (
              <div className="space-y-3">
                <textarea
                  rows={3}
                  value={philosophyDraft}
                  onChange={(e) => setPhilosophyDraft(e.target.value)}
                  className="w-full p-3.5 border border-[#2563EB] rounded-lg text-sm leading-relaxed focus:outline-none font-serif-heading italic bg-[#F8FAFC]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingPhilosophy(false)}
                    className="px-3 py-1.5 text-xs text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={savePhilosophy}
                    className="px-3.5 py-1.5 bg-[#0F172A] text-white text-xs font-semibold rounded cursor-pointer"
                  >
                    Save Manifesto
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section: 02 CORE ANALYTICAL PILLARS */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#0F172A]">
                02 CORE ANALYTICAL PILLARS
              </span>
              <span className="text-xs font-mono text-[#64748B]">
                6 structural dimensions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {renderPillarCard('Typography Architecture', 'typography', dna.typography)}
              {renderPillarCard('Composition & Spatial Grid', 'composition', dna.composition)}
              {renderPillarCard('Color & Substrate Strategy', 'color', dna.color)}
              {renderPillarCard('Conceptual Resonance', 'concepts', dna.concepts)}
              {renderPillarCard('Creative Tone of Voice', 'tone', dna.tone)}
              {renderPillarCard('Craft & Printing Techniques', 'techniques', dna.techniques)}
            </div>
          </div>

          {/* Section: 03 ANTI-PATTERNS & EXCLUSIONS */}
          <div className="bg-white rounded-xl border border-[#CBD5E1] p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#D97706]" />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0F172A]">
                  03 ANTI-PATTERNS & EXCLUSIONS (WHAT TO AVOID)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {(dna.avoid || []).map((rule, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] transition-colors flex items-start justify-between gap-3 text-xs text-[#0F172A] group shadow-2xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                      ✕
                    </span>
                    <span className="leading-snug text-[#334155] font-medium">{rule}</span>
                  </div>
                  {isEditMode && (
                    <button
                      onClick={() => removeAvoidItem(idx)}
                      className="text-[#64748B] hover:text-[#DC2626] transition-colors p-1 cursor-pointer"
                      title="Remove exclusion"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add new boundary input in edit mode */}
            {isEditMode && (
              <div className="flex items-center gap-2 pt-2 max-w-md">
                <input
                  type="text"
                  placeholder="Add exclusion (e.g. Neon drop shadows)..."
                  value={newAvoidItem}
                  onChange={(e) => setNewAvoidItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addAvoidItem();
                  }}
                  className="flex-1 text-xs px-3.5 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#2563EB] bg-white text-[#0F172A] shadow-2xs"
                />
                <button
                  onClick={addAvoidItem}
                  className="px-4 py-2 bg-[#0F172A] text-white text-xs font-semibold rounded-lg hover:bg-[#1E293B] transition-colors cursor-pointer shadow-xs"
                >
                  Add Exclusion
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
