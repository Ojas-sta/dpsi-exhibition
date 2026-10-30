import { create } from 'zustand';
import { Project, CategoryType, CameraViewConfig } from '@/types';
import { SEED_PROJECTS } from '@/data/seedProjects';

export type NavZoneId =
  | 'overview'
  | 'zone-1'
  | 'zone-2'
  | 'zone-3'
  | 'physical'
  | 'digital'
  | 'business';

export type ThemeMode = 'light' | 'dark';

export const CAMERA_PRESETS: Record<NavZoneId, CameraViewConfig> = {
  // Balanced isometric perspective capturing Show & Tell, Main Hall, and Robotics with clear depth
  overview: {
    position: [-12, 40, 44],
    target: [-12, 0.5, -12],
  },
  'zone-1': {
    // Show & Tell angled pavilion
    position: [-36, 18, 12],
    target: [-36, 1.0, -6],
  },
  'zone-2': {
    // Main Hall comprehensive view
    position: [-1, 24, 26],
    target: [-1, 1.0, 0],
  },
  'zone-3': {
    // Robotics arenas
    position: [-1, 22, -14],
    target: [-1, 1.0, -36],
  },
  physical: {
    // Physical Booths P01-P12
    position: [-10, 16, 6],
    target: [-10, 1.0, -8],
  },
  digital: {
    // Digital Booths D01-D12
    position: [0, 16, 6],
    target: [0, 1.0, 0],
  },
  business: {
    // Business Booths B01-B07
    position: [10, 16, 6],
    target: [10, 1.0, 0],
  },
};

export const MOBILE_CAMERA_PRESETS: Record<NavZoneId, CameraViewConfig> = {
  overview: {
    position: [-12, 54, 52],
    target: [-12, 0.5, -12],
  },
  'zone-1': {
    position: [-36, 26, 18],
    target: [-36, 1.0, -6],
  },
  'zone-2': {
    position: [-1, 32, 32],
    target: [-1, 1.0, 0],
  },
  'zone-3': {
    position: [-1, 30, -8],
    target: [-1, 1.0, -36],
  },
  physical: {
    position: [-10, 22, 10],
    target: [-10, 1.0, -8],
  },
  digital: {
    position: [0, 22, 10],
    target: [0, 1.0, 0],
  },
  business: {
    position: [10, 22, 10],
    target: [10, 1.0, 0],
  },
};

export interface ExhibitionUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface ExhibitionState {
  // Navigation & 3D view
  theme: ThemeMode;
  isMobile: boolean;
  activeZone: NavZoneId;
  selectedProject: Project | null;
  cameraConfig: CameraViewConfig;
  viewMode: '3d' | '2d';
  isLeaderboardOpen: boolean;
  isDrawerOpen: boolean;
  isAuthModalOpen: boolean;
  isSearchOpen: boolean;
  isSearchModalOpen: boolean;
  isMobileMenuOpen: boolean;
  activeLeaderboardTab: CategoryType | 'All';

  // Projects & Live Data
  projects: Project[];
  votedProjectIds: string[];
  user: ExhibitionUser | null;
  deviceFingerprint: string | null;

  // Actions
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setIsMobile: (isMobile: boolean) => void;
  setActiveZone: (zone: NavZoneId) => void;
  selectProject: (project: Project | null) => void;
  setViewMode: (mode: '3d' | '2d') => void;
  setLeaderboardOpen: (open: boolean) => void;
  setDrawerOpen: (open: boolean) => void;
  setAuthModalOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setSearchModalOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setActiveLeaderboardTab: (tab: CategoryType | 'All') => void;
  setDeviceFingerprint: (fingerprint: string) => void;
  setUser: (user: ExhibitionUser | null) => void;
  markProjectVoted: (projectId: string) => void;
  incrementProjectVote: (projectId: string) => void;
  setProjects: (projects: Project[]) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetToOverview: () => void;
}

