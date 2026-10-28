import * as admin from 'firebase-admin';

export interface RawVotePayload {
  projectId?: unknown;
  fingerprint?: unknown;
  deviceFingerprint?: unknown;
  userId?: unknown;
  userEmail?: unknown;
}

export interface ValidatedVoteInput {
  projectId: string;
  deviceFingerprint: string;
  userId: string;
  userEmail: string | null;
}

export interface VoteSuccessResponse {
  success: true;
  message: string;
  newVoteCount: number;
}

export interface VoteAlreadyVotedResponse {
  success: false;
  alreadyVoted: true;
  message: string;
}

export interface VoteErrorResponse {
  success: false;
  message: string;
  alreadyVoted?: boolean;
}

export type VoteApiResponse =
  | VoteSuccessResponse
  | VoteAlreadyVotedResponse
  | VoteErrorResponse;

export interface StoredVoteDocument {
  projectId: string;
  userId: string;
  deviceFingerprint: string;
  ipHash: string;
  userEmail: string | null;
  createdAt: admin.firestore.FieldValue | admin.firestore.Timestamp;
}

export interface StoredUserVoteDocument {
  projectId: string;
  userId: string;
  createdAt: admin.firestore.FieldValue | admin.firestore.Timestamp;
}

export interface ProjectDocumentData {
  id?: string;
  title: string;
  zone: string;
  category: string;
  booth_code: string;
  booth_number: number;
  vote_count: number;
  [key: string]: unknown;
}
