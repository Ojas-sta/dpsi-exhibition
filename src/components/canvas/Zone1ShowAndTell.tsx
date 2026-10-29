'use client';

import { Float, Text } from '@react-three/drei';
import { useExhibitionStore } from '@/store/useExhibitionStore';
import BoothMesh from './BoothMesh';

export default function Zone1ShowAndTell() {
  const projects = useExhibitionStore((state) => state.projects);
  const zone1Projects = projects.filter((p) => p.zone === 'zone-1');

  return (
    <group position={[0, 0, 0]}>
      {/* Overhead Angled Pavilion Signage (Aligned with -0.24 rad Pavilion Corridor) */}
      <Float speed={1.0} rotationIntensity={0.01} floatIntensity={0.1}>
        <group position={[-35.5, 4.5, -9.5]} rotation={[0, -0.24, 0]}>
          <mesh position={[0, 0, -0.1]}>
            <boxGeometry args={[11, 1.8, 0.15]} />
            <meshStandardMaterial color="#0b0e18" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, -0.05]}>
            <boxGeometry args={[11.2, 1.95, 0.04]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={0.8} />
          </mesh>
          <Text
            position={[0, 0.25, 0.1]}
            fontSize={0.62}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.08}
          >
            SHOW & TELL PAVILION
          </Text>
          <Text
            position={[0, -0.32, 0.1]}
            fontSize={0.32}
            color="#c084fc"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.12}
          >
            • JUNIOR & SENIOR INNOVATION SHOWCASE (ST01 - ST08) •
          </Text>
        </group>
      </Float>

      {/* Show & Tell Interactive Booths (Dual-row facing layout from Blueprint) */}
      {zone1Projects.map((project) => (
        <BoothMesh key={project.id} project={project} />
      ))}
    </group>
  );
}
