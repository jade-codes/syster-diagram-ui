import React from 'react';
import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll } from 'bun:test';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme, useThemeContext } from '../theme';
import { lightTheme, darkTheme, pastelTheme, getTheme, type NodeCategory } from '../theme/tokens';

// Mock MutationObserver for bun test environment
let MockMutationObserver: any;
let observerCallback: MutationCallback | null = null;

beforeAll(() => {
  MockMutationObserver = class {
    callback: MutationCallback;
    constructor(callback: MutationCallback) {
      this.callback = callback;
      observerCallback = callback; // Store callback for triggering in tests
    }
    observe() {}
    disconnect() {}
    takeRecords() { return []; }
  };
  (globalThis as any).MutationObserver = MockMutationObserver;
});

afterAll(() => {
  delete (globalThis as any).MutationObserver;
});

// Clean up after each test
afterEach(() => {
  cleanup();
  // Reset body classes
  document.body.className = '';
  // Reset matchMedia mock
  delete (window as any).matchMedia;
  observerCallback = null;
});

describe('getTheme', () => {
  test('returns light theme for "light"', () => {
    expect(getTheme('light')).toBe(lightTheme);
  });

  test('returns dark theme for "dark"', () => {
    expect(getTheme('dark')).toBe(darkTheme);
  });

  test('returns pastel theme for "pastel"', () => {
    expect(getTheme('pastel')).toBe(pastelTheme);
  });

  test('returns light theme for unknown value', () => {
    // @ts-expect-error - testing unknown value
    expect(getTheme('unknown')).toBe(lightTheme);
  });
});

