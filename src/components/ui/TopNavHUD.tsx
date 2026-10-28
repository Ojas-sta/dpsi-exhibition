'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Menu,
  X,
  Compass,
  Sparkles,
  Bot,
  Cpu,
  ChevronRight,
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
  const user = useExhibitionStore((state) => state.user);
  const setUser = useExhibitionStore((state) => state.setUser);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const zones: {
    id: 'overview' | ZoneType;
    label: string;
    badge: string;
    desc: string;
    icon: typeof Compass;
  }[] = [
    {
      id: 'overview',
      label: 'Overview',
      badge: 'Full Floor',
      desc: 'Milky Way Space Overview',
      icon: Compass,
    },
    {
      id: 'zone-1',
      label: 'Show & Tell',
      badge: 'ST01-08',
      desc: 'Junior Innovation Pavilion',
      icon: Sparkles,
    },
    {
      id: 'zone-2',
      label: 'Main Hall',
      badge: 'P, D & B',
      desc: 'Physical, Digital & Business Booths',
      icon: Cpu,
    },
    {
      id: 'zone-3',
      label: 'Robotics',
      badge: 'Arenas',
      desc: 'Robo Soccer & Obstacle Arenas',
      icon: Bot,
    },
  ];

  const handleZoneSelect = (zoneId: 'overview' | ZoneType) => {
    setActiveZone(zoneId);
    if (viewMode !== '3d') {
      setViewMode('3d');
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* ============================================================== */}
      {/* 1. FLOATING MINIMALISTIC TOP BAR HUD                           */}
      {/* ============================================================== */}
      <header className="fixed top-2.5 inset-x-2.5 sm:top-4 sm:inset-x-6 md:inset-x-8 z-[120] pointer-events-auto">
        <div className="mx-auto w-full max-w-[1540px] flex items-center justify-between gap-2 sm:gap-3 px-3 py-2 rounded-2xl bg-[#070b16]/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/80 transition-all">
          
          {/* Left: Brand Identity & Quick Reset to Space Overview */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => handleZoneSelect('overview')}
              title="Reset to Galactic Overview"
              className="flex items-center gap-2 sm:gap-2.5 text-left group"
            >
              <div className="h-9 px-2 py-1 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-200 group-hover:scale-105 transition-transform">
                {/* Compact Shield on mobile */}
                <img
                  src="/dps_shield.png"
                  alt="DPS Indirapuram Shield"
                  className="h-full w-auto object-contain block sm:hidden"
                />
                {/* Full Brand on tablet & desktop */}
                <img
                  src="/dps_indirapuram_logo.png"
                  alt="DPS Indirapuram"
                  className="h-full w-auto max-w-[125px] sm:max-w-[155px] md:max-w-[175px] object-contain hidden sm:block"
                />
              </div>

              <div className="hidden lg:block h-6 w-px bg-white/10" />

              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-[13px] font-black tracking-tight text-white group-hover:text-amber-400 transition-colors whitespace-nowrap">
                    Tech & Innovation Expo
                  </span>
                  <span className="flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden xl:block font-sans">
                  DPS Indirapuram • Physical, Digital & Business
                </p>
              </div>
            </button>
          </div>

          {/* Center: Minimalist Desktop Navigation Jumpers */}
          {viewMode === '3d' && (
            <nav className="hidden md:flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5 h-10 shadow-inner">
              {zones.map((zone) => {
                const isActive = activeZone === zone.id;
                const Icon = zone.icon;
                return (
                  <button
                    key={zone.id}
                    onClick={() => handleZoneSelect(zone.id)}
                    className={`h-8 flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{zone.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isActive
                          ? 'bg-slate-950 text-amber-400 font-bold'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {zone.badge}
                    </span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right: Actions (Search, 3D/2D, Leaderboard, Auth / Mobile Menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Instant Search Button (⌘K) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all group"
              title="Search Projects & Students (⌘K)"
            >
              <Search className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-white/5 rounded border border-white/10">
                ⌘K
              </kbd>
            </button>

            {/* 3D vs 2D View Switcher */}
            <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-black/40 border border-white/5 h-10 shadow-inner">
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
              className="flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-2.5 sm:px-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Leaderboard</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            </button>

            {/* Desktop Auth Button */}
            {user ? (
              <div className="hidden md:flex items-center gap-2 pl-2 border-l border-white/10">
                <div className="flex items-center gap-2 h-10 px-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-[10px]">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[90px] lg:max-w-[120px] truncate font-semibold text-white text-xs">
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
                    <LogOut className="w-3.5 h-3.5" />
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

            {/* Mobile Hamburger Menu Toggle (Mobile 5 Style) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. MOBILE 5 FULL-SCREEN ANIMATED MENU OVERLAY                  */}
      {/* ============================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="md:hidden fixed inset-0 z-[115] bg-[#050814]/96 backdrop-blur-2xl flex flex-col pt-20 pb-8 px-4 overflow-y-auto"
          >
            {/* Quick Mobile Search Trigger */}
            <div className="mb-5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-left text-sm text-slate-400"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-amber-400" />
                  <span>Search students or projects...</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  FIND
                </span>
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              <button
                onClick={() => {
                  setViewMode('3d');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs border transition-all ${
                  viewMode === '3d'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-slate-300 border-white/10'
                }`}
              >
                <Box className="w-4 h-4" />
                <span>3D Walkthrough</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('2d');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs border transition-all ${
                  viewMode === '2d'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-slate-300 border-white/10'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>2D Bento Directory</span>
              </button>
            </div>

            {/* Zone Navigation Title */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Exhibition Zones
              </span>
              <span className="text-[10px] font-mono text-amber-400">Tap to Fly</span>
            </div>

            {/* Zone Cards */}
            <div className="space-y-2 mb-6">
              {zones.map((zone) => {
                const isActive = activeZone === zone.id && viewMode === '3d';
                const Icon = zone.icon;
                return (
                  <button
                    key={zone.id}
                    onClick={() => handleZoneSelect(zone.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      isActive
                        ? 'bg-amber-500/15 border-amber-500/40 text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isActive
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{zone.label}</h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-400">
                            {zone.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{zone.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  </button>
                );
              })}
            </div>

            {/* Leaderboard & Voting Banner */}
            <div className="mt-auto pt-4 border-t border-white/10 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLeaderboardOpen(true);
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-300">Live Leaderboard</h4>
                    <p className="text-xs text-slate-400">View real-time rankings & vote counts</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-400" />
              </button>

              {/* User Account / Sign In */}
              {user ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await signOutFromFirebase();
                      } catch (e) {
                        console.warn(e);
                      } finally {
                        setUser(null);
                        setMobileMenuOpen(false);
                      }
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs font-mono shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In with Google to Vote</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
