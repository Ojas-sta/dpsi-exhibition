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
  const theme = useExhibitionStore((state) => state.theme);
  const isLight = theme === 'light';

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
      rotation={[0, project.rotation_y || 0, 0]}
      onClick={handleClick}
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
      {/* Raycastable Touch & Click Hit-box (transparent, but active in BVH/raycaster) */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[2.0, 2.0, 3.0, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 1. Base Platform */}
      <mesh position={[0, 0.06, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.2, 0.12, 1.4]} />
        <meshStandardMaterial
          color={
            isSelected
              ? (isLight ? '#475569' : '#334155')
              : (isLight ? '#64748b' : '#0f172a')
          }
          metalness={isLight ? 0.2 : 0.7}
          roughness={isLight ? 0.5 : 0.3}
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
          color={isLight ? '#cbd5e1' : '#1e293b'}
          metalness={isLight ? 0.15 : 0.5}
          roughness={isLight ? 0.5 : 0.25}
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

      {/* 3. Display Screen Backboard */}
      <mesh position={[0, 1.45, -0.32]} rotation={[-0.05, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.85, 0.06]} />
        <meshStandardMaterial
          color={isLight ? '#334155' : '#0b101c'}
          metalness={isLight ? 0.4 : 0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Screen Face */}
      <mesh position={[0, 1.45, -0.28]}>
        <planeGeometry args={[1.4, 0.75]} />
        <meshStandardMaterial
          color={isLight ? '#1e293b' : '#111827'}
          emissive={style.color}
          emissiveIntensity={hovered || isSelected ? 0.8 : 0.3}
        />
      </mesh>

      {/* 4. Two Exhibitor Stools */}
      <group position={[0, 0, 0.85]}>
        <mesh position={[-0.5, 0.35, 0]} castShadow>
          <boxGeometry args={[0.4, 0.08, 0.4]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        <mesh position={[-0.5, 0.17, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 12]} />
          <meshStandardMaterial color={isLight ? '#94a3b8' : '#475569'} metalness={0.8} />
        </mesh>

        <mesh position={[0.5, 0.35, 0]} castShadow>
          <boxGeometry args={[0.4, 0.08, 0.4]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        <mesh position={[0.5, 0.17, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 12]} />
          <meshStandardMaterial color={isLight ? '#94a3b8' : '#475569'} metalness={0.8} />
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

      {/* 6. Clean 3D Floating Pin / Expanded Tooltip:
          - Default state (not hovered): Compact badge pin [• P01] that NEVER overlaps neighbors!
          - Hovered state: Expands to show title, category, and votes!
          - Selected state: Pulse indicator!
      */}
      {isSelected ? (
        <Html
          position={[0, 2.1, 0]}
          distanceFactor={20}
          zIndexRange={[15, 0]}
          center
          className="pointer-events-none select-none font-sans"
        >
          <div
            className={`px-2.5 py-1 rounded-full border shadow-xl flex items-center gap-1.5 backdrop-blur-md ${
              isLight
                ? 'bg-white/95 border-amber-500 text-slate-900 shadow-slate-300'
                : `${style.badgeBg} ${style.badgeBorder} text-white`
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[10px] font-mono font-black">{project.booth_code}</span>
            <span className={`text-[9px] font-bold uppercase tracking-wider ${style.badgeText}`}>
              {project.category}
            </span>
          </div>
        </Html>
      ) : !isAnySelected ? (
        <Html
          position={[0, hovered ? 2.5 : 2.05, 0]}
          distanceFactor={isMobile ? 18 : 15}
          zIndexRange={[hovered ? 30 : 10, 0]}
          center
          className="pointer-events-none select-none font-sans"
        >
          {hovered ? (
            /* Rich Preview Card when hovered or touched */
            <div
              className={`px-3 py-2 rounded-2xl backdrop-blur-xl border text-center whitespace-nowrap shadow-2xl transition-all duration-300 scale-105 ${
                isLight
                  ? 'bg-white/95 border-amber-500 text-slate-900 shadow-slate-400/40 ring-2 ring-amber-400/30'
                  : `${style.badgeBg} ${style.badgeBorder} text-white shadow-black ring-2 ring-white/30`
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className={`text-[11px] font-mono font-black px-1.5 py-0.2 rounded border ${
                  isLight ? 'bg-slate-100 text-slate-800 border-slate-300' : 'bg-slate-800 text-white border-slate-600'
                }`}>
                  {project.booth_code}
                </span>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider ${style.badgeText}`}>
                  {project.category}
                </span>
              </div>

              <h4 className={`text-xs font-bold truncate max-w-[190px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {project.title.split('•')[1]?.trim()?.split(':')[0] || project.title}
              </h4>

              <div className={`mt-0.5 flex items-center justify-center gap-1 text-[11px] font-semibold font-mono ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}>
                <ThumbsUp className={`w-3 h-3 ${hasVoted ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                <span>{project.vote_count} votes</span>
                {hasVoted && (
                  <span className="ml-1 text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1 py-0.2 rounded font-mono font-bold">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-[9px] text-amber-600 dark:text-amber-400 mt-1 font-mono font-bold">
                Tap to inspect →
              </p>
            </div>
          ) : (
            /* Clean Compact Pill Marker in Overview — NEVER overlaps! */
            <div
              className={`px-2 py-0.5 rounded-full border shadow-md flex items-center gap-1 backdrop-blur-md transition-transform duration-200 hover:scale-110 ${
                isLight
                  ? 'bg-white/92 border-slate-300/90 text-slate-800 shadow-slate-200'
                  : 'bg-slate-950/85 border-slate-700/80 text-white shadow-black/80'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: style.color }} />
              <span className="text-[10px] font-mono font-black">{project.booth_code}</span>
            </div>
          )}
        </Html>
      ) : null}
    </group>
  );
}
