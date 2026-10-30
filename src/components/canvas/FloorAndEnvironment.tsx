'use client';

import { Environment, Float, Text } from '@react-three/drei';
import { useExhibitionStore } from '@/store/useExhibitionStore';

export default function FloorAndEnvironment() {
  const isMobile = useExhibitionStore((state) => state.isMobile);
  const theme = useExhibitionStore((state) => state.theme);
  const isLight = theme === 'light';

  return (
    <>
      {/* Studio Lighting Environment (Low intensity in light mode to prevent washout) */}
      <Environment preset={isLight ? "studio" : "city"} environmentIntensity={isLight ? 0.2 : 0.7} />

      {/* 
        Balanced Studio Directional Light 
        Positive shadow-bias prevents shadow acne & floor moiré lines
      */}
      <ambientLight intensity={isLight ? 0.45 : 0.75} color={isLight ? "#94a3b8" : "#f8fafc"} />
      <directionalLight
        position={[30, 50, 30]}
        intensity={isLight ? 0.65 : 1.2}
        color={isLight ? "#f8fafc" : "#ffffff"}
        castShadow={!isMobile}
        shadow-mapSize={isMobile ? [512, 512] : [2048, 2048]}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={0.0004}
      />

      <directionalLight
        position={[-30, 35, -30]}
        intensity={isLight ? 0.25 : 0.4}
        color={isLight ? "#94a3b8" : "#94a3b8"}
      />

      {/* ========================================================= */}
      {/* 1. SOLID ARCHITECTURAL FLOOR SLABS (Continuous Campus)    */}
      {/* ========================================================= */}
      
      {/* 
        Main Exhibition Hall Floor 
        Solid box: top at y=0.0, height=0.8, bottom at y=-0.8
      */}
      <mesh position={[-1, -0.4, 0]} receiveShadow>
        <boxGeometry args={[46, 0.8, 42]} />
        <meshStandardMaterial
          color={isLight ? "#8fa0b2" : "#0f172a"}
          roughness={isLight ? 0.82 : 0.48}
          metalness={isLight ? 0.05 : 0.2}
        />
      </mesh>

      {/* Main Hall Outer Base Accent (strictly BELOW at y=-0.82) */}
      <mesh position={[-1, -0.82, 0]}>
        <boxGeometry args={[46.6, 0.08, 42.6]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#0284c7"
          emissiveIntensity={isLight ? 0.35 : 0.6}
        />
      </mesh>

      {/* 
        Connecting Corridor 1: Main Hall <-> Robotics Arena Concourse
        Links Main Hall (z=-21) and Robotics Arena (z=-24) seamlessly
      */}
      <mesh position={[-1, -0.4, -22.5]} receiveShadow>
        <boxGeometry args={[32, 0.8, 5]} />
        <meshStandardMaterial
          color={isLight ? "#8899ab" : "#0d1424"}
          roughness={isLight ? 0.82 : 0.48}
          metalness={isLight ? 0.05 : 0.2}
        />
      </mesh>

      {/* Connecting Corridor 1 Base Accent */}
      <mesh position={[-1, -0.82, -22.5]}>
        <boxGeometry args={[32.4, 0.08, 5.4]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#d97706"
          emissiveIntensity={isLight ? 0.35 : 0.6}
        />
      </mesh>

      {/* 
        Top Arena Floor (Robotics Arenas)
        Solid box: top at y=0.0, height=0.8, bottom at y=-0.8
      */}
      <mesh position={[-1, -0.4, -36]} receiveShadow>
        <boxGeometry args={[46, 0.8, 24]} />
        <meshStandardMaterial
          color={isLight ? "#8293a5" : "#0b1120"}
          roughness={isLight ? 0.82 : 0.48}
          metalness={isLight ? 0.05 : 0.2}
        />
      </mesh>

      {/* Top Arena Outer Base Accent */}
      <mesh position={[-1, -0.82, -36]}>
        <boxGeometry args={[46.6, 0.08, 24.6]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#d97706"
          emissiveIntensity={isLight ? 0.35 : 0.6}
        />
      </mesh>

      {/* 
        Connecting Corridor 2: Covered Concourse to Show & Tell
        Links West Wall Entrance to Show & Tell Pavilion seamlessly
      */}
      <mesh position={[-28, -0.4, -6]} receiveShadow>
        <boxGeometry args={[14, 0.8, 8]} />
        <meshStandardMaterial
          color={isLight ? "#8fa0b2" : "#0f172a"}
          roughness={isLight ? 0.82 : 0.48}
          metalness={isLight ? 0.05 : 0.2}
        />
      </mesh>

      {/* Connecting Corridor 2 Base Accent */}
      <mesh position={[-28, -0.82, -6]}>
        <boxGeometry args={[14.4, 0.08, 8.4]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#7c3aed"
          emissiveIntensity={isLight ? 0.35 : 0.6}
        />
      </mesh>

      {/* 
        Left Angled Pavilion (Show & Tell)
        Solid box: top at y=0.0, height=0.8, bottom at y=-0.8
      */}
      <group position={[-36, 0, -6]} rotation={[0, -0.3208, 0]}>
        <mesh position={[0, -0.4, 0]} receiveShadow>
          <boxGeometry args={[26, 0.8, 14]} />
          <meshStandardMaterial
            color={isLight ? "#8d94a8" : "#141124"}
            roughness={isLight ? 0.82 : 0.48}
            metalness={isLight ? 0.05 : 0.2}
          />
        </mesh>
        {/* Base Accent */}
        <mesh position={[0, -0.82, 0]}>
          <boxGeometry args={[26.5, 0.08, 14.5]} />
          <meshStandardMaterial
            color="#9333ea"
            emissive="#7e22ce"
            emissiveIntensity={isLight ? 0.35 : 0.6}
          />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 2. OPEN ARCHITECTURAL WALLS & GRAND PORTALS               */}
      {/* ========================================================= */}
      
      {/* 
        North Wall with Grand Portal Archway into Robotics Arena
        Instead of a solid blind wall blocking the view, left and right walls flank a wide open entry
      */}
      {/* North Wall Left */}
      <mesh position={[-17.5, 1.2, -21]}>
        <boxGeometry args={[13, 2.4, 0.3]} />
        <meshStandardMaterial
          color={isLight ? "#526070" : "#1e293b"}
          metalness={isLight ? 0.2 : 0.7}
          roughness={isLight ? 0.6 : 0.3}
        />
      </mesh>
      {/* North Wall Right */}
      <mesh position={[15.5, 1.2, -21]}>
        <boxGeometry args={[13, 2.4, 0.3]} />
        <meshStandardMaterial
          color={isLight ? "#526070" : "#1e293b"}
          metalness={isLight ? 0.2 : 0.7}
          roughness={isLight ? 0.6 : 0.3}
        />
      </mesh>
      {/* North Portal Overhead Header Lintel */}
      <mesh position={[-1, 3.2, -21]}>
        <boxGeometry args={[20, 1.6, 0.4]} />
        <meshStandardMaterial
          color={isLight ? "#3f4c5b" : "#0f172a"}
          metalness={isLight ? 0.3 : 0.8}
          roughness={0.4}
        />
      </mesh>

      {/* South Wall */}
      <mesh position={[-1, 1.2, 21]}>
        <boxGeometry args={[46, 2.4, 0.3]} />
        <meshStandardMaterial
          color={isLight ? "#526070" : "#1e293b"}
          metalness={isLight ? 0.2 : 0.7}
          roughness={isLight ? 0.6 : 0.3}
        />
      </mesh>

      {/* East Wall */}
      <mesh position={[22, 1.2, 0]}>
        <boxGeometry args={[0.3, 2.4, 42]} />
        <meshStandardMaterial
          color={isLight ? "#526070" : "#1e293b"}
          metalness={isLight ? 0.2 : 0.7}
          roughness={isLight ? 0.6 : 0.3}
        />
      </mesh>

      {/* West Wall with 4 Entrance Door Openings */}
      <group position={[-24, 0, 0]}>
        <mesh position={[0, 1.2, -18]}>
          <boxGeometry args={[0.3, 2.4, 6]} />
          <meshStandardMaterial
            color={isLight ? "#526070" : "#1e293b"}
            metalness={isLight ? 0.2 : 0.7}
            roughness={isLight ? 0.6 : 0.3}
          />
        </mesh>
        <mesh position={[0, 1.2, -7]}>
          <boxGeometry args={[0.3, 2.4, 8]} />
          <meshStandardMaterial
            color={isLight ? "#526070" : "#1e293b"}
            metalness={isLight ? 0.2 : 0.7}
            roughness={isLight ? 0.6 : 0.3}
          />
        </mesh>
        <mesh position={[0, 1.2, 5]}>
          <boxGeometry args={[0.3, 2.4, 8]} />
          <meshStandardMaterial
            color={isLight ? "#526070" : "#1e293b"}
            metalness={isLight ? 0.2 : 0.7}
            roughness={isLight ? 0.6 : 0.3}
          />
        </mesh>
        <mesh position={[0, 1.2, 17]}>
          <boxGeometry args={[0.3, 2.4, 8]} />
          <meshStandardMaterial
            color={isLight ? "#526070" : "#1e293b"}
            metalness={isLight ? 0.2 : 0.7}
            roughness={isLight ? 0.6 : 0.3}
          />
        </mesh>
      </group>

      {/* Internal Aisle Dividers (Glass-like acrylic partitions) */}
      <group position={[0, 0.7, 0]}>
        {/* Horizontal divider above P07-P10 */}
        <mesh position={[7.5, 0, -11.5]}>
          <boxGeometry args={[21, 1.4, 0.15]} />
          <meshStandardMaterial
            color={isLight ? "#94a3b8" : "#334155"}
            metalness={isLight ? 0.4 : 0.8}
            roughness={0.2}
            transparent
            opacity={isLight ? 0.5 : 0.8}
          />
        </mesh>
        <mesh position={[18, 0, -9.25]}>
          <boxGeometry args={[0.15, 1.4, 4.5]} />
          <meshStandardMaterial
            color={isLight ? "#94a3b8" : "#334155"}
            metalness={isLight ? 0.4 : 0.8}
            roughness={0.2}
            transparent
            opacity={isLight ? 0.5 : 0.8}
          />
        </mesh>

        {/* Partition 2 (Between P11-D02 and D05-D08) */}
        <mesh position={[7.5, 0, 2.5]}>
          <boxGeometry args={[21, 1.4, 0.15]} />
          <meshStandardMaterial
            color={isLight ? "#94a3b8" : "#334155"}
            metalness={isLight ? 0.4 : 0.8}
            roughness={0.2}
            transparent
            opacity={isLight ? 0.5 : 0.8}
          />
        </mesh>
        <mesh position={[18, 0, 4.75]}>
          <boxGeometry args={[0.15, 1.4, 4.5]} />
          <meshStandardMaterial
            color={isLight ? "#94a3b8" : "#334155"}
            metalness={isLight ? 0.4 : 0.8}
            roughness={0.2}
            transparent
            opacity={isLight ? 0.5 : 0.8}
          />
        </mesh>

        {/* Partition 3 (Between D09-D12 and Business B aisle) */}
        <mesh position={[7.5, 0, 15]}>
          <boxGeometry args={[21, 1.4, 0.15]} />
          <meshStandardMaterial
            color={isLight ? "#94a3b8" : "#334155"}
            metalness={isLight ? 0.4 : 0.8}
            roughness={0.2}
            transparent
            opacity={isLight ? 0.5 : 0.8}
          />
        </mesh>
      </group>

      {/* Entrance Welcome Desks */}
      <group position={[-21, 0, 0]}>
        {[-14, -6, 2, 10].map((z, i) => (
          <group key={i} position={[0, 0.45, z]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.4, 0.9, 0.8]} />
              <meshStandardMaterial color={isLight ? "#e11d48" : "#be123c"} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.46, 0]}>
              <boxGeometry args={[1.5, 0.04, 0.85]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Architectural Entrance Portal Banner across North Wall */}
      <group position={[-1, 6.2, -21]}>
        {/* Supporting Architectural Pillars */}
        <mesh position={[-11, -3.1, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.35, 6.2, 16]} />
          <meshStandardMaterial color={isLight ? "#94a3b8" : "#334155"} metalness={0.7} />
        </mesh>
        <mesh position={[11, -3.1, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.35, 6.2, 16]} />
          <meshStandardMaterial color={isLight ? "#94a3b8" : "#334155"} metalness={0.7} />
        </mesh>

        {/* Portal Signboard */}
        <Float speed={0.8} rotationIntensity={0.01} floatIntensity={0.05}>
          <group>
            <mesh position={[0, 0, -0.15]}>
              <boxGeometry args={[24, 2.2, 0.25]} />
              <meshStandardMaterial
                color={isLight ? "#cbd5e1" : "#090d16"}
                metalness={isLight ? 0.2 : 0.85}
                roughness={isLight ? 0.3 : 0.25}
              />
            </mesh>
            <mesh position={[0, 0, -0.05]}>
              <boxGeometry args={[24.3, 2.35, 0.08]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#d97706"
                emissiveIntensity={isLight ? 0.4 : 0.7}
              />
            </mesh>
            <Text
              position={[0, 0.35, 0.1]}
              fontSize={0.82}
              color={isLight ? "#0f172a" : "#ffffff"}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.08}
            >
              DPS INDIRAPURAM TECH & INNOVATION
            </Text>
            <Text
              position={[0, -0.4, 0.1]}
              fontSize={0.4}
              color={isLight ? "#b45309" : "#fbbf24"}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.15}
            >
              ★ 35 INVENTIONS • PHYSICAL • DIGITAL • BUSINESS • ROBOTICS ★
            </Text>
          </group>
        </Float>
      </group>
    </>
  );
}
