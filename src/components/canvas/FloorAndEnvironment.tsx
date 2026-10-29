'use client';

import { Environment, Float, Text } from '@react-three/drei';
import { useExhibitionStore } from '@/store/useExhibitionStore';

export default function FloorAndEnvironment() {
  const isMobile = useExhibitionStore((state) => state.isMobile);

  return (
    <>
      {/* Studio Lighting Environment */}
      <Environment preset="city" />

      {/* 
        Balanced Studio Directional Light 
        CRITICAL: shadow-bias must be POSITIVE (0.0004) to prevent shadow acne zebra stripes
      */}
      <ambientLight intensity={0.75} color="#f8fafc" />
      <directionalLight
        position={[30, 50, 30]}
        intensity={1.2}
        color="#ffffff"
        castShadow={!isMobile}
        shadow-mapSize={isMobile ? [512, 512] : [2048, 2048]}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={0.0004} // Fixes all shadow acne & floor moire
      />

      <directionalLight
        position={[-30, 35, -30]}
        intensity={0.4}
        color="#94a3b8"
      />

      {/* ========================================================= */}
      {/* 1. SOLID ARCHITECTURAL FLOOR SLABS (Zero Z-Fighting)      */}
      {/* ========================================================= */}
      
      {/* 
        Main Exhibition Hall Floor 
        Solid box: top at y=0.0, height=0.8, bottom at y=-0.8
        Guaranteed zero coplanar collision, zero raster lines
      */}
      <mesh position={[-1, -0.4, 0]} receiveShadow>
        <boxGeometry args={[46, 0.8, 42]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.48}
          metalness={0.2}
        />
      </mesh>

      {/* Main Hall Outer Base Accent (placed strictly BELOW at y=-0.82) */}
      <mesh position={[-1, -0.82, 0]}>
        <boxGeometry args={[46.6, 0.08, 42.6]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.6} />
      </mesh>

      {/* 
        Top Arena Floor (Robotics Arenas)
        Solid box: top at y=0.0, height=0.8, bottom at y=-0.8
      */}
      <mesh position={[-1, -0.4, -36]} receiveShadow>
        <boxGeometry args={[46, 0.8, 24]} />
        <meshStandardMaterial
          color="#0b1120"
          roughness={0.48}
          metalness={0.2}
        />
      </mesh>

      {/* Top Arena Outer Base Accent (placed strictly BELOW at y=-0.82) */}
      <mesh position={[-1, -0.82, -36]}>
        <boxGeometry args={[46.6, 0.08, 24.6]} />
        <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.6} />
      </mesh>

      {/* 
        Left Angled Pavilion (Show & Tell)
        Aligned with blueprint angle (-0.24 rad) & Dual-Row Layout
      */}
      <group position={[-34, 0, 0]} rotation={[0, -0.24, 0]}>
        <mesh position={[0, -0.4, 0]} receiveShadow>
          <boxGeometry args={[12, 0.8, 24]} />
          <meshStandardMaterial
            color="#141124"
            roughness={0.48}
            metalness={0.2}
          />
        </mesh>
        {/* Base Accent strictly BELOW at y=-0.82 */}
        <mesh position={[0, -0.82, 0]}>
          <boxGeometry args={[12.4, 0.08, 24.4]} />
          <meshStandardMaterial color="#9333ea" emissive="#7e22ce" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 2. BLUEPRINT CORRIDOR PARTITION WALLS                     */}
      {/* ========================================================= */}
      {/* North Wall between Main Hall and Top Arena Room */}
      <mesh position={[-1, 1.2, -21]}>
        <boxGeometry args={[46, 2.4, 0.3]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* South Wall */}
      <mesh position={[-1, 1.2, 21]}>
        <boxGeometry args={[46, 2.4, 0.3]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* East Wall */}
      <mesh position={[22, 1.2, 0]}>
        <boxGeometry args={[0.3, 2.4, 42]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* West Wall with 4 Entrance Door Openings */}
      <group position={[-24, 0, 0]}>
        <mesh position={[0, 1.2, -18]}>
          <boxGeometry args={[0.3, 2.4, 6]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.2, -7]}>
          <boxGeometry args={[0.3, 2.4, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.2, 5]}>
          <boxGeometry args={[0.3, 2.4, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.2, 17]}>
          <boxGeometry args={[0.3, 2.4, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Central Spine Divider between Left & Right Horseshoe Clusters (From Blueprint) */}
      <group position={[0.5, 0.7, -2.5]}>
        {/* Longitudinal partition separating P11-D04 row and D10-D05 row */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.2, 1.4, 30]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Decorative Plants in Top Right Corner (next to B02/B03 as in Blueprint) */}
      <group position={[18.5, 0, -16.5]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.35, 0.28, 0.8, 16]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.48, 16, 16]} />
          <meshStandardMaterial color="#10b981" roughness={0.6} />
        </mesh>
        <mesh position={[1.1, 0.35, 0.8]}>
          <cylinderGeometry args={[0.3, 0.24, 0.7, 16]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[1.1, 0.9, 0.8]}>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshStandardMaterial color="#059669" roughness={0.6} />
        </mesh>
      </group>

      {/* Entrance Help Desks */}
      <group position={[-21, 0, 0]}>
        {[-14, -6, 2, 10].map((z, i) => (
          <group key={i} position={[0, 0.45, z]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.4, 0.9, 0.8]} />
              <meshStandardMaterial color="#e11d48" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.46, 0]}>
              <boxGeometry args={[1.5, 0.04, 0.85]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Decorative Plants in Bottom Right Corner (B04-B07 corner) */}
      <group position={[19.5, 0, 19.5]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.3, 0.25, 0.8, 16]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshStandardMaterial color="#10b981" roughness={0.6} />
        </mesh>
      </group>

      {/* Architectural Entrance Portal Banner across North Wall */}
      <Float speed={1.0} rotationIntensity={0.01} floatIntensity={0.1}>
        <group position={[-1, 7.5, -21]}>
          <mesh position={[0, 0, -0.15]}>
            <boxGeometry args={[32, 2.6, 0.25]} />
            <meshStandardMaterial color="#090d16" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0, -0.05]}>
            <boxGeometry args={[32.3, 2.8, 0.08]} />
            <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.7} />
          </mesh>
          <Text
            position={[0, 0.4, 0.1]}
            fontSize={0.95}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.08}
          >
            DPS INDIRAPURAM TECH & INNOVATION EXHIBITION
          </Text>
          <Text
            position={[0, -0.5, 0.1]}
            fontSize={0.48}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.15}
          >
            ★ OFFICIAL FLOOR PLAN: PHYSICAL • DIGITAL • BUSINESS • ROBOTICS ★
          </Text>
        </group>
      </Float>
    </>
  );
}
