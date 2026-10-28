'use client';

import { Text } from '@react-three/drei';
import { useExhibitionStore } from '@/store/useExhibitionStore';
import BoothMesh from './BoothMesh';

export default function Zone2InnovationHub() {
  const projects = useExhibitionStore((state) => state.projects);
  const zone2Projects = projects.filter((p) => p.zone === 'zone-2');

  return (
    <group position={[0, 0, 0]}>
      {/* Aisle Overhead Indicator Plates */}
      {/* Physical Aisle (P01 - P12) */}
      <group position={[10, 5.5, -17.5]}>
        <mesh>
          <boxGeometry args={[14, 0.9, 0.1]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[14, 0.06, 0.12]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={1.2} />
        </mesh>
        <Text position={[0, 0, 0.08]} fontSize={0.38} color="#fbbf24" anchorX="center" anchorY="middle">
          PHYSICAL TECH • BOOTHS P01 - P12
        </Text>
      </group>

      {/* Digital Aisle (D01 - D12) */}
      <group position={[10, 5.5, 0]}>
        <mesh>
          <boxGeometry args={[14, 0.9, 0.1]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[14, 0.06, 0.12]} />
          <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={1.2} />
        </mesh>
        <Text position={[0, 0, 0.08]} fontSize={0.38} color="#38bdf8" anchorX="center" anchorY="middle">
          DIGITAL SOLUTIONS • BOOTHS D01 - D12
        </Text>
      </group>

      {/* Business Aisle (B01 - B07) */}
      <group position={[10, 5.5, 17.5]}>
        <mesh>
          <boxGeometry args={[14, 0.9, 0.1]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[14, 0.06, 0.12]} />
          <meshStandardMaterial color="#059669" emissive="#047857" emissiveIntensity={1.2} />
        </mesh>
        <Text position={[0, 0, 0.08]} fontSize={0.38} color="#34d399" anchorX="center" anchorY="middle">
          BUSINESS VENTURES • BOOTHS B01 - B07
        </Text>
      </group>

      {/* All Zone 2 Booths (P01-P12, D01-D12, B01-B07) */}
      {zone2Projects.map((project) => (
        <BoothMesh key={project.id} project={project} />
      ))}
    </group>
  );
}
