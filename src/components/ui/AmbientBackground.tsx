'use client';

import React from 'react';
import AeroShards from '@/components/reactbits/AeroShards';

export default function AmbientBackground() {
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
