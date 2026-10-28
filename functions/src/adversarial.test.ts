import { test, describe, beforeEach } from 'node:test';
import * as assert from 'node:assert/strict';
import * as crypto from 'crypto';
import * as admin from 'firebase-admin';

import {
  validateVotePayload,
  extractClientIp,
  hashClientIp,
  IP_HASH_SALT,
} from './validation';
import { SlidingWindowRateLimiter } from './rateLimiter';
import { executeVoteTransaction, VoteServiceError } from './voteService';
import { ValidatedVoteInput } from './types';

// ============================================================================
// ADVERSARIAL STRESS TEST SUITE: CHALLENGER 1
// ============================================================================

describe('Adversarial Schema Stress & Edge Cases', () => {
  const validBase = {
    projectId: 'p01',
    fingerprint: 'device_canvas_fp_12345',
    userId: 'usr_valid_123',
    userEmail: 'student@dpsi.in',
  };

  test('Rejects all non-object and primitive bodies', () => {
    const primitives = [
      null,
      undefined,
      '',
      '{"projectId":"p01"}',
      12345,
      true,
      false,
      [],
      [validBase],
      Symbol('test'),
      () => {},
    ];

    for (const p of primitives) {
      const res = validateVotePayload(p);
      assert.equal(res.isValid, false, `Primitive ${String(p)} must be rejected`);
      assert.ok(res.error.length > 0);
    }
  });

  test('Path traversal attempts in projectId are strictly rejected', () => {
    const maliciousProjectIds = [
      '../p01',
      '../../etc/passwd',
      '..\\p01',
      'p01/subdoc',
      '/p01',
      'p01/',
      'p01/../p02',
      'p01%2fsub',
      'p01\\0',
      'p01\0nullbyte',
      'p01 p02',
      'p01;DROP TABLE',
      '<script>alert(1)</script>',
      '${jndi:ldap://evil.com}',
      'p01?query=1',
      'p01#anchor',
      'p01&param=2',
      '..',
      '.',
      '../',
      '..\\',
      '/etc/shadow',
      'C:\\Windows\\System32',
    ];

    for (const projId of maliciousProjectIds) {
      const res = validateVotePayload({ ...validBase, projectId: projId });
      assert.equal(res.isValid, false, `Malicious projectId "${projId}" must be rejected`);
    }
  });

  test('Internal whitespace and control characters in projectId are rejected', () => {
    const internalWhitespaceIds = [
      'p\n01',
      'p\r\n01',
      'p\t01',
      'p 01',
      'project 2026',
      'p\x0001',
      'p\u000001',
    ];

    for (const id of internalWhitespaceIds) {
      const res = validateVotePayload({ ...validBase, projectId: id });
      assert.equal(res.isValid, false, `ProjectId with internal whitespace/control char "${id}" must be rejected`);
    }
  });

  test('Outer whitespace in projectId is safely trimmed or rejected if blank', () => {
    // Trimming valid ID
    const resTrimmed = validateVotePayload({ ...validBase, projectId: '   p01   ' });
    assert.equal(resTrimmed.isValid, true);
    if (resTrimmed.isValid) {
      assert.equal(resTrimmed.data.projectId, 'p01');
    }

    // Blank or whitespace-only IDs must be rejected
    for (const blankId of ['', '   ', '\t', '\n', '\r\n']) {
      const resBlank = validateVotePayload({ ...validBase, projectId: blankId });
      assert.equal(resBlank.isValid, false, `Blank projectId "${blankId}" must be rejected`);
    }
  });

  test('ProjectId length boundaries: 1 char ok, 50 chars ok, 51 chars rejected, 10000 chars rejected', () => {
    const res1 = validateVotePayload({ ...validBase, projectId: 'a' });
    assert.equal(res1.isValid, true);

    const fiftyChars = 'a'.repeat(50);
    const res50 = validateVotePayload({ ...validBase, projectId: fiftyChars });
    assert.equal(res50.isValid, true);

    const fiftyOneChars = 'a'.repeat(51);
    const res51 = validateVotePayload({ ...validBase, projectId: fiftyOneChars });
    assert.equal(res51.isValid, false);

    const extremeStr = 'x'.repeat(10000);
    const resExtreme = validateVotePayload({ ...validBase, projectId: extremeStr });
    assert.equal(resExtreme.isValid, false);
  });

  test('Fingerprint normalization and path traversal sanitization', () => {
    // Slashes converted to underscores
    const slashesFp = 'canvas/hash/val/12345678';
    const resSlash = validateVotePayload({ ...validBase, fingerprint: slashesFp });
    assert.equal(resSlash.isValid, true);
    if (resSlash.isValid) {
      assert.equal(resSlash.data.deviceFingerprint, 'canvas_hash_val_12345678');
      assert.ok(!resSlash.data.deviceFingerprint.includes('/'));
    }

    // Path traversal slashes normalized to underscores
    const traversalFp = '../../../../secret123';
    const resTrav = validateVotePayload({ ...validBase, fingerprint: traversalFp });
    assert.equal(resTrav.isValid, true);
    if (resTrav.isValid) {
      assert.equal(resTrav.data.deviceFingerprint, '.._.._.._.._secret123');
      assert.ok(!resTrav.data.deviceFingerprint.includes('/'));
    }

    // Dangerous characters rejected by FINGERPRINT_REGEX
    const invalidFpChars = [
      'fp with spaces',
      'fp<script>1234',
      'fp$injection',
      'fp%20encoded',
      'fp\0nullbyte',
      'fp\nnewline',
      'fp"quotes"',
      "fp'single'",
      'fp`backtick`',
    ];

    for (const badFp of invalidFpChars) {
      const res = validateVotePayload({ ...validBase, fingerprint: badFp });
      assert.equal(res.isValid, false, `Fingerprint with bad chars "${badFp}" must be rejected`);
    }
  });

  test('Fingerprint length boundaries: 7 rejected, 8 accepted, 128 accepted, 129 rejected, 10000 rejected', () => {
    assert.equal(validateVotePayload({ ...validBase, fingerprint: '1234567' }).isValid, false);
    assert.equal(validateVotePayload({ ...validBase, fingerprint: '12345678' }).isValid, true);

    const fp128 = 'f'.repeat(128);
    assert.equal(validateVotePayload({ ...validBase, fingerprint: fp128 }).isValid, true);

    const fp129 = 'f'.repeat(129);
    assert.equal(validateVotePayload({ ...validBase, fingerprint: fp129 }).isValid, false);

    const fp10000 = 'f'.repeat(10000);
    assert.equal(validateVotePayload({ ...validBase, fingerprint: fp10000 }).isValid, false);
  });

  test('Missing fields in payload are rejected with clear error messages', () => {
    const noProj = validateVotePayload({ fingerprint: 'fp_12345678', userId: 'u1' });
    assert.equal(noProj.isValid, false);
    assert.ok(noProj.error.includes('projectId'));

    const noFp = validateVotePayload({ projectId: 'p01', userId: 'u1' });
    assert.equal(noFp.isValid, false);
    assert.ok(noFp.error.includes('fingerprint'));

    const noUser = validateVotePayload({ projectId: 'p01', fingerprint: 'fp_12345678' });
    assert.equal(noUser.isValid, false);
    assert.ok(noUser.error.includes('userId'));
  });

  test('Malformed field types are rejected', () => {
    assert.equal(validateVotePayload({ ...validBase, projectId: 12345 }).isValid, false);
    assert.equal(validateVotePayload({ ...validBase, projectId: { id: 'p01' } }).isValid, false);
    assert.equal(validateVotePayload({ ...validBase, fingerprint: true }).isValid, false);
    assert.equal(validateVotePayload({ ...validBase, userId: ['u1'] }).isValid, false);
    assert.equal(validateVotePayload({ ...validBase, userEmail: 12345 }).isValid, false);
    assert.equal(validateVotePayload({ ...validBase, userEmail: { email: 'a@b.com' } }).isValid, false);
  });

  test('Email edge cases: regex conformance, whitespace stripping, and max length', () => {
    for (const validEmail of ['a@b.co', 'user.name+tag@example.org', '123@456.com', 'STUDENT@DPSI-VISITOR.IN']) {
      const res = validateVotePayload({ ...validBase, userEmail: validEmail });
      assert.equal(res.isValid, true, `Email ${validEmail} should be valid`);
      if (res.isValid) {
        assert.equal(res.data.userEmail, validEmail.toLowerCase());
      }
    }

    for (const invalidEmail of ['no-at-sign', 'user@', '@domain.com', 'user@domain', 'user space@domain.com']) {
      const res = validateVotePayload({ ...validBase, userEmail: invalidEmail });
      assert.equal(res.isValid, false, `Email ${invalidEmail} should be rejected`);
    }

    const longEmail = 'a'.repeat(120) + '@example.com';
    const resLong = validateVotePayload({ ...validBase, userEmail: longEmail });
    assert.equal(resLong.isValid, false);
  });
});

