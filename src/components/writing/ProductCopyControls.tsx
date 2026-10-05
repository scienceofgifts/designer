import React from 'react';
import {
  ShoppingBag,
  Sparkles,
  Users,
  Compass,
  FileText,
  Sliders,
  Layers,
} from 'lucide-react';
import {
  ProductCopyOptions,
  ProductCopyTone,
} from '../../prompts/writing/types';
import { WritingStyleKey } from '../../prompts/writing/styles';

interface ProductCopyControlsProps {
  options: ProductCopyOptions;
  onChange: (options: ProductCopyOptions) => void;
  onGenerate: () => void;
  onOpenStyleLibrary?: (tab?: WritingStyleKey) => void;
}

export const ProductCopyControls: React.FC<ProductCopyControlsProps> = ({
  options,
  onChange,
  onGenerate,
  onOpenStyleLibrary,
}) => {
  const updateOption = <K extends keyof ProductCopyOptions>(
    key: K,
    value: ProductCopyOptions[K]
  ) => {
    onChange({
      ...options,
      [key]: value,
    });
  };

  const tones: { id: ProductCopyTone; label: string; desc: string }[] = [
    { id: 'sophisticated-editorial', label: 'Sophisticated Editorial', desc: 'Tactile, quiet luxury & poetic craft' },
    { id: 'warm-approachable', label: 'Warm & Approachable', desc: 'Like a trusted shopkeeper recommendation' },
    { id: 'playfully-cerebral', label: 'Playfully Cerebral', desc: 'Witty scientific & historical charm' },
    { id: 'minimalist-luxury', label: 'Minimalist Luxury', desc: 'Spare, direct, focused on pure form' },
    { id: 'practical-informative', label: 'Practical & Informative', desc: 'Specs, durability & daily rituals' },
  ];

  return (
    <div className="space-y-6 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
      {/* Tool Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#fae8ff] text-[#a21caf] flex items-center justify-center font-bold">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0f172a]">
              Boutique Product Copy Generator
            </h2>
            <p className="text-[11px] text-[#64748b]">
              Craft tactile, compelling e-commerce copy that honors craftsmanship without salesy hyperbole
            </p>
          </div>
        </div>
      </div>

      {/* Active Style Directives Banner */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#f0fdfa] border border-[#ccfbf1] text-xs">
        <div className="flex items-center gap-2 text-[#0f766e]">
          <Sliders className="w-3.5 h-3.5 text-[#0f766e] flex-shrink-0" />
          <span className="text-[11px]">
            Active Style Rules: <strong className="font-semibold text-[#0f172a]">Global + Copy Directives</strong>
          </span>
        </div>
        {onOpenStyleLibrary && (
          <button
            type="button"
            onClick={() => onOpenStyleLibrary('copy')}
            className="text-[11px] font-semibold text-[#0f766e] hover:text-[#0d9488] underline underline-offset-2 transition-colors cursor-pointer"
          >
            Edit Rules
          </button>
        )}
      </div>

      {/* 1. Product Name & Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-[#fae8ff] text-[#a21caf] text-[11px] font-bold flex items-center justify-center">1</span>
            Product Name
          </label>
          <input
            type="text"
            value={options.productName}
            onChange={(e) => updateOption('productName', e.target.value)}
            placeholder="e.g. Celestial Atlas Hardcover Journal"
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#a21caf] text-[#1e293b]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Layers className="w-3.5 h-3.5 text-[#a21caf]" />
            Product Type / Category
          </label>
          <input
            type="text"
            value={options.productType}
            onChange={(e) => updateOption('productType', e.target.value)}
            placeholder="e.g. Archival Stationery / Journal"
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#a21caf] text-[#1e293b]"
          />
        </div>
      </div>

      {/* 2. Target Customer */}
      <div>
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
          <span className="w-5 h-5 rounded-full bg-[#fae8ff] text-[#a21caf] text-[11px] font-bold flex items-center justify-center">2</span>
          Target Customer / Recipient Persona
        </label>
        <input
          type="text"
          value={options.targetCustomer}
          onChange={(e) => updateOption('targetCustomer', e.target.value)}
          placeholder="e.g. Stargazers, writers, physics students, thoughtful gift seekers"
          className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#a21caf] text-[#1e293b]"
        />
      </div>

      {/* 3. Product Concept & Narrative Origin */}
      <div>
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
          <Compass className="w-3.5 h-3.5 text-[#a21caf]" />
          Product Concept / Theme / Origin
        </label>
        <textarea
          rows={2}
          value={options.productConcept}
          onChange={(e) => updateOption('productConcept', e.target.value)}
          placeholder="e.g. Inspired by Galileo Galilei’s 1610 Sidereus Nuncius sketches of the moon and Jupiter's moons. Features gold debossed foil on midnight blue bookbinding cloth."
          className="w-full p-3 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#a21caf] text-[#1e293b] placeholder-[#94a3b8] resize-y"
        />
      </div>

      {/* 4. Key Features & Materials */}
      <div>
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
          <FileText className="w-3.5 h-3.5 text-[#a21caf]" />
          Key Features, Materials & Dimensions
        </label>
        <textarea
          rows={3}
          value={options.keyFeatures}
          onChange={(e) => updateOption('keyFeatures', e.target.value)}
          placeholder="e.g. 160 pages of 120 GSM fountain pen-friendly paper&#10;Lay-flat thread binding&#10;Silk ribbon page marker&#10;Elastic closure band&#10;5.5 x 8.25 inches"
          className="w-full p-3 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#a21caf] text-[#1e293b] placeholder-[#94a3b8] resize-y"
        />
      </div>

      {/* 5. Tone */}
      <div>
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Sliders className="w-3.5 h-3.5 text-[#a21caf]" />
          Brand Voice & Tone
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tones.map((t) => {
            const isSelected = options.tone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => updateOption('tone', t.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#a21caf] bg-[#fdf4ff] ring-1 ring-[#a21caf]'
                    : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                }`}
              >
                <p className={`text-xs font-bold ${isSelected ? 'text-[#a21caf]' : 'text-[#1e293b]'}`}>
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

      {/* 6. Additional Instructions */}
      <div className="pt-4 border-t border-[#f1f5f9]">
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
          <FileText className="w-3.5 h-3.5 text-[#a21caf]" />
          Additional Instructions (Optional)
        </label>
        <textarea
          rows={2}
          value={options.additionalInstructions || ''}
          onChange={(e) => updateOption('additionalInstructions', e.target.value)}
          placeholder="e.g. Include a suggested gift pairing note, emphasize fountain pen ink absorbency..."
          className="w-full p-3 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#a21caf] text-[#1e293b] placeholder-[#94a3b8] resize-y"
        />
      </div>

      {/* Generate Prompt Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onGenerate}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2.5 text-sm bg-gradient-to-r from-[#a21caf] via-[#0284c7] to-[#0f766e] hover:from-[#86198f] hover:to-[#0f766e] hover:shadow-lg active:scale-[0.99] cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-fuchsia-200" />
          <span>Generate Product Copy Prompt</span>
        </button>
        <p className="text-center text-[11px] text-[#64748b] mt-2">
          Outputs a complete Shopify-ready product narrative, sensory features & specs prompt
        </p>
      </div>
    </div>
  );
};
