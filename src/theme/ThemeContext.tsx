import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeName = 'studio' | 'warm' | 'midnight';

export interface ThemeOption {
  id: ThemeName;
  name: string;
  tagline: string;
  description: string;
  swatches: [string, string, string, string]; // [canvas, surface, accent, text]
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'studio',
    name: 'Studio',
    tagline: 'Technical & Modern',
    description: 'Cool blue-gray canvas, crisp white surfaces, and precision blue accents.',
    swatches: ['#eef2f6', '#ffffff', '#2563eb', '#0f172a'],
  },
  {
    id: 'warm',
    name: 'Warm',
    tagline: 'Literary & Editorial',
    description: 'Parchment cream canvas, warm ivory surfaces, and muted terracotta accents.',
    swatches: ['#f6f4ee', '#fcfbf8', '#c25e3e', '#292524'],
  },
  {
    id: 'midnight',
    name: 'Midnight',
    tagline: 'Deep Slate Creative',
    description: 'Deep navy charcoal canvas, elevated slate surfaces, and luminous blue accents.',
    swatches: ['#0b0f19', '#141c2c', '#3b82f6', '#f1f5f9'],
  },
];

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  currentThemeOption: ThemeOption;
  availableThemes: ThemeOption[];
}

const STORAGE_KEY = 'designdna_studio_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'warm' || stored === 'midnight' || stored === 'studio') {
        return stored;
      }
    } catch {
      // localStorage may be unavailable
    }
    return 'studio';
  });

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    // Apply data-theme attribute to root document element
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const currentThemeOption = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        currentThemeOption,
        availableThemes: THEME_OPTIONS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
