import React, { useRef } from 'react';
import {
  Database,
  Sparkles,
  Link as LinkIcon,
  Tag,
  DollarSign,
  Compass,
  FileText,
  Sliders,
  Layers,
  Upload,
  CheckCircle2,
  X,
  ImageIcon,
} from 'lucide-react';
import {
  ProductDataOptions,
  ProductDataAffiliateType,
  ProductDataPriceMode,
  ProductDataEditorialPositioning,
  ProductDataEditorialTone,
} from '../../prompts/writing/types';

interface ProductDataControlsProps {
  options: ProductDataOptions;
  onChange: (options: ProductDataOptions) => void;
  onGenerate: () => void;
  uploadedImage?: string | null;
  imageInfo?: { name: string; size: string; width?: number; height?: number } | null;
  onImageSelected?: (dataUrl: string, info: { name: string; size: string; width?: number; height?: number }) => void;
  onClearImage?: () => void;
}

const PRODUCT_TYPES = [
  'T-Shirt',
  'Hoodie',
  'Sweatshirt',
  'Mug',
  'Glass',
  'Tumbler',
  'Water Bottle',
  'Journal / Notebook',
  'Poster',
  'Book',
  'Other',
];

const SUBJECT_CATEGORIES = [
  'Astronomy & Stargazing',
  'Physics & Mathematics',
  'History & Archaeology',
  'Biology & Nature',
  'Chemistry & Earth Sciences',
  'Literature & Ephemera',
  'Scientific Equipment & Tools',
  'Other',
];

const AFFILIATE_TYPES: { id: ProductDataAffiliateType; label: string; desc: string }[] = [
  { id: 'affiliate', label: 'Affiliate', desc: 'Monetized affiliate referral link' },
  { id: 'direct', label: 'Direct Product Link', desc: 'Direct canonical vendor store page' },
  { id: 'sponsored', label: 'Sponsored', desc: 'Paid partnership / sponsored feature' },
  { id: 'not-sponsored', label: 'Not Sponsored', desc: 'Independent editorial feature' },
];

const POSITIONING_OPTIONS: { id: ProductDataEditorialPositioning; label: string }[] = [
  { id: 'none', label: 'Default / Unspecified' },
  { id: 'broad-appeal', label: 'Broad appeal' },
  { id: 'enthusiast-niche', label: 'Enthusiast / niche interest' },
  { id: 'practical-gift', label: 'Practical gift' },
  { id: 'conversation-piece', label: 'Conversation piece' },
  { id: 'collector-enthusiast', label: 'Collector / enthusiast' },
  { id: 'novelty-gift', label: 'Novelty gift' },
];

const TONE_OPTIONS: { id: ProductDataEditorialTone; label: string; desc: string }[] = [
  { id: 'standard', label: 'Standard Science of Gifts', desc: 'Eloquent, intellectually curious & authoritative' },
  { id: 'practical', label: 'More practical', desc: 'Focused heavily on specs, everyday utility & durability' },
  { id: 'playful', label: 'More playful', desc: 'Witty, lighthearted with clever science anecdotes' },
  { id: 'sophisticated', label: 'More sophisticated', desc: 'Poetic, quiet luxury & understated craft' },
];

