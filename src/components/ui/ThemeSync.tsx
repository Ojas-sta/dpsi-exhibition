'use client';

import { useEffect } from 'react';
import { useExhibitionStore, ThemeMode } from '@/store/useExhibitionStore';

export default function ThemeSync() {
  const theme = useExhibitionStore((state) => state.theme);
  const setTheme = useExhibitionStore((state) => state.setTheme);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dpsi_expo_theme') as ThemeMode | null;
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved);
      } else {
        // Default to light mode so the architectural light showroom is immediately visible
        setTheme('light');
      }
    } catch {
      setTheme('light');
    }
  }, [setTheme]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  return null;
}
