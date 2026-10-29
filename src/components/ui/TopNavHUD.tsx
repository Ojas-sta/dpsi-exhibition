'use client';

import { useExhibitionStore, NavZoneId } from '@/store/useExhibitionStore';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { signOutFromFirebase } from '@/lib/firebase';
import {
  Trophy,
  Box,
  LayoutGrid,
  User,
  LogOut,
  Search,
  Menu,
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
      <div className="mx-auto w-full max-w-[1580px] flex items-center justify-between gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 md:p-2.5 rounded-2xl bg-[#070b14]/92 backdrop-blur-2xl border border-slate-700/60 shadow-2xl shadow-black/90 overflow-hidden">
        
        {/* Left: Brand & DPS Indirapuram Identity */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => {
              setViewMode('3d');
              setActiveZone('overview');
            }}
            className="h-8 sm:h-9 px-2 sm:px-2.5 py-1 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-200 hover:opacity-95 transition-all"
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
              className="h-full w-auto max-w-[110px] sm:max-w-[145px] md:max-w-[165px] object-contain hidden sm:block"
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

        {/* Center: Search & Zone Navigation (Desktop & Large Screens) */}
        <div className="hidden lg:flex items-center gap-2 min-w-0 flex-1 justify-center px-1">
          {/* Global Search Bar */}
          <button
            onClick={() => setSearchOpen(true)}
            className="h-8 sm:h-9 flex items-center gap-2 px-2.5 sm:px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-all shadow-inner group shrink-0"
            title="Search Projects (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden 2xl:inline">Search 35 booths & students...</span>
            <span className="hidden xl:inline 2xl:hidden">Search...</span>
            <kbd className="hidden xl:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 ml-1">
              ⌘K
            </kbd>
          </button>

          {/* Zone Quick Navigation Jumpers in 3D Mode */}
          {viewMode === '3d' && (
            <nav className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800/90 h-8 sm:h-9 shadow-inner overflow-x-auto no-scrollbar max-w-full">
              {zones.map((zone) => {
                const isActive = activeZone === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() => setActiveZone(zone.id)}
                    className={`h-6 sm:h-7 flex items-center gap-1 px-2 xl:px-2.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isActive ? 'bg-slate-950' : 'bg-slate-500'
                      }`}
                    />
                    <span>{zone.label}</span>
                    <span
                      className={`text-[9px] font-mono px-1 py-0.2 rounded hidden 2xl:inline-block ${
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

        {/* Right: Controls & Login (ALWAYS ANCHORED, NEVER CUT OFF) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
          {/* Mobile/Tablet Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all"
            title="Search Projects"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* 3D vs 2D Toggle */}
          <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-slate-900/90 border border-slate-800/90 h-8 sm:h-9 shadow-inner shrink-0">
            <button
              onClick={() => setViewMode('3d')}
              className={`h-7 sm:h-8 flex items-center gap-1.5 px-2 sm:px-2.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === '3d'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to 3D Floor Plan"
            >
              <Box className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">3D</span>
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`h-7 sm:h-8 flex items-center gap-1.5 px-2 sm:px-2.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === '2d'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to 2D Directory Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">2D</span>
            </button>
          </div>

          {/* Light / Dark Mode Toggle */}
          <ThemeToggle variant="hud" />

          {/* Live Leaderboard Button */}
          <button
            onClick={() => setLeaderboardOpen(!isLeaderboardOpen)}
            className="flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm transition-all whitespace-nowrap shrink-0"
            title="Live Rankings Leaderboard"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden md:inline">Leaderboard</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
          </button>

          {/* User Sign-In / Account (Always visible and cleanly aligned) */}
          {user ? (
            <div className="flex items-center gap-1 pl-1 sm:pl-1.5 border-l border-slate-800 shrink-0">
              <div className="flex items-center gap-1.5 h-8 sm:h-9 px-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 max-w-[130px] sm:max-w-[160px]">
                <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="truncate font-semibold text-white text-xs">
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
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all ml-0.5 shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 active:scale-95 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/20 transition-all whitespace-nowrap shrink-0"
              title="Sign in with Google or Visitor Pass"
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span>Sign In</span>
              <span className="hidden sm:inline">to Vote</span>
            </button>
          )}

          {/* Mobile Full-Screen Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white flex items-center justify-center active:scale-95 transition-all shadow-md shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
