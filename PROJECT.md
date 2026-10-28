# Project: DPSI Exhibition Platform Productionization

## Architecture
The DPSI Exhibition platform is a real-time web application built with Next.js (App Router, React 19, Three.js) backed natively and securely by Google Firebase services:
- **Firebase Authentication**: Native Google OAuth (`signInWithPopup`) and Anonymous/Guest (`signInAnonymously`) authentication. All client session states are tied to `auth.currentUser`.
- **Cloud Firestore**: Real-time document database storing `projects` (exhibition booth showcase and atomic vote counter) and `votes` (immutable append-only audit records).
- **Cloud Functions for Firebase (v2)**: Standalone TypeScript codebase in `functions/` (Node.js 22, `firebase-functions` v6+, `firebase-admin` v13+) providing the authoritative `vote` HTTPS endpoint with multi-layer anti-cheat (schema validation, salted SHA-256 IP hashing + rate limiting, canvas hardware fingerprint collision check, and atomic Firestore transactions).
- **Firestore Security Rules**: Zero-trust default-deny rules (`firestore.rules`) enforcing domain type guards, atomic counter increment validation (+1 strictly on `projects.vote_count`), immutable append-only semantics on `votes`, and PII lockdown.
- **Project Configuration**: Declarative `firebase.json` and `.firebaserc` targeting active project `smarthome-88486`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Firebase Project Config | Declarative `firebase.json` linking `firestore`, `functions` (Node 22, predeploy), and `auth.providers` | M1 | ORIGINAL_REQUEST §R4 |
| 2 | Active Project Linkage | Verified binding to default project `smarthome-88486` in `.firebaserc` | M1 | ORIGINAL_REQUEST §R4 |
| 3 | Functions Package Scaffold | Standalone `functions/package.json` and `tsconfig.json` targeting Node 22 and ES2022 | M1 | ORIGINAL_REQUEST §R2 |
| 4 | Cloud Functions v2 Vote Handler | Serverless HTTPS function using `firebase-admin` and `firebase-functions` v6+ | M2 | ORIGINAL_REQUEST §R2 |
| 5 | Anti-Cheat Schema Validation | Rigorous payload validation for `projectId`, `deviceFingerprint`, `userId`, `userEmail` | M2 | ORIGINAL_REQUEST §R2 |
| 6 | IP Rate Limiting & Hashing | Volumetric flood protection (30-60 req/min/IP) with salted SHA-256 hashing | M2 | ORIGINAL_REQUEST §R2 |
| 7 | Atomic Firestore Transaction | Deduplicating votes by `${projectId}_${deviceFingerprint}` and atomic `+1` on `projects.vote_count` | M2 | ORIGINAL_REQUEST §R2 |
| 8 | Production Firestore Security Rules | Zero-trust default deny, domain validators, +1 counter isolation, PII lockdown | M3 | ORIGINAL_REQUEST §R3 |
| 9 | Native Firebase Auth Client | Google OAuth and Anonymous visitor sign-in in `src/lib/firebase.ts` | M4 | ORIGINAL_REQUEST §R1 |
| 10 | Auth UI & Session Management | Remove mock fallbacks in `AuthModal.tsx`, add proper sign-out in `TopNavHUD.tsx`, single listener | M4 | ORIGINAL_REQUEST §R1 |
| 11 | Client Voting Integration | Wire `ProjectDetailDrawer.tsx` to Cloud Functions v2 endpoint, remove duplicate client writes | M4 | ORIGINAL_REQUEST §R1/R2 |
| 12 | Build & Verification Integrity | Clean compilation of root Next.js (`npm run build`) and functions (`npm --prefix functions run build`) | M5 | ORIGINAL_REQUEST AC |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Firebase Config & Functions Scaffolding | `firebase.json`, `.firebaserc`, `functions/package.json`, `functions/tsconfig.json` | none | DONE |
| M2 | Cloud Functions v2 Anti-Cheat Voting Codebase | `functions/src/index.ts` with atomic transaction, rate limiting, validation, clean build | M1 | DONE |
| M3 | Production-Grade Firestore Security Rules | Authoring and compiling `firestore.rules` via `firestore-rules-author` | M1 | DONE |
| M4 | Native Firebase Auth & Client Integration | `src/lib/firebase.ts`, `AuthModal.tsx`, `TopNavHUD.tsx`, `page.tsx`, `ProjectDetailDrawer.tsx` | M2, M3 | DONE |
| M5 | Build Integrity & E2E Verification | Root Next.js build, functions build, rules dry-run, full AC verification | M4 | DONE |

## Interface Contracts
### Client ↔ Cloud Functions v2 (`/api/vote` or Cloud Functions URL)
- Request:
  ```json
  {
    "projectId": "p01",
    "fingerprint": "canvas_hash_string",
    "userId": "firebase_auth_uid",
    "userEmail": "visitor@example.com"
  }
  ```
- Response (200 OK):
  ```json
  {
    "success": true,
    "message": "Vote recorded successfully",
    "newVoteCount": 42
  }
  ```
- Response (409 Conflict):
  ```json
  {
    "success": false,
    "alreadyVoted": true,
    "message": "You have already voted for this project"
  }
  ```
- Response (429 Too Many Requests):
  ```json
  {
    "success": false,
    "message": "Too many requests. Please wait before submitting another vote."
  }
  ```

### Cloud Functions ↔ Firestore Data Model
- Collection `projects/{projectId}`:
  - Document fields: `id`, `title`, `zone`, `category`, `booth_code`, `booth_number`, `position_x`, `position_y`, `position_z`, `image_url`, `description`, `members`, `vote_count` (number, incremented via `FieldValue.increment(1)`).
- Collection `votes/{projectId}_{deviceFingerprint}`:
  - Document fields:
    - `projectId`: string
    - `userId`: string
    - `deviceFingerprint`: string
    - `ipHash`: string (SHA-256 salted hash)
    - `userEmail`: string | null
    - `createdAt`: FieldValue.serverTimestamp()

## Code Layout
- `firebase.json`: Declarative Firebase configuration (Firestore, Functions, Auth providers).
- `.firebaserc`: Active project alias (`default: smarthome-88486`).
- `firestore.rules`: Security rules for Cloud Firestore.
- `firestore.indexes.json`: Firestore indexing configuration.
- `functions/`:
  - `package.json`: Node 22, firebase-functions v6+, firebase-admin, typescript.
  - `tsconfig.json`: TypeScript configuration for Cloud Functions.
  - `src/index.ts`: Cloud Functions v2 entrypoint (`vote` HTTPS function).
- `src/`:
  - `lib/firebase.ts`: Client Firebase SDK initialization, auth helpers, real-time listeners.
  - `components/ui/AuthModal.tsx`: Native Google & Anonymous sign-in modal.
  - `components/ui/TopNavHUD.tsx`: HUD navigation, user profile display, and sign-out handler.
  - `components/ui/ProjectDetailDrawer.tsx`: Project details and serverless vote submission.
  - `app/page.tsx`: Main exhibition canvas and synchronized auth state listener.
