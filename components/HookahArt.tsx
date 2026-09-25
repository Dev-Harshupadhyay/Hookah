'use client';

import { useId } from 'react';
import type { BaseShape, Hookah } from '@/lib/hookahs';

interface BaseGeom {
  d: string;
  neckY: number;
  waterY: number;
  bottomY: number;
  widest: number;
}

/** All shapes drawn inside a 280 x 560 viewBox, centred on x = 140. */
function baseGeometry(shape: BaseShape): BaseGeom {
  switch (shape) {
    case 'teardrop':
      return {
        d: 'M140 292 C 172 330 226 372 226 434 C 226 492 188 524 140 524 C 92 524 54 492 54 434 C 54 372 108 330 140 292 Z',
        neckY: 300,
        waterY: 430,
        bottomY: 524,
        widest: 172,
      };
    case 'squat':
      return {
        d: 'M140 360 C 200 360 244 392 244 448 C 244 500 200 526 140 526 C 80 526 36 500 36 448 C 36 392 80 360 140 360 Z',
        neckY: 364,
        waterY: 452,
        bottomY: 526,
        widest: 208,
      };
    case 'pot':
      return {
        d: 'M88 336 L 192 336 C 214 372 220 410 216 444 C 210 496 180 522 140 522 C 100 522 70 496 64 444 C 60 410 66 372 88 336 Z',
        neckY: 340,
        waterY: 438,
        bottomY: 522,
        widest: 156,
      };
    case 'coconut':
      return {
        d: 'M140 344 C 192 344 226 384 226 434 C 226 486 190 522 140 522 C 90 522 54 486 54 434 C 54 384 88 344 140 344 Z',
        neckY: 348,
        waterY: 438,
        bottomY: 522,
        widest: 172,
      };
    case 'globe':
      return {
        d: 'M140 334 C 196 334 232 378 232 430 C 232 486 194 524 140 524 C 86 524 48 486 48 430 C 48 378 84 334 140 334 Z',
        neckY: 338,
        waterY: 436,
        bottomY: 524,
        widest: 184,
      };
    case 'melon':
      return {
        d: 'M140 352 C 204 352 240 388 240 440 C 240 492 202 522 140 522 C 78 522 40 492 40 440 C 40 388 76 352 140 352 Z',
        neckY: 356,
        waterY: 444,
        bottomY: 522,
        widest: 200,
      };
    case 'urn':
      return {
        d: 'M104 320 C 96 348 60 366 60 418 C 60 470 92 502 140 502 C 188 502 220 470 220 418 C 220 366 184 348 176 320 Z',
        neckY: 326,
        waterY: 424,
        bottomY: 502,
        widest: 160,
      };
    case 'round':
    default:
      return {
        d: 'M140 316 C 198 316 232 360 232 418 C 232 480 194 520 140 520 C 86 520 48 480 48 418 C 48 360 82 316 140 316 Z',
        neckY: 320,
        waterY: 424,
        bottomY: 520,
        widest: 184,
      };
  }
}

export interface HookahArtProps {
  hookah: Hookah;
  waterColor: string;
  glowColor: string;
  /** 0 → idle coal, 1 → full inhale */
  intensity?: number;
  bubbling?: boolean;
  className?: string;
  /** adds the interactive port marker used by the hose renderer */
  portRef?: (el: SVGCircleElement | null) => void;
}

