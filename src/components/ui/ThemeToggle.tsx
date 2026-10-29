'use client';

import React from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'header' | 'hud' | 'inline';
  className?: string;
}

export default function ThemeToggle({ variant = 'header', className = '' }: ThemeToggleProps) {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isLight = theme === 'light';

  if (variant === 'hud') {
    return (
      <button
        onClick={toggleTheme}
        className={`h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold border transition-all duration-300 group shadow-sm ${
          isLight
            ? 'bg-amber-100/90 text-amber-900 border-amber-300 hover:bg-amber-200/90 shadow-amber-500/10'
            : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800/90'
        } ${className}`}
        title={`Current mode: ${isLight ? 'Light' : 'Dark'} (Click to switch)`}
        aria-label="Toggle light and dark theme"
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          {isLight ? (
            <Sun className="w-4 h-4 text-amber-600 transition-transform duration-500 rotate-0 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-sky-400 transition-transform duration-500 rotate-0 hover:-rotate-12" />
          )}
        </div>
        <span className="hidden xl:inline text-[11px] font-mono font-medium">
          {isLight ? 'Light' : 'Dark'}
        </span>
      </button>
    );
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={toggleTheme}
        className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-xs font-mono font-semibold border transition-all ${
          isLight
            ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            : 'bg-slate-900/80 text-slate-200 border-slate-800 hover:bg-slate-800'
        } ${className}`}
        aria-label="Toggle light and dark theme"
      >
        <span className="flex items-center gap-2">
          {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-sky-400" />}
          <span>Display Mode</span>
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-black/10 dark:bg-white/10">
          {isLight ? 'Light' : 'Dark'}
        </span>
      </button>
    );
  }

  // Default: GitHub Universe Header Grid cell
  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-3 sm:px-4 border-l border-[#30363d] dark:border-[#30363d] light:border-[#d0d7de] text-xs font-mono transition-all duration-200 group ${
        isLight
          ? 'bg-slate-100/90 text-slate-800 hover:bg-slate-200 hover:text-black border-slate-300'
          : 'bg-transparent text-[#8b949e] hover:text-white hover:bg-[#161b22]'
      } ${className}`}
      title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
      aria-label="Toggle color theme"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isLight ? (
          <Sun className="w-3.5 h-3.5 text-amber-600 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-sky-400 transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </div>
      <span className="hidden sm:inline text-[11px] font-mono tracking-tight font-medium">
        {isLight ? 'LIGHT' : 'DARK'}
      </span>
    </button>
  );
}
