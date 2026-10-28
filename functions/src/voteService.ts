import * as admin from 'firebase-admin';
import { ValidatedVoteInput, StoredVoteDocument, StoredUserVoteDocument } from './types';

export class VoteServiceError extends Error {
  public statusCode: number;
  public code: string;
  public alreadyVoted?: boolean;

  constructor(message: string, statusCode: number, code: string, alreadyVoted?: boolean) {
    super(message);
    this.name = 'VoteServiceError';
    this.statusCode = statusCode;
    this.code = code;
    this.alreadyVoted = alreadyVoted;
  }
}

/**
 * Executes the atomic Firestore transaction to check project existence,
 * verify dual duplicate voting per hardware fingerprint AND user identity,
 * write both vote audit documents, and increment the project vote counter by +1.
 */
export async function executeVoteTransaction(
  db: admin.firestore.Firestore,
  input: ValidatedVoteInput,
  ipHash: string
): Promise<{ success: true; message: string; newVoteCount: number }> {
  return await db.runTransaction(async (transaction) => {
    // 1. Reference target project document projects/{projectId}
    const projectRef = db.collection('projects').doc(input.projectId);
    const projectDoc = await transaction.get(projectRef);

    if (!projectDoc.exists) {
      throw new VoteServiceError(
        `Project not found: ${input.projectId}`,
        404,
        'PROJECT_NOT_FOUND'
      );
    }

    // 2. Reference unique device vote document votes/{projectId}_{deviceFingerprint} (hardware collision)
    const voteDocId = `${input.projectId}_${input.deviceFingerprint}`;
    const voteRef = db.collection('votes').doc(voteDocId);
    const voteDoc = await transaction.get(voteRef);

    // 3. Reference unique user vote document user_votes/{projectId}_{userId} (user collision)
    const userVoteDocId = `${input.projectId}_${input.userId}`;
    const userVoteRef = db.collection('user_votes').doc(userVoteDocId);
    const userVoteDoc = await transaction.get(userVoteRef);

    // 4. Verify dual deduplication constraints
    if (voteDoc.exists) {
      throw new VoteServiceError(
        'This device has already voted for this project',
        409,
        'ALREADY_VOTED',
        true
      );
    }

    if (userVoteDoc.exists) {
      throw new VoteServiceError(
        'This user account has already voted for this project',
        409,
        'ALREADY_VOTED',
        true
      );
    }

    // 5. Calculate new vote count
    const projectData = projectDoc.data();
    const currentCount =
      typeof projectData?.vote_count === 'number' && Number.isFinite(projectData.vote_count)
        ? projectData.vote_count
        : 0;
    const newVoteCount = currentCount + 1;

    // 6. Create vote audit documents with exact required schemas
    const voteDocData: StoredVoteDocument = {
      projectId: input.projectId,
      userId: input.userId,
      deviceFingerprint: input.deviceFingerprint,
      ipHash,
      userEmail: input.userEmail,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const userVoteDocData: StoredUserVoteDocument = {
      projectId: input.projectId,
      userId: input.userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // 7. Atomically write both deduplication audit documents
    transaction.set(voteRef, voteDocData);
    transaction.set(userVoteRef, userVoteDocData);

    // 8. Atomically increment the project vote_count by +1
    transaction.update(projectRef, {
      vote_count: admin.firestore.FieldValue.increment(1),
    });

    return {
      success: true,
      message: 'Vote recorded successfully',
      newVoteCount,
    };
  });
}
