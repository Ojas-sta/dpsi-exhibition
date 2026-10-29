'use client';

import React from 'react';
import BlobCursor from '@/components/reactbits/BlobCursor';

export default function CustomCursor() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
      aria-hidden="true"
    >
      <BlobCursor
        material="chrome"
        color="#3B82F6"
        size={64}
        hideCursor={true}
      />
    </div>
  );
}