export const useExhibitionStore = create<ExhibitionState>((set, get) => ({
  theme: 'light',
  isMobile: false,
  activeZone: 'overview',
  selectedProject: null,
  cameraConfig: CAMERA_PRESETS.overview,
  viewMode: '3d',
  isLeaderboardOpen: false,
  isDrawerOpen: false,
  isAuthModalOpen: false,
  isSearchOpen: false,
  isSearchModalOpen: false,
  isMobileMenuOpen: false,
  activeLeaderboardTab: 'All',

  projects: SEED_PROJECTS,
  votedProjectIds: [],
  user: null,
  deviceFingerprint: null,

  setIsMobile: (isMobile) => {
    set({ isMobile });
  },

  setActiveZone: (zone) => {
    const isMobile = get().isMobile;
    const presets = isMobile ? MOBILE_CAMERA_PRESETS : CAMERA_PRESETS;
    const config = presets[zone] || presets.overview;
    set({
      activeZone: zone,
      cameraConfig: config,
      selectedProject: null,
      isDrawerOpen: false,
      isMobileMenuOpen: false,
    });
  },

  selectProject: (project) => {
    if (!project) {
      set({
        selectedProject: null,
        isDrawerOpen: false,
      });
      return;
    }

    const isMobile = get().isMobile;
    // Offset camera slightly so the 3D booth is framed cleanly in the visible viewport
    const boothCamera: CameraViewConfig = {
      position: [
        project.position_x + (isMobile ? 0 : 1.3),
        project.position_y + (isMobile ? 5.2 : 3.4),
        project.position_z + (isMobile ? 8.5 : 6.2),
      ],
      target: [
        project.position_x + (isMobile ? 0 : 1.3),
        project.position_y + (isMobile ? 0.6 : 1.1),
        project.position_z,
      ],
    };

    set({
      selectedProject: project,
      activeZone: project.zone,
      cameraConfig: boothCamera,
      isDrawerOpen: true,
      isSearchOpen: false,
      isMobileMenuOpen: false,
    });
  },

  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('dpsi_expo_theme', theme);
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
      } catch (e) {
        console.warn('Storage error:', e);
      }
    }
    set({ theme });
  },

  toggleTheme: () => {
    const nextTheme: ThemeMode = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(nextTheme);
  },

  setViewMode: (mode) => set({ viewMode: mode, isMobileMenuOpen: false }),
  setLeaderboardOpen: (open) => set({ isLeaderboardOpen: open }),
  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
  setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open, isSearchModalOpen: open }),
  setSearchModalOpen: (open) => set({ isSearchOpen: open, isSearchModalOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setActiveLeaderboardTab: (tab) => set({ activeLeaderboardTab: tab }),
  setDeviceFingerprint: (fingerprint) => set({ deviceFingerprint: fingerprint }),
  setUser: (user) => set({ user }),

  markProjectVoted: (projectId) => {
    const current = get().votedProjectIds;
    if (!current.includes(projectId)) {
      set({ votedProjectIds: [...current, projectId] });
    }
  },

  incrementProjectVote: (projectId) => {
    const updated = get().projects.map((p) =>
      p.id === projectId ? { ...p, vote_count: p.vote_count + 1 } : p
    );
    const selected = get().selectedProject;
    set({
      projects: updated,
      selectedProject:
        selected && selected.id === projectId
          ? { ...selected, vote_count: selected.vote_count + 1 }
          : selected,
    });
  },

  setProjects: (incoming) => {
    if (!incoming || incoming.length === 0) return;
    if (incoming.length < SEED_PROJECTS.length) {
      const map = new Map(incoming.map((p) => [p.id.toLowerCase(), p]));
      const complete = SEED_PROJECTS.map((sp) => {
        const found = map.get(sp.id.toLowerCase());
        return found ? { ...sp, ...found } : sp;
      });
      set({ projects: complete });
      return;
    }
    set({ projects: incoming });
  },

  zoomIn: () => {
    const current = get().cameraConfig;
    const factor = 0.75;
    const newPos: [number, number, number] = [
      current.target[0] + (current.position[0] - current.target[0]) * factor,
      Math.max(5, current.target[1] + (current.position[1] - current.target[1]) * factor),
      current.target[2] + (current.position[2] - current.target[2]) * factor,
    ];
    set({ cameraConfig: { position: newPos, target: current.target } });
  },

  zoomOut: () => {
    const current = get().cameraConfig;
    const factor = 1.3;
    const newPos: [number, number, number] = [
      current.target[0] + (current.position[0] - current.target[0]) * factor,
      Math.min(180, current.target[1] + (current.position[1] - current.target[1]) * factor),
      current.target[2] + (current.position[2] - current.target[2]) * factor,
    ];
    set({ cameraConfig: { position: newPos, target: current.target } });
  },

  resetToOverview: () => {
    get().setActiveZone('overview');
  },
}));
