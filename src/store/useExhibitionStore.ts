import { create } from 'zustand';
import { Project, ZoneType, CategoryType, CameraViewConfig } from '@/types';
import { SEED_PROJECTS } from '@/data/seedProjects';

export type NavZoneId =
  | 'overview'
  | 'zone-1'
  | 'zone-2'
  | 'zone-3'
  | 'physical'
  | 'digital'
  | 'business';

export const CAMERA_PRESETS: Record<NavZoneId, CameraViewConfig> = {
  // Zoomed-out master view capturing full floor & cosmos
  overview: {
    position: [-10, 74, 56],
    target: [-10, 0, -14],
  },
  'zone-1': {
    // Show & Tell angled dual-row pavilion
    position: [-33, 20, 16],
    target: [-33, 1.2, 0],
  },
  'zone-2': {
    // Main Hall comprehensive view
    position: [0, 36, 26],
    target: [0, 1.2, -3],
  },
  'zone-3': {
    // Robotics arenas
    position: [-1, 32, -14],
    target: [-1, 1.2, -36],
  },
  physical: {
    // Physical Booths P01-P12 in Left Horseshoe Cluster
    position: [-10, 26, 16],
    target: [-10, 1.2, -3],
  },
  digital: {
    // Digital Booths D01-D12 central view
    position: [0, 26, 16],
    target: [0, 1.2, -3],
  },
  business: {
    // Business Booths B01-B07 in Right Horseshoe Cluster
    position: [10, 26, 16],
    target: [10, 1.2, -3],
  },
};

export const MOBILE_CAMERA_PRESETS: Record<NavZoneId, CameraViewConfig> = {
  overview: {
    position: [-10, 92, 70],
    target: [-10, 0, -14],
  },
  'zone-1': {
    position: [-33, 28, 20],
    target: [-33, 1.2, 0],
  },
  'zone-2': {
    position: [0, 46, 36],
    target: [0, 1.2, -3],
  },
  'zone-3': {
    position: [-1, 40, -10],
    target: [-1, 1.2, -36],
  },
  physical: {
    position: [-10, 34, 24],
    target: [-10, 1.2, -3],
  },
  digital: {
    position: [0, 34, 24],
    target: [0, 1.2, -3],
  },
  business: {
    position: [10, 34, 24],
    target: [10, 1.2, -3],
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
  isMobile: boolean;
  activeZone: NavZoneId;
  selectedProject: Project | null;
  cameraConfig: CameraViewConfig;
  viewMode: '3d' | '2d';
  isLeaderboardOpen: boolean;
  isDrawerOpen: boolean;
  isAuthModalOpen: boolean;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  activeLeaderboardTab: CategoryType | 'All';

  // Projects & Live Data
  projects: Project[];
  votedProjectIds: string[];
  user: ExhibitionUser | null;
  deviceFingerprint: string | null;

  // Actions
  setIsMobile: (isMobile: boolean) => void;
  setActiveZone: (zone: NavZoneId) => void;
  selectProject: (project: Project | null) => void;
  setViewMode: (mode: '3d' | '2d') => void;
  setLeaderboardOpen: (open: boolean) => void;
  setDrawerOpen: (open: boolean) => void;
  setAuthModalOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
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
  isMobile: false,
  activeZone: 'overview',
  selectedProject: null,
  cameraConfig: CAMERA_PRESETS.overview,
  viewMode: '3d',
  isLeaderboardOpen: false,
  isDrawerOpen: false,
  isAuthModalOpen: false,
  isSearchOpen: false,
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

  setViewMode: (mode) => set({ viewMode: mode, isMobileMenuOpen: false }),
  setLeaderboardOpen: (open) => set({ isLeaderboardOpen: open }),
  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
  setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
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
