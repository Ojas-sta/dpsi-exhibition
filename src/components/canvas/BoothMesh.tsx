'use client';

import { useState, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Project, CategoryType } from '@/types';
import { useExhibitionStore } from '@/store/useExhibitionStore';
import { ThumbsUp } from 'lucide-react';

interface BoothMeshProps {
  project: Project;
}

const CATEGORY_STYLES: Record<CategoryType, {
  color: string;
  glow: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}> = {
  Physical: {
    color: '#f59e0b',
    glow: '#fbbf24',
    badgeBg: 'bg-amber-950/90',
    badgeBorder: 'border-amber-500/70',
    badgeText: 'text-amber-300',
  },
  Digital: {
    color: '#0284c7',
    glow: '#38bdf8',
    badgeBg: 'bg-sky-950/90',
    badgeBorder: 'border-sky-500/70',
    badgeText: 'text-sky-300',
  },
  Business: {
    color: '#059669',
    glow: '#34d399',
    badgeBg: 'bg-emerald-950/90',
    badgeBorder: 'border-emerald-500/70',
    badgeText: 'text-emerald-300',
  },
  'Show & Tell': {
    color: '#7c3aed',
    glow: '#a78bfa',
    badgeBg: 'bg-purple-950/90',
    badgeBorder: 'border-purple-500/70',
    badgeText: 'text-purple-300',
  },
  'Robo Race': {
    color: '#dc2626',
    glow: '#f87171',
    badgeBg: 'bg-rose-950/90',
    badgeBorder: 'border-rose-500/70',
    badgeText: 'text-rose-300',
  },
  'Robo Soccer': {
    color: '#0d9488',
    glow: '#2dd4bf',
    badgeBg: 'bg-teal-950/90',
    badgeBorder: 'border-teal-500/70',
    badgeText: 'text-teal-300',
  },
};

