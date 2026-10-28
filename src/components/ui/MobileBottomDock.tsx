'use client';

import { useExhibitionStore } from '@/store/useExhibitionStore';
import { ZoneType } from '@/types';
import { signOutFromFirebase } from '@/lib/firebase';
import {
  Trophy,
  Box,
  LayoutGrid,
  User,
  LogOut,
  Search,
} from 'lucide-react';

export default function MobileBottomDock() {
  const activeZone = useExhibitionStore((state) => state.activeZone);
  const setActiveZone = useExhibitionStore((state) => state.setActiveZone);
  const viewMode = useExhibitionStore((state) => state.viewMode);
  const setViewMode = useExhibitionStore((state) => state.setViewMode);
  const isLeaderboardOpen = useExhibitionStore((state) => state.isLeaderboardOpen);
  const setLeaderboardOpen = useExhibitionStore((state) => state.setLeaderboardOpen);
  const setAuthModalOpen = useExhibitionStore((state) => state.setAuthModalOpen);
  const setSearchOpen = useExhibitionStore((state) => state.setSearchOpen);
  const isDrawerOpen = useExhibitionStore((state) => state.isDrawerOpen);
  const user = useExhibitionStore((state) => state.user);
  const setUser = useExhibitionStore((state) => state.setUser);

  const zones: { id: 'overview' | ZoneType; label: string; short: string }[] = [
    { id: 'overview', label: 'All', short: 'All' },
    { id: 'zone-1', label: 'ST', short: 'ST' },
    { id: 'zone-2', label: 'P/D/B', short: 'P·D·B' },
    { id: 'zone-3', label: 'Robo', short: 'Robo' },
  ];

  if (isDrawerOpen) return null;

  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-[100] pointer-events-auto pb-safe">
      <div className="flex items-center justify-between p-1.5 rounded-2xl bg-[#090d16]/95 backdrop-blur-xl border border-slate-800 shadow-2xl shadow-black">
        
        {/* Quick Zone Navigation in 3D Mode */}
        {viewMode === '3d' ? (
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {zones.map((zone) => {
              const isActive = activeZone === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => setActiveZone(zone.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {zone.short}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="px-3 py-1.5 text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>2D BENTO DIRECTORY</span>
          </div>
        )}

        {/* Action Controls: Search, 2D/3D toggle, Leaderboard, Auth */}
        <div className="flex items-center gap-1.5">
          {/* Quick Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2.5 rounded-xl text-xs font-bold bg-slate-900 text-amber-400 border border-slate-800 active:scale-95 transition-all"
            title="Search Projects & Students"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* 3D / 2D Toggle */}
          <button
            onClick={() => setViewMode(viewMode === '3d' ? '2d' : '3d')}
            className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
              viewMode === '2d'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-300 border-slate-800'
            }`}
            title="Toggle View Mode"
          >
            {viewMode === '3d' ? <LayoutGrid className="w-4 h-4 text-slate-300" /> : <Box className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={() => setLeaderboardOpen(!isLeaderboardOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 active:scale-95 transition-all font-mono"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Ranks</span>
          </button>

          {/* Auth Button & Mobile Sign-Out */}
          {user ? (
            <div className="flex items-center gap-1">
              <div
                className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs"
                title={user.name}
              >
                {user.name.charAt(0)}
              </div>
              <button
                onClick={async () => {
                  try {
                    await signOutFromFirebase();
                  } catch (e) {
                    console.warn('Mobile sign-out notice:', e);
                  } finally {
                    setUser(null);
                  }
                }}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 font-bold text-xs shadow-md active:scale-95 transition-all"
              title="Sign in to Vote"
            >
              <User className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
