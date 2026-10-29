'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useExhibitionStore } from '@/store/useExhibitionStore';
import { getDeviceFingerprint } from '@/lib/fingerprint';
import { subscribeToProjects, onFirebaseAuthStateChange, checkRedirectResult } from '@/lib/firebase';
import TopNavHUD from '@/components/ui/TopNavHUD';
import MobileBottomDock from '@/components/ui/MobileBottomDock';
import ProjectDetailDrawer from '@/components/ui/ProjectDetailDrawer';
import LiveLeaderboard from '@/components/ui/LiveLeaderboard';
import TwoDFallbackGrid from '@/components/ui/TwoDFallbackGrid';
import AuthModal from '@/components/ui/AuthModal';
import SearchModal from '@/components/ui/SearchModal';
import MobileNavMenu from '@/components/ui/MobileNavMenu';
import CameraControlsWidget from '@/components/ui/CameraControlsWidget';
import { MousePointerClick, Move, ZoomIn, ArrowLeft } from 'lucide-react';

const ExhibitionCanvas = dynamic(
  () => import('@/components/canvas/ExhibitionCanvas'),
  { ssr: false }
);

export default function ExpoFloorPlanPage() {
  const viewMode = useExhibitionStore((state) => state.viewMode);
  const setDeviceFingerprint = useExhibitionStore((state) => state.setDeviceFingerprint);
  const setIsMobile = useExhibitionStore((state) => state.setIsMobile);
  const setProjects = useExhibitionStore((state) => state.setProjects);
  const setUser = useExhibitionStore((state) => state.setUser);

  useEffect(() => {
    const checkMobile = () => {
      const isMob = window.innerWidth < 768;
      setIsMobile(isMob);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    getDeviceFingerprint().then((fp) => {
      setDeviceFingerprint(fp);
    });

    // 1. Check for pending redirect OAuth results
    checkRedirectResult()
      .then((redirectUser) => {
        if (redirectUser) {
          setUser({
            id: redirectUser.uid,
            email: redirectUser.email || 'user@dpsi.in',
            name: redirectUser.displayName || 'Visitor',
          });
        }
      })
      .catch(console.error);

    // 2. Centralized Firebase Auth state synchronization
    const unsubAuth = onFirebaseAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || 'user@dpsi.in',
          name: firebaseUser.displayName || 'Visitor',
        });
      } else {
        setUser(null);
      }
    });

    // 3. Real-time Firebase Firestore synchronization
    const unsubProjects = subscribeToProjects((liveProjects) => {
      if (liveProjects && liveProjects.length > 0) {
        setProjects(liveProjects);
      }
    });

    return () => {
      window.removeEventListener('resize', checkMobile);
      unsubAuth();
      unsubProjects();
    };
  }, [setIsMobile, setDeviceFingerprint, setProjects, setUser]);

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden bg-[#070b14] font-sans">
      {/* Top HUD Navigation Bar */}
      <TopNavHUD />

      {/* Back to Landing Page floating button */}
      <div className="fixed top-20 left-4 sm:left-6 z-40 pointer-events-auto">
        <Link
          href="/"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/90 text-xs font-semibold shadow-xl backdrop-blur-md transition-all group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Event Info & Overview</span>
        </Link>
      </div>

      {/* Main Exhibition Floor (3D WebGL Hall or 2D Bento Directory) */}
      {viewMode === '3d' ? (
        <div className="relative isolate w-full h-full">
          <ExhibitionCanvas />

          {/* Desktop Only: Bottom Left Camera Gesture Legend */}
          <div className="hidden lg:flex fixed bottom-4 left-6 z-30 items-center gap-4 px-4 py-2.5 rounded-2xl bg-[#0b101c]/85 backdrop-blur-md border border-slate-800 text-[11px] text-slate-400 pointer-events-none shadow-xl font-mono">
            <div className="flex items-center gap-1.5">
              <MousePointerClick className="w-3.5 h-3.5 text-amber-400" />
              <span>Tap Booth</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-slate-300" />
              <span>Drag to Orbit</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <ZoomIn className="w-3.5 h-3.5 text-slate-300" />
              <span>Pinch / Scroll to Zoom</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full overflow-y-auto">
          <TwoDFallbackGrid />
        </div>
      )}

      {/* Mobile Floating Action Dock */}
      <MobileBottomDock />

      {/* Floating 3D Navigation Controls Widget */}
      <CameraControlsWidget />

      {/* Slide-out Drawers & Modals */}
      <ProjectDetailDrawer />
      <LiveLeaderboard />
      <AuthModal />
      <SearchModal />
      <MobileNavMenu />

      {/* Small Bottom Credit */}
      <div className="fixed bottom-2 right-4 z-20 pointer-events-none text-[10px] font-mono text-slate-500/70">
        Co-Engineered by Ojas Singh dpsi&apos;&apos;30
      </div>
    </main>
  );
}
