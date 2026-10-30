'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AeroShards from '@/components/reactbits/AeroShards';
import { useExhibitionStore } from '@/store/useExhibitionStore';

export default function AmbientBackground() {
  const pathname = usePathname();
  const theme = useExhibitionStore((state) => state.theme);
  const isLight = theme === 'light';

  // Do not render behind the dedicated 3D exhibition room
  if (pathname === '/expo') {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-500 ${
        isLight ? 'opacity-55' : 'opacity-50'
      }`}
      aria-hidden="true"
    >
      <AeroShards
        shardColor={isLight ? '#6366f1' : '#896ABD'}
        accentColor={isLight ? '#3b82f6' : '#A855F7'}
        placement="full"
        material="glass"
        count={1300}
        speed={0.8}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
