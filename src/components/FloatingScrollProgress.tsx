import { useId, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';

const SIZE = 46;
const STROKE = 2.5;
const CENTER = SIZE / 2;
/** Dientes de la «culebra» — más segmentos = más zigzags. */
const SERPENT_TEETH = 18;
const SERPENT_OUTER_R = (SIZE - STROKE) / 2 - 1;
const SERPENT_BITE = 4.25;
const TRACK_STROKE = '#3F3F46';

type Point = [number, number];

function buildSerpentPoints(
  cx: number,
  cy: number,
  outerRadius: number,
  teeth: number,
  biteDepth: number,
): Point[] {
  const steps = teeth * 2;
  const points: Point[] = [];

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2 - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : outerRadius - biteDepth;
    points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
  }

  return points;
}

function pointsToPath(points: Point[]): string {
  return points
    .map(([x, y], index) =>
      index === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : `L ${x.toFixed(2)} ${y.toFixed(2)}`,
    )
    .join(' ');
}

function measurePathLength(points: Point[]): number {
  let length = 0;

  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i - 1][0];
    const dy = points[i][1] - points[i - 1][1];
    length += Math.hypot(dx, dy);
  }

  return length;
}

const SERPENT_POINTS = buildSerpentPoints(CENTER, CENTER, SERPENT_OUTER_R, SERPENT_TEETH, SERPENT_BITE);
const SERPENT_PATH = pointsToPath(SERPENT_POINTS);
const SERPENT_LENGTH = measurePathLength(SERPENT_POINTS);

export default function FloatingScrollProgress() {
  const { scrollYProgress } = useScroll();
  const [percent, setPercent] = useState(0);
  const gradientId = useId().replace(/:/g, '');
  const glowId = `snake-glow-${gradientId}`;
  const progressStroke = `url(#snake-progress-${gradientId})`;

  const strokeDashoffset = useTransform(scrollYProgress, [0, 1], [SERPENT_LENGTH, 0]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setPercent(Math.min(100, Math.max(0, Math.round(latest * 100))));
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="fixed bottom-5 left-4 z-[90] sm:bottom-8 sm:left-6"
      data-nocursor
    >
      <button
        type="button"
        onClick={scrollToTop}
        className="pointer-events-auto relative flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#0a0a0a]/92 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-sm transition-all duration-300 hover:ring-[#5EEAD4]/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4]/60"
        aria-label={`Progreso de la página: ${percent} por ciento. Clic para volver arriba.`}
      >
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0 m-auto"
          aria-hidden
        >
          <defs>
            <linearGradient id={`snake-progress-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2DD4BF" />
              <stop offset="38%" stopColor="#FFE800" />
              <stop offset="72%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
            <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="1.1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d={SERPENT_PATH}
            fill="none"
            stroke={TRACK_STROKE}
            strokeWidth={STROKE}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <motion.path
            d={SERPENT_PATH}
            fill="none"
            stroke={progressStroke}
            strokeWidth={STROKE + 0.35}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={SERPENT_LENGTH}
            style={{ strokeDashoffset }}
            filter={`url(#${glowId})`}
          />
        </svg>

        <span className="relative flex flex-col items-center leading-none text-white">
          <span className="text-sm font-bold tabular-nums tracking-tight">{percent}</span>
          <span className="mt-px text-[8px] font-medium leading-none text-white/85">%</span>
        </span>
      </button>
    </div>
  );
}
