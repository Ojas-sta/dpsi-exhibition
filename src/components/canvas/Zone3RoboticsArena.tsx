'use client';

import { Text } from '@react-three/drei';
import { useExhibitionStore } from '@/store/useExhibitionStore';
import BoothMesh from './BoothMesh';

export default function Zone3RoboticsArena() {
  const projects = useExhibitionStore((state) => state.projects);
  const zone3Projects = projects.filter((p) => p.zone === 'zone-3');

  return (
    <group position={[0, 0, 0]}>
      {/* ======================================================== */}
      {/* 1. LEFT ARENA: ROBO RACE CIRCUIT (x = -10, z = -36)      */}
      {/* ======================================================== */}
      <group position={[-10, 0, -36]}>
        <Text
          position={[0, 3.2, -8.5]}
          fontSize={0.48}
          color="#f87171"
          anchorX="center"
          anchorY="middle"
        >
          ARENA 1 • ROBO SPEEDWAY CIRCUIT
        </Text>

        {/* Platform Base */}
        <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
          <boxGeometry args={[12, 0.4, 15]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Green Turf Track Surface (from blueprint green rectangle) */}
        <mesh position={[0, 0.41, 0]} receiveShadow>
          <boxGeometry args={[11.4, 0.02, 14.4]} />
          <meshStandardMaterial color="#065f46" roughness={0.7} />
        </mesh>

        {/* Outer Crimson Guardrails */}
        <mesh position={[0, 0.6, -7.2]}>
          <boxGeometry args={[11.4, 0.35, 0.08]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, 0.6, 7.2]}>
          <boxGeometry args={[11.4, 0.35, 0.08]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[-5.7, 0.6, 0]}>
          <boxGeometry args={[0.08, 0.35, 14.4]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[5.7, 0.6, 0]}>
          <boxGeometry args={[0.08, 0.35, 14.4]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.8} />
        </mesh>

        {/* Center Chicane Barrier */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[5.5, 0.35, 7.5]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Start / Finish Arch */}
        <group position={[3.2, 0.4, 5.0]}>
          <mesh position={[-1.2, 1.2, 0]}>
            <boxGeometry args={[0.12, 2.4, 0.12]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <mesh position={[1.2, 1.2, 0]}>
            <boxGeometry args={[0.12, 2.4, 0.12]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <mesh position={[0, 2.3, 0]}>
            <boxGeometry args={[2.55, 0.25, 0.15]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <Text position={[0, 2.3, 0.09]} fontSize={0.2} color="#000000" anchorX="center" anchorY="middle">
            START / FINISH
          </Text>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 2. RIGHT ARENA: ROBO SOCCER STADIUM (x = 10, z = -36)    */}
      {/* ======================================================== */}
      <group position={[10, 0, -36]}>
        <Text
          position={[0, 3.2, -8.5]}
          fontSize={0.48}
          color="#34d399"
          anchorX="center"
          anchorY="middle"
        >
          ARENA 2 • ROBO SOCCER PITCH
        </Text>

        {/* Platform Base */}
        <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
          <boxGeometry args={[12, 0.4, 15]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Green Astroturf (from blueprint green rectangle) */}
        <mesh position={[0, 0.41, 0]} receiveShadow>
          <boxGeometry args={[11.4, 0.02, 14.4]} />
          <meshStandardMaterial color="#059669" roughness={0.7} />
        </mesh>

        {/* Pitch Lines */}
        <mesh position={[0, 0.425, 0]}>
          <boxGeometry args={[10.5, 0.01, 0.08]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.425, 0]}>
          <ringGeometry args={[1.5, 1.58, 32]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Clear Acrylic Walls */}
        <mesh position={[0, 0.7, -7.2]}>
          <boxGeometry args={[11.4, 0.5, 0.08]} />
          <meshStandardMaterial color="#10b981" transparent opacity={0.35} />
        </mesh>
        <mesh position={[0, 0.7, 7.2]}>
          <boxGeometry args={[11.4, 0.5, 0.08]} />
          <meshStandardMaterial color="#10b981" transparent opacity={0.35} />
        </mesh>

        {/* Goalposts */}
        <group position={[0, 0.42, -6.8]}>
          <mesh position={[-1.2, 0.5, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.0, 16]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[1.2, 0.5, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.0, 16]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[0, 1.0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 2.4, 16]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
        </group>

        <group position={[0, 0.42, 6.8]}>
          <mesh position={[-1.2, 0.5, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.0, 16]} />
            <meshStandardMaterial color="#f87171" />
          </mesh>
          <mesh position={[1.2, 0.5, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.0, 16]} />
            <meshStandardMaterial color="#f87171" />
          </mesh>
          <mesh position={[0, 1.0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 2.4, 16]} />
            <meshStandardMaterial color="#f87171" />
          </mesh>
        </group>

        {/* Mini Ball */}
        <mesh position={[0.2, 0.62, 0]} castShadow>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.3} />
        </mesh>
      </group>

      {/* Robotics Teams Pit-Stops */}
      {zone3Projects.map((project) => (
        <BoothMesh key={project.id} project={project} />
      ))}
    </group>
  );
}
