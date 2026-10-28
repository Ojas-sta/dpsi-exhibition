'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExhibitionStore } from '@/store/useExhibitionStore';
import { CategoryType, Project } from '@/types';
import {
  Search,
  X,
  MapPin,
  Users,
  ArrowRight,
  Sparkles,
  Command,
  ThumbsUp,
} from 'lucide-react';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Physical: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  Digital: { bg: 'bg-sky-500/15', text: 'text-sky-300', border: 'border-sky-500/30' },
  Business: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  'Show & Tell': { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
  'Robo Race': { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30' },
  'Robo Soccer': { bg: 'bg-teal-500/15', text: 'text-teal-300', border: 'border-teal-500/30' },
};

const FILTER_PILLS: { label: string; value: CategoryType | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Physical (P)', value: 'Physical' },
  { label: 'Digital (D)', value: 'Digital' },
  { label: 'Business (B)', value: 'Business' },
  { label: 'Show & Tell', value: 'Show & Tell' },
  { label: 'Robo Race', value: 'Robo Race' },
  { label: 'Robo Soccer', value: 'Robo Soccer' },
];

export default function SearchModal() {
  const isSearchModalOpen = useExhibitionStore((state) => state.isSearchModalOpen);
  const setSearchModalOpen = useExhibitionStore((state) => state.setSearchModalOpen);
  const projects = useExhibitionStore((state) => state.projects);
  const selectProject = useExhibitionStore((state) => state.selectProject);
  const votedProjectIds = useExhibitionStore((state) => state.votedProjectIds);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSearchModalOpen(false);
  }, [setSearchModalOpen]);

  // Focus input automatically on open
  useEffect(() => {
    if (isSearchModalOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchModalOpen]);

  // Global keyboard shortcut listener: Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(!isSearchModalOpen);
      } else if (e.key === 'Escape' && isSearchModalOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setSearchModalOpen, handleClose]);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        project.title.toLowerCase().includes(q) ||
        project.booth_code.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.members.some((m) => m.toLowerCase().includes(q)) ||
        (project.tech_stack && project.tech_stack.some((t) => t.toLowerCase().includes(q))) ||
        project.category.toLowerCase().includes(q)
      );
    });
  }, [projects, searchQuery, selectedCategory]);

  const handleSelectProject = (project: Project) => {
    handleClose();
    selectProject(project);
  };

  if (!isSearchModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-start justify-center p-3 sm:p-6 md:p-10 pt-16 sm:pt-20 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -16 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-[#090e1a] border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/90 flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Header & Search Bar */}
          <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-900/60 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Search className="w-4 h-4 text-amber-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, booth codes (e.g. P01), students..."
                className="w-full bg-transparent text-sm sm:text-base font-medium text-white placeholder-slate-400 outline-none"
              />
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-[10px] font-mono text-slate-400 shrink-0">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {FILTER_PILLS.map((pill) => {
                const isActive = selectedCategory === pill.value;
                return (
                  <button
                    key={pill.value}
                    onClick={() => setSelectedCategory(pill.value)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1.5 divide-y divide-slate-800/40">
            {filteredProjects.length === 0 ? (
              <div className="py-12 px-4 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">No exhibition projects found</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try searching for another booth code, student name, or category filter.
                </p>
              </div>
            ) : (
              filteredProjects.map((project) => {
                const colors = CATEGORY_COLORS[project.category] || CATEGORY_COLORS['Digital'];
                const hasVoted = votedProjectIds.includes(project.id);

                return (
                  <div
                    key={project.id}
                    onClick={() => handleSelectProject(project)}
                    className="group relative flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700 cursor-pointer transition-all pt-2.5"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Booth Badge */}
                      <div
                        className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-mono font-black shrink-0 border ${colors.bg} ${colors.text} ${colors.border}`}
                      >
                        <span className="text-[12px]">{project.booth_code}</span>
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                            {project.title}
                          </h4>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
                          >
                            {project.category}
                          </span>
                          {hasVoted && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                              <ThumbsUp className="w-2.5 h-2.5" /> Voted
                            </span>
                          )}
                        </div>

                        {/* Members */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Users className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{project.members.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Action: Zone & Fly-To */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1 justify-end">
                          <MapPin className="w-2.5 h-2.5" />
                          {project.zone.replace('-', ' ')}
                        </span>
                        <span className="text-xs font-mono font-semibold text-amber-400">
                          {project.vote_count} votes
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center text-slate-400 transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Stats & Hints */}
          <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong className="text-white">{filteredProjects.length}</strong> of{' '}
              {projects.length} exhibition projects
            </span>
            <span className="hidden sm:inline font-mono text-[11px] text-slate-500">
              Click to jump to 3D booth • [ESC] to exit
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
