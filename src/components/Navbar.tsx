import React from 'react';
import { Sparkles, Terminal, ShieldCheck, Cpu } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#e2e8f0]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Identity */}
        <div className="flex items-center gap-3.5">
          {/* Logo Mark: Stylized Armillary / Celestial Orbit */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#dbeafe] via-[#ccfbf1] to-[#a7f3d0] border border-[#93c5fd]/50 flex items-center justify-center text-[#0f766e] shadow-xs">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-25 12 12)" />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.6" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-2xl font-semibold tracking-wide text-[#0f172a]">
                Science of Gifts
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#f0f9ff] text-[#0369a1] border border-[#bae6fd] text-[10px] font-semibold uppercase tracking-wider">
                Prompt Studio
              </span>
            </div>
            <p className="text-xs text-[#64748b] tracking-wide">
              Editorial Product Photography & Writing Prompt Studio
            </p>
          </div>
        </div>

        {/* Engine status indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#475569]">
            <Cpu className="w-3.5 h-3.5 text-[#0f766e]" />
            <span className="font-medium text-[#1e293b]">100% Local Browser Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          </div>

          <div className="text-[11px] text-[#64748b] hidden lg:block">
            No API Keys • Zero Cloud Storage
          </div>
        </div>
      </div>
    </header>
  );
};
