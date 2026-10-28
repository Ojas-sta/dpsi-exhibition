'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExhibitionStore } from '@/store/useExhibitionStore';
import { signInWithGoogle, signInAsGuest } from '@/lib/firebase';
import {
  X,
  CheckCircle,
  Fingerprint,
  Lock,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';

export default function AuthModal() {
  const isAuthModalOpen = useExhibitionStore((state) => state.isAuthModalOpen);
  const setAuthModalOpen = useExhibitionStore((state) => state.setAuthModalOpen);
  const setUser = useExhibitionStore((state) => state.setUser);

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const firebaseUser = await signInWithGoogle();
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || 'user@dpsi.in',
          name: firebaseUser.displayName || 'Verified Judge (Google)',
        });
        setAuthModalOpen(false);
      }
    } catch (err: unknown) {
      console.error('Google sign-in error:', err);
      const errorMsg =
        err instanceof Error && err.message.includes('popup-closed-by-user')
          ? 'Sign-in window was closed before completion. Please try again.'
          : err instanceof Error && err.message.includes('cancelled-popup-request')
          ? 'Another sign-in popup is already open.'
          : err instanceof Error && err.message.includes('auth/unauthorized-domain')
          ? 'Domain not authorized for OAuth in Firebase Console. Please use Visitor Pass.'
          : err instanceof Error
          ? err.message
          : 'Failed to sign in with Google. Please try again or use Visitor Pass.';
      setAuthError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setLoading(true);
    setAuthError(null);
    try {
      const guest = await signInAsGuest(guestName.trim(), guestEmail.trim());
      setUser({
        id: guest.uid,
        name: guest.displayName,
        email: guest.email,
      });
      setAuthModalOpen(false);
    } catch (err: unknown) {
      console.error('Guest sign-in error:', err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Unable to issue verified visitor pass. Please check your connection.';
      setAuthError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 text-slate-900 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={() => {
              setAuthError(null);
              setAuthModalOpen(false);
            }}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="space-y-1.5 pr-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
                <img src="/dps_indirapuram_logo.png" alt="DPS Indirapuram Logo" className="h-full w-auto max-w-[170px] object-contain" />
              </div>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Sign In to Vote
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              DPS Indirapuram uses multi-layered hardware & account verification to ensure transparent, fair, and tamper-proof voting.
            </p>
          </div>

          {/* Anti-Cheat Features List */}
          <div className="my-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs font-sans">
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Layer 1: Verified Google Account / Voter ID</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Fingerprint className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Layer 2: Hardware Device Canvas Fingerprint</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Lock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Layer 3: Cloud Functions v2 Atomic Anti-Cheat & Firestore Rules</span>
            </div>
          </div>

          {/* Error Alert */}
          {authError && (
            <div className="my-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Authentication Failed</p>
                <p className="text-[11px] mt-0.5 text-rose-700/90">{authError}</p>
              </div>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full min-h-[44px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google OAuth</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-mono uppercase text-[10px]">
                Or Visitor Pass
              </span>
            </div>
          </div>

          {/* Quick Visitor Pass Form */}
          <form onSubmit={handleGuestSignIn} className="space-y-3 font-sans">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Your Name / Judge Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Dr. Rajesh Sharma"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs text-slate-900 placeholder-slate-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="rajesh.sharma@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs text-slate-900 placeholder-slate-400 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all font-mono shadow-md shadow-amber-500/20"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Issue Verified Visitor Pass</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
