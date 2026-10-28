'use client';

import { MeshReflectorMaterial, ContactShadows, Environment, Float, Text } from '@react-three/drei';
import { useExhibitionStore } from '@/store/useExhibitionStore';

export default function FloorAndEnvironment() {
  const isMobile = useExhibitionStore((state) => state.isMobile);

  return (
    <>
      {/* Studio HDRI Environment */}
      <Environment preset="city" />

      {/* Balanced Soft Ambient & Directional Lighting */}
      <ambientLight intensity={0.65} color="#e2e8f0" />
      <directionalLight
        position={[25, 45, 25]}
        intensity={1.2}
        color="#fffaf0"
        castShadow={!isMobile}
        shadow-mapSize={isMobile ? [512, 512] : [2048, 2048]}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Soft Fill Light from opposite quadrant */}
      <directionalLight
        position={[-25, 30, -30]}
        intensity={0.5}
        color="#94a3b8"
      />

      {/* ========================================================= */}
      {/* 1. FLOOR PLAN BASES (Matching Blueprint)                  */}
      {/* ========================================================= */}
      
      {/* Main Exhibition Hall Floor (Obsidian Slate Satin) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1, -0.01, 0]} receiveShadow>
        <planeGeometry args={[46, 42]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={isMobile ? 512 : 1024}
          mirror={0.35}
          mixBlur={0.8}
          mixStrength={1.2}
          roughness={0.28}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0f1422"
          metalness={0.3}
        />
      </mesh>

      {/* Top Hall Floor (Robotics Arena Room) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1, -0.01, -36]} receiveShadow>
        <planeGeometry args={[46, 24]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={isMobile ? 512 : 1024}
          mirror={0.35}
          mixBlur={0.8}
          mixStrength={1.2}
          roughness={0.28}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0b101c"
          metalness={0.3}
        />
      </mesh>

      {/* Left Angled Pavilion Floor (Show & Tell) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0.22]} // 12-degree angle matching blueprint
        position={[-36, -0.008, -6]}
        receiveShadow
      >
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#1a1528" roughness={0.35} metalness={0.4} />
      </mesh>

      {/* Subtle Corridor Boundary Lines (Zero Glare, Clean Architectural Insets) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1, 0.002, 0]}>
        <ringGeometry args={[0, 0, 0]} />
      </mesh>

      {/* Soft Contact Shadows across floor */}
      {!isMobile && (
        <ContactShadows
          position={[0, 0.005, 0]}
          opacity={0.6}
          scale={90}
          blur={1.8}
          far={15}
          resolution={1024}
          color="#000000"
        />
      )}

      {/* ========================================================= */}
      {/* 2. BLUEPRINT CORRIDOR PARTITION WALLS (Thick Black Lines) */}
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
      {/* Partition 1 (Above Physical P01-P04 aisle divider) */}
      <group position={[0, 0.7, 0]}>
        {/* Horizontal divider above P07-P10 */}
        <mesh position={[7.5, 0, -11.5]}>
          <boxGeometry args={[21, 1.4, 0.15]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} transparent opacity={0.85} />
        </mesh>
        {/* Vertical turn near P04/P07 */}
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

      {/* Entrance Help Desks & School Banners (from blueprint left side) */}
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

      {/* Main Overhead Architectural Header in Top Room */}
      <Float speed={1.2} rotationIntensity={0.02} floatIntensity={0.15}>
        <group position={[-1, 14, -48]}>
          <mesh position={[0, 0, -0.2]}>
            <boxGeometry args={[44, 3.8, 0.4]} />
            <meshStandardMaterial color="#0b101c" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, -0.1]}>
            <boxGeometry args={[44.4, 4.2, 0.1]} />
            <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.8} />
          </mesh>
          <Text
            position={[0, 0.6, 0.1]}
            fontSize={1.35}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.09}
          >
            DPS INDIRAPURAM TECH & INNOVATION EXHIBITION
          </Text>
          <Text
            position={[0, -0.8, 0.1]}
            fontSize={0.65}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.18}
          >
            ★ OFFICIAL FLOOR PLAN: PHYSICAL • DIGITAL • BUSINESS • ROBOTICS ★
          </Text>
        </group>
      </Float>
    </>
  );
}
