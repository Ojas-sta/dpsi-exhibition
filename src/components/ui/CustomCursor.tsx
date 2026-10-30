'use client';

import React from 'react';
import BlobCursor from '@/components/reactbits/BlobCursor';
import { useExhibitionStore } from '@/store/useExhibitionStore';

export default function CustomCursor() {
  const theme = useExhibitionStore((state) => state.theme);
  const isLight = theme === 'light';

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
      aria-hidden="true"
    >
      <BlobCursor
        material="chrome"
        color={isLight ? '#1D4ED8' : '#3B82F6'}
        size={isLight ? 68 : 64}
        hideCursor={true}
      />
    </div>
  );
}
