'use client';

import { useEffect, useRef } from 'react';
import { CameraControls } from '@react-three/drei';
import { useExhibitionStore } from '@/store/useExhibitionStore';

export default function CameraSystem() {
  const controlsRef = useRef<CameraControls | null>(null);
  const cameraConfig = useExhibitionStore((state) => state.cameraConfig);
  const isMobile = useExhibitionStore((state) => state.isMobile);

  useEffect(() => {
    if (!controlsRef.current) return;

    const [px, py, pz] = cameraConfig.position;
    const [tx, ty, tz] = cameraConfig.target;

    // Smoothly fly camera to new position and target with animation damping
    controlsRef.current.setLookAt(px, py, pz, tx, ty, tz, true);
  }, [cameraConfig]);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      smoothTime={isMobile ? 0.6 : 0.75}
      minDistance={isMobile ? 5 : 3.5}
      maxDistance={isMobile ? 240 : 210}
      maxPolarAngle={Math.PI / 2.05} // Prevent camera going below floor
      minPolarAngle={Math.PI / 12}
      dollySpeed={isMobile ? 1.0 : 0.85}
      truckSpeed={isMobile ? 1.0 : 0.85}
      azimuthRotateSpeed={isMobile ? 0.85 : 0.9}
      polarRotateSpeed={isMobile ? 0.75 : 0.85}
      draggingSmoothTime={0.12}
    />
  );
}
