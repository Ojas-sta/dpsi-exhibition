'use client';

import { useExhibitionStore } from '@/store/useExhibitionStore';
import { ZoneType } from '@/types';
import {
  Trophy,
  Box,
  LayoutGrid,
  User,
  LogOut,
} from 'lucide-react';

export default function TopNavHUD() {
  const activeZone = useExhibitionStore((state) => state.activeZone);
  const setActiveZone = useExhibitionStore((state) => state.setActiveZone);
  const viewMode = useExhibitionStore((state) => state.viewMode);
  const setViewMode = useExhibitionStore((state) => state.setViewMode);
  const isLeaderboardOpen = useExhibitionStore((state) => state.isLeaderboardOpen);
  const setLeaderboardOpen = useExhibitionStore((state) => state.setLeaderboardOpen);
  const setAuthModalOpen = useExhibitionStore((state) => state.setAuthModalOpen);
  const user = useExhibitionStore((state) => state.user);
  const setUser = useExhibitionStore((state) => state.setUser);

  const zones: { id: 'overview' | ZoneType; label: string; badge: string }[] = [
    { id: 'overview', label: 'Overview', badge: 'Full Floor' },
    { id: 'zone-1', label: 'Show & Tell', badge: 'ST01-08' },
    { id: 'zone-2', label: 'Main Hall', badge: 'P, D & B' },
    { id: 'zone-3', label: 'Robotics', badge: 'Arenas' },
  ];

  return (
    <header className="fixed top-2.5 inset-x-2.5 sm:top-3 sm:inset-x-6 z-[100] pointer-events-auto pt-safe">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#0b101c]/90 backdrop-blur-xl border border-slate-800 shadow-2xl shadow-black/80">
        
        {/* Brand & Live Indicator */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 p-1 flex items-center justify-center shadow-lg shadow-amber-500/10 overflow-hidden shrink-0">
            <img
              src="/dpsi_crest.png"
              alt="DPSI Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Tech & Innovation Expo
              </h1>
              <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden xs:block font-sans">
              DPS Indirapuram • Physical, Digital & Business Showcase
            </p>
          </div>
        </div>

        {/* Desktop Zone Quick Navigation Jumpers */}
        {viewMode === '3d' && (
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
            {zones.map((zone) => {
              const isActive = activeZone === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => setActiveZone(zone.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-slate-950' : 'bg-slate-500'
                    }`}
                  />
                  <span>{zone.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isActive
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {zone.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right HUD Controls: 2D/3D Toggle, Leaderboard, Auth */}
        <div className="flex items-center gap-2">
          {/* 3D vs 2D Toggle (Desktop) */}
          <div className="hidden md:flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === '3d'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Plan</span>
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === '2d'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>2D Grid</span>
            </button>
          </div>

          {/* Live Leaderboard Button */}
          <button
            onClick={() => setLeaderboardOpen(!isLeaderboardOpen)}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm transition-all"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Leaderboard</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </button>

          {/* User Sign-In / Account */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0)}
                </div>
                <span className="max-w-[80px] sm:max-w-[120px] truncate font-semibold text-white">
                  {user.name}
                </span>
                <button
                  onClick={() => setUser(null)}
                  title="Sign out"
                  className="text-slate-400 hover:text-rose-400 ml-1 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 transition-all font-mono"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In to Vote</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
