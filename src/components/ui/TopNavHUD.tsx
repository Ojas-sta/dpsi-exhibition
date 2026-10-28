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

export default function TopNavHUD() {
  const activeZone = useExhibitionStore((state) => state.activeZone);
  const setActiveZone = useExhibitionStore((state) => state.setActiveZone);
  const viewMode = useExhibitionStore((state) => state.viewMode);
  const setViewMode = useExhibitionStore((state) => state.setViewMode);
  const isLeaderboardOpen = useExhibitionStore((state) => state.isLeaderboardOpen);
  const setLeaderboardOpen = useExhibitionStore((state) => state.setLeaderboardOpen);
  const setAuthModalOpen = useExhibitionStore((state) => state.setAuthModalOpen);
  const setSearchModalOpen = useExhibitionStore((state) => state.setSearchModalOpen);
  const user = useExhibitionStore((state) => state.user);
  const setUser = useExhibitionStore((state) => state.setUser);

  const zones: { id: 'overview' | ZoneType; label: string; badge: string }[] = [
    { id: 'overview', label: 'Overview', badge: 'Full Floor' },
    { id: 'zone-1', label: 'Show & Tell', badge: 'ST01-08' },
    { id: 'zone-2', label: 'Main Hall', badge: 'P, D & B' },
    { id: 'zone-3', label: 'Robotics', badge: 'Arenas' },
  ];

  return (
    <header className="fixed top-2 inset-x-2 sm:top-3 sm:inset-x-4 md:inset-x-6 z-[100] pointer-events-auto pt-safe">
      <div className="mx-auto w-full max-w-[1520px] flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-2xl bg-[#080d19]/92 backdrop-blur-2xl border border-slate-800/90 shadow-2xl shadow-black/90">
        
        {/* Left: Brand & DPS Indirapuram Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="h-9 px-2 sm:px-2.5 py-1 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-200">
            {/* Mobile: crisp compact shield */}
            <img
              src="/dps_shield.png"
              alt="DPS Indirapuram Shield"
              className="h-full w-auto object-contain block sm:hidden"
            />
            {/* Tablet & Desktop: official full DPS Indirapuram banner */}
            <img
              src="/dps_indirapuram_logo.png"
              alt="DPS Indirapuram"
              className="h-full w-auto max-w-[130px] sm:max-w-[165px] md:max-w-[185px] object-contain hidden sm:block"
            />
          </div>

          <div className="hidden lg:block h-6 w-px bg-slate-800" />

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-xs sm:text-[13px] font-extrabold tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
                Tech & Innovation Expo
              </h1>
              <span className="flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden xl:block font-sans">
              Physical (P) • Digital (D) • Business (B)
            </p>
          </div>
        </div>

        {/* Center: Desktop Zone Quick Navigation Jumpers */}
        {viewMode === '3d' && (
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800/90 h-10 shadow-inner">
            {zones.map((zone) => {
              const isActive = activeZone === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => setActiveZone(zone.id)}
                  className={`h-8 flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
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
                        ? 'bg-amber-600 text-white font-bold'
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

        {/* Right: Controls (Search, 3D/2D, Leaderboard, Auth) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Search Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-2 h-10 px-2.5 sm:px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold shadow-inner transition-all group"
            title="Search projects (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden xl:inline text-slate-400 group-hover:text-slate-200">Search</span>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
              ⌘K
            </span>
          </button>

          {/* 3D vs 2D Toggle */}
          <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-slate-900/90 border border-slate-800/90 h-10 shadow-inner">
            <button
              onClick={() => setViewMode('3d')}
              className={`h-8 flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
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
              className={`h-8 flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
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
            className="flex items-center gap-2 h-10 px-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm transition-all"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Leaderboard</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </button>

          {/* User Sign-In / Account */}
          {user ? (
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2 h-10 px-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0)}
                </div>
                <span className="max-w-[70px] sm:max-w-[110px] truncate font-semibold text-white text-xs">
                  {user.name}
                </span>
                <button
                  onClick={async () => {
                    try {
                      await signOutFromFirebase();
                    } catch (e) {
                      console.warn('Sign out notice:', e);
                    } finally {
                      setUser(null);
                    }
                  }}
                  title="Sign out"
                  className="text-slate-400 hover:text-rose-400 ml-0.5 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 transition-all font-mono"
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
