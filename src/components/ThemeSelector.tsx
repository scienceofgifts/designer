import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { useTheme, ThemeName, THEME_OPTIONS } from '../theme/ThemeContext';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, currentThemeOption } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger Button: Compact and clean */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface-primary)] hover:bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-[color,background-color,border-color,box-shadow] duration-150 ease-out cursor-pointer shadow-2xs group"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Change application appearance theme"
      >
        <Palette className="w-3.5 h-3.5 text-[var(--accent)] transition-transform group-hover:rotate-12 duration-200" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
          Theme
        </span>
        <span className="font-medium text-[var(--text-primary)]">
          {currentThemeOption.name}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-strong)] shadow-xl z-50 p-2.5 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--text-muted)]">
              Appearance Theme
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">
              3 palettes
            </span>
          </div>

          <div className="space-y-1 pt-1">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border transition-[color,background-color,border-color,box-shadow] duration-150 ease-out cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-[var(--selected-border)] bg-[var(--selected-bg)] ring-1 ring-[var(--selected-border)] shadow-xs'
                      : 'border-transparent hover:border-[var(--border-subtle)] hover:bg-[var(--surface-secondary)]'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                        {opt.name}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        · {opt.tagline}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1 leading-snug">
                      {opt.description}
                    </p>
                    {/* Swatches preview */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                        Palette:
                      </span>
                      <div className="flex items-center -space-x-1 shrink-0">
                        {opt.swatches.map((color, idx) => (
                          <span
                            key={idx}
                            className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs shrink-0"
                            style={{ backgroundColor: color }}
                            title={`Color sample ${idx + 1}: ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-2.5 pt-2 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] font-mono flex items-center justify-between">
            <span>Visual styling only</span>
            <span>Zero state reset</span>
          </div>
        </div>
      )}
    </div>
  );
};
