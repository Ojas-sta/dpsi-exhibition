'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Procedural Milky Way Galactic Dust Band
 * Generates an astronomical arc of thousands of glowing stellar particles
 * mimicking the Milky Way's galactic core and dust lanes.
 */
function GalacticCoreBand() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate 5,500 particles along a curved celestial galactic disc
  const { positions, colors, sizes } = useMemo(() => {
    const count = 5500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const colorPalette = [
      new THREE.Color('#38bdf8'), // Starlight cyan
      new THREE.Color('#818cf8'), // Galactic indigo
      new THREE.Color('#c084fc'), // Nebula violet
      new THREE.Color('#f472b6'), // Cosmic magenta
      new THREE.Color('#fbbf24'), // Stellar gold (core stars)
      new THREE.Color('#ffffff'), // Pure white starlight
      new THREE.Color('#1e1b4b'), // Dark dust lane blue
    ];

    for (let i = 0; i < count; i++) {
      // Angle along the celestial galactic arc (-PI to PI)
      const theta = (Math.random() - 0.5) * Math.PI * 1.8;
      
      // Radius from center of the celestial sphere (distant background)
      const radius = 220 + (Math.random() - 0.5) * 80;
      
      // Galactic disc thickness (denser at core theta ~ 0)
      const coreDensity = Math.exp(-Math.pow(theta * 1.2, 2));
      const spreadY = (Math.random() - 0.5) * (45 + coreDensity * 55);
      const spreadOffset = (Math.random() - 0.5) * 35;

      // Tilting the galactic plane at ~32 degrees
      const x = Math.cos(theta) * radius + spreadOffset;
      const z = Math.sin(theta) * radius;
      const y = Math.sin(theta * 0.8) * 40 + spreadY;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color selection based on proximity to galactic core
      const pickColor =
        Math.random() < 0.35 + coreDensity * 0.4
          ? colorPalette[Math.floor(Math.random() * 4) + 2] // warm / nebula
          : colorPalette[Math.floor(Math.random() * 3)];     // blue / indigo

      colors[i * 3] = pickColor.r;
      colors[i * 3 + 1] = pickColor.g;
      colors[i * 3 + 2] = pickColor.b;

      // Particle size variation
      sizes[i] = Math.random() * 2.8 + (coreDensity > 0.4 ? 1.5 : 0.8);
    }

    return { positions, colors, sizes };
  }, []);

  // Gentle, hypnotic celestial rotation
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.008;
      pointsRef.current.rotation.x += delta * 0.002;
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
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2.2}
        vertexColors
        transparent
        opacity={0.88}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * Deep Space Celestial Dome
 * Rich atmospheric interstellar gradient
 */
function CosmicSkyDome() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Subtle rotation to sync with galactic movement
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.003;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[480, 32, 24]} />
      <meshBasicMaterial
        side={THREE.BackSide}
        color="#030511"
        depthWrite={false}
      />
    </mesh>
  );
}

export default function MilkyWayBackground() {
  return (
    <group>
      {/* 1. Deep Celestial Space Skybox */}
      <CosmicSkyDome />

      {/* 2. Deep Outer Starfield (5,000 distant stars) */}
      <Stars
        radius={260}
        depth={100}
        count={5000}
        factor={4}
        saturation={0.5}
        fade
        speed={0.6}
      />

      {/* 3. Closer Luminous Stars (1,200 twinkling stars) */}
      <Stars
        radius={140}
        depth={50}
        count={1200}
        factor={5.5}
        saturation={0.8}
        fade
        speed={1.0}
      />

      {/* 4. The Milky Way Galactic Spiral Dust Band */}
      <GalacticCoreBand />

      {/* 5. Floating Cosmic Micro-Stardust hovering gently around the venue */}
      <Sparkles
        count={120}
        scale={[110, 30, 110]}
        position={[0, 10, -8]}
        size={2.8}
        speed={0.25}
        opacity={0.55}
        color="#fde047"
      />
      <Sparkles
        count={80}
        scale={[100, 25, 100]}
        position={[-10, 8, -12]}
        size={3.2}
        speed={0.3}
        opacity={0.45}
        color="#38bdf8"
      />
    </group>
  );
}
