'use client';

import { ContactShadows, Environment, Float, Text } from '@react-three/drei';
import { useExhibitionStore } from '@/store/useExhibitionStore';

export default function FloorAndEnvironment() {
  const isMobile = useExhibitionStore((state) => state.isMobile);

  return (
    <>
      {/* Studio Lighting Environment */}
      <Environment preset="city" />

      {/* Balanced, Noise-Free Architectural Studio Lighting */}
      <ambientLight intensity={0.7} color="#f1f5f9" />
      <directionalLight
        position={[30, 50, 30]}
        intensity={1.25}
        color="#ffffff"
        castShadow={!isMobile}
        shadow-mapSize={isMobile ? [512, 512] : [2048, 2048]}
        shadow-camera-left={-65}
        shadow-camera-right={65}
        shadow-camera-top={55}
        shadow-camera-bottom={-55}
        shadow-bias={-0.0001}
      />

      {/* Soft Fill Light from opposite angle */}
      <directionalLight
        position={[-30, 35, -30]}
        intensity={0.45}
        color="#cbd5e1"
      />

      {/* ========================================================= */}
      {/* 1. FLOOR PLAN BASES (Clean, Noise-Free Architectural PBR)  */}
      {/* ========================================================= */}
      
      {/* Floating Pavilion Foundation Slabs with Clean Underglow */}
      {/* Main Hall Foundation */}
      <mesh position={[-1, -0.4, 0]}>
        <boxGeometry args={[46.4, 0.78, 42.4]} />
        <meshStandardMaterial color="#090d16" roughness={0.6} metalness={0.7} />
      </mesh>
      <mesh position={[-1, -0.05, 0]}>
        <boxGeometry args={[46.7, 0.08, 42.7]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.5} />
      </mesh>

      {/* Top Arena Foundation */}
      <mesh position={[-1, -0.4, -36]}>
        <boxGeometry args={[46.4, 0.78, 24.4]} />
        <meshStandardMaterial color="#090d16" roughness={0.6} metalness={0.7} />
      </mesh>
      <mesh position={[-1, -0.05, -36]}>
        <boxGeometry args={[46.7, 0.08, 24.7]} />
        <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.5} />
      </mesh>

      {/* Main Exhibition Hall Floor (Clean Satin Obsidian Slate - Zero Banding) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1, 0, 0]} receiveShadow>
        <planeGeometry args={[46, 42]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.42}
          metalness={0.25}
          envMapIntensity={0.6}
        />
      </mesh>

      {/* Subtle Architectural Floor Grid Lines (Clean & Professional) */}
      <gridHelper
        args={[46, 23, '#334155', '#1e293b']}
        position={[-1, 0.003, 0]}
      />

      {/* Top Hall Floor (Robotics Arena Room) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1, 0, -36]} receiveShadow>
        <planeGeometry args={[46, 24]} />
        <meshStandardMaterial
          color="#0b1120"
          roughness={0.42}
          metalness={0.25}
          envMapIntensity={0.6}
        />
      </mesh>
      <gridHelper
        args={[46, 12, '#334155', '#1e293b']}
        position={[-1, 0.003, -36]}
      />

      {/* Left Angled Pavilion (Show & Tell) - Perfectly Unified & Aligned */}
      <group position={[-36, 0, -6]} rotation={[0, -0.22, 0]}>
        {/* Foundation Slab */}
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[14, 0.78, 26]} />
          <meshStandardMaterial color="#0b0d18" roughness={0.6} metalness={0.7} />
        </mesh>
        {/* Underglow Accent Rim */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[14.3, 0.08, 26.3]} />
          <meshStandardMaterial color="#9333ea" emissive="#7e22ce" emissiveIntensity={0.5} />
        </mesh>
        {/* Floor Surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[14, 26]} />
          <meshStandardMaterial
            color="#141124"
            roughness={0.45}
            metalness={0.3}
            envMapIntensity={0.6}
          />
        </mesh>
        <gridHelper
          args={[26, 13, '#475569', '#2e1065']}
          position={[0, 0.003, 0]}
          rotation={[0, Math.PI / 2, 0]}
        />
      </group>

      {/* Soft Contact Shadows across floor */}
      {!isMobile && (
        <ContactShadows
          position={[0, 0.005, 0]}
          opacity={0.5}
          scale={90}
          blur={2.0}
          far={15}
          resolution={1024}
          color="#000000"
        />
      )}

      {/* ========================================================= */}
      {/* 2. BLUEPRINT CORRIDOR PARTITION WALLS                     */}
      {/* ========================================================= */}
      {/* Outer Hall Boundary Walls */}
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

      {/* Internal Serpentine Partition Walls (From Blueprint) */}
      <group position={[0, 0.7, 0]}>
        {/* Horizontal divider above P07-P10 */}
        <mesh position={[7.5, 0, -11.5]}>
          <boxGeometry args={[21, 1.4, 0.15]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} transparent opacity={0.85} />
        </mesh>
        <mesh position={[18, 0, -9.25]}>
          <boxGeometry args={[0.15, 1.4, 4.5]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} transparent opacity={0.85} />
        </mesh>

        {/* Partition 2 (Between P11-D02 and D05-D08) */}
        <mesh position={[7.5, 0, 2.5]}>
          <boxGeometry args={[21, 1.4, 0.15]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} transparent opacity={0.85} />
        </mesh>
        <mesh position={[18, 0, 4.75]}>
          <boxGeometry args={[0.15, 1.4, 4.5]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} transparent opacity={0.85} />
        </mesh>

        {/* Partition 3 (Between D09-D12 and Business B aisle) */}
        <mesh position={[7.5, 0, 15]}>
          <boxGeometry args={[21, 1.4, 0.15]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} transparent opacity={0.85} />
        </mesh>
      </group>

      {/* Entrance Help Desks & School Banners */}
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
