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
  Sun,
  Moon,
} from 'lucide-react';

export default function TopNavHUD() {
  const theme = useExhibitionStore((state) => state.theme);
  const toggleTheme = useExhibitionStore((state) => state.toggleTheme);
  const isLight = theme === 'light';

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
    { id: 'overview', label: 'Overview', badge: isLight ? 'Daylight' : 'Milky Way' },
    { id: 'zone-1', label: 'Show & Tell', badge: 'ST01–08' },
    { id: 'physical', label: 'Physical', badge: 'P01–12' },
    { id: 'digital', label: 'Digital', badge: 'D01–12' },
    { id: 'business', label: 'Business', badge: 'B01–07' },
    { id: 'zone-3', label: 'Robotics', badge: 'Arenas' },
  ];

  return (
    <header className="fixed top-2 inset-x-2 sm:top-3 sm:inset-x-4 md:inset-x-6 z-[100] pointer-events-auto pt-safe">
      <div className={`mx-auto w-full max-w-[1580px] flex items-center justify-between gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 md:p-2.5 rounded-2xl backdrop-blur-2xl border transition-colors duration-300 shadow-2xl overflow-hidden ${
        isLight
          ? 'bg-white/92 border-slate-200/90 shadow-slate-300/40 text-slate-900'
          : 'bg-[#070b14]/92 border-slate-700/60 shadow-black/90 text-white'
      }`}>
        
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

          <div className={`hidden lg:block h-6 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className={`text-xs sm:text-[13px] font-extrabold tracking-tight flex items-center gap-1.5 whitespace-nowrap ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Tech & Innovation Expo
              </h1>
              <span className="flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                LIVE
              </span>
            </div>
            <p className={`text-[10px] hidden 2xl:block font-sans ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              35 Inventions · Physical • Digital • Business • Robotics
            </p>
          </div>
        </div>

        {/* Center: Search & Zone Navigation (Desktop & Large Screens) */}
        <div className="hidden lg:flex items-center gap-2 min-w-0 flex-1 justify-center px-1">
          {/* Global Search Bar */}
          <button
            onClick={() => setSearchOpen(true)}
            className={`h-8 sm:h-9 flex items-center gap-2 px-2.5 sm:px-3 rounded-xl border text-xs transition-all shadow-inner group shrink-0 ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200/90 border-slate-200 text-slate-700 hover:text-slate-950'
                : 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Search Projects (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="hidden 2xl:inline">Search 35 booths & students...</span>
            <span className="hidden xl:inline 2xl:hidden">Search...</span>
            <kbd className={`hidden xl:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded border ml-1 ${
              isLight ? 'bg-slate-200 text-slate-600 border-slate-300' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              ⌘K
            </kbd>
          </button>

          {/* Zone Quick Navigation Jumpers in 3D Mode */}
          {viewMode === '3d' && (
            <nav className={`flex items-center gap-1 p-1 rounded-xl border h-8 sm:h-9 shadow-inner overflow-x-auto no-scrollbar max-w-full ${
              isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-900/90 border-slate-800/90'
            }`}>
              {zones.map((zone) => {
                const isActive = activeZone === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() => setActiveZone(zone.id)}
                    className={`h-6 sm:h-7 flex items-center gap-1 px-2 xl:px-2.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                        : isLight
                          ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/70'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isActive ? 'bg-slate-950' : isLight ? 'bg-slate-400' : 'bg-slate-500'
                      }`}
                    />
                    <span>{zone.label}</span>
                    <span
                      className={`text-[9px] font-mono px-1 py-0.2 rounded hidden 2xl:inline-block ${
                        isActive
                          ? 'bg-amber-600 text-white font-bold'
                          : isLight
                            ? 'bg-slate-200 text-slate-600'
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
          {/* Mobile/Tablet Search Button (Shown on tablet, dock handles on phone) */}
          <button
            onClick={() => setSearchOpen(true)}
            className={`hidden sm:flex lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl border items-center justify-center transition-all ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Search Projects"
          >
            <Search className="w-3.5 h-3.5 text-amber-500" />
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl border transition-all active:scale-95 shrink-0 shadow-sm ${
              isLight
                ? 'bg-amber-50 hover:bg-amber-100/90 border-amber-300 text-amber-900'
                : 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-700 text-amber-300'
            }`}
            title={isLight ? 'Switch to Cosmic Dark Mode (Milky Way)' : 'Switch to Architectural Light Showroom Mode'}
          >
            {isLight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="text-xs font-bold hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-xs font-bold hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* 3D vs 2D Toggle */}
          <div className={`hidden sm:flex items-center p-0.5 rounded-xl border h-8 sm:h-9 shadow-inner shrink-0 ${
            isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-900/90 border-slate-800/90'
          }`}>
            <button
              onClick={() => setViewMode('3d')}
              className={`h-7 sm:h-8 flex items-center gap-1.5 px-2 sm:px-2.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === '3d'
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40 shadow-sm font-bold'
                  : isLight
                    ? 'text-slate-600 hover:text-slate-900'
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
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40 shadow-sm font-bold'
                  : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to 2D Directory Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">2D</span>
            </button>
          </div>

          {/* Live Leaderboard Button (Tablet & Desktop, dock handles on phone) */}
          <button
            onClick={() => setLeaderboardOpen(!isLeaderboardOpen)}
            className={`hidden sm:flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl border text-xs font-bold shadow-sm transition-all whitespace-nowrap shrink-0 ${
              isLight
                ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-800'
                : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
            }`}
            title="Live Rankings Leaderboard"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="hidden md:inline">Leaderboard</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
          </button>

          {/* User Sign-In / Account (Always visible and cleanly aligned) */}
          {user ? (
            <div className={`flex items-center gap-1 pl-1 sm:pl-1.5 border-l shrink-0 ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <div className={`flex items-center gap-1.5 h-8 sm:h-9 px-2 rounded-xl border text-xs max-w-[130px] sm:max-w-[160px] ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className={`truncate font-semibold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>
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
                  className={`p-1 rounded-lg transition-all ml-0.5 shrink-0 ${
                    isLight ? 'text-slate-500 hover:text-rose-600 hover:bg-slate-200' : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
                  }`}
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
            className={`lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center active:scale-95 transition-all shadow-md shrink-0 ${
              isLight
                ? 'bg-slate-100 border-slate-300 text-slate-800'
                : 'bg-slate-900/90 border-slate-700/80 text-white'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-4 h-4 text-amber-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
