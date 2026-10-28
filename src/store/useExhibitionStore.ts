import { create } from 'zustand';
import { Project, ZoneType, CategoryType, CameraViewConfig } from '@/types';
import { SEED_PROJECTS } from '@/data/seedProjects';

export const CAMERA_PRESETS: Record<'overview' | ZoneType, CameraViewConfig> = {
  overview: {
    position: [0, 52, 26],
    target: [0, 0, -6],
  },
  'zone-1': {
    position: [-36, 18, 4],
    target: [-36, 1.2, -6],
  },
  'zone-2': {
    position: [11, 26, 16],
    target: [11, 1.2, 1],
  },
  'zone-3': {
    position: [0, 26, -18],
    target: [0, 1.2, -36],
  },
};

export const MOBILE_CAMERA_PRESETS: Record<'overview' | ZoneType, CameraViewConfig> = {
  overview: {
    position: [0, 72, 38],
    target: [0, 0, -6],
  },
  'zone-1': {
    position: [-36, 26, 10],
    target: [-36, 1.2, -6],
  },
  'zone-2': {
    position: [11, 36, 26],
    target: [11, 1.2, 1],
  },
  'zone-3': {
    position: [0, 36, -16],
    target: [0, 1.2, -36],
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
  activeZone: 'overview' | ZoneType;
  selectedProject: Project | null;
  cameraConfig: CameraViewConfig;
  viewMode: '3d' | '2d';
  isLeaderboardOpen: boolean;
  isDrawerOpen: boolean;
  isAuthModalOpen: boolean;
  isSearchModalOpen: boolean;
  activeLeaderboardTab: CategoryType | 'All';

  // Projects & Live Data
  projects: Project[];
  votedProjectIds: string[];
  user: ExhibitionUser | null;
  deviceFingerprint: string | null;

  // Actions
  setIsMobile: (isMobile: boolean) => void;
  setActiveZone: (zone: 'overview' | ZoneType) => void;
  selectProject: (project: Project | null) => void;
  setViewMode: (mode: '3d' | '2d') => void;
  setLeaderboardOpen: (open: boolean) => void;
  setDrawerOpen: (open: boolean) => void;
  setAuthModalOpen: (open: boolean) => void;
  setSearchModalOpen: (open: boolean) => void;
  setActiveLeaderboardTab: (tab: CategoryType | 'All') => void;
  setDeviceFingerprint: (fingerprint: string) => void;
  setUser: (user: ExhibitionUser | null) => void;
  markProjectVoted: (projectId: string) => void;
  incrementProjectVote: (projectId: string) => void;
  setProjects: (projects: Project[]) => void;
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
  isSearchModalOpen: false,
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
    const config = presets[zone];
    set({
      activeZone: zone,
      cameraConfig: config,
      selectedProject: null,
      isDrawerOpen: false,
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
    // Offset camera slightly so the 3D booth is framed in the visible viewport without overlapping the drawer
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
    });
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  setLeaderboardOpen: (open) => set({ isLeaderboardOpen: open }),
  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
  setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  setSearchModalOpen: (open) => set({ isSearchModalOpen: open }),
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
      // Guaranteed failsafe: merge so all 35 blueprint booths are always rendered
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
}));
