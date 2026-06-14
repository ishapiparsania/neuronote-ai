import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { darkColors, lightColors, ThemeColors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { shadows } from './shadows';

type ThemeContextValue = {
  colors: ThemeColors;
  isDark: boolean;
  spacing: typeof spacing;
  typography: typeof typography;
  shadows: typeof shadows;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const darkModeOverride = useSelector(
    (state: RootState) => state.settings.darkModeOverride,
  );

  const isDark = useMemo(() => {
    if (darkModeOverride === 'light') return false;
    if (darkModeOverride === 'dark') return true;
    return systemScheme === 'dark';
  }, [darkModeOverride, systemScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
      spacing,
      typography,
      shadows,
    }),
    [isDark],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return context;
}