// ============================================================================
// ADVERSARIAL IP EXTRACTION & INTEGRITY
// ============================================================================

describe('Adversarial IP Extraction & Salted Hashing', () => {
  test('Spoofed multi-proxy headers are safely parsed', () => {
    const reqWithSpoofedChain = {
      headers: {
        'x-forwarded-for': '203.0.113.195, 10.0.0.1, 192.168.1.1, <script>evil</script>',
      },
    };
    const extracted = extractClientIp(reqWithSpoofedChain);
    assert.equal(extracted, '203.0.113.195');

    const expectedHash = crypto.createHash('sha256').update(extracted + IP_HASH_SALT).digest('hex');
    assert.equal(hashClientIp(extracted), expectedHash);
  });

  test('Empty and whitespace-padded headers fallback gracefully', () => {
    assert.equal(extractClientIp({ headers: { 'x-forwarded-for': '   ' } }), '127.0.0.1');
    assert.equal(extractClientIp({ headers: { 'x-real-ip': '' } }), '127.0.0.1');
    assert.equal(extractClientIp({ headers: {} }), '127.0.0.1');
  });

  test('IPv6 address hashing', () => {
    const ipv6 = '2001:0db8:85a3:0000:0000:8a2e:0370:7334';
    const extracted = extractClientIp({ headers: { 'x-real-ip': ipv6 } });
    assert.equal(extracted, ipv6);
    const hash = hashClientIp(extracted);
    assert.equal(hash.length, 64);
  });
});

