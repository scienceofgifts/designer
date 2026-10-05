/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TopNav, ActiveTab } from './components/TopNav';
import { LibraryView } from './components/LibraryView';
import { DesignDetailModal } from './components/DesignDetailModal';
import { UploadModal } from './components/UploadModal';
import { DesignDnaView } from './components/DesignDnaView';
import { PromptStudioView } from './components/PromptStudioView';
import { storage } from './services/storage';
import { INITIAL_DESIGNS, INITIAL_DESIGN_DNA } from './utils/sampleData';
import { DesignItem, DesignDna, PromptStudioSelections, GeneratedPromptResult } from './types';
import { normalizeImageForAnalysis } from './utils/imageNormalization';
import { classifyGeminiError, ClassifiedError } from './utils/geminiErrorHandler';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { LogoMark } from './components/Logo';
import { analyzeDesignApi, synthesizeDnaApi, enhancePromptApi } from './services/geminiClient';

const DEFAULT_PROMPT_SELECTIONS: PromptStudioSelections = {
  product: 'T-shirt',
  categories: ['Typography', 'Definition', 'Minimalist'],
  visualStyles: ['Minimalist'],
  treatments: ['Screen Print'],
  typeCharacter: ['Serif'],
  typeHierarchy: 'Headline + subtitle',
  typeTreatment: ['Clean'],
  composition: ['Centered', 'Generous negative space'],
  colorStrategy: 'Limited palette',
  palette: 'Black + Cream',
  customColorNotes: '',
  concepts: ['Identity', 'Historical reference'],
  subject: 'Roman history',
  useDesignDna: true,
  dnaInfluence: 'Balanced',
  references: [],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('library');
  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [dna, setDna] = useState<DesignDna | null>(null);
  const [promptSelections, setPromptSelections] = useState<PromptStudioSelections>(DEFAULT_PROMPT_SELECTIONS);
  const [lastPromptResult, setLastPromptResult] = useState<GeneratedPromptResult | null>(null);

  // Modals & UI States
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisProgressMessage, setAnalysisProgressMessage] = useState<string | null>(null);
  const [isUpdatingDna, setIsUpdatingDna] = useState(false);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Load initial data from persistence
  useEffect(() => {
    async function loadData() {
      try {
        let loadedDesigns = await storage.getAllDesigns();
        if (!loadedDesigns || loadedDesigns.length === 0) {
          // Seed with initial curated sample designs
          for (const item of INITIAL_DESIGNS) {
            await storage.saveDesign(item);
          }
          loadedDesigns = INITIAL_DESIGNS;
        }

        let loadedDna = await storage.getDesignDna();
        if (!loadedDna) {
          await storage.saveDesignDna(INITIAL_DESIGN_DNA);
          loadedDna = INITIAL_DESIGN_DNA;
        }

        const loadedSelections = await storage.getPromptStudioSelections();
        const loadedLastPrompt = await storage.getLastPromptResult();

        setDesigns(loadedDesigns);
        setDna(loadedDna);
        if (loadedSelections) setPromptSelections(loadedSelections);
        if (loadedLastPrompt) setLastPromptResult(loadedLastPrompt);
      } catch (err) {
        console.error('Error loading initial data:', err);
      } finally {
        setIsLoadingInitial(false);
      }
    }
    loadData();
  }, []);

  // Save prompt selections whenever updated
  const handleUpdatePromptSelections = useCallback((updated: PromptStudioSelections) => {
    setPromptSelections(updated);
    storage.savePromptStudioSelections(updated);
  }, []);

  // Save prompt result whenever updated
  const handleSavePromptResult = useCallback((res: GeneratedPromptResult | null) => {
    setLastPromptResult(res);
    storage.saveLastPromptResult(res);
  }, []);

  // Save designs batch (from upload)
  const handleSaveUploadedDesigns = async (newItems: DesignItem[]) => {
    for (const item of newItems) {
      await storage.saveDesign(item);
    }
    setDesigns((prev) => [...newItems, ...prev]);
    showNotification(`Added ${newItems.length} new ${newItems.length === 1 ? 'design' : 'designs'} to library.`);
  };

  // Update a single design item (e.g. metadata)
  const handleUpdateDesign = async (designId: string, updates: Partial<DesignItem>) => {
    const existing = designs.find((d) => d.id === designId);
    if (!existing) return;
    const updated = { ...existing, ...updates };
    await storage.saveDesign(updated);
    setDesigns((prev) => prev.map((d) => (d.id === designId ? updated : d)));
    showNotification('Design metadata updated.');
  };

  // Delete a design
  const handleDeleteDesign = async (designId: string) => {
    await storage.deleteDesign(designId);
    setDesigns((prev) => prev.filter((d) => d.id !== designId));
    // Also remove from prompt references if present
    if (promptSelections.references.some((r) => r.designId === designId)) {
      const updatedRefs = promptSelections.references.filter((r) => r.designId !== designId);
      handleUpdatePromptSelections({ ...promptSelections, references: updatedRefs });
    }
    showNotification('Design removed from library.');
  };

  // Explicit Analyze Design action with resilience & bounded automatic retry (max 3 attempts)
  const handleAnalyzeDesign = async (designId: string) => {
    const design = designs.find((d) => d.id === designId);
    if (!design) return;

    setAnalyzingId(designId);
    setAnalysisProgressMessage(null);

    // 1. Normalize image client-side to supported raster base64 (e.g. SVG -> PNG canvas render)
    let normalized;
    try {
      normalized = await normalizeImageForAnalysis(design.imageUrl);
    } catch (normErr: any) {
      console.error('Image normalization error:', normErr);
      const classified = classifyGeminiError(normErr);
      const updatedDesign: DesignItem = {
        ...design,
        errorMessage: JSON.stringify(classified),
      };
      setDesigns((prev) => prev.map((d) => (d.id === designId ? updatedDesign : d)));
      showNotification('Unable to prepare this image for analysis.', 'error');
      setAnalyzingId(null);
      setAnalysisProgressMessage(null);
      return;
    }

    const MAX_ATTEMPTS = 3;
    const BACKOFF_DELAYS = [2000, 5000]; // attempt 1 -> wait 2s -> attempt 2 -> wait 5s -> attempt 3
    let lastError: any = null;
    let lastClassified: ClassifiedError | null = null;

    try {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          if (attempt > 1) {
            setAnalysisProgressMessage(`Gemini is temporarily busy · Retrying (attempt ${attempt} of ${MAX_ATTEMPTS})...`);
          }

          const data = await analyzeDesignApi({
            imageBase64: normalized.base64Data,
            mimeType: normalized.mimeType,
            name: design.name,
            source: design.source,
            category: design.category,
          });

          // SUCCESS: Save new analysis and clear previous errors
          const updatedDesign: DesignItem = {
            ...design,
            analysisStatus: 'analyzed',
            analysis: {
              ...data.analysis,
              analyzedAt: new Date().toISOString(),
            },
            errorMessage: undefined,
          };

          await storage.saveDesign(updatedDesign);
          setDesigns((prev) => prev.map((d) => (d.id === designId ? updatedDesign : d)));
          showNotification(`Analysis complete for "${design.name}". Structured design profile saved.`);
          lastError = null;
          break; // Exit retry loop on success
        } catch (attemptErr: any) {
          lastError = attemptErr;
          lastClassified = classifyGeminiError(attemptErr, attemptErr.data);
          console.error(`Gemini analysis attempt ${attempt}/${MAX_ATTEMPTS} failed:`, attemptErr);

          // Only retry if error is temporary/retryable AND we haven't reached max attempts
          if (!lastClassified.isRetryable || attempt >= MAX_ATTEMPTS) {
            break;
          }

          const delay = BACKOFF_DELAYS[attempt - 1] || 3000;
          setAnalysisProgressMessage(`Gemini is temporarily busy · Retrying in ${Math.round(delay / 1000)}s...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      if (lastError && lastClassified) {
        // PRESERVE EXISTING ANALYSIS:
        // Do NOT overwrite design.analysis or revert analysisStatus if it was already analyzed!
        const updatedDesign: DesignItem = {
          ...design,
          errorMessage: JSON.stringify(lastClassified),
        };
        await storage.saveDesign(updatedDesign);
        setDesigns((prev) => prev.map((d) => (d.id === designId ? updatedDesign : d)));
        showNotification(`${lastClassified.title}: ${lastClassified.message}`, 'error');
      }
    } catch (outerErr: any) {
      console.error('Unhandled analysis error:', outerErr);
      const classified = classifyGeminiError(outerErr);
      const updatedDesign: DesignItem = {
        ...design,
        errorMessage: JSON.stringify(classified),
      };
      await storage.saveDesign(updatedDesign);
      setDesigns((prev) => prev.map((d) => (d.id === designId ? updatedDesign : d)));
      showNotification(`${classified.title}: ${classified.message}`, 'error');
    } finally {
      setAnalyzingId(null);
      setAnalysisProgressMessage(null);
    }
  };

  // Explicit Update Design DNA action
  const handleUpdateDna = async () => {
    const analyzedList = designs.filter((d) => d.analysisStatus === 'analyzed' && d.analysis);
    if (analyzedList.length === 0) {
      showNotification('Analyze at least one design before updating Design DNA.', 'error');
      return;
    }

    setIsUpdatingDna(true);
    try {
      const data = await synthesizeDnaApi(analyzedList);
      const rawDna = data.dna;
      const formatPrinciples = (list: any[] = [], prefix: string) =>
        list.map((item, idx) => ({
          id: `dna_${prefix}_${Date.now()}_${idx}`,
          trait: item.trait || 'Principle',
          strength: item.strength || `Observed across ${analyzedList.length} designs`,
          observation: item.observation || '',
        }));

      const newDna: DesignDna = {
        typography: formatPrinciples(rawDna.typography, 'typo'),
        composition: formatPrinciples(rawDna.composition, 'comp'),
        color: formatPrinciples(rawDna.color, 'col'),
        concepts: formatPrinciples(rawDna.concepts, 'conc'),
        tone: formatPrinciples(rawDna.tone, 'tone'),
        techniques: formatPrinciples(rawDna.techniques, 'tech'),
        philosophy: rawDna.philosophy || dna?.philosophy || 'Design with quiet authority and archival precision.',
        avoid: rawDna.avoid || dna?.avoid || [],
        lastUpdated: new Date().toISOString(),
        basedOnCount: analyzedList.length,
      };

      await storage.saveDesignDna(newDna);
      setDna(newDna);
      showNotification(`Design DNA updated from ${analyzedList.length} analyzed reference designs.`);
    } catch (error: any) {
      console.error('DNA synthesis error:', error);
      showNotification(error?.message || 'Failed to update Design DNA.', 'error');
    } finally {
      setIsUpdatingDna(false);
    }
  };

  // Explicit Enhance with AI action in Prompt Studio
  const handleEnhanceWithAi = async (structuredPrompt: string) => {
    setIsEnhancingPrompt(true);
    try {
      const data = await enhancePromptApi({
        structuredPrompt,
        designDna: promptSelections.useDesignDna ? dna : null,
        dnaInfluence: promptSelections.dnaInfluence,
        references: promptSelections.references.map((r) => {
          const item = designs.find((d) => d.id === r.designId);
          return {
            name: item?.name || 'Reference',
            borrowedAspects: r.borrowedAspects,
          };
        }),
      });

      showNotification('Prompt enhanced with AI art direction.');
      return data.result;
    } catch (error: any) {
      console.error('Enhance prompt error:', error);
      showNotification(error?.message || 'Failed to enhance prompt.', 'error');
      throw error;
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // Reset to default sample library
  const handleResetSamples = async () => {
    if (confirm('Reset library and Design DNA to default curated samples?')) {
      for (const item of INITIAL_DESIGNS) {
        await storage.saveDesign(item);
      }
      await storage.saveDesignDna(INITIAL_DESIGN_DNA);
      setDesigns(INITIAL_DESIGNS);
      setDna(INITIAL_DESIGN_DNA);
      showNotification('Library and Design DNA reset to sample state.');
    }
  };

  const selectedDesign = designs.find((d) => d.id === selectedDesignId) || null;
  const analyzedCount = designs.filter((d) => d.analysisStatus === 'analyzed').length;

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--text-primary)] flex flex-col font-sans antialiased selection:bg-[var(--accent)] selection:text-white transition-colors duration-200">
      {/* Top Bar Contract */}
      <TopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        analyzedCount={analyzedCount}
        totalCount={designs.length}
      />

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 duration-200">
          <div
            className={`p-3.5 rounded-lg border shadow-lg flex items-center gap-3 text-xs font-medium ${
              notification.type === 'error'
                ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                : 'bg-[#0F172A] text-white border-[#0F172A]'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0" />
            )}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-3 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {isLoadingInitial ? (
          <div className="py-24 text-center text-xs text-[#64748B] font-mono">
            Loading design intelligence workspace...
          </div>
        ) : activeTab === 'library' ? (
          <LibraryView
            designs={designs}
            onSelectDesign={(d) => setSelectedDesignId(d.id)}
            onOpenUpload={() => setIsUploadOpen(true)}
            onAnalyzeDesign={handleAnalyzeDesign}
            analyzingId={analyzingId}
            onResetSamples={handleResetSamples}
          />
        ) : activeTab === 'dna' ? (
          <DesignDnaView
            dna={dna}
            designs={designs}
            onUpdateDna={handleUpdateDna}
            onSaveDna={async (updatedDna) => {
              await storage.saveDesignDna(updatedDna);
              setDna(updatedDna);
              showNotification('Design DNA principles saved.');
            }}
            isUpdating={isUpdatingDna}
          />
        ) : (
          <PromptStudioView
            selections={promptSelections}
            onUpdateSelections={handleUpdatePromptSelections}
            dna={dna}
            designs={designs}
            lastResult={lastPromptResult}
            onSaveResult={handleSavePromptResult}
            onEnhanceWithAi={handleEnhanceWithAi}
            isEnhancing={isEnhancingPrompt}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-strong)] py-6 bg-[var(--surface-primary)] text-center text-xs text-[var(--text-secondary)] font-mono shadow-2xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <LogoMark size={16} className="text-[var(--text-muted)]" />
            <span className="font-semibold text-[var(--text-primary)]">DesignDNA Studio</span>
            <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
            <span>Personal Reference Library & Prompt Generator</span>
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">
            {designs.length} designs ({analyzedCount} analyzed) · Client-Side IndexedDB Storage
          </span>
        </div>
      </footer>

      {/* Modal: Design Detail / Analysis */}
      <DesignDetailModal
        design={selectedDesign}
        isOpen={!!selectedDesign}
        onClose={() => setSelectedDesignId(null)}
        onAnalyze={handleAnalyzeDesign}
        onUpdateDesign={handleUpdateDesign}
        onDeleteDesign={handleDeleteDesign}
        isAnalyzing={analyzingId === selectedDesignId}
        analysisProgressMessage={analyzingId === selectedDesignId ? analysisProgressMessage : null}
      />

      {/* Modal: Upload Multiple Designs */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSaveDesigns={handleSaveUploadedDesigns}
      />
    </div>
  );
}
