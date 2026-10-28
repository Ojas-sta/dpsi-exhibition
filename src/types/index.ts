export type ZoneType = 'zone-1' | 'zone-2' | 'zone-3';

export type CategoryType =
  | 'Show & Tell'
  | 'Physical'
  | 'Digital'
  | 'Business'
  | 'Robo Race'
  | 'Robo Soccer';

export interface Project {
  id: string;
  title: string;
  zone: ZoneType;
  category: CategoryType;
  booth_code: string;
  booth_number: number;
  position_x: number;
  position_y: number;
  position_z: number;
  image_url: string;
  description: string;
  tagline?: string;
  members: string[];
  tech_stack?: string[];
  vote_count: number;
  created_at?: string;
}

export interface VotePayload {
  projectId: string;
  fingerprint: string;
  userId?: string;
  userEmail?: string;
}

export interface VoteResponse {
  success: boolean;
  message: string;
  newVoteCount?: number;
  alreadyVoted?: boolean;
}

export interface CameraViewConfig {
  position: [number, number, number];
  target: [number, number, number];
}
