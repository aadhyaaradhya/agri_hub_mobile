import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { colors, ThemeColors } from './colors';
import { typography, Typography } from './typography';
import { spacing, Spacing } from './spacing';
import { storage, STORAGE_KEYS } from '../services/storageService';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(systemColorScheme === 'dark' ? 'dark' : 'light');

  // Restore a manually-chosen theme so it survives app restarts instead of
  // resetting to the system scheme every launch. If nothing was saved, the
  // system-scheme initial state above stands.
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const saved = await storage.get<ThemeMode>(STORAGE_KEYS.themeMode);
        if (isMounted && (saved === 'light' || saved === 'dark')) {
          setModeState(saved);
        }
      } catch (err) {
        console.warn('Failed to restore theme mode:', err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    storage.set(STORAGE_KEYS.themeMode, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((prev) => {
      const next: ThemeMode = prev === 'light' ? 'dark' : 'light';
      storage.set(STORAGE_KEYS.themeMode, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      colors: colors[mode],
      typography,
      spacing,
      toggleTheme,
      setMode,
    }),
    [mode, toggleTheme, setMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