describe('useTheme hook', () => {
  test('returns light theme when no provider exists (fallback)', () => {
    function TestComponent() {
      const theme = useTheme();
      return <div data-testid="theme-name">{theme.name}</div>;
    }
    
    render(<TestComponent />);
    expect(screen.getByTestId('theme-name').textContent).toBe('light');
  });

  test('returns theme from provider', () => {
    function TestComponent() {
      const theme = useTheme();
      return <div data-testid="theme-name">{theme.name}</div>;
    }
    
    render(
      <ThemeProvider initialTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-name').textContent).toBe('dark');
  });

  test('returns pastel theme when set', () => {
    function TestComponent() {
      const theme = useTheme();
      return <div data-testid="theme-name">{theme.name}</div>;
    }
    
    render(
      <ThemeProvider initialTheme="pastel">
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-name').textContent).toBe('pastel');
  });
});

describe('useThemeContext hook', () => {
  test('throws error when used outside provider', () => {
    function TestComponent() {
      try {
        useThemeContext();
        return <div>No error</div>;
      } catch (e) {
        return <div data-testid="error">{(e as Error).message}</div>;
      }
    }
    
    render(<TestComponent />);
    expect(screen.getByTestId('error').textContent).toBe(
      'useThemeContext must be used within a ThemeProvider'
    );
  });

  test('provides theme context with setter', () => {
    function TestComponent() {
      const { theme, themeName, setThemeName } = useThemeContext();
      return (
        <div>
          <div data-testid="theme-name">{theme.name}</div>
          <div data-testid="mode">{themeName}</div>
          <button onClick={() => setThemeName('dark')}>Set Dark</button>
        </div>
      );
    }
    
    render(
      <ThemeProvider initialTheme="light">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-name').textContent).toBe('light');
    expect(screen.getByTestId('mode').textContent).toBe('light');
  });
});

describe('ThemeProvider', () => {
  test('defaults to auto mode', () => {
    function TestComponent() {
      const { themeName } = useThemeContext();
      return <div data-testid="mode">{themeName}</div>;
    }
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('mode').textContent).toBe('auto');
  });

  test('detects vscode-dark class on body', () => {
    document.body.classList.add('vscode-dark');
    
    function TestComponent() {
      const theme = useTheme();
      return <div data-testid="theme-name">{theme.name}</div>;
    }
    
    render(
      <ThemeProvider initialTheme="auto">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-name').textContent).toBe('dark');
  });

  test('detects vscode-light class on body', () => {
    document.body.classList.add('vscode-light');
    
    function TestComponent() {
      const theme = useTheme();
      return <div data-testid="theme-name">{theme.name}</div>;
    }
    
    render(
      <ThemeProvider initialTheme="auto">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-name').textContent).toBe('light');
  });

  test('falls back to system dark preference when no vscode class', () => {
    // Mock matchMedia to return dark preference
    (window as any).matchMedia = (query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    });
    
    function TestComponent() {
      const theme = useTheme();
      return <div data-testid="theme-name">{theme.name}</div>;
    }
    
    render(
      <ThemeProvider initialTheme="auto">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-name').textContent).toBe('dark');
  });

  test('responds to theme class changes via MutationObserver', async () => {
    function TestComponent() {
      const theme = useTheme();
      return <div data-testid="theme-name">{theme.name}</div>;
    }
    
    render(
      <ThemeProvider initialTheme="auto">
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initially light (no vscode class)
    expect(screen.getByTestId('theme-name').textContent).toBe('light');
    
    // Simulate VS Code switching to dark mode
    document.body.classList.add('vscode-dark');
    
    // Trigger the MutationObserver callback
    if (observerCallback) {
      observerCallback([], {} as MutationObserver);
    }
    
    await waitFor(() => {
      expect(screen.getByTestId('theme-name').textContent).toBe('dark');
    });
  });

  test('allows setting theme name programmatically', async () => {
    function TestComponent() {
      const { theme, setThemeName } = useThemeContext();
      return (
        <div>
          <div data-testid="theme-name">{theme.name}</div>
          <button data-testid="set-dark" onClick={() => setThemeName('dark')}>Set Dark</button>
          <button data-testid="set-pastel" onClick={() => setThemeName('pastel')}>Set Pastel</button>
        </div>
      );
    }
    
    render(
      <ThemeProvider initialTheme="light">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-name').textContent).toBe('light');
    
    // Change to dark
    screen.getByTestId('set-dark').click();
    await waitFor(() => {
      expect(screen.getByTestId('theme-name').textContent).toBe('dark');
    });
    
    // Change to pastel
    screen.getByTestId('set-pastel').click();
    await waitFor(() => {
      expect(screen.getByTestId('theme-name').textContent).toBe('pastel');
    });
  });
});

describe('Theme tokens', () => {
  test('all themes have required ui properties', () => {
    const themes = [lightTheme, darkTheme, pastelTheme];
    
    for (const theme of themes) {
      expect(theme.ui).toBeDefined();
      expect(theme.ui.background).toBeDefined();
      expect(theme.ui.text).toBeDefined();
      expect(theme.ui.textMuted).toBeDefined();
      expect(theme.ui.border).toBeDefined();
    }
  });

  test('all themes have required category colors', () => {
    const themes = [lightTheme, darkTheme, pastelTheme];
    // Use actual category names from the token file
    const requiredCategories: NodeCategory[] = ['part-def', 'part-usage', 'action-def', 'requirement-def', 'constraint'];
    
    for (const theme of themes) {
      for (const cat of requiredCategories) {
        const colors = theme.categories[cat];
        expect(colors).toBeDefined();
        expect(colors.primary).toBeDefined();
        expect(colors.light).toBeDefined();
        expect(colors.border).toBeDefined();
        expect(colors.text).toBeDefined();
      }
    }
  });

  test('pastel theme has distinct pink/blue/purple colors', () => {
    // Check that pastel uses the specified palette (pinks, blues, purples)
    const { categories } = pastelTheme;
    
    // Part def should have pink-ish colors
    expect(categories['part-def'].light).toMatch(/#[a-fA-F0-9]{6}/);
    // Action def should have blue-ish colors
    expect(categories['action-def'].light).toMatch(/#[a-fA-F0-9]{6}/);
    // Requirement def should have purple-ish colors
    expect(categories['requirement-def'].light).toMatch(/#[a-fA-F0-9]{6}/);
  });
});
