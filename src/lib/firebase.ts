import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  writeBatch,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInAnonymously,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { Project } from '@/types';
import { SEED_PROJECTS } from '@/data/seedProjects';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'smarthome-88486',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Initialize Firebase singleton
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sign in using Google OAuth
 */
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * Sign in as a verified guest/judge visitor
 */
export async function signInAsGuest(name: string, email: string) {
  const userCredential = await signInAnonymously(auth);
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName: name,
    });
  }
  return {
    uid: userCredential.user.uid,
    displayName: name,
    email: email || `${name.toLowerCase().replace(/\s+/g, '')}@dpsi-visitor.in`,
  };
}

/**
 * Sign out
 */
export async function signOutFromFirebase() {
  await signOut(auth);
}

/**
 * Listen for auth state changes
 */
export function onFirebaseAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Real-time subscription to all exhibition projects from Cloud Firestore.
 * Always guarantees ALL 35 blueprint projects are returned and rendered,
 * hydrated with live votes and updates from Firestore.
 */
export function subscribeToProjects(onUpdate: (projects: Project[]) => void) {
  const projectsCol = collection(db, 'projects');
  const q = query(projectsCol);

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        // If Firestore collection is empty, render canonical seed list without unauthorized writes
        onUpdate(SEED_PROJECTS);
        return;
      }

      // Map Firestore docs by ID (case-insensitive for safety)
      const firestoreMap = new Map<string, Record<string, unknown>>();
      snapshot.forEach((docSnap) => {
        firestoreMap.set(docSnap.id.toLowerCase(), docSnap.data());
      });

      // Always merge against canonical SEED_PROJECTS so no booth is EVER missing from the 3D scene
      const mergedProjects: Project[] = SEED_PROJECTS.map((seedProj) => {
        const remoteData = firestoreMap.get(seedProj.id.toLowerCase());
        if (remoteData) {
          return {
            ...seedProj,
            vote_count:
              typeof remoteData.vote_count === 'number'
                ? remoteData.vote_count
                : seedProj.vote_count,
            title: (remoteData.title as string) || seedProj.title,
            description: (remoteData.description as string) || seedProj.description,
            members:
              Array.isArray(remoteData.members) && remoteData.members.length > 0
                ? (remoteData.members as string[])
                : seedProj.members,
            image_url: (remoteData.image_url as string) || seedProj.image_url,
          };
        }
        return seedProj;
      });

      onUpdate(mergedProjects);
    },
    (err) => {
      console.warn('Firestore subscription notice (using local seed):', err.message);
      onUpdate(SEED_PROJECTS);
    }
  );
}

/**
 * Seed all 35 blueprint projects into Firestore via atomic batch write
 */
export async function seedInitialProjects() {
  try {
    const batch = writeBatch(db);
    for (const project of SEED_PROJECTS) {
      const docRef = doc(db, 'projects', project.id);
      batch.set(
        docRef,
        {
          id: project.id,
          title: project.title,
          zone: project.zone,
          category: project.category,
          booth_code: project.booth_code,
          booth_number: project.booth_number,
          position_x: project.position_x,
          position_y: project.position_y,
          position_z: project.position_z,
          image_url: project.image_url,
          description: project.description,
          tagline: project.tagline || '',
          members: project.members,
          tech_stack: project.tech_stack || [],
          vote_count: project.vote_count || 0,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
    await batch.commit();
  } catch (err) {
    console.warn('Firestore batch seeding notice:', err);
  }
}

export interface VoteSubmissionPayload {
  projectId: string;
  fingerprint: string;
  userId: string;
  userEmail?: string;
}

export interface VoteSubmissionResponse {
  success: boolean;
  message: string;
  alreadyVoted?: boolean;
  newVoteCount?: number;
}

/**
 * Cast a verified vote via the authoritative serverless voting endpoint (/api/vote).
 * Eliminates direct client-side transactions, enforcing server-side rate-limiting and atomic deduplication.
 */
export async function castVoteInFirebase(
  payload: VoteSubmissionPayload
): Promise<VoteSubmissionResponse> {
  try {
    const response = await fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    return {
      success: response.ok && Boolean(data.success),
      message: data.message || (response.ok ? 'Vote recorded successfully' : 'Failed to record vote'),
      alreadyVoted: Boolean(data.alreadyVoted) || response.status === 409,
      newVoteCount: typeof data.newVoteCount === 'number' ? data.newVoteCount : undefined,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network error during vote submission';
    return {
      success: false,
      message: errorMsg,
    };
  }
}
