import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ThemeName, lightTheme, darkTheme, pastelTheme, getTheme } from './tokens';

type ThemeMode = ThemeName | 'auto';

interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeMode;
  setThemeName: (name: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  /** Initial theme name. Defaults to 'auto' which detects from VS Code/system */
  initialTheme?: ThemeMode;
}

/**
 * Detects if VS Code is in dark mode by checking body classes or CSS variables
 */
function detectVSCodeTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';
  
  // VS Code adds 'vscode-dark' or 'vscode-light' class to body
  const body = document.body;
  if (body.classList.contains('vscode-dark')) return 'dark';
  if (body.classList.contains('vscode-light')) return 'light';
  
  // Fallback: check system preference
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

/**
 * Theme provider for SysML diagram components.
 * Automatically detects VS Code theme or uses system preference.
 */
export function ThemeProvider({ children, initialTheme = 'auto' }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeMode>(initialTheme);
  const [detectedTheme, setDetectedTheme] = useState<'light' | 'dark'>(detectVSCodeTheme());

  // Listen for VS Code theme changes via MutationObserver
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const observer = new MutationObserver(() => {
      const detected = detectVSCodeTheme();
      setDetectedTheme(detected);
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Resolve actual theme: use detected when in auto mode
  const resolvedThemeName = themeName === 'auto' ? detectedTheme : themeName;
  const theme = getTheme(resolvedThemeName);

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access the current theme.
 * Must be used within a ThemeProvider.
 */
export function useTheme(): Theme {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback to light theme if no provider (for testing, etc.)
    return lightTheme;
  }
  return context.theme;
}

/**
 * Hook to access theme context including setter.
 */
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
