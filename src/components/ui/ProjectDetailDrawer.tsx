'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExhibitionStore } from '@/store/useExhibitionStore';
import { getDeviceFingerprint } from '@/lib/fingerprint';
import { castVoteInFirebase } from '@/lib/firebase';
import confetti from 'canvas-confetti';
import {
  X,
  ThumbsUp,
  ShieldCheck,
  AlertTriangle,
  Users,
  Code2,
  MapPin,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { CategoryType } from '@/types';

const CATEGORY_THEMES: Record<
  CategoryType,
  { badgeBg: string; badgeText: string; border: string; glow: string }
> = {
  Physical: {
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-300',
    border: 'border-amber-500/40',
    glow: 'from-amber-950/60 to-slate-900/40',
  },
  Digital: {
    badgeBg: 'bg-sky-500/15',
    badgeText: 'text-sky-300',
    border: 'border-sky-500/40',
    glow: 'from-sky-950/60 to-slate-900/40',
  },
  Business: {
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-300',
    border: 'border-emerald-500/40',
    glow: 'from-emerald-950/60 to-slate-900/40',
  },
  'Show & Tell': {
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-300',
    border: 'border-purple-500/40',
    glow: 'from-purple-950/60 to-slate-900/40',
  },
  'Robo Race': {
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-300',
    border: 'border-rose-500/40',
    glow: 'from-rose-950/60 to-slate-900/40',
  },
  'Robo Soccer': {
    badgeBg: 'bg-teal-500/15',
    badgeText: 'text-teal-300',
    border: 'border-teal-500/40',
    glow: 'from-teal-950/60 to-slate-900/40',
  },
};

export default function ProjectDetailDrawer() {
  const selectedProject = useExhibitionStore((state) => state.selectedProject);
  const isDrawerOpen = useExhibitionStore((state) => state.isDrawerOpen);
  const selectProject = useExhibitionStore((state) => state.selectProject);
  const votedProjectIds = useExhibitionStore((state) => state.votedProjectIds);
  const markProjectVoted = useExhibitionStore((state) => state.markProjectVoted);
  const incrementProjectVote = useExhibitionStore((state) => state.incrementProjectVote);
  const user = useExhibitionStore((state) => state.user);
  const setAuthModalOpen = useExhibitionStore((state) => state.setAuthModalOpen);
  const isMobile = useExhibitionStore((state) => state.isMobile);

  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [voteSuccessMessage, setVoteSuccessMessage] = useState<string | null>(null);

  if (!selectedProject) return null;

  const hasVoted = votedProjectIds.includes(selectedProject.id);
  const theme = CATEGORY_THEMES[selectedProject.category] || CATEGORY_THEMES['Digital'];

  const handleCastVote = async () => {
    setVoteError(null);
    setVoteSuccessMessage(null);

    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    if (hasVoted) return;

    setIsVoting(true);
    try {
      const fingerprint = await getDeviceFingerprint();

      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProject.id,
          fingerprint,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setVoteError(data.message || 'Vote verification failed.');
        if (data.alreadyVoted) {
          markProjectVoted(selectedProject.id);
        }
        return;
      }

      markProjectVoted(selectedProject.id);
      incrementProjectVote(selectedProject.id);
      setVoteSuccessMessage('Vote successfully verified and recorded!');

      // Synchronize vote to Firebase Cloud Firestore asynchronously
      castVoteInFirebase({
        projectId: selectedProject.id,
        fingerprint,
        userId: user.id,
        userEmail: user.email,
      }).catch((e) => console.warn('Firebase vote sync notice:', e));

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: isMobile ? 0.9 : 0.8, x: 0.5 },
        colors: ['#f59e0b', '#fbbf24', '#0284c7', '#10b981', '#f43f5e'],
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error during vote submission.';
      setVoteError(msg);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => selectProject(null)}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer / Mobile Bottom Sheet */}
          <motion.aside
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className={`fixed z-[9999] bg-[#090d16]/95 backdrop-blur-2xl border-slate-800 shadow-2xl flex flex-col text-slate-100 overflow-hidden ${
              isMobile
                ? 'bottom-0 inset-x-0 max-h-[90vh] rounded-t-3xl border-t'
                : 'top-0 right-0 h-full w-[460px] md:w-[480px] border-l'
            }`}
          >
            {/* Mobile Drag Pill */}
            {isMobile && (
              <div className="w-full pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 rounded-full bg-slate-700" />
              </div>
            )}

            {/* Header */}
            <div className={`p-4 border-b border-slate-800/80 bg-gradient-to-r ${theme.glow} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-amber-300">
                  Booth {selectedProject.booth_code}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${theme.badgeBg} ${theme.badgeText} border ${theme.border}`}
                >
                  {selectedProject.category}
                </span>
              </div>

              <button
                onClick={() => selectProject(null)}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-700/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5">
              {/* Project Title & Tagline */}
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  {selectedProject.title}
                </h2>
                {selectedProject.tagline && (
                  <p className="text-xs text-amber-400 font-semibold mt-1">
                    {selectedProject.tagline}
                  </p>
                )}
              </div>

              {/* Image */}
              <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedProject.image_url}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-85" />
                
                <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-slate-300 bg-slate-950/80 px-2 py-1 rounded-md border border-slate-800 backdrop-blur-md">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>
                    Floor Location: [{selectedProject.position_x}, {selectedProject.position_z}]
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Project Description
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 font-sans">
                  {selectedProject.description}
                </p>
              </div>

              {/* Tech Stack Chips */}
              {selectedProject.tech_stack && selectedProject.tech_stack.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tech Architecture</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tech_stack.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Team Members */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Student Exhibitors</span>
                </h3>
                <div className="grid grid-cols-1 gap-1.5">
                  {selectedProject.members.map((member, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/70 border border-slate-800"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center font-black text-xs text-slate-950 shadow-sm">
                        {member.charAt(0)}
                      </div>
                      <span className="text-xs font-semibold text-slate-200">
                        {member}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anti-Cheat Notice */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Verified Anti-Cheat Voting:</strong> Protected with hardware canvas fingerprinting and account validation to ensure 100% election fairness.
                </p>
              </div>

              {/* Error Alert */}
              {voteError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-start gap-2.5 text-xs text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Voting Blocked</p>
                    <p className="text-[11px] mt-0.5 text-rose-400/90">{voteError}</p>
                  </div>
                </div>
              )}

              {/* Success Alert */}
              {voteSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-start gap-2.5 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Vote Confirmed!</p>
                    <p className="text-[11px] mt-0.5 text-emerald-400/90">{voteSuccessMessage}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div className="p-4 border-t border-slate-800 bg-[#090d16] flex items-center justify-between gap-3 pb-safe">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Total Votes
                </span>
                <div className="flex items-center gap-1.5">
                  <ThumbsUp className={`w-4 h-4 ${hasVoted ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                  <span className="text-lg font-black text-white font-mono">
                    {selectedProject.vote_count}
                  </span>
                </div>
              </div>

              {hasVoted ? (
                <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Voted ✓</span>
                </div>
              ) : (
                <button
                  onClick={handleCastVote}
                  disabled={isVoting}
                  className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 transition-all font-mono"
                >
                  {isVoting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Hardware...</span>
                    </>
                  ) : !user ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign In to Vote</span>
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Cast Verified Vote</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
