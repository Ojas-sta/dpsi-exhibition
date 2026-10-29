'use client';

import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useExhibitionStore } from '@/store/useExhibitionStore';

function MilkyWaySphere({ isMobile }: { isMobile: boolean }) {
  const texturePath = isMobile ? '/textures/milkyway_mobile_smooth.jpg' : '/textures/milkyway_smooth.jpg';
  const texture = useTexture(texturePath);
  const meshRef = useRef<THREE.Mesh>(null);

  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
    }
  }, [texture]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Very gentle, imperceptible cosmic drift
      meshRef.current.rotation.y += delta * 0.0003;
    }
  });

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]} rotation={[0.4, -1.2, 0.1]}>
      {/* High-res smoothed celestial sphere with zero pixel noise */}
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

/**
 * Subtle, sparse distant starlight - NO harsh static speckles.
 * Generates only ~150 gentle, elegant soft points.
 */
function SubtleStarlight() {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const count = 150;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#93c5fd'), // Soft ice blue
      new THREE.Color('#c4b5fd'), // Soft lavender
      new THREE.Color('#fef08a'), // Warm starlight
      new THREE.Color('#ffffff'), // Pure white
    ];

    for (let i = 0; i < count; i++) {
      const radius = 280 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      pos[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * 0.7;
      pos[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return [pos, col];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Gentle subtle breathing
      const time = state.clock.getElapsedTime();
      (pointsRef.current.material as THREE.PointsMaterial).opacity =
        0.35 + Math.sin(time * 0.8) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.6}
        vertexColors
        transparent
        opacity={0.4}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export default function MilkyWaySky() {
  const isMobile = useExhibitionStore((state) => state.isMobile);

  return (
    <group>
      {/* Photorealistic Denoised Milky Way Galaxy Atmosphere */}
      <Suspense fallback={null}>
        <MilkyWaySphere isMobile={isMobile} />
      </Suspense>

      {/* Subtle, soft distant celestial points (Zero noise) */}
      <SubtleStarlight />

      {/* Atmospheric Space Station Lighting */}
      <ambientLight intensity={0.5} color="#e2e8f0" />
      <directionalLight position={[-50, 70, -30]} intensity={0.5} color="#f8fafc" />
    </group>
  );
}
