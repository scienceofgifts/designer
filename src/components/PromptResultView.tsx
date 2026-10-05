import React, { useState } from 'react';
import {
  Copy,
  Check,
  Trash2,
  RotateCcw,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { GenerationSettings } from '../types';

export interface ResultActiveChip {
  label?: string;
  value: string;
}

interface PromptResultViewProps {
  prompt: string;
  onPromptChange: (newPrompt: string) => void;
  onClear: () => void;
  onRegenerate: () => void;
  toolTitle?: string;
  toolSubtitle?: string;
  referenceImage?: string | null;
  imageInfo?: { name: string; size: string; width?: number; height?: number } | null;
  settings?: GenerationSettings;
  activeChips?: ResultActiveChip[];
}

export const PromptResultView: React.FC<PromptResultViewProps> = ({
  prompt,
  onPromptChange,
  onClear,
  onRegenerate,
  toolTitle = 'Generated Prompt',
  toolSubtitle,
  referenceImage,
  imageInfo,
  settings,
  activeChips,
}) => {
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const wordCount = prompt ? prompt.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = prompt.length;

  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setStatusMessage('Prompt copied.');
      setTimeout(() => {
        setCopied(false);
        setStatusMessage(null);
      }, 2500);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = prompt;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setStatusMessage('Prompt copied.');
      setTimeout(() => {
        setCopied(false);
        setStatusMessage(null);
      }, 2500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Reference Image Mini Card if an image is loaded */}
      {referenceImage && settings && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
              <img
                src={referenceImage}
                alt="Product Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider truncate">
                  {imageInfo?.name || 'Local Reference Product'}
                </h4>
              </div>
              <p className="text-[11px] text-[#64748b] mt-0.5">
                Staged as: <strong className="text-[#0f172a] capitalize">{settings.productType}</strong> • {settings.orientation} • {settings.aspectRatio}
              </p>
              <p className="text-[10px] text-[#0f766e] mt-0.5">
                Private local preview • Kept 100% on device
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Prompt Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 sm:p-6 shadow-sm flex flex-col min-h-[560px]">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">
                {toolTitle}
              </h3>
              <p className="text-[11px] text-[#64748b]">
                {wordCount} words • {charCount} characters • {toolSubtitle || 'Ready to paste into your favorite LLM or image model'}
              </p>
            </div>
          </div>

          {/* Action buttons on top */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRegenerate}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#334155] bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#cbd5e1] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset prompt to current template selections"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={onClear}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#dc2626] bg-[#fef2f2] hover:bg-[#fee2e2] border border-[#fecaca] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Clear generated prompt text"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Large Editable Text Area */}
        <div className="relative flex-1 flex flex-col">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Select your options on the left and click 'Generate Prompt'..."
            rows={20}
            className="w-full flex-1 min-h-[420px] p-4 rounded-xl border border-[#cbd5e1] font-mono text-xs sm:text-[13px] leading-relaxed text-[#1e293b] bg-[#fafbfc] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] focus:border-transparent transition-all resize-y select-text shadow-inner"
          />

          {/* Floating Copy Status Notice */}
          {statusMessage && (
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-[#0f766e] text-white text-xs font-semibold shadow-md flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-[#f1f5f9]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#64748b]">
              Editable prompt • Click anywhere to customize wording before copying
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!prompt}
              className={`px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-sm transition-all flex items-center gap-2 active:scale-[0.98] cursor-pointer ${
                !prompt
                  ? 'bg-[#94a3b8] cursor-not-allowed opacity-60'
                  : copied
                  ? 'bg-[#0f766e]'
                  : 'bg-gradient-to-r from-[#0284c7] to-[#0f766e] hover:from-[#0369a1] hover:to-[#0f766e]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Prompt copied.</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Staging Summary Chips */}
        <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex flex-wrap items-center gap-1.5 text-[11px] text-[#475569]">
          <span className="font-semibold text-[#0f172a] mr-1">Active Rules:</span>

          {/* Product Photography Chips */}
          {settings && (
            <>
              <span className="px-2 py-0.5 rounded-md bg-[#f1f5f9] border border-[#e2e8f0] capitalize">
                {settings.productType}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#f1f5f9] border border-[#e2e8f0] capitalize">
                {settings.orientation.replace('-', ' ')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#f1f5f9] border border-[#e2e8f0] capitalize">
                {settings.background.replace(/-/g, ' ')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#f1f5f9] border border-[#e2e8f0] capitalize">
                {settings.surface.replace(/-/g, ' ')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#f1f5f9] border border-[#e2e8f0] capitalize">
                {settings.props.replace(/-/g, ' ')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] font-medium">
                Ratio: {settings.aspectRatio}
              </span>
            </>
          )}

          {/* Custom Chips for Writing Tools */}
          {activeChips &&
            activeChips.map((chip, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-[#f8fafc] text-[#334155] border border-[#e2e8f0] font-medium capitalize"
              >
                {chip.label ? `${chip.label}: ` : ''}
                {chip.value}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};
