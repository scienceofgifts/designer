import {
  DEFAULT_GLOBAL_STYLE,
  DEFAULT_EDITORIAL_STYLE,
  DEFAULT_COPY_STYLE,
  DEFAULT_SEO_STYLE,
  WritingStyleKey,
  WritingStylesConfig,
} from '../prompts/writing/styles';

export const STYLE_STORAGE_KEYS: Record<WritingStyleKey, string> = {
  global: 'scienceOfGifts_style_global',
  editorial: 'scienceOfGifts_style_editorial',
  copy: 'scienceOfGifts_style_copy',
  seo: 'scienceOfGifts_style_seo',
};

export const DEFAULT_STYLES: WritingStylesConfig = {
  global: DEFAULT_GLOBAL_STYLE,
  editorial: DEFAULT_EDITORIAL_STYLE,
  copy: DEFAULT_COPY_STYLE,
  seo: DEFAULT_SEO_STYLE,
};

export const STYLE_METADATA: Record<
  WritingStyleKey,
  { label: string; description: string; appliedTo: string }
> = {
  global: {
    label: 'Global Style',
    description: 'Universal human prose rules, natural sentence rhythm, and em dash avoidance.',
    appliedTo: 'Applied to all writing tools (Gift Guides, Articles, Product Copy)',
  },
  editorial: {
    label: 'Editorial Style',
    description: 'Polished New York Times-inspired cultural clarity, restraint, and subtle wit.',
    appliedTo: 'Applied to Articles, Guide Introductions, More Gifts, How to Choose & FAQs',
  },
  copy: {
    label: 'Copy Style',
    description: 'Tactile, concise product storytelling without salesy marketing hype.',
    appliedTo: 'Applied to Standalone Product Copy, Guide Product Entries & More Gifts',
  },
  seo: {
    label: 'SEO Style',
    description: 'Clean search intent, concision, and zero keyword stuffing.',
    appliedTo: 'Applied strictly to Title & Meta generation',
  },
};

/**
 * Retrieves the currently active style text for a given key,
 * loading from localStorage if customized, or falling back to built-in defaults.
 */
export function getWritingStyle(key: WritingStyleKey): string {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(STYLE_STORAGE_KEYS[key]);
      if (saved && saved.trim()) {
        return saved;
      }
    } catch {
      // Safe fallback if localStorage is disabled or restricted
    }
  }
  return DEFAULT_STYLES[key];
}

/**
 * Returns all 4 current styles as a config object.
 */
export function getAllWritingStyles(): WritingStylesConfig {
  return {
    global: getWritingStyle('global'),
    editorial: getWritingStyle('editorial'),
    copy: getWritingStyle('copy'),
    seo: getWritingStyle('seo'),
  };
}

/**
 * Saves a customized style string to localStorage.
 */
export function saveWritingStyle(key: WritingStyleKey, content: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STYLE_STORAGE_KEYS[key], content);
      // Dispatch a custom event so other components or open views update in real time
      window.dispatchEvent(new Event('scienceOfGifts_styles_updated'));
    } catch {
      // Ignore write errors
    }
  }
}

/**
 * Resets a single style back to its built-in default by removing the localStorage entry.
 */
export function resetWritingStyle(key: WritingStyleKey): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(STYLE_STORAGE_KEYS[key]);
      window.dispatchEvent(new Event('scienceOfGifts_styles_updated'));
    } catch {
      // Ignore errors
    }
  }
}

/**
 * Checks if a particular style has been customized by the user.
 */
export function isWritingStyleCustomized(key: WritingStyleKey): boolean {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(STYLE_STORAGE_KEYS[key]);
      return saved !== null && saved !== undefined;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Composes the appropriate style blocks based on the required flags.
 * Uses optional custom styles if provided, or reads current active styles.
 */
export function composeWritingStyleBlocks(
  flags: {
    includeGlobal?: boolean;
    includeEditorial?: boolean;
    includeCopy?: boolean;
    includeSeo?: boolean;
  },
  customStyles?: Partial<WritingStylesConfig>
): string {
  const blocks: string[] = [];

  const getStyle = (key: WritingStyleKey): string => {
    if (customStyles && customStyles[key] !== undefined) {
      return customStyles[key]!;
    }
    return getWritingStyle(key);
  };

  if (flags.includeGlobal) {
    const text = getStyle('global').trim();
    if (text) blocks.push(text);
  }

  if (flags.includeEditorial) {
    const text = getStyle('editorial').trim();
    if (text) blocks.push(text);
  }

  if (flags.includeCopy) {
    const text = getStyle('copy').trim();
    if (text) blocks.push(text);
  }

  if (flags.includeSeo) {
    const text = getStyle('seo').trim();
    if (text) blocks.push(text);
  }

  if (blocks.length === 0) {
    return '';
  }

  return `\n${blocks.join('\n\n')}\n`;
}
