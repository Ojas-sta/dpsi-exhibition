'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExhibitionStore } from '@/store/useExhibitionStore';
import { CategoryType } from '@/types';
import {
  X,
  Medal,
  ThumbsUp,
  ArrowRight,
  Flame,
} from 'lucide-react';

const FILTER_TABS: { label: string; value: CategoryType | 'All' }[] = [
  { label: 'All Projects', value: 'All' },
  { label: 'Physical (P01-P12)', value: 'Physical' },
  { label: 'Digital (D01-D12)', value: 'Digital' },
  { label: 'Business (B01-B07)', value: 'Business' },
  { label: 'Show & Tell', value: 'Show & Tell' },
  { label: 'Robo Race', value: 'Robo Race' },
  { label: 'Robo Soccer', value: 'Robo Soccer' },
];

export default function LiveLeaderboard() {
  const isLeaderboardOpen = useExhibitionStore((state) => state.isLeaderboardOpen);
  const setLeaderboardOpen = useExhibitionStore((state) => state.setLeaderboardOpen);
  const projects = useExhibitionStore((state) => state.projects);
  const selectProject = useExhibitionStore((state) => state.selectProject);
  const activeTab = useExhibitionStore((state) => state.activeLeaderboardTab);
  const setActiveTab = useExhibitionStore((state) => state.setActiveLeaderboardTab);

  const sortedProjects = useMemo(() => {
    const list =
      activeTab === 'All'
        ? [...projects]
        : projects.filter((p) => p.category === activeTab);

    return list.sort((a, b) => b.vote_count - a.vote_count);
  }, [projects, activeTab]);

  if (!isLeaderboardOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/50 dark:bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl bg-[#f8fafc]/98 dark:bg-[#090d16] border border-slate-300/80 dark:border-slate-800 shadow-2xl flex flex-col text-slate-800 dark:text-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200/90 dark:border-slate-800 bg-gradient-to-r from-amber-100/70 dark:from-amber-500/15 via-white/50 dark:via-[#0b101c] to-amber-100/50 dark:to-amber-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 px-2 sm:px-2.5 py-1 rounded-xl bg-white shadow-md flex items-center justify-center shrink-0 border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dps_shield.png"
                  alt="DPS Indirapuram Emblem"
                  className="h-full w-auto object-contain block sm:hidden"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dps_indirapuram_logo.png"
                  alt="DPS Indirapuram Logo"
                  className="h-full w-auto max-w-[140px] sm:max-w-[170px] object-contain hidden sm:block"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    Live Leaderboard
                  </h2>
                  <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                    REALTIME
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans">
                  DPS Indirapuram • Real-time verified standings across all aisles
                </p>
              </div>
            </div>

            <button
              onClick={() => setLeaderboardOpen(false)}
              aria-label="Close leaderboard"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300/80 text-slate-600 hover:text-slate-950 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="p-2 sm:p-3 bg-slate-100/80 dark:bg-slate-950/80 border-b border-slate-200/90 dark:border-slate-800 overflow-x-auto flex items-center gap-1.5">
            {FILTER_TABS.map((tab) => {
              const isSelected = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Project Rankings List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
            <AnimatePresence mode="popLayout">
              {sortedProjects.map((project, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;
                const medalColors =
                  rank === 1
                    ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-400/20 dark:bg-yellow-400/10 border-yellow-400/40 dark:border-yellow-400/30'
                    : rank === 2
                    ? 'text-slate-600 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-300/10 border-slate-300 dark:border-slate-300/30'
                    : rank === 3
                    ? 'text-amber-700 dark:text-amber-500 bg-amber-500/20 dark:bg-amber-500/10 border-amber-500/40 dark:border-amber-500/30'
                    : 'text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800';

                return (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isTop3
                        ? 'bg-amber-50/60 dark:bg-[#0f1422] border-amber-300/70 dark:border-slate-700/80 shadow-xs'
                        : 'bg-slate-50/80 dark:bg-[#0a0d16] border-slate-200/90 dark:border-slate-800/60 shadow-xs'
                    }`}
                  >
                    {/* Rank Badge & Project Info */}
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 border ${medalColors}`}
                      >
                        {rank === 1 ? (
                          <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
                        ) : rank === 2 ? (
                          <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-300" />
                        ) : rank === 3 ? (
                          <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 dark:text-amber-500" />
                        ) : (
                          <span className="font-mono">#{rank}</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-amber-700 dark:text-amber-300 border border-slate-300/80 dark:border-slate-700">
                            {project.booth_code}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {project.category}
                          </span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                          {project.title.split('•')[1]?.trim() || project.title}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400 truncate font-sans">
                          {project.members.join(', ')}
                        </p>
                      </div>
                    </div>

                    {/* Votes & Inspect */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                      <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <ThumbsUp className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                          {project.vote_count}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setLeaderboardOpen(false);
                          selectProject(project);
                        }}
                        className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/40 dark:border-amber-500/30 text-xs font-bold transition-all group font-mono"
                      >
                        <span className="hidden xs:inline">Inspect</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 dark:bg-[#07090e] border-t border-slate-200/90 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-4 sm:px-5 pb-safe">
            <span className="font-mono text-[11px]">{sortedProjects.length} Competing Projects</span>
            <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold text-[11px]">
              <Flame className="w-3.5 h-3.5" />
              <span>Verified Standings</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
