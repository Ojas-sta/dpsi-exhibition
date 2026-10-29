'use client';

import { useExhibitionStore } from '@/store/useExhibitionStore';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export default function CameraControlsWidget() {
  const viewMode = useExhibitionStore((state) => state.viewMode);
  const zoomIn = useExhibitionStore((state) => state.zoomIn);
  const zoomOut = useExhibitionStore((state) => state.zoomOut);
  const resetToOverview = useExhibitionStore((state) => state.resetToOverview);
  const isDrawerOpen = useExhibitionStore((state) => state.isDrawerOpen);

  if (viewMode !== '3d' || isDrawerOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-center gap-1.5 p-1.5 rounded-2xl bg-[#090e1a]/85 backdrop-blur-xl border border-slate-700/60 shadow-2xl shadow-black/80 pointer-events-auto">
      {/* Zoom In Button */}
      <button
        onClick={zoomIn}
        className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-90"
        title="Zoom In"
        aria-label="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      {/* Zoom Out Button */}
      <button
        onClick={zoomOut}
        className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-90"
        title="Zoom Out to Milky Way"
        aria-label="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <div className="w-5 h-px bg-slate-700/60 my-0.5" />

      {/* Reset Overview Camera */}
      <button
        onClick={resetToOverview}
        className="w-9 h-9 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 flex items-center justify-center transition-all active:scale-90"
        title="Reset to Full Floor Overview"
        aria-label="Reset Overview"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
}
