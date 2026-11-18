'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'portfolio-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Calculate resolved theme based on theme preference
  useEffect(() => {
    const calculateResolvedTheme = () => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
      return theme;
    };

    if (typeof window !== 'undefined') {
      const newResolvedTheme = calculateResolvedTheme();
      setResolvedTheme(newResolvedTheme);
      
      // Update HTML class
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(newResolvedTheme);
    }
  }, [theme]);

  // Initialize theme from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedTheme = localStorage.getItem(storageKey) as Theme | null;
    
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      // Check system preference for default 'system' theme
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (defaultTheme === 'system') {
        setResolvedTheme(systemPrefersDark ? 'dark' : 'light');
      }
    }
    
    setMounted(true);
  }, [storageKey, defaultTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newResolvedTheme = e.matches ? 'dark' : 'light';
      setResolvedTheme(newResolvedTheme);
      
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(newResolvedTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    theme,
    resolvedTheme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, newTheme);
        
        // Show toast feedback
        const themeLabels = {
          light: 'Light',
          dark: 'Dark',
          system: 'System',
        };
        toast(`Theme set to ${themeLabels[newTheme]}`, {
          duration: 2000,
        });
      }
    },
  };

  // Prevent flash of wrong theme on initial load
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};