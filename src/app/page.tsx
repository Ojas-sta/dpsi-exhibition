'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Trophy,
  Cpu,
  Layers,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  Flame,
  Radio,
  Eye,
  Vote,
  Sparkle,
} from 'lucide-react';

// Dynamic imports with ssr: false for canvas/shader components
const GradientASCII = dynamic(() => import('@/components/reactbits/GradientASCII'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#070b14]" />,
});

const TechText = dynamic(() => import('@/components/reactbits/TechText'), {
  ssr: false,
  loading: () => (
    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-wider text-white">
      DPSI TECH EXPO
    </h1>
  ),
});

const BellToggle = dynamic(() => import('@/components/reactbits/BellToggle'), {
  ssr: false,
});

const AeroShards = dynamic(() => import('@/components/reactbits/AeroShards'), {
  ssr: false,
});

const TextLoop = dynamic(() => import('@/components/reactbits/TextLoop'), {
  ssr: false,
});

export default function LandingPage() {
  const [bellOn, setBellOn] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [shardsError, setShardsError] = useState(false);
  const [activeTab, setActiveTab] = useState<'day1' | 'day2'>('day1');

  // Handle email subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setBellOn(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmailInput('');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden">
      {/* ─── STICKY HEADER ─── */}
      <header className="sticky top-0 z-50 w-full bg-[#070b14]/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & School Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 px-2.5 py-1 rounded-xl bg-white shadow-md flex items-center justify-center shrink-0 border border-slate-200 group-hover:scale-105 transition-transform">
              <img
                src="/dps_shield.png"
                alt="DPS Indirapuram"
                className="h-full w-auto object-contain block sm:hidden"
              />
              <img
                src="/dps_indirapuram_logo.png"
                alt="DPS Indirapuram"
                className="h-full w-auto max-w-[140px] sm:max-w-[175px] object-contain hidden sm:block"
              />
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                Annual Exhibition 2026
              </span>
              <span className="text-xs font-semibold text-slate-300">
                Tech & Innovation Summit
              </span>
            </div>
          </Link>

          {/* Quick Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#about" className="hover:text-amber-400 transition-colors">
              About Event
            </a>
            <a href="#zones" className="hover:text-amber-400 transition-colors">
              Exhibition Zones
            </a>
            <a href="#shards" className="hover:text-amber-400 transition-colors">
              Materials Lab
            </a>
            <a href="#voting" className="hover:text-amber-400 transition-colors">
              Live Voting
            </a>
            <a href="#schedule" className="hover:text-amber-400 transition-colors">
              Schedule
            </a>
          </nav>

          {/* Header Action: Bell Toggle & 3D Hall CTA */}
          <div className="flex items-center gap-3">
            {/* React Bits Element 3: BellToggle in Header */}
            <div className="scale-90 origin-right">
              <BellToggle
                pressed={bellOn}
                onChange={(active) => setBellOn(active)}
                count={bellOn ? 3 : 0}
              />
            </div>

            <Link
              href="/expo"
              className="relative group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
              <span>Enter 3D Hall</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION WITH GRADIENT ASCII & TECHTEXT ─── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 pt-12 pb-20 overflow-hidden border-b border-slate-800/60">
        {/* React Bits Element 1: <GradientASCII /> WebGL Background */}
        <div className="absolute inset-0 z-0 pointer-events-auto opacity-70">
          <GradientASCII
            colors={['#0f172a', '#1e3fd8', '#38bdf8', '#0ea5e9']}
            shape="horizon"
            characters=" =+xX0S8#@"
            cellSize={18}
            density={0.78}
            mouseInteraction={true}
            clickEffect="wave"
            flicker={0.15}
            glow={0.3}
            speed={0.8}
          />
        </div>

        {/* Ambient Dark Gradient Vignette for Readability */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-radial-gradient from-transparent via-[#070b14]/50 to-[#070b14]" />

        {/* Hero Content Layer */}
        <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center text-center mt-6">
          {/* Top Pill: Status */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
              DELHI PUBLIC SCHOOL INDIRAPURAM
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] font-mono text-slate-300">
              ANNUAL INNOVATION SUMMIT 2026
            </span>
          </div>

          {/* React Bits Element 2: <TechText /> Canvas Wordmark */}
          <div className="w-full max-w-3xl my-2 flex items-center justify-center">
            <TechText
              text="DPSI TECH EXPO"
              color="#38bdf8"
              fontFamily='"Space Grotesk", "Geist Sans", sans-serif'
              fontSize={56}
              fontWeight={900}
              letterSpacing={6}
              strokeWidth={2}
              labels={true}
              bounce={0.2}
              draggable={true}
              clickKick={true}
            />
          </div>

          {/* Event Subtitle */}
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Where visionaries, engineers, and young minds converge. Discover over{' '}
            <strong className="text-white font-semibold">24+ live student-engineered innovations</strong>{' '}
            spanning Artificial Intelligence, Autonomous Robotics, and Sustainable Clean Tech.
          </p>

          {/* Event Date & Location Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-medium text-slate-300">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>November 14-15, 2026 • 09:00 AM IST</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Main Auditorium & Robotics Wing, DPS Indirapuram</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Live Anti-Cheat Voting Portal</span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <Link
              href="/expo"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch 3D Virtual Hall</span>
            </Link>

            <a
              href="#zones"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-sm shadow-lg hover:border-slate-700 transition-all"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Explore 3 Zones</span>
            </a>
          </div>

          {/* Real-time stats strip */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl pt-6 border-t border-slate-800/80">
            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">24+</span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Student Projects
              </span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">3</span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Major Arenas
              </span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100%</span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Fair-Play Voting
              </span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">2,500+</span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Expected Visitors
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-slate-500 animate-bounce">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Scroll Down</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ─── REACT BITS ELEMENT 5: <TextLoop /> MARQUEE RIBBON ─── */}
      <section className="relative w-full py-6 bg-slate-950/90 border-y border-slate-800 overflow-hidden">
        <TextLoop
          text="DPSI TECH EXPO ✦ INNOVATION HUB ✦ ROBOTICS ARENA ✦ SUSTAINABLE CLEAN ENERGY ✦ PHYSICAL PROTOTYPES ✦ DIGITAL AI ✦ LIVE ANTI-CHEAT VOTING"
          shape="wave"
          speed={80}
          direction="forward"
          separator="✦"
          curviness={55}
          fontSize={38}
          fontWeight={900}
          letterSpacing={3}
          uppercase={true}
          ribbon={true}
          ribbonColor="#1e3fd8"
          ribbonWidth={70}
          cross={true}
          crossAngle={14}
          edgeFade={0.5}
          pauseOnHover={true}
        />
      </section>

      {/* ─── ABOUT THE EXHIBITION ─── */}
      <section id="about" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold mb-4">
              <Sparkle className="w-3.5 h-3.5" />
              <span>THE VISION & THE MISSION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Fostering Next-Gen Innovators at DPS Indirapuram
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              The DPSI Tech & Innovation Exhibition is the school’s flagship showcase celebrating
              student ingenuity across STEM disciplines. From computer vision systems developed by senior
              scholars to working hydraulic and pneumatic models by middle school innovators, every booth
              tackles authentic real-world challenges.
            </p>
            <p className="mt-3 text-slate-400 leading-relaxed text-sm">
              Visitors can interact directly with project teams, test working prototypes, and participate in
              live voting powered by our secure anti-tamper voting engine.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="text-sm font-bold text-white">Authentic Student Inventions</h4>
                <p className="text-xs text-slate-400 mt-1">
                  100% student conceived, designed, coded, and built under faculty mentorship.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <Trophy className="w-5 h-5 text-amber-400 mb-2" />
                <h4 className="text-sm font-bold text-white">Jury & Visitor Voting</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluated by distinguished industry judges and visitor ballots.
                </p>
              </div>
            </div>
          </div>

          {/* Exhibition Highlights Feature Box */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1324] to-[#080d19] border border-slate-800/90 shadow-2xl">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Exhibition Highlights</h3>
                  <p className="text-xs text-slate-400">2-Day Grand Showcase Schedule</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Open to Public
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">
                  01
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Interactive 3D Virtual Floor Plan</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Navigate the auditorium in WebGL 3D, inspect booths, and review project documentation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">
                  02
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Robotics Combat & Obstacle Course</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Live heats in the custom arena featuring autonomous rovers and remote combat machines.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">
                  03
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Live Cryptographic Anti-Cheat Voting</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    One vote per visitor verified with canvas device fingerprinting and Firebase state.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Ready to explore?</span>
              <Link
                href="/expo"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>Launch Floor Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THREE MAJOR EXHIBITION ZONES ─── */}
      <section id="zones" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>EXHIBITION FLOOR LAYOUT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore the Three Main Exhibition Arenas
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Each zone is curated to give students a professional platform to showcase their research,
            code, and physical assemblies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Zone 1: Show & Tell */}
          <div className="group relative rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold">
                  ZONE 1
                </span>
                <span className="text-xs font-mono text-slate-500">Booths ST01 - ST08</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                Show & Tell Prototype Wing
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Dedicated to hands-on experimental demonstrations, renewable energy harvesters,
                sustainable water purification, and bio-assistive models crafted by budding scientists.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Renewable Clean Energy Micro-Generators</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Smart Agri-tech & Soil Sensor Systems</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Bio-degradable Plastic Alternatives</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800">
              <Link
                href="/expo"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 text-xs font-bold text-cyan-300 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Zone 1 in 3D</span>
              </Link>
            </div>
          </div>

          {/* Zone 2: Innovation Hub */}
          <div className="group relative rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-mono text-xs font-bold">
                  ZONE 2
                </span>
                <span className="text-xs font-mono text-slate-500">P, D & B Pods</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                The Innovation Hub
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                The centerpiece hall featuring Physical computing (P), Digital software & AI models (D),
                and Business sustainability startup models (B) solving community problems.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Physical: IoT Edge Devices & Assistive Wearables</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Digital: AI Medical Diagnostics & Computer Vision</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Business: Circular Economy Ventures & FinTech</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800">
              <Link
                href="/expo"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800/80 hover:bg-amber-500/20 text-xs font-bold text-amber-300 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Zone 2 in 3D</span>
              </Link>
            </div>
          </div>

          {/* Zone 3: Robotics Arena */}
          <div className="group relative rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-400 font-mono text-xs font-bold">
                  ZONE 3
                </span>
                <span className="text-xs font-mono text-slate-500">Arena & Pits</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                Robotics Arena & Drone Pit
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                High-octane action featuring autonomous obstacle-navigating rovers, maze-solvers,
                and mechanical fighting robots battling for supremacy on the battle grid.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Autonomous LiDAR & Ultrasound Rovers</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>High-Torque Combat Battle-Bots</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Micro-Drone Precision Flight Circuit</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800">
              <Link
                href="/expo"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800/80 hover:bg-purple-500/20 text-xs font-bold text-purple-300 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Zone 3 in 3D</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── REACT BITS ELEMENT 4: <AeroShards /> INTERACTIVE MATERIALS LAB ─── */}
      <section id="shards" className="py-20 px-4 sm:px-6 bg-[#060911] border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INTERACTIVE LAB EXPERIENCE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Future Materials & Spatial Simulation
              </h2>
              <p className="mt-2 text-slate-400 text-sm max-w-xl">
                Experience simulated refractive crystalline ribbons. Move your cursor to part the shards,
                click to trigger sonic light ripples, and press-and-hold to gather the field.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>Interactive: Hover • Click • Hold</span>
            </div>
          </div>

          {/* Interactive AeroShards Canvas with graceful fallback */}
          <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl">
            {!shardsError ? (
              <AeroShards
                shardColor="#6366f1"
                accentColor="#a855f7"
                placement="full"
                material="glass"
                markers="plus"
                count={900}
                depthOfField={0.65}
                vignette={0.4}
                mouseInteraction={true}
                pulseOnClick={true}
                holdToGather={true}
                style={{ width: '100%', height: '100%' }}
                onError={() => setShardsError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-950">
                <Cpu className="w-12 h-12 text-purple-400 mb-3 animate-pulse" />
                <h3 className="text-lg font-bold text-white">Spatial Shards Simulation</h3>
                <p className="text-xs text-slate-400 max-w-md mt-1">
                  WebGL/WebGPU acceleration initialized. Experience the 3D exhibition booths in full interactive mode below.
                </p>
              </div>
            )}

            {/* Overlay Caption on Bottom Left */}
            <div className="absolute bottom-6 left-6 z-20 pointer-events-none bg-slate-950/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-800 text-xs text-slate-300">
              <p className="font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Materials Physics & Aerodynamics Pavilion</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Simulating molecular lattice structures developed by Class 11-12 Physics & Chemistry Scholars.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIVE ANTI-CHEAT VOTING FAIR PLAY ─── */}
      <section id="voting" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GUARANTEED FAIR PLAY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Anti-Cheat, Real-Time Community Voting
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Every vote matters. To ensure that the best projects win honestly, our custom-engineered
              voting infrastructure combines client-side browser fingerprinting with Cloud Firestore
              atomic transactions.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Browser Fingerprinting</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Combines WebGL GPU renderer, screen depth, and audio contexts to prevent ballot-stuffing
                    across incognito or duplicate windows.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Weighted Stakeholder System</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Verified teachers and visiting judges carry a 3x weighted ballot while general students
                    and visitors contribute a 1x community vote.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Live Leaderboard Synchronization</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Votes are streamed in real time to the live leaderboard in the virtual hall without
                    requiring page reloads.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Voting Interactive Mockup Card */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl" />
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Vote className="w-4 h-4 text-emerald-400" />
              <span>How To Cast Your Vote</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Follow these simple steps when attending in-person or viewing online:
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span className="text-xs text-slate-300">
                  Enter the <strong className="text-white">3D Virtual Floor Plan</strong> or tap a booth.
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span className="text-xs text-slate-300">
                  Review the project’s pitch, abstract, photo gallery, and demo video.
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span className="text-xs text-slate-300">
                  Sign in with Google and click <strong className="text-amber-400">Cast Vote</strong>.
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-mono text-slate-400">Ready to cast your ballot?</span>
                <span className="text-xs font-bold text-white">Voting is Open Now</span>
              </div>
              <Link
                href="/expo"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Launch Voting</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EVENT SCHEDULE & TIMELINE ─── */}
      <section id="schedule" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>EXHIBITION ITINERARY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Event Schedule & Programme
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Join us across two power-packed days of presentations, jury evaluations, and demonstrations.
          </p>

          {/* Day 1 vs Day 2 Tabs */}
          <div className="mt-6 inline-flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('day1')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'day1'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Day 1: Fri, Nov 14 (Jury & Heats)
            </button>
            <button
              onClick={() => setActiveTab('day2')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'day2'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Day 2: Sat, Nov 15 (Public & Awards)
            </button>
          </div>
        </div>

        {/* Schedule Timeline Content */}
        <div className="max-w-3xl mx-auto space-y-4">
          {activeTab === 'day1' ? (
            <>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-mono text-xs font-bold shrink-0">
                  09:00 AM
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Delegates Registration & Booth Setup</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Participating student teams arrive at the main auditorium and test electronics and sensors.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-mono text-xs font-bold shrink-0">
                  10:30 AM
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Grand Inauguration & Keynote Address</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Welcome address by Principal and Chief Guest from Indian Institute of Technology (IIT).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-mono text-xs font-bold shrink-0">
                  11:45 AM
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Round 1: Technical Jury Evaluation</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Judges inspect codebases, circuit schematics, patentability, and scientific method.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-mono text-xs font-bold shrink-0">
                  02:30 PM
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Robotics Arena Qualifying Rounds</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Timed obstacle trials and line follower robot heats in Zone 3.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-mono text-xs font-bold shrink-0">
                  09:30 AM
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Public Exhibition & Community Voting Opens</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Doors open for parents, visiting schools, and tech enthusiasts. Live voting goes live.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-mono text-xs font-bold shrink-0">
                  01:00 PM
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Innovation Shark Tank: Finalist Pitches</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Top 6 student teams pitch their business plans and prototypes on the auditorium stage.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-mono text-xs font-bold shrink-0">
                  03:30 PM
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Ballots Close & Score Compilation</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Online and physical voting portals lock. Jury tallies final rankings.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-mono text-xs font-bold shrink-0">
                  04:15 PM
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Grand Awards & Felicitation Ceremony</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Distribution of trophies, merit certificates, and incubation funding grants.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ─── NOTIFICATIONS & VIP PASS SIGNUP WITH BELL TOGGLE ─── */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#070b14] via-[#0b1222] to-[#070b14] border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <BellToggle
              pressed={bellOn}
              onChange={(active) => setBellOn(active)}
              count={bellOn ? 5 : 0}
            />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Stay Updated on Live Results & Round Alerts
          </h2>
          <p className="mt-3 text-slate-400 text-sm max-w-lg mx-auto">
            Toggle the notification bell above to receive real-time alerts when round winners are announced,
            or sign up for your digital event pass below.
          </p>

          <form onSubmit={handleSubscribe} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all shrink-0"
            >
              Get Free Pass
            </button>
          </form>

          {subscribed && (
            <p className="mt-4 text-xs font-mono text-emerald-400 animate-fade-in">
              ✓ You are subscribed! We will notify you with the digital event pass and round alerts.
            </p>
          )}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-4 sm:px-6 border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 px-2 py-1 rounded-lg bg-white flex items-center justify-center">
              <img src="/dps_shield.png" alt="DPS Indirapuram" className="h-full w-auto object-contain" />
            </div>
            <div>
              <p className="font-bold text-white">Delhi Public School Indirapuram</p>
              <p className="text-[11px] text-slate-500">
                Ahinsa Khand-II, Indirapuram, Ghaziabad, Uttar Pradesh 201014
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <Link href="/expo" className="hover:text-amber-400 transition-colors">
              3D Floor Plan
            </Link>
            <a href="#about" className="hover:text-amber-400 transition-colors">
              About Summit
            </a>
            <a href="#zones" className="hover:text-amber-400 transition-colors">
              Exhibition Zones
            </a>
            <a href="#voting" className="hover:text-amber-400 transition-colors">
              Fair-Play Voting Rules
            </a>
          </div>

          <div className="text-slate-500 text-center md:text-right">
            <p>© 2026 Delhi Public School Indirapuram.</p>
            <p className="text-[10px] mt-0.5">Designed with React Bits Components.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
