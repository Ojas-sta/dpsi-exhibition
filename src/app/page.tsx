'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useThemeStore } from '@/store/useThemeStore';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Vote,
} from 'lucide-react';
import { SEED_PROJECTS } from '@/data/seedProjects';

// React Bits Components loaded dynamically for SSR safety
const GradientASCII = dynamic(() => import('@/components/reactbits/GradientASCII'), {
  ssr: false,
});

const TechText = dynamic(() => import('@/components/reactbits/TechText'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-[300px]">
      <span className="text-4xl md:text-6xl font-black tracking-widest text-[#2a75d3] font-mono">
        DPSI TECH EXPO
      </span>
    </div>
  ),
});

const BellToggle = dynamic(() => import('@/components/reactbits/BellToggle'), {
  ssr: false,
});

const TextLoop = dynamic(() => import('@/components/reactbits/TextLoop'), {
  ssr: false,
});

export default function LandingPage() {
  const [selectedZone, setSelectedZone] = useState<'all' | 'Physical' | 'Digital' | 'Business'>('all');
  const [selectedDay, setSelectedDay] = useState<'day1' | 'day2'>('day1');
  const [email, setEmail] = useState('');
  const [registered, setRegistered] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const isLight = theme === 'light';

  const filteredProjects = SEED_PROJECTS.filter((p) => {
    if (selectedZone === 'all') return true;
    return p.category === selectedZone;
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setRegistered(true);
      setTimeout(() => setRegistered(false), 5000);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#f0f6fc] font-sans selection:bg-[#2ea043] selection:text-black overflow-x-clip">
      {/* ─── GITHUB UNIVERSE TOP ANNOUNCEMENT TICKER ─── */}
      <div className="w-full bg-[#0d1117] border-b border-[#21262d] px-4 py-2 flex items-center justify-between text-[11px] font-mono text-[#8b949e]">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse" />
            <span className="text-[#f0f6fc] font-bold">ANNUAL TECH &amp; INNOVATION SUMMIT 2026</span>
            <span className="hidden sm:inline text-[#8b949e]">{'// NOVEMBER 14–15 • MAIN AUDITORIUM'}</span>
          </div>
          <Link
            href="/expo"
            className="flex items-center gap-1 text-[#58a6ff] hover:text-[#79c0ff] font-semibold hover:underline"
          >
            <span>Launch 3D Exhibition</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ─── GITHUB UNIVERSE GRID NAVBAR ─── */}
      <header className="sticky top-0 z-50 w-full bg-[#000000]/95 backdrop-blur-md border-b border-[#30363d]">
        <div className="max-w-7xl mx-auto flex items-stretch h-14">
          {/* Brand Cell */}
          <Link
            href="/"
            className="flex items-center gap-3 px-4 border-r border-[#30363d] hover:bg-[#161b22] transition-colors shrink-0"
          >
            <div className="h-8 px-2 py-0.5 rounded bg-white flex items-center justify-center">
              <img src="/dps_shield.png" alt="DPS Indirapuram" className="h-full w-auto object-contain" />
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-[12px] font-black tracking-tight text-white uppercase font-mono">
                DPSI EXPO &apos;26
              </span>
              <span className="text-[9px] font-mono text-[#8b949e] tracking-widest">
                INDIRAPURAM
              </span>
            </div>
          </Link>

          {/* Navigation Cells */}
          <nav className="hidden lg:flex items-stretch text-xs font-mono">
            <a
              href="#stage"
              className="flex items-center px-4 border-r border-[#30363d] text-[#c9d1d9] hover:text-white hover:bg-[#161b22] transition-colors"
            >
              {'[ 01 // STAGE ]'}
            </a>
            <a
              href="#projects"
              className="flex items-center px-4 border-r border-[#30363d] text-[#c9d1d9] hover:text-white hover:bg-[#161b22] transition-colors"
            >
              {'[ 02 // 35 INVENTIONS ]'}
            </a>
            <a
              href="#arenas"
              className="flex items-center px-4 border-r border-[#30363d] text-[#c9d1d9] hover:text-white hover:bg-[#161b22] transition-colors"
            >
              {'[ 03 // 3 ARENAS ]'}
            </a>
            <a
              href="#voting"
              className="flex items-center px-4 border-r border-[#30363d] text-[#c9d1d9] hover:text-white hover:bg-[#161b22] transition-colors"
            >
              {'[ 04 // ANTI-CHEAT BALLOT ]'}
            </a>
            <a
              href="#schedule"
              className="flex items-center px-4 border-r border-[#30363d] text-[#c9d1d9] hover:text-white hover:bg-[#161b22] transition-colors"
            >
              {'[ 05 // ITINERARY ]'}
            </a>
          </nav>

          {/* Right Action: Launch 3D Hall & Theme Toggle */}
          <div className="ml-auto flex items-stretch">
            <ThemeToggle variant="header" />
            <Link
              href="/expo"
              className="flex items-center gap-2 px-4 sm:px-5 bg-[#238636] hover:bg-[#2ea043] text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enter 3D Hall ↗</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── GITHUB UNIVERSE STYLE HERO SECTION ─── */}
      <section className="border-b border-[#30363d]">
        <div className="max-w-7xl mx-auto">
          {/* Giant UNIVERSE-Style Headline */}
          <div className="px-4 sm:px-8 pt-10 pb-6 border-b border-[#30363d]">
            <div className="flex items-center justify-between font-mono text-xs text-[#8b949e] mb-3">
              <span className="flex items-center gap-2 text-[#3fb950]">
                <span>november 14–15_2026{"}"}</span>
                <span className="inline-block w-2.5 h-2.5 bg-[#3fb950]" />
              </span>
              <span className="hidden sm:inline text-[#8b949e]">
                in-person &amp; 3d-hall % |35-booths
              </span>
            </div>

            {/* Massive Conference Title with Neon Block Accent */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-white uppercase font-sans leading-none">
                EXPO&apos;26<span className="inline-block w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#2ea043] ml-2 -mb-1 align-baseline" /><span className="inline-block w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#db61a2] -mb-1 align-baseline" />
              </h1>
            </div>
          </div>

          {/* Element 2: <TechText /> in exact previous format */}
          <div id="stage" className="border-b border-[#30363d] bg-[#050811]/40">
            <div className="px-4 py-2 border-b border-[#21262d] flex items-center justify-between text-[11px] font-mono text-[#8b949e]">
              <span>{'[ ELEMENT 02 ] :: INTERACTIVE PHYSICS WORDMARK'}</span>
              <span className="text-[#58a6ff]">CURSOR INTERACTION ENABLED</span>
            </div>
            <div style={{ width: '100%', height: '300px', position: 'relative' }}>
              <TechText
                text="DPSI TECH EXPO"
                color="#2a75d3"
                fontFamily='"Space Grotesk", sans-serif'
                fontSize={56}
                fontWeight={800}
                letterSpacing={0}
              />
            </div>
          </div>

          {/* GitHub Universe 2-Column Bento Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#30363d]">
            {/* Left Column: Terminal Slug & Categories */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-[#8b949e] uppercase tracking-widest block mb-2">
                  {'// THE SUMMIT ARCHITECTURE'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                  innovate-build-deploy/
                </h2>
                <p className="mt-4 text-sm text-[#8b949e] leading-relaxed font-mono">
                  35 student research teams across Physical Computing, Artificial Intelligence,
                  Sustainable Enterprise, and Combat Robotics.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 border border-[#21262d] bg-[#0d1117] rounded">
                  <span className="text-[#3fb950] font-bold block">[ 12 BOOTHS ]</span>
                  <span className="text-white mt-1 block">Physical Computing (P)</span>
                </div>
                <div className="p-3 border border-[#21262d] bg-[#0d1117] rounded">
                  <span className="text-[#58a6ff] font-bold block">[ 12 BOOTHS ]</span>
                  <span className="text-white mt-1 block">Digital &amp; AI Software (D)</span>
                </div>
                <div className="p-3 border border-[#21262d] bg-[#0d1117] rounded">
                  <span className="text-[#d2a8ff] font-bold block">[ 07 BOOTHS ]</span>
                  <span className="text-white mt-1 block">Business Ventures (B)</span>
                </div>
                <div className="p-3 border border-[#21262d] bg-[#0d1117] rounded">
                  <span className="text-[#f0883e] font-bold block">[ 04 HEATS ]</span>
                  <span className="text-white mt-1 block">Robotics Battle Arena</span>
                </div>
              </div>
            </div>

            {/* Right Column: Mission statement and Primary Action */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between bg-[#040711]/60">
              <div>
                <span className="text-xs font-mono text-[#8b949e] uppercase tracking-widest block mb-2">
                  {'// PURPOSE & INVITATION'}
                </span>
                <p className="text-base sm:text-lg text-[#c9d1d9] leading-relaxed font-sans">
                  From deep-learning soil fertility scanners to hardware ADAS driver assistance and
                  autonomous maze rovers, experience the next generation of engineers delivering live at
                  Delhi Public School Indirapuram.
                </p>
                <p className="mt-3 text-xs sm:text-sm text-[#8b949e] font-mono">
                  Inspect blueprints in 3D WebGL, evaluate technical schematics, and submit your verified
                  ballot through our multi-factor anti-cheat voting portal.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/expo"
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#238636] hover:bg-[#2ea043] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#238636]/20"
                >
                  <span>Launch 3D Hall Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#projects"
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <span>Browse 35 Projects [ ⌘K ]</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ELEMENT 5: <TextLoop /> IN EXACT PREVIOUS FORMAT ─── */}
      <section className="border-b border-[#30363d] bg-[#040711]">
        <div className="px-4 py-2 border-b border-[#21262d] flex items-center justify-between text-[11px] font-mono text-[#8b949e] max-w-7xl mx-auto">
          <span>{'[ ELEMENT 05 ] :: SVG CURVED LOOP RIBBON'}</span>
          <span className="text-[#a855f7]">LIVE STREAM MARQUEE</span>
        </div>
        <div className="py-2 overflow-hidden">
          <TextLoop
            text="DPSI TECH & INNOVATION EXPO 2026 ✦ 35 STUDENT INVENTIONS ✦ PHYSICAL PROTOTYPES ✦ AI & COMPUTER VISION ✦ BUSINESS SUSTAINABILITY ✦ COMBAT ROBOTICS ✦ ANTI-CHEAT COMMUNITY BALLOT"
            shape="wave"
            speed={90}
            direction="forward"
            separator="✦"
            curviness={90}
            tilt={0}
            fontSize={46}
            fontWeight={800}
            letterSpacing={2}
            uppercase
            ribbon
            ribbonColor="#5227FF"
            ribbonWidth={86}
            edgeFade={0}
            cross={false}
            crossAngle={16}
            draggable={false}
            scrollBoost={0}
            outline={false}
            pauseOnHover
          />
        </div>
      </section>

      {/* ─── ELEMENT 1: <GradientASCII /> SEAMLESS HORIZON (BAR REMOVED) ─── */}
      <section className="relative bg-[#000000] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div
            style={{
              width: '100%',
              height: '600px',
              position: 'relative',
              maskImage: 'linear-gradient(to bottom, black 0%, black 65%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 65%, transparent 100%)'
            }}
          >
            <GradientASCII
              colors={
                isLight
                  ? ['#1d4ed8', '#60a5fa', '#93c5fd', '#3b82f6']
                  : ['#1e3fd8', '#f6f8ff', '#a5d8ff', '#38bdf8']
              }
              shape="horizon"
              characters=" =+xX0S8#@"
              cellSize={18}
              density={0.8}
              softness={0.7}
              gradientOpacity={0.85}
              lightMode={isLight}
            />

            {/* Seamless Bottom Gradient dissolve into black or light surface */}
            <div
              className={`absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent pointer-events-none z-10 transition-colors duration-300 ${
                isLight ? 'via-slate-50/70 to-slate-50' : 'via-[#000000]/60 to-[#000000]'
              }`}
            />

            {/* GitHub Universe Terminal Overlay in Center */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
              <span
                className={`px-3 py-1 rounded font-mono text-xs mb-4 border transition-colors ${
                  isLight
                    ? 'bg-white/90 border-slate-300 text-blue-700 shadow-sm'
                    : 'bg-black/80 border-[#30363d] text-[#38bdf8]'
                }`}
              >
                {'STAGE_A // COMPUTATIONAL ASCII CANVAS'}
              </span>
              <h2
                className={`text-3xl sm:text-5xl font-black font-sans uppercase tracking-tight max-w-2xl drop-shadow-md transition-colors ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}
              >
                Where Young Visionaries Shape Tomorrow
              </h2>
              <p
                className={`mt-3 text-xs sm:text-sm font-mono max-w-lg transition-colors ${
                  isLight ? 'text-slate-800 font-semibold' : 'text-slate-300'
                }`}
              >
                Move your cursor to warp the ASCII matrix field. Real-time dual-pass fragment shader
                computing character density.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GITHUB UNIVERSE STYLE 35 INVENTIONS DIRECTORY (DIRECTLY UNDER ASCII HORIZON) ─── */}
      <section id="projects" className="border-b border-[#30363d] pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#30363d]">
            <div>
              <span className="text-xs font-mono text-[#3fb950] block mb-1">
                {'// COMPETING BOOTHS DIRECTORY'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-sans tracking-tight">
                All 35 Inventions
              </h2>
            </div>

            {/* Filter Cells */}
            <div className="flex items-center border border-[#30363d] bg-[#0d1117] rounded text-xs font-mono">
              {(['all', 'Physical', 'Digital', 'Business'] as const).map((z) => (
                <button
                  key={z}
                  onClick={() => setSelectedZone(z)}
                  className={`px-3 py-1.5 transition-colors ${
                    selectedZone === z
                      ? 'bg-[#238636] text-white font-bold'
                      : 'text-[#8b949e] hover:text-white'
                  }`}
                >
                  {z === 'all' ? 'All (35)' : z}
                </button>
              ))}
            </div>
          </div>

          {/* High-Density Session Cards Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:gap-4">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="p-5 border border-[#30363d] bg-[#0d1117] rounded-md hover:border-[#58a6ff] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs mb-2">
                    <span className="px-2 py-0.5 rounded bg-[#161b22] border border-[#30363d] text-[#f0883e] font-bold">
                      {p.booth_code}
                    </span>
                    <span className="text-[#3fb950] flex items-center gap-1">
                      <Vote className="w-3.5 h-3.5" />
                      <span>{p.vote_count} votes</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#58a6ff] transition-colors line-clamp-1">
                    {p.title.replace(/^.+•\s*/, '')}
                  </h3>
                  <p className="mt-2 text-xs text-[#8b949e] line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1 font-mono text-[10px]">
                    {p.tech_stack?.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-[#161b22] text-[#c9d1d9] border border-[#21262d]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#21262d] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8b949e] truncate max-w-[170px]">
                    {p.members?.join(', ')}
                  </span>
                  <Link
                    href="/expo"
                    className="flex items-center gap-1 text-[#58a6ff] hover:text-[#79c0ff] font-bold group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View in 3D</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/expo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-white font-mono text-xs font-bold uppercase transition-colors"
            >
              <span>Explore Full 3D Interactive Floor Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>


      {/* ─── THE THREE EXHIBITION ARENAS (GITHUB UNIVERSE BENTO) ─── */}
      <section id="arenas" className="border-b border-[#30363d] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="pb-6 border-b border-[#30363d]">
            <span className="text-xs font-mono text-[#3fb950] block mb-1">
              {'// PHYSICAL BLUEPRINT'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-sans tracking-tight">
              The Three Arenas
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:gap-6">
            {/* Arena 1 */}
            <div className="p-6 border border-[#30363d] bg-[#0d1117] rounded-md flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-[#161b22] border border-[#30363d] text-[#38bdf8] font-mono text-xs font-bold">
                  {'ZONE_01 // ST01-ST08'}
                </span>
                <h3 className="text-xl font-bold text-white mt-3 font-sans">
                  Show &amp; Tell Prototypes
                </h3>
                <p className="mt-2 text-xs text-[#8b949e] leading-relaxed font-mono">
                  Hands-on working prototypes, renewable energy micro-harvesters, clean water filtration,
                  and bio-materials engineered by junior innovators.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#21262d]">
                <Link
                  href="/expo"
                  className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#58a6ff] hover:underline"
                >
                  <span>Enter Zone 1 in 3D</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Arena 2 */}
            <div className="p-6 border border-[#30363d] bg-[#0d1117] rounded-md flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-[#161b22] border border-[#30363d] text-[#f0883e] font-mono text-xs font-bold">
                  {'ZONE_02 // P, D & B PODS'}
                </span>
                <h3 className="text-xl font-bold text-white mt-3 font-sans">
                  The Innovation Hub
                </h3>
                <p className="mt-2 text-xs text-[#8b949e] leading-relaxed font-mono">
                  The flagship hall housing Physical computing (P01-12), Digital AI algorithms (D01-12), and
                  sustainable Business enterprises (B01-07).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#21262d]">
                <Link
                  href="/expo"
                  className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#f0883e] hover:underline"
                >
                  <span>Enter Zone 2 in 3D</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Arena 3 */}
            <div className="p-6 border border-[#30363d] bg-[#0d1117] rounded-md flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-[#161b22] border border-[#30363d] text-[#db61a2] font-mono text-xs font-bold">
                  {'ZONE_03 // BATTLE PITS'}
                </span>
                <h3 className="text-xl font-bold text-white mt-3 font-sans">
                  Robotics Arena &amp; Drone Pit
                </h3>
                <p className="mt-2 text-xs text-[#8b949e] leading-relaxed font-mono">
                  Autonomous obstacle-navigating rovers, maze solvers, combat battle-bots, and drone telemetry
                  stations battling in live heats.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#21262d]">
                <Link
                  href="/expo"
                  className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#db61a2] hover:underline"
                >
                  <span>Enter Zone 3 in 3D</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GUARANTEED FAIR PLAY: ANTI-CHEAT VOTING ─── */}
      <section id="voting" className="border-b border-[#30363d] py-12 bg-[#040711]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-mono text-[#3fb950] block mb-1">
                {'// CRYPTOGRAPHIC INTEGRITY'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-sans tracking-tight">
                Anti-Cheat Verified Voting
              </h2>
              <p className="mt-3 text-sm text-[#8b949e] font-mono leading-relaxed">
                To safeguard the awards, our custom-engineered voting pipeline eliminates duplicate ballots
                and ballot-stuffing using hardware-accelerated device fingerprinting and Cloud Firestore
                atomic transactions.
              </p>

              <div className="mt-6 space-y-3 font-mono text-xs">
                <div className="p-3 border border-[#21262d] bg-[#0d1117] rounded flex items-center justify-between">
                  <span className="text-white">Multi-Factor Hardware Fingerprint</span>
                  <span className="text-[#3fb950] font-bold">[ ACTIVE ]</span>
                </div>
                <div className="p-3 border border-[#21262d] bg-[#0d1117] rounded flex items-center justify-between">
                  <span className="text-white">Weighted Ballots: Faculty (3x) • Community (1x)</span>
                  <span className="text-[#58a6ff] font-bold">[ VERIFIED ]</span>
                </div>
                <div className="p-3 border border-[#21262d] bg-[#0d1117] rounded flex items-center justify-between">
                  <span className="text-white">Live Leaderboard Real-Time Streaming</span>
                  <span className="text-[#d2a8ff] font-bold">[ SYNCED ]</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 border border-[#30363d] bg-[#0d1117] rounded-md font-mono">
              <span className="text-xs text-[#8b949e] block mb-3">{'// HOW TO CAST BALLOT'}</span>
              <ol className="space-y-3 text-xs text-[#c9d1d9]">
                <li className="flex items-start gap-2">
                  <span className="text-[#3fb950] font-bold">01.</span>
                  <span>Enter the 3D floor plan and select any booth.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3fb950] font-bold">02.</span>
                  <span>Review the pitch deck, schematics, and live demo video.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3fb950] font-bold">03.</span>
                  <span>Click &quot;Cast Vote&quot; (authenticated via Google OAuth).</span>
                </li>
              </ol>

              <Link
                href="/expo"
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold uppercase transition-colors"
              >
                <span>Go To Voting Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ELEMENT 3: <BellToggle /> IN VIP PASS & ALERTS ─── */}
      <section className="border-b border-[#30363d] py-14 bg-[#000000]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-xs font-mono text-[#3fb950] block mb-2">
            {'// ELEMENT 03 // REAL-TIME ALERTS'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase font-sans tracking-tight">
            Live Round Notifications &amp; Digital Pass
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#8b949e] font-mono">
            Toggle the notification bell below to enable audio chime alerts when round evaluations close.
          </p>

          {/* Element 3: <BellToggle /> in exact previous format */}
          <div className="flex justify-center my-6">
            <BellToggle
              offLabel="Notify me"
              onLabel="You'll be notified"
              color="#f5f5f5"
              background="#27272a"
              onColor="#18181b"
              onBackground="#f5f5f5"
              size="md"
              count={3}
              onChange={(active: boolean) => console.log('active: ', active)}
            />
          </div>

          <form onSubmit={handleRegister} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto font-mono text-xs">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="visitor@dpsi.in"
              required
              className="flex-1 px-4 py-3 bg-[#0d1117] border border-[#30363d] text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] rounded"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white font-bold uppercase transition-colors rounded"
            >
              Get Entry Pass
            </button>
          </form>

          {registered && (
            <p className="mt-3 text-xs font-mono text-[#3fb950]">
              ✓ Entry pass registered! You will receive live round alerts.
            </p>
          )}
        </div>
      </section>

      {/* ─── GITHUB UNIVERSE ITINERARY TABLE ─── */}
      <section id="schedule" className="py-12 border-b border-[#30363d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between pb-6 border-b border-[#30363d]">
            <div>
              <span className="text-xs font-mono text-[#3fb950] block mb-1">
                {'// CONFERENCE TIMETABLE'}
              </span>
              <h2 className="text-3xl font-black text-white uppercase font-sans tracking-tight">
                Two-Day Schedule
              </h2>
            </div>

            <div className="flex items-center border border-[#30363d] bg-[#0d1117] rounded text-xs font-mono">
              <button
                onClick={() => setSelectedDay('day1')}
                className={`px-3 py-1.5 transition-colors ${
                  selectedDay === 'day1' ? 'bg-[#238636] text-white font-bold' : 'text-[#8b949e]'
                }`}
              >
                Day 1 (Nov 14)
              </button>
              <button
                onClick={() => setSelectedDay('day2')}
                className={`px-3 py-1.5 transition-colors ${
                  selectedDay === 'day2' ? 'bg-[#238636] text-white font-bold' : 'text-[#8b949e]'
                }`}
              >
                Day 2 (Nov 15)
              </button>
            </div>
          </div>

          <div className="mt-6 divide-y divide-[#21262d] font-mono text-xs">
            {selectedDay === 'day1' ? (
              <>
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[#3fb950] font-bold w-28 shrink-0">09:00 - 10:30</span>
                  <span className="text-white font-bold flex-1">Student Booth Setup &amp; Electrical Safety Check</span>
                  <span className="text-[#8b949e]">Main Auditorium</span>
                </div>
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[#3fb950] font-bold w-28 shrink-0">10:30 - 11:30</span>
                  <span className="text-white font-bold flex-1">Opening Keynote: Next-Gen Autonomous AI</span>
                  <span className="text-[#8b949e]">Stage A</span>
                </div>
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[#3fb950] font-bold w-28 shrink-0">11:30 - 14:00</span>
                  <span className="text-white font-bold flex-1">Round 1: Faculty &amp; Jury Technical Scoring</span>
                  <span className="text-[#8b949e]">Zones 1 &amp; 2</span>
                </div>
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[#3fb950] font-bold w-28 shrink-0">14:30 - 16:30</span>
                  <span className="text-white font-bold flex-1">Robotics Combat &amp; Obstacle Course Qualifying Heats</span>
                  <span className="text-[#8b949e]">Zone 3 Battle Pit</span>
                </div>
              </>
            ) : (
              <>
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[#3fb950] font-bold w-28 shrink-0">09:30 - 12:30</span>
                  <span className="text-white font-bold flex-1">Public Exhibition &amp; Community Ballot Voting Opens</span>
                  <span className="text-[#8b949e]">Full Floor</span>
                </div>
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[#3fb950] font-bold w-28 shrink-0">13:00 - 14:30</span>
                  <span className="text-white font-bold flex-1">Student Shark Tank: Finalist Venture Pitches</span>
                  <span className="text-[#8b949e]">Main Stage</span>
                </div>
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[#3fb950] font-bold w-28 shrink-0">15:30</span>
                  <span className="text-[#f0883e] font-bold flex-1">Live Voting Closes • Final Firestore Tally</span>
                  <span className="text-[#8b949e]">Online Portal</span>
                </div>
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[#3fb950] font-bold w-28 shrink-0">16:00 - 17:00</span>
                  <span className="text-white font-bold flex-1">Grand Awards Ceremony &amp; Incubation Grants</span>
                  <span className="text-[#8b949e]">Auditorium</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── GITHUB UNIVERSE STYLE MINIMALIST FOOTER ─── */}
      <footer className="py-10 bg-[#000000] text-[#8b949e] font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-6 px-1.5 py-0.5 rounded bg-white flex items-center justify-center">
              <img src="/dps_shield.png" alt="DPS Indirapuram" className="h-full w-auto object-contain" />
            </div>
            <span>© 2026 Delhi Public School Indirapuram.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/expo" className="text-white hover:underline">
              [ 3D Floor Plan ]
            </Link>
            <a href="#projects" className="hover:text-white transition-colors">
              [ 35 Inventions ]
            </a>
            <a href="#voting" className="hover:text-white transition-colors">
              [ Fair-Play Voting ]
            </a>
            <a href="#schedule" className="hover:text-white transition-colors">
              [ Itinerary ]
            </a>
          </div>
        </div>

        {/* Small Bottom Credit */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-5 pt-4 border-t border-[#21262d] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#8b949e]">
          <span>Annual Technology &amp; Innovation Summit 2026</span>
          <span className="font-mono">Co-Engineered by Ojas Singh dpsi&apos;&apos;30</span>
        </div>
      </footer>
    </div>
  );
}
