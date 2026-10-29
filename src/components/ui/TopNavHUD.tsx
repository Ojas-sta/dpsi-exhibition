'use client';

import { useExhibitionStore, NavZoneId } from '@/store/useExhibitionStore';
import { signOutFromFirebase } from '@/lib/firebase';
import {
  Trophy,
  Box,
  LayoutGrid,
  User,
  LogOut,
  Search,
  Menu,
  Sparkles,
  Compass,
} from 'lucide-react';

export default function TopNavHUD() {
  const activeZone = useExhibitionStore((state) => state.activeZone);
  const setActiveZone = useExhibitionStore((state) => state.setActiveZone);
  const viewMode = useExhibitionStore((state) => state.viewMode);
  const setViewMode = useExhibitionStore((state) => state.setViewMode);
  const isLeaderboardOpen = useExhibitionStore((state) => state.isLeaderboardOpen);
  const setLeaderboardOpen = useExhibitionStore((state) => state.setLeaderboardOpen);
  const setAuthModalOpen = useExhibitionStore((state) => state.setAuthModalOpen);
  const setSearchOpen = useExhibitionStore((state) => state.setSearchOpen);
  const isMobileMenuOpen = useExhibitionStore((state) => state.isMobileMenuOpen);
  const setMobileMenuOpen = useExhibitionStore((state) => state.setMobileMenuOpen);
  const user = useExhibitionStore((state) => state.user);
  const setUser = useExhibitionStore((state) => state.setUser);

  const zones: { id: NavZoneId; label: string; badge: string }[] = [
    { id: 'overview', label: 'Overview', badge: 'Milky Way' },
    { id: 'zone-1', label: 'Show & Tell', badge: 'ST01–08' },
    { id: 'physical', label: 'Physical', badge: 'P01–12' },
    { id: 'digital', label: 'Digital', badge: 'D01–12' },
    { id: 'business', label: 'Business', badge: 'B01–07' },
    { id: 'zone-3', label: 'Robotics', badge: 'Arenas' },
  ];

  return (
    <header className="fixed top-2 inset-x-2 sm:top-3 sm:inset-x-4 md:inset-x-6 z-[100] pointer-events-auto pt-safe">
      <div className="mx-auto w-full max-w-[1580px] flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-2xl bg-[#070b14]/88 backdrop-blur-2xl border border-slate-700/60 shadow-2xl shadow-black/90">
        
        {/* Left: Brand & DPS Indirapuram Identity */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => {
              setViewMode('3d');
              setActiveZone('overview');
            }}
            className="h-9 px-2 sm:px-2.5 py-1 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-200 hover:opacity-95 transition-all"
            title="DPS Indirapuram Tech Expo"
          >
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
              className="h-full w-auto max-w-[125px] sm:max-w-[160px] md:max-w-[175px] object-contain hidden sm:block"
            />
          </button>

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
            <p className="text-[10px] text-slate-400 hidden 2xl:block font-sans">
              35 Inventions · Physical • Digital • Business • Robotics
            </p>
          </div>
        </div>

        {/* Center: Search & Zone Jump Navigation (Desktop & Large screens) */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Global Search Bar */}
          <button
            onClick={() => setSearchOpen(true)}
            className="h-9 flex items-center gap-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800/90 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-all shadow-inner group"
          >
            <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden xl:inline">Search 35 booths & students...</span>
            <span className="inline xl:hidden">Search...</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 ml-1">
              ⌘K
            </kbd>
          </button>

          {/* Zone Quick Navigation Jumpers in 3D Mode */}
          {viewMode === '3d' && (
            <nav className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800/90 h-10 shadow-inner">
              {zones.map((zone) => {
                const isActive = activeZone === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() => setActiveZone(zone.id)}
                    className={`h-8 flex items-center gap-1.5 px-2.5 xl:px-3 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
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
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
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
        </div>

        {/* Right: Controls (3D/2D, Leaderboard, Auth, Mobile Menu Trigger) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Search Icon Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all"
            title="Search Projects"
          >
            <Search className="w-4 h-4 text-amber-400" />
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
            className="flex items-center gap-2 h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm transition-all"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Leaderboard</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </button>

          {/* User Sign-In / Account (Desktop) */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-800">
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
                      setUser(null);
                    } catch (e) {
                      console.warn('Sign out notice:', e);
                    }
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In to Vote</span>
            </button>
          )}

          {/* Mobile Full-Screen Menu Toggle (Mobile 5 block feature) */}
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white flex items-center justify-center active:scale-95 transition-all shadow-md"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
