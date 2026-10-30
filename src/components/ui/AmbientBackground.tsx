'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AeroShards from '@/components/reactbits/AeroShards';
import { useExhibitionStore } from '@/store/useExhibitionStore';

export default function AmbientBackground() {
  const pathname = usePathname();
  const theme = useExhibitionStore((state) => state.theme);

  // Do not render behind the 3D exhibition room or in clean light mode
  if (pathname === '/expo' || theme === 'light') {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50"
      aria-hidden="true"
    >
      <AeroShards
        shardColor="#896ABD"
        accentColor="#A855F7"
        placement="full"
        material="glass"
        count={1300}
        speed={0.8}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