export default function HookahArt({
  hookah,
  waterColor,
  glowColor,
  intensity = 0,
  bubbling = false,
  className,
  portRef,
}: HookahArtProps) {
  const uid = useId().replace(/[:]/g, '');
  const { art } = hookah;
  const g = baseGeometry(art.base);
  const c = art.colors;
  const right = art.hoseSide === 'right';

  const trayY = 208;
  const trayW = art.tray === 'wide' ? 116 : art.tray === 'steel' ? 96 : art.tray === 'brass' ? 104 : 78;
  const stemTopY = 150;
  const portY = 268;
  const portX = right ? 140 + 30 : 140 - 30;

  const clipId = `clip-${uid}`;
  const glowId = `glow-${uid}`;
  const waterGradId = `water-${uid}`;
  const glassGradId = `glass-${uid}`;
  const stemGradId = `stem-${uid}`;
  const bodyGradId = `body-${uid}`;

  const ribbed = art.stem === 'ribbed';
  const bound = art.stem === 'bound';
  const carved = art.stem === 'carved';
  const inlay = art.stem === 'inlay';
  const slim = art.stem === 'slim';
  const stemW = slim ? 9 : bound ? 15 : 12;

  return (
    <svg
      viewBox="0 0 280 560"
      className={className}
      aria-label={`${hookah.name} hookah`}
      role="img"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={g.d} />
        </clipPath>
        <linearGradient id={bodyGradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c.bodyDark} />
          <stop offset="38%" stopColor={c.body} />
          <stop offset="72%" stopColor={c.body} />
          <stop offset="100%" stopColor={c.bodyDark} />
        </linearGradient>
        <linearGradient id={stemGradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c.stemDark} />
          <stop offset="40%" stopColor={c.stem} />
          <stop offset="100%" stopColor={c.stemDark} />
        </linearGradient>
        <linearGradient id={waterGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={waterColor} stopOpacity="0.98" />
        </linearGradient>
        <linearGradient id={glassGradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
        </linearGradient>
        <filter id={glowId} x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── jar ─────────────────────────────────────────────── */}
      <ellipse cx="140" cy={g.bottomY + 8} rx={g.widest / 2 + 6} ry="9" fill="#000" opacity="0.18" />
      <path d={g.d} fill={art.glass ? '#ffffff' : `url(#${bodyGradId})`} fillOpacity={art.glass ? 0.14 : 1} />

      {/* water */}
      <g clipPath={`url(#${clipId})`}>
        <g opacity={art.glass ? 1 : 0.22}>
          <rect x="0" y={g.waterY} width="280" height={g.bottomY - g.waterY + 12} fill={`url(#${waterGradId})`} />
          <rect x="0" y={g.waterY} width="280" height="4" fill="#fff" opacity="0.35" />
        </g>
        {bubbling && (
          <g>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle
                key={i}
                cx={140 + (i % 3) * 9 - 9 + (i > 2 ? 4 : -4)}
                cy={g.bottomY - 6}
                r={2.6 + (i % 3)}
                fill="#fff"
                opacity="0.75"
              >
                <animate
                  attributeName="cy"
                  from={g.bottomY - 6}
                  to={g.waterY - 2}
                  dur={`${0.75 + i * 0.13}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.8;0"
                  dur={`${0.75 + i * 0.13}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        )}
        {art.glass && <path d={g.d} fill={`url(#${glassGradId})`} />}
        {!art.glass && art.base === 'coconut' && (
          <g stroke={c.accent} strokeWidth="1.1" opacity="0.5" fill="none">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <path key={i} d={`M40 ${350 + i * 26} Q 140 ${338 + i * 26} 240 ${350 + i * 26}`} />
            ))}
          </g>
        )}
        {!art.glass && art.base === 'globe' && (
          <g stroke={c.accent} strokeWidth="1.4" opacity="0.85" fill="none">
            <circle cx="140" cy="430" r="46" />
            <circle cx="140" cy="430" r="30" strokeDasharray="4 5" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const a = (i / 8) * Math.PI * 2;
              return (
                <path
                  key={i}
                  d={`M${140 + Math.cos(a) * 30} ${430 + Math.sin(a) * 30} Q ${140 + Math.cos(a) * 58} ${430 + Math.sin(a) * 58} ${140 + Math.cos(a + 0.5) * 44} ${430 + Math.sin(a + 0.5) * 44}`}
                />
              );
            })}
          </g>
        )}
        {!art.glass && (art.base === 'melon' || art.base === 'pot') && (
          <g stroke={c.accent} strokeWidth="1.6" opacity="0.35" fill="none">
            {[-60, -30, 0, 30, 60].map((dx) => (
              <path key={dx} d={`M${140 + dx} 330 Q ${140 + dx * 1.25} 430 ${140 + dx} 530`} />
            ))}
          </g>
        )}
      </g>

      <path
        d={g.d}
        fill="none"
        stroke={art.glass ? '#ffffff' : c.bodyDark}
        strokeOpacity={art.glass ? 0.7 : 0.9}
        strokeWidth={art.glass ? 2 : 2.4}
      />
      {/* highlight */}
      <path
        d={`M${140 - g.widest / 3.4} ${g.waterY - 60} q -10 46 4 84`}
        stroke="#fff"
        strokeOpacity="0.4"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── stem ────────────────────────────────────────────── */}
      <rect
        x={140 - stemW / 2}
        y={stemTopY}
        width={stemW}
        height={g.neckY - stemTopY + 14}
        rx={stemW / 2}
        fill={`url(#${stemGradId})`}
      />
      {ribbed &&
        [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect
            key={i}
            x={140 - stemW / 2 - 2}
            y={stemTopY + 12 + i * 14}
            width={stemW + 4}
            height="4"
            rx="2"
            fill={c.stemDark}
            opacity="0.55"
          />
        ))}
      {carved &&
        [0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx="140" cy={stemTopY + 20 + i * 28} rx={stemW / 2 + 5} ry="6" fill={c.stemDark} />
        ))}
      {inlay &&
        [0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={140 - stemW / 2} y={stemTopY + 10 + i * 18} width={stemW} height="2" fill={c.accent} opacity="0.9" />
        ))}
      {bound && (
        <>
          <rect x={140 - 21} y={stemTopY + 6} width="12" height={g.neckY - stemTopY} rx="6" fill={c.stem} />
          <rect x={140 + 9} y={stemTopY + 6} width="12" height={g.neckY - stemTopY} rx="6" fill={c.stemDark} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={140 - 25} y={stemTopY + 18 + i * 28} width="50" height="5" rx="2.5" fill={c.accent} opacity="0.9" />
          ))}
        </>
      )}

      {/* neck collar */}
      <ellipse cx="140" cy={g.neckY + 4} rx={stemW + 12} ry="8" fill={c.stemDark} />
      <ellipse cx="140" cy={g.neckY} rx={stemW + 12} ry="8" fill={c.stem} />

      {/* ── tray ────────────────────────────────────────────── */}
      {art.tray !== 'none' && (
        <>
          <ellipse cx="140" cy={trayY + 7} rx={trayW / 2} ry={trayW / 9} fill={c.stemDark} opacity="0.85" />
          <ellipse cx="140" cy={trayY} rx={trayW / 2} ry={trayW / 9} fill={c.tray} />
          <ellipse cx="140" cy={trayY} rx={trayW / 2 - 8} ry={trayW / 11} fill="#000" opacity="0.07" />
        </>
      )}

      {/* ── bowl + coal ─────────────────────────────────────── */}
      <path
        d={`M${140 - 26} ${stemTopY} L ${140 - 20} ${stemTopY - 34} L ${140 + 20} ${stemTopY - 34} L ${140 + 26} ${stemTopY} Z`}
        fill={c.bowl}
      />
      <ellipse cx="140" cy={stemTopY - 34} rx="20" ry="7" fill={c.bowl} />
      <ellipse cx="140" cy={stemTopY - 36} rx="20" ry="7" fill="#000" opacity="0.25" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={140 - 28} y={stemTopY - 26 + i * 9} width="56" height="4" rx="2" fill="#000" opacity="0.12" />
      ))}
      {/* coals */}
      <g filter={intensity > 0.05 ? `url(#${glowId})` : undefined}>
        {[-9, 0, 9].map((dx, i) => (
          <circle
            key={dx}
            cx={140 + dx}
            cy={stemTopY - 39 + (i === 1 ? -2 : 0)}
            r="6"
            fill={intensity > 0.05 ? '#ff7a2f' : '#30302f'}
            opacity={intensity > 0.05 ? 0.4 + intensity * 0.6 : 0.9}
          />
        ))}
      </g>
      {intensity > 0.05 && (
        <ellipse cx="140" cy={stemTopY - 40} rx="26" ry="12" fill="#ff8c3a" opacity={0.18 * intensity} />
      )}

      {/* ── hose port ───────────────────────────────────────── */}
      <rect
        x={right ? 140 + 4 : 140 - 34}
        y={portY - 7}
        width="30"
        height="14"
        rx="7"
        fill={c.stem}
        transform={`rotate(${right ? -12 : 12} 140 ${portY})`}
      />
      <circle ref={portRef} cx={portX} cy={portY} r="6" fill={c.accent} data-hose-port="" />
    </svg>
  );
}
