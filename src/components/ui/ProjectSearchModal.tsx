'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExhibitionStore } from '@/store/useExhibitionStore';
import { Project, CategoryType } from '@/types';
import {
  Search,
  X,
  Sparkles,
  MapPin,
  Users,
  ArrowRight,
  Cpu,
  Globe,
  Briefcase,
  Bot,
  Lightbulb,
} from 'lucide-react';

const CATEGORY_COLORS: Record<CategoryType, { bg: string; text: string; border: string }> = {
  Physical: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  Digital: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  Business: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  'Robo Race': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  'Robo Soccer': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  'Show & Tell': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' },
};

function getCategoryIcon(category: CategoryType) {
  switch (category) {
    case 'Physical':
      return Cpu;
    case 'Digital':
      return Globe;
    case 'Business':
      return Briefcase;
    case 'Robo Race':
    case 'Robo Soccer':
      return Bot;
    case 'Show & Tell':
      return Lightbulb;
    default:
      return Sparkles;
  }
}

export default function ProjectSearchModal() {
  const isSearchOpen = useExhibitionStore((state) => state.isSearchOpen);
  const setSearchOpen = useExhibitionStore((state) => state.setSearchOpen);
  const projects = useExhibitionStore((state) => state.projects);
  const selectProject = useExhibitionStore((state) => state.selectProject);
  const setViewMode = useExhibitionStore((state) => state.setViewMode);

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedCategory('All');
    }
  }, [isSearchOpen]);

  // Global ⌘K / Ctrl+K and Escape keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  // Filter projects based on query and category
  const filteredProjects = useMemo(() => {
    const q = query.toLowerCase().trim();
    return projects.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      const titleMatch = p.title.toLowerCase().includes(q);
      const codeMatch = p.booth_code.toLowerCase().includes(q);
      const descMatch = p.description.toLowerCase().includes(q);
      const memberMatch = p.members?.some((m) =>
        m.toLowerCase().includes(q)
      );

      return titleMatch || codeMatch || descMatch || memberMatch;
    });
  }, [projects, query, selectedCategory]);

  const handleSelectProject = (project: Project) => {
    setViewMode('3d');
    selectProject(project);
    setSearchOpen(false);
  };

  const categories: (CategoryType | 'All')[] = [
    'All',
    'Physical',
    'Digital',
    'Business',
    'Show & Tell',
    'Robo Soccer',
    'Robo Race',
  ];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4 pointer-events-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Search Palette Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-[#0b101d]/95 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[82vh]"
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/50">
              <Search className="w-5 h-5 text-amber-400 shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by student name, project title, or booth (e.g. Aarav, P04, D08)..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
              />
              {query ? (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
                ESC
              </kbd>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto no-scrollbar border-b border-slate-800/80 bg-slate-950/40">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Results List */}
            <div className="overflow-y-auto p-2 sm:p-3 divide-y divide-slate-800/50 flex-1">
              {filteredProjects.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500 mb-3">
                    <Search className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-300">No matching projects found</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try searching for student names, booth numbers (P01-P12, D01-D12, B01-B07), or categories.
                  </p>
                </div>
              ) : (
                filteredProjects.map((project) => {
                  const CategoryIcon = getCategoryIcon(project.category);
                  const colors = CATEGORY_COLORS[project.category] || CATEGORY_COLORS.Physical;

                  return (
                    <button
                      key={project.id}
                      onClick={() => handleSelectProject(project)}
                      className="group w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/70 text-left transition-all"
                    >
                      <div className="flex items-start gap-3 min-w-0 pr-2">
                        {/* Booth Code Badge */}
                        <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700 flex flex-col items-center justify-center shrink-0 group-hover:border-amber-500/50 group-hover:bg-amber-500/10 transition-colors">
                          <span className="text-[10px] font-mono text-slate-400 group-hover:text-amber-400">
                            BOOTH
                          </span>
                          <span className="text-xs font-mono font-black text-white group-hover:text-amber-300">
                            {project.booth_code}
                          </span>
                        </div>

                        {/* Project Details */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white group-hover:text-amber-300 truncate">
                              {project.title}
                            </h4>
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
                            >
                              <CategoryIcon className="w-3 h-3" />
                              <span>{project.category}</span>
                            </span>
                          </div>

                          {/* Student Names & Class */}
                          {project.members && project.members.length > 0 && (
                            <p className="text-xs text-slate-400 truncate mt-1 flex items-center gap-1.5 font-sans">
                              <Users className="w-3 h-3 text-slate-500 shrink-0" />
                              <span>
                                {project.members.join(', ')}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Arrow & Jump to Booth */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400/80 group-hover:text-amber-300">
                          Fly to Booth <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                        <div className="sm:hidden p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-amber-300">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Bottom Footer Tip */}
            <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>35 Student Booths Across 3 Zones</span>
              </span>
              <span>Showing {filteredProjects.length} results</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
