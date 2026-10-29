'use client';

import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture, Stars } from '@react-three/drei';
import { useExhibitionStore } from '@/store/useExhibitionStore';

function MilkyWaySphere({ isMobile }: { isMobile: boolean }) {
  const texturePath = isMobile ? '/textures/milkyway-mobile.jpg' : '/textures/milkyway.jpg';
  const texture = useTexture(texturePath);
  const meshRef = useRef<THREE.Mesh>(null);

  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
    }
  }, [texture]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Gentle, majestic cosmic orbital rotation
      meshRef.current.rotation.y += delta * 0.0006;
    }
  });

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]} rotation={[0.35, -1.15, 0.12]}>
      {/* Huge inverted celestial dome encapsulating space */}
      <sphereGeometry args={[950, 48, 32]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        toneMapped={false}
        fog={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function MilkyWaySky() {
  const isMobile = useExhibitionStore((state) => state.isMobile);

  return (
    <group>
      {/* 360-degree ESO Photorealistic Milky Way Panorama Sphere */}
      <Suspense fallback={null}>
        <MilkyWaySphere isMobile={isMobile} />
      </Suspense>

      {/* 3D Twinkling Starfield for Dynamic Parallax Depth */}
      <Stars
        radius={380}
        depth={160}
        count={isMobile ? 2200 : 6000}
        factor={3.8}
        saturation={0.7}
        fade
        speed={1.0}
      />

      {/* Distant galactic core starlight hues */}
      <ambientLight intensity={0.4} color="#e0e7ff" />
      <directionalLight position={[-60, 90, -40]} intensity={0.55} color="#fffbeb" />
    </group>
  );
}
