'use client';

import { useEffect } from 'react';
import { useThemeStore, ThemeMode } from '@/store/useThemeStore';

export default function ThemeInitializer() {
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dpsi-expo-theme') as ThemeMode | null;
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved);
      } else {
        setTheme('dark');
      }
    } catch {
      // ignore
    }
  }, [setTheme]);

  return null;
}
