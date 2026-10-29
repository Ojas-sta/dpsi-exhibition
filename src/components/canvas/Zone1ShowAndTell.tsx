'use client';

import { Float, Text } from '@react-three/drei';
import { useExhibitionStore } from '@/store/useExhibitionStore';
import BoothMesh from './BoothMesh';

export default function Zone1ShowAndTell() {
  const projects = useExhibitionStore((state) => state.projects);
  const zone1Projects = projects.filter((p) => p.zone === 'zone-1');

  return (
    <group position={[0, 0, 0]}>
      {/* Overhead Angled Pavilion Signage (aligned with -0.3208 rad pavilion angle) */}
      <Float speed={1.0} rotationIntensity={0.01} floatIntensity={0.1}>
        <group position={[-36, 6.5, -6]} rotation={[0, -0.3208, 0]}>
          <mesh position={[0, 0, -0.1]}>
            <boxGeometry args={[18, 2.2, 0.2]} />
            <meshStandardMaterial color="#0f1422" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, -0.05]}>
            <boxGeometry args={[18.3, 2.4, 0.05]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={0.8} />
          </mesh>
          <Text
            position={[0, 0.35, 0.1]}
            fontSize={0.78}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.08}
          >
            SHOW & TELL PAVILION
          </Text>
          <Text
            position={[0, -0.4, 0.1]}
            fontSize={0.38}
            color="#c084fc"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.15}
          >
            • JUNIOR & SENIOR INNOVATION SHOWCASE (ST01 - ST08) •
          </Text>
        </group>
      </Float>

      {/* Show & Tell Interactive Booths */}
      {zone1Projects.map((project) => (
        <BoothMesh key={project.id} project={project} />
      ))}
    </group>
  );
}
