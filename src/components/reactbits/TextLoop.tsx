'use client';

import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, CSSProperties } from 'react';
import { gsap } from 'gsap';

import './TextLoop.css';

const VIEW_W = 1200;
const VIEW_H = 520;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;
const EDGE_PAD = 6;
const FADE_STEPS = 8;
const MAX_FLING = 2600;
const MAX_BOOST = 1600;

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const wrap = (v: number, length: number) => {
  if (length <= 0) return 0;
  return ((v % length) + length) % length;
};

const circleRadius = (curviness: number, ribbonWidth: number) =>
  Math.min(90 + Math.max(0, curviness) * 0.95, Math.max(20, CY - Math.max(0, ribbonWidth) / 2 - EDGE_PAD));

const buildPath = (shape: string, curviness: number, ribbonWidth: number, mirrored = false) => {
  const c = Math.max(0, curviness);
  const room = Math.max(20, CY - Math.max(0, ribbonWidth) / 2 - EDGE_PAD);
  const flip = mirrored ? -1 : 1;

  switch (shape) {
    case 'circle': {
      const r = circleRadius(curviness, ribbonWidth);
      if (mirrored) {
        const rx = r * 1.22;
        const ry = r * 0.42;
        return `M ${CX - rx} ${CY} A ${rx} ${ry} 0 1 1 ${CX + rx} ${CY} A ${rx} ${ry} 0 1 1 ${CX - rx} ${CY} Z`;
      }
      return `M ${CX - r} ${CY} A ${r} ${r} 0 1 1 ${CX + r} ${CY} A ${r} ${r} 0 1 1 ${CX - r} ${CY} Z`;
    }
    case 'infinity': {
      const r = 150 + c * 1.4;
      const h = Math.min(60 + c * 0.95, room);
      return [
        `M ${CX} ${CY}`,
        `C ${CX + r * 0.55} ${CY - h} ${CX + r} ${CY - h} ${CX + r} ${CY}`,
        `C ${CX + r} ${CY + h} ${CX + r * 0.55} ${CY + h} ${CX} ${CY}`,
        `C ${CX - r * 0.55} ${CY - h} ${CX - r} ${CY - h} ${CX - r} ${CY}`,
        `C ${CX - r} ${CY + h} ${CX - r * 0.55} ${CY + h} ${CX} ${CY}`,
        'Z'
      ].join(' ');
    }
    case 'arch': {
      const rise = Math.min(120 + c * 1.1, room * 2) * flip;
      return `M 120 ${CY + rise / 2} Q ${CX} ${CY - rise * 1.5} ${VIEW_W - 120} ${CY + rise / 2}`;
    }
    case 'line':
      return `M -320 ${CY} L ${VIEW_W + 320} ${CY}`;
    case 'wave':
    default: {
      const a = Math.min(c * 2.2, room * 2) * flip;
      return `M -320 ${CY} Q -160 ${CY - a} 0 ${CY} T 320 ${CY} T 640 ${CY} T 960 ${CY} T 1280 ${CY} T ${VIEW_W + 320} ${CY}`;
    }
  }
};

const buildFade = (edgeFade: number) => {
  const width = Math.min(1, Math.max(0, edgeFade)) * 0.3;
  if (width <= 0) return [];
  const stops: { offset: number; opacity: number }[] = [];
  for (let i = 0; i <= FADE_STEPS; i++) {
    const t = i / FADE_STEPS;
    stops.push({ offset: t * width, opacity: smootherstep(t) });
  }
  for (let i = FADE_STEPS; i >= 0; i--) {
    const t = i / FADE_STEPS;
    stops.push({ offset: 1 - t * width, opacity: smootherstep(t) });
  }
  return stops;
};

