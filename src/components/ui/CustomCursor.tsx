'use client';

import React from 'react';
import BlobCursor from '@/components/reactbits/BlobCursor';
import { useThemeStore } from '@/store/useThemeStore';

export default function CustomCursor() {
  const theme = useThemeStore((state) => state.theme);
  const isLight = theme === 'light';

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
      aria-hidden="true"
    >
      <BlobCursor
        material="chrome"
        color={isLight ? '#2563EB' : '#3B82F6'}
        size={64}
        hideCursor={true}
      />
    </div>
  );
}
