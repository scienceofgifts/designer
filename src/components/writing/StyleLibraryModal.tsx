import React, { useState, useEffect } from 'react';
import {
  WritingStyleKey,
  WritingStylesConfig,
} from '../../prompts/writing/styles';
import {
  getWritingStyle,
  saveWritingStyle,
  resetWritingStyle,
  isWritingStyleCustomized,
  DEFAULT_STYLES,
  STYLE_METADATA,
} from '../../utils/styleManager';
import {
  X,
  Sliders,
  Check,
  RotateCcw,
  Edit3,
  Shield,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface StyleLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStylesUpdated?: () => void;
  initialTab?: WritingStyleKey;
}

export const StyleLibraryModal: React.FC<StyleLibraryModalProps> = ({
  isOpen,
  onClose,
  onStylesUpdated,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<WritingStyleKey>('global');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingContent, setEditingContent] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Load current content whenever activeTab changes or modal opens
  useEffect(() => {
    if (isOpen) {
      const targetTab = initialTab || activeTab;
      setActiveTab(targetTab);
      setEditingContent(getWritingStyle(targetTab));
      setIsEditing(false);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const currentCustomized = isWritingStyleCustomized(activeTab);
  const currentMetadata = STYLE_METADATA[activeTab];

  const handleStartEdit = () => {
    setEditingContent(getWritingStyle(activeTab));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditingContent(getWritingStyle(activeTab));
    setIsEditing(false);
  };

  const handleSave = () => {
    saveWritingStyle(activeTab, editingContent);
    setIsEditing(false);
    showNotice(`${currentMetadata.label} saved successfully.`);
    if (onStylesUpdated) onStylesUpdated();
  };

  const handleResetCurrent = () => {
    resetWritingStyle(activeTab);
    setEditingContent(DEFAULT_STYLES[activeTab]);
    setIsEditing(false);
    showNotice(`${currentMetadata.label} restored to built-in default.`);
    if (onStylesUpdated) onStylesUpdated();
  };

  const handleResetAll = () => {
    (['global', 'editorial', 'copy', 'seo'] as WritingStyleKey[]).forEach((key) => {
      resetWritingStyle(key);
    });
    setEditingContent(DEFAULT_STYLES[activeTab]);
    setIsEditing(false);
    showNotice('All writing styles restored to built-in defaults.');
    if (onStylesUpdated) onStylesUpdated();
  };

  const showNotice = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage(null);
    }, 2800);
  };

  const tabs: { key: WritingStyleKey; label: string }[] = [
    { key: 'global', label: 'Global Style' },
    { key: 'editorial', label: 'Editorial Style' },
    { key: 'copy', label: 'Copy Style' },
    { key: 'seo', label: 'SEO Style' },
  ];

  const anyCustomized = tabs.some((t) => isWritingStyleCustomized(t.key));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative bg-white rounded-2xl border border-[#cbd5e1] shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
                <span>Writing Style Library</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]">
                  Protected Defaults
                </span>
              </h3>
              <p className="text-xs text-[#64748b]">
                Centralized prose and tone directives applied automatically to all generated writing prompts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-[#f1f5f9] bg-white flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.key;
            const isCust = isWritingStyleCustomized(tab.key);
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  if (isEditing) {
                    // if editing, confirm switch
                    setIsEditing(false);
                  }
                  setActiveTab(tab.key);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0f766e] text-white shadow-xs'
                    : 'bg-[#f8fafc] text-[#475569] hover:bg-[#f1f5f9] border border-[#e2e8f0]'
                }`}
              >
                <span>{tab.label}</span>
                {isCust ? (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? 'bg-amber-300' : 'bg-amber-500'
                    }`}
                    title="Customized by user"
                  />
                ) : (
                  <span
                    className={`text-[10px] font-normal ${
                      isSelected ? 'text-teal-200' : 'text-[#94a3b8]'
                    }`}
                  >
                    Default
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Description Bar */}
        <div className="px-6 py-2.5 bg-[#f0fdfa]/60 border-b border-[#ccfbf1] flex items-start gap-2.5 text-xs text-[#0f766e]">
          <Info className="w-4 h-4 text-[#0f766e] mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-semibold">{currentMetadata.description}</span>
            <span className="text-[#047857] block text-[11px] mt-0.5">
              {currentMetadata.appliedTo}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 text-[11px]">
            {currentCustomized ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                Customized
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                Built-in Default
              </span>
            )}
          </div>
        </div>

        {/* Modal Body / Editor Area */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col space-y-3">
          {statusMessage && (
            <div className="px-3.5 py-2 rounded-xl bg-[#0f766e] text-white text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-200 flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="flex-1 flex flex-col">
            {isEditing ? (
              <div className="flex-1 flex flex-col space-y-2">
                <div className="flex items-center justify-between text-xs text-[#64748b]">
                  <span className="font-semibold text-[#0f172a]">Editing {currentMetadata.label}:</span>
                  <span>Changes persist in localStorage and take effect immediately</span>
                </div>
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  rows={14}
                  className="w-full flex-1 min-h-[300px] p-3.5 rounded-xl border border-[#cbd5e1] font-mono text-xs leading-relaxed text-[#1e293b] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f766e] focus:border-transparent resize-y"
                  placeholder="Enter custom writing instructions..."
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col space-y-2">
                <div className="flex items-center justify-between text-xs text-[#64748b]">
                  <span>Active Instructions for {currentMetadata.label}:</span>
                  <span className="text-[11px] text-[#64748b]">
                    Protected view • Click Edit to customize
                  </span>
                </div>
                <div className="w-full flex-1 min-h-[300px] p-4 rounded-xl border border-[#e2e8f0] font-mono text-xs leading-relaxed text-[#334155] bg-[#fafbfc] overflow-y-auto whitespace-pre-wrap select-text">
                  {getWritingStyle(activeTab)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-[#e2e8f0] bg-[#f8fafc] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {currentCustomized && !isEditing && (
              <button
                type="button"
                onClick={handleResetCurrent}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#dc2626] bg-[#fef2f2] hover:bg-[#fee2e2] border border-[#fecaca] transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Reset this style back to default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>
            )}

            {anyCustomized && !isEditing && (
              <button
                type="button"
                onClick={handleResetAll}
                className="text-xs text-[#64748b] hover:text-[#0f172a] underline underline-offset-2 ml-2 cursor-pointer"
                title="Reset all 4 style categories back to built-in defaults"
              >
                Reset all styles
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#475569] bg-white border border-[#cbd5e1] hover:bg-[#f1f5f9] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0f766e] hover:bg-[#0d9488] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#475569] bg-white border border-[#cbd5e1] hover:bg-[#f1f5f9] transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0f766e] hover:bg-[#0d9488] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <Edit3 className="w-3.5 h-3.5 text-teal-200" />
                  <span>Edit Style</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