const parseHex = (value: string) => {
  const match = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(String(value || '').trim());
  if (!match) return null;
  const hex = match[1].length === 3 ? match[1].replace(/./g, ch => ch + ch) : match[1];
  return [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
};

const tint = (color: string, amount: number) => {
  const rgb = parseHex(color);
  if (!rgb) return color;
  return `#${rgb
    .map(v =>
      Math.round(v + (255 - v) * amount)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`;
};

const inkOn = (color: string) => {
  const rgb = parseHex(color);
  if (!rgb) return '#ffffff';
  const [r, g, b] = rgb.map(v => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.2 ? '#120f17' : '#ffffff';
};

export interface TextLoopProps {
  text?: string;
  shape?: 'wave' | 'circle' | 'infinity' | 'arch' | 'line';
  path?: string;
  speed?: number;
  direction?: 'forward' | 'reverse';
  separator?: string;
  curviness?: number;
  tilt?: number;
  fontSize?: number;
  fontWeight?: number | string;
  letterSpacing?: number;
  uppercase?: boolean;
  color?: string;
  ribbon?: boolean;
  ribbonColor?: string;
  ribbonWidth?: number;
  edgeFade?: number;
  pauseOnHover?: boolean;
  cross?: boolean;
  crossColor?: string;
  crossAngle?: number;
  draggable?: boolean;
  scrollBoost?: number;
  outline?: boolean;
  outlineWidth?: number;
  className?: string;
  style?: CSSProperties;
}

export default function TextLoop({
  text = 'React ✦ Bits',
  shape = 'wave',
  path,
  speed = 90,
  direction = 'forward',
  separator = '✦',
  curviness = 90,
  tilt = 0,
  fontSize = 46,
  fontWeight = 800,
  letterSpacing = 2,
  uppercase = true,
  color,
  ribbon = true,
  ribbonColor = '#5227FF',
  ribbonWidth = 86,
  edgeFade = 0,
  pauseOnHover = true,
  cross = false,
  crossColor,
  crossAngle = 16,
  draggable = false,
  scrollBoost = 0,
  outline = false,
  outlineWidth = 1.5,
  className = '',
  style = {}
}: TextLoopProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const crossPathRef = useRef<SVGPathElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const headRef = useRef<SVGTextPathElement>(null);
  const tailRef = useRef<SVGTextPathElement>(null);
  const crossHeadRef = useRef<SVGTextPathElement>(null);
  const crossTailRef = useRef<SVGTextPathElement>(null);
  
  const progressRef = useRef(0);
  const crossProgressRef = useRef(0);
  const hoverScaleRef = useRef(1);
  const velocityRef = useRef(0);

  const [metrics, setMetrics] = useState({ length: 0, reps: 1, crossLength: 0, crossReps: 1 });

  const rawId = useId();
  const pathId = `text-loop-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const crossId = `${pathId}-cross`;
  const fadeId = `${pathId}-fade`;
  const maskId = `${pathId}-mask`;

  const d = useMemo(() => path || buildPath(shape, curviness, ribbonWidth), [path, shape, curviness, ribbonWidth]);
  const crossD = useMemo(() => {
    if (!cross) return '';
    if (path) return path;
    return buildPath(shape, curviness, ribbonWidth, shape === 'wave' || shape === 'arch' || shape === 'circle');
  }, [cross, path, shape, curviness, ribbonWidth]);
  const fade = useMemo(() => buildFade(edgeFade), [edgeFade]);
  const fill = color || (ribbon ? '#ffffff' : 'currentColor');

  const half = cross ? crossAngle / 2 : 0;
  const mainAngle = tilt + half;
  const crossAngleDeg = tilt - half;
  const mainTransform = mainAngle ? `rotate(${mainAngle} ${CX} ${CY})` : undefined;
  const crossTransform = crossAngleDeg ? `rotate(${crossAngleDeg} ${CX} ${CY})` : undefined;
  const crossTape = crossColor || tint(ribbonColor, 0.62);
  const crossFill = ribbon ? inkOn(crossTape) : crossColor || 'currentColor';
  const crossDim = !ribbon && !crossColor ? 0.45 : 1;

  const unit = useMemo(() => {
    const base = uppercase ? String(text).toUpperCase() : String(text);
    const gap = separator ? `\u00A0${separator}\u00A0` : '\u00A0\u00A0\u00A0';
    return `${base}${gap}`;
  }, [text, separator, uppercase]);

  const textStyle: CSSProperties = useMemo(
    () => ({ fontSize: `${fontSize}px`, fontWeight, letterSpacing: `${letterSpacing}px`, fontFamily: 'inherit' }),
    [fontSize, fontWeight, letterSpacing]
  );

  useIsomorphicLayoutEffect(() => {
    const pathEl = pathRef.current;
    const measureEl = measureRef.current;
    if (!pathEl || !measureEl) return;

    let cancelled = false;

    const measure = () => {
      if (cancelled) return;
      let length = 0;
      let unitWidth = 0;
      let crossLength = 0;
      try {
        length = pathEl.getTotalLength();
        unitWidth = measureEl.getComputedTextLength();
        crossLength = crossPathRef.current ? crossPathRef.current.getTotalLength() : 0;
      } catch {
        return;
      }
      if (!length) return;

      const repsFor = (total: number) => (unitWidth > 0 ? Math.max(2, Math.ceil((total * 2) / unitWidth) + 1) : 4);
      const next = { length, reps: repsFor(length), crossLength, crossReps: repsFor(crossLength) };
      setMetrics(prev =>
        prev.length === next.length &&
        prev.reps === next.reps &&
        prev.crossLength === next.crossLength &&
        prev.crossReps === next.crossReps
          ? prev
          : next
      );
    };

    measure();
    if (typeof document !== 'undefined' && (document as any).fonts?.ready) {
      (document as any).fonts.ready.then(measure).catch(() => {});
    }

    return () => {
      cancelled = true;
    };
  }, [d, crossD, unit, fontSize, fontWeight, letterSpacing]);

  // Repeated text string
  const repeatedMainText = useMemo(() => {
    return unit.repeat(Math.max(2, metrics.reps));
  }, [unit, metrics.reps]);

  const repeatedCrossText = useMemo(() => {
    return unit.repeat(Math.max(2, metrics.crossReps));
  }, [unit, metrics.crossReps]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let isDragging = false;
    let lastX = 0;

    const onEnter = () => {
      if (pauseOnHover) {
        gsap.to(hoverScaleRef, { current: 0, duration: 0.35, ease: 'power2.out' });
      }
    };
    const onLeave = () => {
      if (pauseOnHover) {
        gsap.to(hoverScaleRef, { current: 1, duration: 0.5, ease: 'power2.out' });
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!draggable) return;
      isDragging = true;
      lastX = e.clientX;
      velocityRef.current = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      velocityRef.current = dx * 60;
      progressRef.current += dx;
      crossProgressRef.current -= dx;
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      gsap.to(velocityRef, { current: 0, duration: 0.8, ease: 'power2.out' });
    };

    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);
    if (draggable) {
      root.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    }

    // Scroll boost listener
    let scrollTimeout: NodeJS.Timeout | null = null;
    let boostVel = 0;
    const onScroll = () => {
      if (scrollBoost <= 0) return;
      boostVel = clamp(scrollBoost * 30, -MAX_BOOST, MAX_BOOST);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        gsap.to({ b: boostVel }, {
          b: 0,
          duration: 0.5,
          onUpdate() {
            boostVel = (this as any).targets()[0].b;
          }
        });
      }, 50);
    };
    if (scrollBoost > 0) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // GSAP Ticker Loop
    const dirSign = direction === 'forward' ? 1 : -1;
    const ticker = (_time: number, deltaTime: number) => {
      if (metrics.length <= 0) return;
      const dt = deltaTime / 1000;
      const currentSpeed = (speed * dirSign * hoverScaleRef.current + boostVel + (isDragging ? 0 : velocityRef.current)) * dt;
      
      progressRef.current = wrap(progressRef.current + currentSpeed, metrics.length);
      if (metrics.crossLength > 0) {
        crossProgressRef.current = wrap(crossProgressRef.current - currentSpeed, metrics.crossLength);
      }

      if (headRef.current) {
        headRef.current.setAttribute('startOffset', `${progressRef.current}`);
      }
      if (tailRef.current) {
        tailRef.current.setAttribute('startOffset', `${progressRef.current - metrics.length}`);
      }
      if (crossHeadRef.current) {
        crossHeadRef.current.setAttribute('startOffset', `${crossProgressRef.current}`);
      }
      if (crossTailRef.current) {
        crossTailRef.current.setAttribute('startOffset', `${crossProgressRef.current - metrics.crossLength}`);
      }
    };

    gsap.ticker.add(ticker);

    return () => {
      gsap.ticker.remove(ticker);
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
      if (draggable) {
        root.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      }
      if (scrollBoost > 0) {
        window.removeEventListener('scroll', onScroll);
      }
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [speed, direction, pauseOnHover, draggable, scrollBoost, metrics.length, metrics.crossLength]);

  return (
    <div
      ref={rootRef}
      className={['text-loop-wrapper', className].filter(Boolean).join(' ')}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        cursor: draggable ? 'grab' : 'default',
        ...style
      }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="text-loop-svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <defs>
          <path id={pathId} ref={pathRef} d={d} fill="none" />
          {cross && <path id={crossId} ref={crossPathRef} d={crossD} fill="none" />}
          {fade.length > 0 && (
            <linearGradient id={fadeId} x1="0%" y1="0%" x2="100%" y2="0%">
              {fade.map((stop, i) => (
                <stop key={i} offset={`${stop.offset * 100}%`} stopColor="white" stopOpacity={stop.opacity} />
              ))}
            </linearGradient>
          )}
          {fade.length > 0 && (
            <mask id={maskId}>
              <rect width={VIEW_W} height={VIEW_H} fill={`url(#${fadeId})`} />
            </mask>
          )}
        </defs>

        {/* Hidden text measuring node */}
        <text ref={measureRef} style={{ ...textStyle, visibility: 'hidden', position: 'absolute' }}>
          {unit}
        </text>

        <g mask={fade.length > 0 ? `url(#${maskId})` : undefined}>
          {/* Ribbon paths */}
          {cross && ribbon && (
            <path
              d={crossD}
              transform={crossTransform}
              fill="none"
              stroke={crossTape}
              strokeWidth={ribbonWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {ribbon && (
            <path
              d={d}
              transform={mainTransform}
              fill="none"
              stroke={ribbonColor}
              strokeWidth={ribbonWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Cross Ribbon Text */}
          {cross && (
            <g transform={crossTransform} opacity={crossDim}>
              <text
                style={textStyle}
                fill={outline ? 'none' : crossFill}
                stroke={outline ? crossFill : undefined}
                strokeWidth={outline ? outlineWidth : undefined}
              >
                <textPath ref={crossHeadRef} href={`#${crossId}`} startOffset="0">
                  {repeatedCrossText}
                </textPath>
                <textPath ref={crossTailRef} href={`#${crossId}`} startOffset={-metrics.crossLength}>
                  {repeatedCrossText}
                </textPath>
              </text>
            </g>
          )}

          {/* Main Ribbon Text */}
          <g transform={mainTransform}>
            <text
              style={textStyle}
              fill={outline ? 'none' : fill}
              stroke={outline ? fill : undefined}
              strokeWidth={outline ? outlineWidth : undefined}
            >
              <textPath ref={headRef} href={`#${pathId}`} startOffset="0">
                {repeatedMainText}
              </textPath>
              <textPath ref={tailRef} href={`#${pathId}`} startOffset={-metrics.length}>
                {repeatedMainText}
              </textPath>
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
