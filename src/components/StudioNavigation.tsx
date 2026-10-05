import React from 'react';
import {
  Camera,
  Gift,
  FileText,
  ShoppingBag,
  Sparkles,
  PenTool,
  Database,
} from 'lucide-react';
import { StudioToolId } from '../prompts/writing/types';
import { Sliders } from 'lucide-react';

interface StudioNavigationProps {
  activeTool: StudioToolId;
  onSelectTool: (tool: StudioToolId) => void;
  onOpenStyleLibrary?: () => void;
}

export const StudioNavigation: React.FC<StudioNavigationProps> = ({
  activeTool,
  onSelectTool,
  onOpenStyleLibrary,
}) => {
  const tools: {
    id: StudioToolId;
    category: 'image' | 'writing';
    label: string;
    icon: React.ReactNode;
    shortDesc: string;
  }[] = [
    {
      id: 'product-photography',
      category: 'image',
      label: 'Product Photography',
      icon: <Camera className="w-4 h-4" />,
      shortDesc: 'Editorial product staging & camera prompts',
    },
    {
      id: 'gift-guide',
      category: 'writing',
      label: 'Gift Guides',
      icon: <Gift className="w-4 h-4" />,
      shortDesc: 'Curated editorial gift roundups',
    },
    {
      id: 'article',
      category: 'writing',
      label: 'Articles',
      icon: <FileText className="w-4 h-4" />,
      shortDesc: 'Deep-dive stories, explainer & essays',
    },
    {
      id: 'product-copy',
      category: 'writing',
      label: 'Product Copy',
      icon: <ShoppingBag className="w-4 h-4" />,
      shortDesc: 'High-converting boutique catalog descriptions',
    },
    {
      id: 'product-data',
      category: 'writing',
      label: 'Product Data',
      icon: <Database className="w-4 h-4" />,
      shortDesc: 'Structured YAML product records & catalog metadata',
    },
  ];

  const imageTools = tools.filter((t) => t.category === 'image');
  const writingTools = tools.filter((t) => t.category === 'writing');

  return (
    <div className="bg-white border-b border-[#e2e8f0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Main Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Category 1: Image */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0]">
              <span className="px-2 text-[10px] font-bold text-[#64748b] uppercase tracking-wider hidden sm:inline-block">
                Image
              </span>
              {imageTools.map((t) => {
                const isActive = activeTool === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectTool(t.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#0369a1] shadow-xs border border-[#bae6fd] ring-1 ring-[#0284c7]/20'
                        : 'text-[#475569] hover:text-[#0f172a] hover:bg-white/60'
                    }`}
                  >
                    <span className={isActive ? 'text-[#0284c7]' : 'text-[#64748b]'}>
                      {t.icon}
                    </span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Separator on wider screens */}
            <div className="h-6 w-px bg-[#e2e8f0] hidden sm:block" />

            {/* Category 2: Writing */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0]">
              <span className="px-2 text-[10px] font-bold text-[#64748b] uppercase tracking-wider hidden sm:inline-block">
                Writing
              </span>
              {writingTools.map((t) => {
                const isActive = activeTool === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectTool(t.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#0f766e] shadow-xs border border-[#a7f3d0] ring-1 ring-[#0f766e]/20'
                        : 'text-[#475569] hover:text-[#0f172a] hover:bg-white/60'
                    }`}
                  >
                    <span className={isActive ? 'text-[#0f766e]' : 'text-[#64748b]'}>
                      {t.icon}
                    </span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Action / Mode indicator */}
          <div className="flex items-center gap-3">
            {activeTool !== 'product-photography' && onOpenStyleLibrary && (
              <button
                type="button"
                onClick={onOpenStyleLibrary}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0f766e] bg-[#f0fdfa] hover:bg-[#ccfbf1] border border-[#a7f3d0] shadow-2xs transition-all cursor-pointer"
                title="Open centralized Writing Style Library"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Style Library</span>
              </button>
            )}

            <div className="text-right hidden lg:block">
              <span className="text-[11px] font-medium text-[#64748b]">
                Active Studio Mode:{' '}
                <strong className="text-[#0f172a]">
                  {tools.find((t) => t.id === activeTool)?.label}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