export default function BoothMesh({ project }: BoothMeshProps) {
  const [hovered, setHovered] = useState(false);
  const meshGroupRef = useRef<THREE.Group>(null);

  const selectedProject = useExhibitionStore((state) => state.selectedProject);
  const selectProject = useExhibitionStore((state) => state.selectProject);
  const votedProjectIds = useExhibitionStore((state) => state.votedProjectIds);
  const isMobile = useExhibitionStore((state) => state.isMobile);

  const isSelected = selectedProject?.id === project.id;
  const isAnySelected = Boolean(selectedProject);
  const hasVoted = votedProjectIds.includes(project.id);
  const style = CATEGORY_STYLES[project.category] || CATEGORY_STYLES['Digital'];

  useFrame((_, delta) => {
    if (meshGroupRef.current) {
      const targetY = isSelected || hovered ? project.position_y + 0.18 : project.position_y;
      meshGroupRef.current.position.y = THREE.MathUtils.damp(
        meshGroupRef.current.position.y,
        targetY,
        6,
        delta
      );
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    selectProject(project);
  };

  return (
    <group
      ref={meshGroupRef}
      position={[project.position_x, project.position_y, project.position_z]}
      onClick={handleClick}
      onPointerDown={isMobile ? handleClick : undefined}
      onPointerOver={(e) => {
        if (!isMobile) {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        if (!isMobile) {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }
      }}
    >
      {/* Invisible Touch Hit-box */}
      <mesh position={[0, 1.2, 0]} visible={false}>
        <cylinderGeometry args={[2.0, 2.0, 3.0, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 1. Base Platform in Matte Slate */}
      <mesh position={[0, 0.06, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.2, 0.12, 1.4]} />
        <meshStandardMaterial
          color={isSelected ? '#1e293b' : '#0f172a'}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Glowing Category Base Accent Line */}
      <mesh position={[0, 0.125, 0]}>
        <boxGeometry args={[2.1, 0.02, 1.3]} />
        <meshStandardMaterial
          color={style.glow}
          emissive={style.color}
          emissiveIntensity={hovered || isSelected ? 1.8 : 0.8}
        />
      </mesh>

      {/* 2. Exhibition Counter Desk */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.75, 0.8]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.5}
          roughness={0.25}
        />
      </mesh>

      {/* Front Glowing Light Strip */}
      <mesh position={[0, 0.75, 0.41]}>
        <boxGeometry args={[1.7, 0.05, 0.02]} />
        <meshStandardMaterial
          color={style.glow}
          emissive={style.glow}
          emissiveIntensity={hovered || isSelected ? 2.0 : 0.9}
        />
      </mesh>

      {/* 3. Sleek Display Screen Backboard */}
      <mesh position={[0, 1.45, -0.32]} rotation={[-0.05, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.85, 0.06]} />
        <meshStandardMaterial color="#0b101c" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Screen Face */}
      <mesh position={[0, 1.45, -0.28]}>
        <planeGeometry args={[1.4, 0.75]} />
        <meshStandardMaterial
          color="#111827"
          emissive={style.color}
          emissiveIntensity={hovered || isSelected ? 0.7 : 0.25}
        />
      </mesh>

      {/* 4. Two Exhibitor Red Chairs / Stools (from Blueprint) */}
      <group position={[0, 0, 0.85]}>
        <mesh position={[-0.5, 0.35, 0]} castShadow>
          <boxGeometry args={[0.4, 0.08, 0.4]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        <mesh position={[-0.5, 0.17, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>

        <mesh position={[0.5, 0.35, 0]} castShadow>
          <boxGeometry args={[0.4, 0.08, 0.4]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        <mesh position={[0.5, 0.17, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
      </group>

      {/* 5. Pure WebGL Selection Floor Halo & Accent Light */}
      {isSelected && (
        <group position={[0, 0.02, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 1.75, 32]} />
            <meshBasicMaterial color={style.glow} transparent opacity={0.85} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.5, 32]} />
            <meshBasicMaterial color={style.glow} transparent opacity={0.12} />
          </mesh>
          <pointLight position={[0, 3.2, 0]} intensity={3.0} color={style.glow} distance={7} decay={2} />
        </group>
      )}

      {/* 6. Floating 3D Badge:
          - When NO project is selected: all booths show their interactive badge.
          - When ANY project is selected:
            * All OTHER booths: completely HIDDEN (return null) so there is ZERO overlap and clutter.
            * The SELECTED booth: shows a sleek, compact tag that never blocks the 3D booth or overlaps UI.
      */}
      {isSelected ? (
        <Html
          position={[0, 2.1, 0]}
          distanceFactor={22}
          zIndexRange={[15, 0]}
          center
          className="pointer-events-none select-none font-sans"
        >
          <div
            className={`px-2.5 py-0.5 rounded-full ${style.badgeBg} ${style.badgeBorder} border shadow-xl flex items-center gap-1.5 backdrop-blur-md`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[10px] font-mono font-black text-white">{project.booth_code}</span>
            <span className={`text-[9px] font-bold uppercase tracking-wider ${style.badgeText}`}>
              {project.category}
            </span>
          </div>
        </Html>
      ) : !isAnySelected ? (
        <Html
          position={[0, 2.3, 0]}
          distanceFactor={isMobile ? 18 : 14}
          zIndexRange={[15, 0]}
          center
          className="pointer-events-none select-none font-sans"
        >
          <div
            className={`px-3 py-1.5 rounded-xl backdrop-blur-xl border text-center whitespace-nowrap shadow-2xl transition-all duration-300 ${
              hovered
                ? `${style.badgeBg} ${style.badgeBorder} scale-105 shadow-black ring-2 ring-white/30`
                : 'bg-slate-950/85 border-slate-700/80 shadow-black/80'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <span className="text-[11px] font-mono font-black px-1.5 py-0.2 rounded bg-slate-800 text-white border border-slate-600">
                {project.booth_code}
              </span>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider ${style.badgeText}`}>
                {project.category}
              </span>
            </div>

            <h4 className="text-xs font-bold text-white tracking-tight">
              {project.title.split('•')[1]?.trim()?.split(':')[0] || project.title}
            </h4>

            <div className="mt-0.5 flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-300 font-mono">
              <ThumbsUp className={`w-3 h-3 ${hasVoted ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
              <span>{project.vote_count} votes</span>
              {hasVoted && (
                <span className="ml-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-mono font-bold">
                  ✓
                </span>
              )}
            </div>
          </div>
        </Html>
      ) : null}
    </group>
  );
}