// ============================================================================
// ADVERSARIAL RATE LIMITING & BURST STRESS TESTS
// ============================================================================

describe('Adversarial Rate Limiting & Burst Protection', () => {
  let limiter: SlidingWindowRateLimiter;

  beforeEach(() => {
    limiter = new SlidingWindowRateLimiter({
      windowMs: 60 * 1000,
      maxRequests: 60,
      maxKeys: 1000,
    });
  });

  test('Burst of 100 requests from single IP: exactly 60 allowed, 40 rejected with 429 semantics', () => {
    const ipHash = 'attacker_ip_hash';
    const t0 = Date.now();

    let allowedCount = 0;
    let blockedCount = 0;

    for (let i = 0; i < 100; i++) {
      const res = limiter.check(ipHash, t0 + i);
      if (res.allowed) {
        allowedCount++;
        assert.equal(res.remaining, 60 - allowedCount);
      } else {
        blockedCount++;
        assert.equal(res.remaining, 0);
        assert.ok((res.retryAfterSeconds ?? 0) >= 1);
        assert.ok((res.retryAfterSeconds ?? 0) <= 60);
      }
    }

    assert.equal(allowedCount, 60, 'Exactly 60 requests must be allowed');
    assert.equal(blockedCount, 40, 'Remaining 40 requests must be blocked');
  });

  test('Shared NAT IP behavior: multiple IPs do not interfere with each other', () => {
    const t0 = Date.now();
    const ipA = 'school_nat_ip_hash_a';
    const ipB = 'school_nat_ip_hash_b';

    for (let i = 0; i < 60; i++) {
      assert.equal(limiter.check(ipA, t0 + i).allowed, true);
    }
    assert.equal(limiter.check(ipA, t0 + 60).allowed, false);

    for (let i = 0; i < 60; i++) {
      const resB = limiter.check(ipB, t0 + i);
      assert.equal(resB.allowed, true, `IP B request ${i + 1} should be allowed`);
    }
    assert.equal(limiter.check(ipB, t0 + 60).allowed, false);
  });

  test('Sliding window restores capacity as time elapses', () => {
    const ip = 'time_advance_ip';
    const t0 = Date.now();

    for (let i = 0; i < 30; i++) {
      assert.equal(limiter.check(ip, t0 + i).allowed, true);
    }

    for (let i = 0; i < 30; i++) {
      assert.equal(limiter.check(ip, t0 + 30000 + i).allowed, true);
    }

    assert.equal(limiter.check(ip, t0 + 30100).allowed, false);

    const t1 = t0 + 60100;
    const checkAfterPartialSlide = limiter.check(ip, t1);
    assert.equal(checkAfterPartialSlide.allowed, true, 'Requests from first batch have expired');
  });

  test('Pruning and memory leak protection under high key churn', () => {
    const t0 = Date.now();
    for (let i = 0; i < 500; i++) {
      limiter.check(`ip_churn_${i}`, t0);
    }
    assert.equal(limiter.getRecordCount(), 500);

    // Advance time past window (61 seconds) and check a new IP to trigger maybeCleanup
    const tExpired = t0 + 61000;
    limiter.check('ip_trigger_cleanup', tExpired);

    // All old keys should have been pruned
    assert.ok(limiter.getRecordCount() <= 2, `Records should be pruned, count was: ${limiter.getRecordCount()}`);
  });
});

