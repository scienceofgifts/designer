import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';
import { GenerationSettings, ProductType, SampleProduct } from '../types';

interface UploadDropzoneProps {
  image: string | null;
  imageInfo: { name: string; size: string; width?: number; height?: number } | null;
  onImageSelected: (dataUrl: string, info: { name: string; size: string; width?: number; height?: number }) => void;
  onClear: () => void;
  onApplySampleSettings?: (settings: Partial<GenerationSettings>) => void;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  image,
  imageInfo,
  onImageSelected,
  onClear,
  onApplySampleSettings,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process File to Data URL with dimensions
  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setIsProcessing(true);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setIsProcessing(false);
        onImageSelected(result, {
          name: file.name,
          size: `${sizeInMB} MB`,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.onerror = () => {
        setIsProcessing(false);
        onImageSelected(result, {
          name: file.name,
          size: `${sizeInMB} MB`,
        });
      };
      img.src = result;
    };

    reader.onerror = () => {
      setIsProcessing(false);
      alert('Error reading the selected image.');
    };

    reader.readAsDataURL(file);
  }, [onImageSelected]);

  // Support paste from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          e.preventDefault();
          processFile(file);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleSelectSample = (sample: SampleProduct) => {
    onImageSelected(sample.imageUrl, {
      name: `${sample.title}.svg`,
      size: 'Sample Product',
      width: 800,
      height: 800,
    });
    if (onApplySampleSettings && sample.recommendedSettings) {
      onApplySampleSettings(sample.recommendedSettings);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Box or Preview */}
      {!image ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-8 text-center ${
            isDragging
              ? 'border-[#0284c7] bg-[#f0f9ff] scale-[1.01]'
              : 'border-[#cbd5e1] hover:border-[#94a3b8] bg-white hover:bg-[#fafafa]'
          } shadow-sm`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center text-[#0f766e] shadow-sm">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <p className="text-base font-semibold text-[#0f172a]">
                Drop your product image here, or{' '}
                <span className="text-[#0284c7] underline decoration-[#38bdf8] underline-offset-2">
                  browse
                </span>
              </p>
              <p className="text-xs text-[#64748b] mt-1">
                PNG, JPG, or WEBP. You can also paste directly with <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border text-[10px] font-mono">Ctrl+V</kbd>
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-[11px] text-[#475569]">
              <Sparkles className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>Preserves actual product logos, artwork & geometry</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl bg-white border border-[#e2e8f0] p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Thumbnail Preview */}
            <div className="relative w-32 h-32 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#f1f5f9] border border-[#e2e8f0] flex-shrink-0 flex items-center justify-center">
              <img
                src={image}
                alt="Uploaded Product Reference"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain p-2"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-medium backdrop-blur-xs">
                Reference
              </span>
            </div>

            {/* Info details */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0f766e]" />
                <h4 className="text-sm font-semibold text-[#0f172a] truncate">
                  {imageInfo?.name || 'Product Image Loaded'}
                </h4>
              </div>
              <p className="text-xs text-[#64748b] mt-1">
                {imageInfo?.width && imageInfo?.height
                  ? `${imageInfo.width} × ${imageInfo.height} px • `
                  : ''}
                {imageInfo?.size}
              </p>
              <p className="text-[11px] text-[#0f766e] font-medium mt-1">
                ✓ Ready for editorial studio staging
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs font-medium text-[#334155] bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg transition-colors"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={onClear}
                className="p-1.5 text-[#64748b] hover:text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick Sample Products Picker */}
      <div className="rounded-xl bg-[#f8fafc] border border-[#e2e8f0]/80 p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#334155] tracking-wide uppercase">
            Or test with a Science of Gifts sample product:
          </span>
          <span className="text-[11px] text-[#64748b]">1-Click load</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_PRODUCTS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#e2e8f0] hover:border-[#0284c7] hover:shadow-xs transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-md bg-[#f1f5f9] border border-[#e2e8f0] overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5">
                <img
                  src={sample.imageUrl}
                  alt={sample.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-[#1e293b] truncate group-hover:text-[#0284c7]">
                  {sample.title}
                </p>
                <p className="text-[9px] text-[#64748b] capitalize">
                  {sample.category}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
