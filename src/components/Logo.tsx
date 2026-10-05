import React from 'react';

interface LogoMarkProps {
  size?: number | string;
  className?: string;
  ariaHidden?: boolean;
}

/**
 * Minimalist Architectural "D" Monogram for DesignDNA Studio
 * 
 * Concept: Structure + Form
 * A vertical architectural spine (structure/rules) paired with a precision
 * semicircular arch (generative visual form), separated by an architectural aperture.
 * Highly legible from 16px to 64px, perfectly balanced, theme-adaptive via currentColor.
 */
export const LogoMark: React.FC<LogoMarkProps> = ({
  size = 24,
  className = '',
  ariaHidden = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden={ariaHidden}
    >
      {/* Structural spine / foundation column */}
      <rect
        x="3"
        y="3"
        width="3.2"
        height="18"
        rx="1.6"
        fill="currentColor"
      />
      {/* Precision architectural bowl / visual envelope */}
      <path
        d="M 9.8 4.6 H 13.2 C 17.2 4.6 20.4 7.9 20.4 12 C 20.4 16.1 17.2 19.4 13.2 19.4 H 9.8"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

interface LogoProps {
  markSize?: number;
  showWordmark?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  markSize = 22,
  showWordmark = true,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      role="banner"
      aria-label="DesignDNA Studio"
    >
      {/* Minimalist Mark Container: Understated, clean, borderless or subtle */}
      <div className="text-[var(--text-primary)] flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.03]">
        <LogoMark size={markSize} />
      </div>

      {showWordmark && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline leading-none">
            <span className="text-[15px] font-bold tracking-tight text-[var(--text-primary)]">
              Design<span className="font-extrabold tracking-normal">DNA</span>
            </span>
          </div>
          <span className="text-[9px] font-mono tracking-[0.26em] uppercase text-[var(--text-muted)] mt-1 font-semibold leading-none">
            STUDIO
          </span>
        </div>
      )}
    </div>
  );
};
