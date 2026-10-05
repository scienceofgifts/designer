import React from 'react';
import { Images, Dna, Wand2, Plus, Database } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { Logo } from './Logo';

export type ActiveTab = 'library' | 'dna' | 'prompt-studio';

interface TopNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenUpload: () => void;
  onOpenBackup: () => void;
  analyzedCount: number;
  totalCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenUpload,
  onOpenBackup,
  analyzedCount,
  totalCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[var(--surface-primary)] border-b border-[var(--border-strong)] shadow-2xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Minimalist Architectural Brand Lockup */}
        <div className="flex items-center">
          <button
            onClick={() => onSelectTab('library')}
            className="group transition-opacity hover:opacity-90 cursor-pointer"
            title="DesignDNA Studio - Back to Library"
          >
            <Logo markSize={24} />
          </button>
        </div>

        {/* Center: Segmented Navigation */}
        <nav className="flex items-center gap-1 bg-[var(--surface-secondary)] p-1 rounded-lg border border-[var(--border-strong)]">
          <button
            onClick={() => onSelectTab('library')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-md transition-[color,background-color,box-shadow] duration-150 ease-out whitespace-nowrap cursor-pointer font-semibold ${
              activeTab === 'library'
                ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-primary)]'
            }`}
          >
            <Images className="w-3.5 h-3.5" />
            <span>Library</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                activeTab === 'library'
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--surface-primary)] text-[var(--text-muted)] border border-[var(--border-strong)]'
              }`}
            >
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('dna')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-md transition-[color,background-color,box-shadow] duration-150 ease-out whitespace-nowrap cursor-pointer font-semibold ${
              activeTab === 'dna'
                ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-primary)]'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>Design DNA</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                activeTab === 'dna'
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--surface-primary)] text-[var(--text-muted)] border border-[var(--border-strong)]'
              }`}
            >
              {analyzedCount}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('prompt-studio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-md transition-[color,background-color,box-shadow] duration-150 ease-out whitespace-nowrap cursor-pointer font-semibold ${
              activeTab === 'prompt-studio'
                ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-primary)]'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Prompt Studio</span>
          </button>
        </nav>

        {/* Right: Utility & Primary Action */}
        <div className="flex items-center gap-2">
          <ThemeSelector />
          <button
            onClick={onOpenBackup}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface-primary)] hover:bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
            title="Local Data & Backup (Export / Import)"
          >
            <Database className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="hidden md:inline">Backup</span>
          </button>
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-[var(--btn-primary-text)] bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] rounded-lg transition-all whitespace-nowrap shadow-xs hover:shadow cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.25]" />
            <span>Add Reference</span>
          </button>
        </div>
      </div>
    </header>
  );
};
