'use client';

import { Text } from '@react-three/drei';
import { useExhibitionStore } from '@/store/useExhibitionStore';
import BoothMesh from './BoothMesh';

export default function Zone2InnovationHub() {
  const projects = useExhibitionStore((state) => state.projects);
  const zone2Projects = projects.filter((p) => p.zone === 'zone-2');

  return (
    <group position={[0, 0, 0]}>
      {/* Overhead Cluster Gateways (Matching Blueprint Posters at Top) */}
      {/* Left Cluster: Physical (P01-P12) & Digital (D01-D04) */}
      <group position={[-9.25, 4.2, -19.5]}>
        <mesh>
          <boxGeometry args={[14, 0.85, 0.1]} />
          <meshStandardMaterial color="#0b101c" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <boxGeometry args={[14, 0.05, 0.12]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={1.2} />
        </mesh>
        <Text position={[0, 0, 0.08]} fontSize={0.36} color="#fbbf24" anchorX="center" anchorY="middle">
          PHYSICAL INNOVATIONS • BOOTHS P01 - P12 & D01 - D04
        </Text>
      </group>

      {/* Right Cluster: Digital (D05-D12) & Business (B01-B07) */}
      <group position={[10.25, 4.2, -19.5]}>
        <mesh>
          <boxGeometry args={[14, 0.85, 0.1]} />
          <meshStandardMaterial color="#0b101c" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <boxGeometry args={[14, 0.05, 0.12]} />
          <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={1.2} />
        </mesh>
        <Text position={[0, 0, 0.08]} fontSize={0.36} color="#38bdf8" anchorX="center" anchorY="middle">
          DIGITAL & BUSINESS VENTURES • BOOTHS D05 - D12 & B01 - B07
        </Text>
      </group>

      {/* All Zone 2 Booths (P01-P12, D01-D12, B01-B07) */}
      {zone2Projects.map((project) => (
        <BoothMesh key={project.id} project={project} />
      ))}
    </group>
  );
}
