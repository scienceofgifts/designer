import React, { useState, useRef } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, FileUp } from 'lucide-react';
import { DesignItem, DesignSource, InfluenceLevel } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDesigns: (items: DesignItem[]) => void;
}

interface QueuedFile {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  category: string;
  type: string;
  source: DesignSource;
  tagsText: string;
  influence: InfluenceLevel;
}

const CATEGORY_OPTIONS = [
  'T-shirt',
  'Hoodie',
  'Sweatshirt',
  'Mug',
  'Water Bottle',
  'Tumbler',
  'Poster',
  'Journal',
  'Notebook',
  'Emblem / Badge',
  'Hat / Cap',
  'Other',
];

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSaveDesigns }) => {
  const [queuedFiles, setQueuedFiles] = useState<QueuedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [defaultSource, setDefaultSource] = useState<DesignSource>('My Design');
  const [defaultCategory, setDefaultCategory] = useState<string>('T-shirt');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = (files: FileList | File[]) => {
    const newItems: QueuedFile[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const previewUrl = URL.createObjectURL(file);
      newItems.push({
        id: 'upload_' + Math.random().toString(36).substring(2, 9),
        file,
        previewUrl,
        name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
        category: defaultCategory,
        type: 'Apparel',
        source: defaultSource,
        tagsText: 'Apparel, Graphic',
        influence: 'High',
      });
    });
    setQueuedFiles((prev) => [...prev, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setQueuedFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItemField = (id: string, field: keyof QueuedFile, value: any) => {
    setQueuedFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleSave = async () => {
    if (queuedFiles.length === 0) return;

    const itemsToSave: DesignItem[] = [];
    for (const q of queuedFiles) {
      const base64Data = await fileToBase64(q.file);
      const parsedTags = q.tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      itemsToSave.push({
        id: 'design_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        name: q.name.trim() || 'Untitled Reference',
        category: q.category,
        type: q.type,
        source: q.source,
        tags: parsedTags.length > 0 ? parsedTags : ['General'],
        influence: q.influence,
        imageUrl: base64Data,
        analysisStatus: 'unanalyzed',
        createdAt: new Date().toISOString(),
      });
    }

    onSaveDesigns(itemsToSave);
    setQueuedFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-[#CBD5E1] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-[#2563EB]">
                STUDIO INGESTION
              </span>
              <span className="text-[#94A3B8]">/</span>
              <span className="text-[10px] font-mono text-[#0D9488] flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                IndexedDB Local Storage
              </span>
            </div>
            <h2 className="text-base font-semibold text-[#0F172A]">
              Add Design References
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Drag & Drop Hero Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-[#2563EB] bg-[#EFF6FF]'
                : 'border-[#CBD5E1] hover:border-[#2563EB] bg-[#F8FAFC] hover:bg-[#F1F5F9]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleFileSelect}
            />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] mb-3 shadow-2xs">
                <FileUp className="w-5 h-5 stroke-[1.75]" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#0F172A]">
                Drag and drop your design files here, or browse
              </p>
              <p className="text-xs text-[#475569] mt-1 max-w-sm">
                Supports PNG, JPG, WEBP, and SVG. Add original vector artwork, apparel graphics, or inspirational references.
              </p>
              <span className="mt-3 text-[10px] font-mono text-[#64748B] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                Zero AI calls executed on upload · Purely local
              </span>
            </div>
          </div>

          {/* Staged Upload Files List */}
          {queuedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0F172A] font-mono">
                  Staged for ingestion ({queuedFiles.length})
                </span>
                <button
                  onClick={() => setQueuedFiles([])}
                  className="text-xs text-[#64748B] hover:text-[#DC2626] transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-2.5">
                {queuedFiles.map((q) => (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl border border-[#CBD5E1] bg-white grid grid-cols-1 sm:grid-cols-12 gap-3 items-center shadow-2xs"
                  >
                    {/* Thumbnail */}
                    <div className="sm:col-span-2 aspect-square rounded-lg overflow-hidden bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-center p-1 shadow-2xs">
                      <img
                        src={q.previewUrl}
                        alt={q.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Metadata Fields */}
                    <div className="sm:col-span-9 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono font-medium text-[#64748B] uppercase block mb-0.5">
                            Design Title
                          </label>
                          <input
                            type="text"
                            value={q.name}
                            onChange={(e) => updateItemField(q.id, 'name', e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 border border-[#CBD5E1] rounded-md focus:outline-none focus:border-[#2563EB] bg-white text-[#0F172A]"
                            placeholder="Design Name"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono font-medium text-[#64748B] uppercase block mb-0.5">
                            Product Category
                          </label>
                          <select
                            value={q.category}
                            onChange={(e) => updateItemField(q.id, 'category', e.target.value)}
                            className="w-full text-xs px-2 py-1.5 border border-[#CBD5E1] rounded-md focus:outline-none focus:border-[#2563EB] bg-white text-[#0F172A]"
                          >
                            {CATEGORY_OPTIONS.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-mono font-medium text-[#64748B] uppercase block mb-0.5">
                            Source Provenance
                          </label>
                          <div className="flex rounded-md border border-[#CBD5E1] p-0.5 bg-[#F8FAFC]">
                            <button
                              type="button"
                              onClick={() => updateItemField(q.id, 'source', 'My Design')}
                              className={`flex-1 text-[11px] py-1 font-medium rounded transition-all cursor-pointer ${
                                q.source === 'My Design'
                                    ? 'bg-[#0F172A] text-white shadow-2xs font-semibold'
                                  : 'text-[#475569]'
                              }`}
                            >
                              My Design
                            </button>
                            <button
                              type="button"
                              onClick={() => updateItemField(q.id, 'source', 'Inspiration')}
                              className={`flex-1 text-[11px] py-1 font-medium rounded transition-all cursor-pointer ${
                                q.source === 'Inspiration'
                                  ? 'bg-[#0F172A] text-white shadow-2xs font-semibold'
                                  : 'text-[#475569]'
                              }`}
                            >
                              Inspiration
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono font-medium text-[#64748B] uppercase block mb-0.5">
                            Influence Weight
                          </label>
                          <select
                            value={q.influence}
                            onChange={(e) =>
                              updateItemField(q.id, 'influence', e.target.value as InfluenceLevel)
                            }
                            className="w-full text-xs px-2 py-1.5 border border-[#CBD5E1] rounded-md focus:outline-none focus:border-[#2563EB] bg-white text-[#0F172A]"
                          >
                            <option value="High">High (Core DNA)</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low (Subtle)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono font-medium text-[#64748B] uppercase block mb-0.5">
                            Tags (comma separated)
                          </label>
                          <input
                            type="text"
                            value={q.tagsText}
                            onChange={(e) => updateItemField(q.id, 'tagsText', e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 border border-[#CBD5E1] rounded-md focus:outline-none focus:border-[#2563EB] bg-white text-[#0F172A]"
                            placeholder="Vintage, Typo, Minimal"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Delete action */}
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        onClick={() => removeFile(q.id)}
                        className="p-1.5 text-[#64748B] hover:text-[#DC2626] rounded transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between">
          <span className="text-xs text-[#334155] font-mono font-medium">
            {queuedFiles.length} {queuedFiles.length === 1 ? 'reference' : 'references'} staged
          </span>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-[#475569] hover:text-[#0F172A] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={queuedFiles.length === 0}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Commit to Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