// ============================================================================
// ADVERSARIAL ATOMIC TRANSACTION & ANTI-CHEAT TESTS
// ============================================================================

describe('Adversarial Atomic Transaction & Duplicate Rejection', () => {
  interface MockDocSnapshot {
    exists: boolean;
    id: string;
    data: () => Record<string, unknown> | undefined;
  }

  interface MockDocRef {
    id: string;
    colName: string;
  }

  interface MockTransaction {
    get: (docRef: MockDocRef) => Promise<MockDocSnapshot>;
    set: (docRef: MockDocRef, data: Record<string, unknown>) => void;
    update: (docRef: MockDocRef, updateData: Record<string, unknown>) => void;
  }

  interface MockFirestoreDb {
    collection: (colName: string) => { doc: (docId: string) => MockDocRef };
    runTransaction: <T>(updateFunction: (transaction: MockTransaction) => Promise<T>) => Promise<T>;
    getProject: (id: string) => Record<string, unknown> | undefined;
    getVote: (id: string) => Record<string, unknown> | undefined;
    getAllVotes: () => Map<string, Record<string, unknown>>;
  }

  function createMockFirestore(
    initialProjects: Record<string, Record<string, unknown>> = {},
    initialVotes: Record<string, Record<string, unknown>> = {}
  ): MockFirestoreDb {
    const projectsStore = new Map<string, Record<string, unknown>>(Object.entries(initialProjects));
    const votesStore = new Map<string, Record<string, unknown>>(Object.entries(initialVotes));

    const mockDb: MockFirestoreDb = {
      collection: (colName: string) => ({
        doc: (docId: string) => ({
          id: docId,
          colName,
        }),
      }),
      runTransaction: async <T>(updateFunction: (transaction: MockTransaction) => Promise<T>): Promise<T> => {
        const stagedWrites: Array<() => void> = [];

        const mockTransaction: MockTransaction = {
          get: async (docRef: MockDocRef): Promise<MockDocSnapshot> => {
            if (docRef.colName === 'projects') {
              const data = projectsStore.get(docRef.id);
              return {
                exists: data !== undefined,
                id: docRef.id,
                data: () => (data ? { ...data } : undefined),
              };
            }
            if (docRef.colName === 'votes') {
              const data = votesStore.get(docRef.id);
              return {
                exists: data !== undefined,
                id: docRef.id,
                data: () => (data ? { ...data } : undefined),
              };
            }
            return { exists: false, id: docRef.id, data: () => undefined };
          },
          set: (docRef: MockDocRef, data: Record<string, unknown>) => {
            stagedWrites.push(() => {
              if (docRef.colName === 'votes') {
                votesStore.set(docRef.id, { ...data });
              }
            });
          },
          update: (docRef: MockDocRef, updateData: Record<string, unknown>) => {
            stagedWrites.push(() => {
              if (docRef.colName === 'projects') {
                const current = projectsStore.get(docRef.id) || { vote_count: 0 };
                let newCount = typeof current.vote_count === 'number' ? current.vote_count : 0;
                if (updateData.vote_count && typeof updateData.vote_count === 'object') {
                  newCount += 1;
                } else if (typeof updateData.vote_count === 'number') {
                  newCount = updateData.vote_count;
                }
                projectsStore.set(docRef.id, { ...current, vote_count: newCount });
              }
            });
          },
        };

        const result = await updateFunction(mockTransaction);
        stagedWrites.forEach((write) => write());
        return result;
      },
      getProject: (id: string) => projectsStore.get(id),
      getVote: (id: string) => votesStore.get(id),
      getAllVotes: () => votesStore,
    };

    return mockDb;
  }

  test('Atomic duplicate rejection: same hardware fingerprint voting twice on same project fails with 409', async () => {
    const mockDb = createMockFirestore({
      p01: { id: 'p01', title: 'Robotics Project', vote_count: 10 },
    });

    const voteInput: ValidatedVoteInput = {
      projectId: 'p01',
      deviceFingerprint: 'hw_fingerprint_unique_device_999',
      userId: 'user_first',
      userEmail: 'user1@example.com',
    };
    const ipHash = hashClientIp('192.168.1.100');

    const res1 = await executeVoteTransaction(mockDb as unknown as admin.firestore.Firestore, voteInput, ipHash);
    assert.equal(res1.success, true);
    assert.equal(res1.newVoteCount, 11);

    const projectAfterVote1 = mockDb.getProject('p01') as { vote_count: number };
    assert.equal(projectAfterVote1.vote_count, 11);

    const secondVoteInput: ValidatedVoteInput = {
      ...voteInput,
      userId: 'different_user_same_device',
      userEmail: 'attacker@example.com',
    };

    await assert.rejects(
      async () => {
        await executeVoteTransaction(mockDb as unknown as admin.firestore.Firestore, secondVoteInput, ipHash);
      },
      (err: unknown) => {
        assert.ok(err instanceof VoteServiceError);
        assert.equal(err.statusCode, 409);
        assert.equal(err.code, 'ALREADY_VOTED');
        assert.equal(err.alreadyVoted, true);
        return true;
      }
    );

    const projectAfterVote2 = mockDb.getProject('p01') as { vote_count: number };
    assert.equal(projectAfterVote2.vote_count, 11);
  });

  test('Same hardware fingerprint can vote for DIFFERENT projects', async () => {
    const mockDb = createMockFirestore({
      p01: { id: 'p01', title: 'Project 1', vote_count: 5 },
      p02: { id: 'p02', title: 'Project 2', vote_count: 8 },
    });

    const fp = 'shared_hardware_device_fingerprint';
    const ipHash = hashClientIp('10.0.0.1');

    const resP01 = await executeVoteTransaction(
      mockDb as unknown as admin.firestore.Firestore,
      { projectId: 'p01', deviceFingerprint: fp, userId: 'user_1', userEmail: null },
      ipHash
    );
    assert.equal(resP01.success, true);
    assert.equal(resP01.newVoteCount, 6);

    const resP02 = await executeVoteTransaction(
      mockDb as unknown as admin.firestore.Firestore,
      { projectId: 'p02', deviceFingerprint: fp, userId: 'user_1', userEmail: null },
      ipHash
    );
    assert.equal(resP02.success, true);
    assert.equal(resP02.newVoteCount, 9);

    assert.equal((mockDb.getProject('p01') as { vote_count: number }).vote_count, 6);
    assert.equal((mockDb.getProject('p02') as { vote_count: number }).vote_count, 9);
  });

  test('Non-existent project ID returns 404 and does not write vote record', async () => {
    const mockDb = createMockFirestore({
      p01: { id: 'p01', vote_count: 1 },
    });

    await assert.rejects(
      async () => {
        await executeVoteTransaction(
          mockDb as unknown as admin.firestore.Firestore,
          { projectId: 'p99_ghost_project', deviceFingerprint: 'fp_valid_12345', userId: 'u1', userEmail: null },
          'ip_hash'
        );
      },
      (err: unknown) => {
        assert.ok(err instanceof VoteServiceError);
        assert.equal(err.statusCode, 404);
        assert.equal(err.code, 'PROJECT_NOT_FOUND');
        return true;
      }
    );

    assert.equal(mockDb.getAllVotes().size, 0);
  });

  test('Concurrent double-vote race condition: serial execution guarantees exactly 1 vote succeeds', async () => {
    const mockDb = createMockFirestore({
      p03: { id: 'p03', title: 'Solar Car', vote_count: 0 },
    });

    const voteInput: ValidatedVoteInput = {
      projectId: 'p03',
      deviceFingerprint: 'race_test_fingerprint_12345',
      userId: 'race_user',
      userEmail: null,
    };
    const ipHash = hashClientIp('192.168.1.200');

    let successCount = 0;
    let duplicateCount = 0;

    for (let i = 0; i < 20; i++) {
      try {
        await executeVoteTransaction(mockDb as unknown as admin.firestore.Firestore, voteInput, ipHash);
        successCount++;
      } catch (err) {
        if (err instanceof VoteServiceError && err.statusCode === 409) {
          duplicateCount++;
        }
      }
    }

    assert.equal(successCount, 1, 'Only exactly 1 vote must succeed');
    assert.equal(duplicateCount, 19, 'Exactly 19 duplicate votes must fail with 409');
    assert.equal((mockDb.getProject('p03') as { vote_count: number }).vote_count, 1);
  });
});