export const ProductDataControls: React.FC<ProductDataControlsProps> = ({
  options,
  onChange,
  onGenerate,
  uploadedImage,
  imageInfo,
  onImageSelected,
  onClearImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateOption = <K extends keyof ProductDataOptions>(
    key: K,
    value: ProductDataOptions[K]
  ) => {
    onChange({
      ...options,
      [key]: value,
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onImageSelected) {
      const file = e.target.files[0];
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onImageSelected(result, {
          name: file.name,
          size: `${sizeInMB} MB`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
      {/* Tool Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#e0f2fe] text-[#0369a1] flex items-center justify-center font-bold">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0f172a]">
              Product Data Generator
            </h2>
            <p className="text-[11px] text-[#64748b]">
              Generate complete Science of Gifts YAML catalog records & structured product metadata
            </p>
          </div>
        </div>
      </div>

      {/* Active Rule Banner */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#f0f9ff] border border-[#bae6fd] text-xs">
        <div className="flex items-center gap-2 text-[#0284c7]">
          <Sliders className="w-3.5 h-3.5 text-[#0284c7] flex-shrink-0" />
          <span className="text-[11px]">
            Active Schema: <strong className="font-semibold text-[#0f172a]">Science of Gifts Product YAML Record</strong>
          </span>
        </div>
      </div>

      {/* 1. Product Image Attachment */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-[11px] font-bold flex items-center justify-center">1</span>
            Product Image (Attached for LLM Reference)
          </span>
          {options.hasImage && (
            <span className="text-[11px] font-semibold text-[#0f766e]">
              Image attached
            </span>
          )}
        </label>

        {!uploadedImage ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-xl border border-dashed border-[#cbd5e1] hover:border-[#0284c7] bg-[#f8fafc] hover:bg-[#f0f9ff] p-4 text-center transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="flex items-center justify-center gap-2 text-xs text-[#475569]">
              <Upload className="w-4 h-4 text-[#0284c7]" />
              <span>Attach product image for reference (or browse)</span>
            </div>
            <p className="text-[10px] text-[#64748b] mt-1">
              Note: The image is referenced in the prompt so ChatGPT knows to examine it.
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-[#0f766e] flex-shrink-0" />
              <div className="truncate">
                <p className="font-semibold text-[#0f172a] truncate">
                  {imageInfo?.name || options.imageName || 'Product Image Attached'}
                </p>
                <p className="text-[10px] text-[#0f766e]">
                  Explicitly referenced in generated prompt
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2 py-1 text-[11px] text-[#334155] bg-white border border-[#cbd5e1] rounded-lg hover:bg-[#f8fafc]"
              >
                Change
              </button>
              {onClearImage && (
                <button
                  type="button"
                  onClick={onClearImage}
                  className="p-1 text-[#64748b] hover:text-[#ef4444] rounded-lg"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Product / Source URL */}
      <div>
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
          <span className="w-5 h-5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-[11px] font-bold flex items-center justify-center">2</span>
          Product / Source URL
        </label>
        <div className="relative">
          <LinkIcon className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-3" />
          <input
            type="url"
            value={options.productUrl}
            onChange={(e) => updateOption('productUrl', e.target.value)}
            placeholder="https://example.com/product"
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] text-[#1e293b]"
          />
        </div>
      </div>

      {/* 3 & 4. Product Type and Subject / Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-[11px] font-bold flex items-center justify-center">3</span>
            Product Type
          </label>
          <select
            value={options.productType}
            onChange={(e) => updateOption('productType', e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] text-[#1e293b] bg-white"
          >
            {PRODUCT_TYPES.map((pt) => (
              <option key={pt} value={pt}>
                {pt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-[11px] font-bold flex items-center justify-center">4</span>
            Subject / Category
          </label>
          <select
            value={options.category}
            onChange={(e) => updateOption('category', e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] text-[#1e293b] bg-white"
          >
            {SUBJECT_CATEGORIES.map((sc) => (
              <option key={sc} value={sc}>
                {sc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. Affiliate / Link Type */}
      <div>
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <span className="w-5 h-5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-[11px] font-bold flex items-center justify-center">5</span>
          Affiliate / Link Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {AFFILIATE_TYPES.map((at) => {
            const isSelected = options.affiliateType === at.id;
            return (
              <button
                key={at.id}
                type="button"
                onClick={() => updateOption('affiliateType', at.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#0284c7] bg-[#f0f9ff] ring-1 ring-[#0284c7]'
                    : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                }`}
              >
                <p className={`text-xs font-bold ${isSelected ? 'text-[#0284c7]' : 'text-[#1e293b]'}`}>
                  {at.label}
                </p>
                <p className="text-[10px] text-[#64748b] mt-0.5 leading-tight">
                  {at.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Price Choice & Price Input */}
      <div>
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <span className="w-5 h-5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-[11px] font-bold flex items-center justify-center">6</span>
          Price
        </label>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            type="button"
            onClick={() => updateOption('priceMode', 'extract')}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              options.priceMode === 'extract'
                ? 'border-[#0284c7] bg-[#f0f9ff] ring-1 ring-[#0284c7]'
                : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
            }`}
          >
            <p className={`text-xs font-bold ${options.priceMode === 'extract' ? 'text-[#0284c7]' : 'text-[#1e293b]'}`}>
              Extract price from source
            </p>
            <p className="text-[10px] text-[#64748b] mt-0.5">
              LLM will extract numeric price from source URL
            </p>
          </button>

          <button
            type="button"
            onClick={() => updateOption('priceMode', 'provided')}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              options.priceMode === 'provided'
                ? 'border-[#0284c7] bg-[#f0f9ff] ring-1 ring-[#0284c7]'
                : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
            }`}
          >
            <p className={`text-xs font-bold ${options.priceMode === 'provided' ? 'text-[#0284c7]' : 'text-[#1e293b]'}`}>
              I'll provide the price
            </p>
            <p className="text-[10px] text-[#64748b] mt-0.5">
              Specify explicit price value below
            </p>
          </button>
        </div>

        {options.priceMode === 'provided' && (
          <div className="mt-2 pl-1">
            <label className="text-[11px] font-semibold text-[#475569] mb-1 block">
              Provided Price Value
            </label>
            <div className="relative">
              <DollarSign className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-2.5" />
              <input
                type="text"
                value={options.providedPrice || ''}
                onChange={(e) => updateOption('providedPrice', e.target.value)}
                placeholder="e.g. 34.00"
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] text-[#1e293b]"
              />
            </div>
          </div>
        )}
      </div>

      {/* 7. Editorial Positioning */}
      <div>
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
          <span className="w-5 h-5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-[11px] font-bold flex items-center justify-center">7</span>
          Editorial Positioning
        </label>
        <select
          value={options.editorialPositioning || 'none'}
          onChange={(e) =>
            updateOption(
              'editorialPositioning',
              e.target.value as ProductDataEditorialPositioning
            )
          }
          className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] text-[#1e293b] bg-white"
        >
          {POSITIONING_OPTIONS.map((po) => (
            <option key={po.id} value={po.id}>
              {po.label}
            </option>
          ))}
        </select>
      </div>

      {/* 8. Editorial Tone */}
      <div>
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <span className="w-5 h-5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-[11px] font-bold flex items-center justify-center">8</span>
          Editorial Tone
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TONE_OPTIONS.map((to) => {
            const isSelected = options.editorialTone === to.id;
            return (
              <button
                key={to.id}
                type="button"
                onClick={() => updateOption('editorialTone', to.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#0284c7] bg-[#f0f9ff] ring-1 ring-[#0284c7]'
                    : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                }`}
              >
                <p className={`text-xs font-bold ${isSelected ? 'text-[#0284c7]' : 'text-[#1e293b]'}`}>
                  {to.label}
                </p>
                <p className="text-[10px] text-[#64748b] mt-0.5 leading-tight">
                  {to.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 9. Additional Instructions */}
      <div className="pt-4 border-t border-[#f1f5f9]">
        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
          <span className="w-5 h-5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-[11px] font-bold flex items-center justify-center">9</span>
          Additional Instructions (Optional)
        </label>
        <textarea
          rows={3}
          value={options.additionalInstructions || ''}
          onChange={(e) => updateOption('additionalInstructions', e.target.value)}
          placeholder="e.g. Note that this mug is high-fired stoneware, microwave safe, and includes Galileo's original 1610 astronomical drawings..."
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
          <span>Generate Product Data Prompt</span>
        </button>
        <p className="text-center text-[11px] text-[#64748b] mt-2">
          Outputs a complete YAML schema & prompt ready to paste into ChatGPT
        </p>
      </div>
    </div>
  );
};
