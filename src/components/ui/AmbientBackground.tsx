'use client';

import React from 'react';
import AeroShards from '@/components/reactbits/AeroShards';
import { useThemeStore } from '@/store/useThemeStore';

export default function AmbientBackground() {
  const theme = useThemeStore((state) => state.theme);
  const isLight = theme === 'light';

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-500 ${
        isLight ? 'opacity-35' : 'opacity-50'
      }`}
      aria-hidden="true"
    >
      <AeroShards
        shardColor={isLight ? '#6366F1' : '#896ABD'}
        accentColor={isLight ? '#2563EB' : '#A855F7'}
        placement="full"
        material="glass"
        count={1300}
        speed={0.8}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
