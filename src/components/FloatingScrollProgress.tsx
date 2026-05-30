import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';

const SIZE = 46;
const STROKE = 3;
const RADIUS = (SIZE - STROKE) / 2 - 2;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getButtonRect() {
  const isSm = window.innerWidth >= 640;
  const size = SIZE;
  const left = isSm ? 24 : 16;
  const bottom = isSm ? 32 : 20;
  const top = window.innerHeight - bottom - size;

  return {
    top,
    left,
    right: left + size,
    bottom: window.innerHeight - bottom,
  };
}

function rectsOverlap(
  a: { top: number; left: number; right: number; bottom: number },
  b: DOMRect,
) {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}

export default function FloatingScrollProgress() {
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();
  const [percent, setPercent] = useState(0);
  const [onLightBg, setOnLightBg] = useState(false);

  const strokeDashoffset = useTransform(
    scrollYProgress,
    [0, 1],
    [CIRCUMFERENCE, 0],
  );

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setPercent(Math.min(100, Math.max(0, Math.round(latest * 100))));
  });

  const updateLightBg = useCallback(() => {
    if (pathname !== '/') {
      setOnLightBg(false);
      return;
    }

    const section = document.getElementById('entrenamientos');
    if (!section) {
      setOnLightBg(false);
      return;
    }

    setOnLightBg(rectsOverlap(getButtonRect(), section.getBoundingClientRect()));
  }, [pathname]);

  useEffect(() => {
    updateLightBg();

    let raf = 0;
    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateLightBg);
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      cancelAnimationFrame(raf);
    };
  }, [updateLightBg]);

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
        className={[
          'pointer-events-auto relative flex h-[46px] w-[46px] items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 focus-visible:outline-none',
          onLightBg
            ? 'bg-white/95 shadow-[0_8px_28px_rgba(12,12,12,0.18)] ring-2 ring-[#0C0C0C]/10 hover:ring-red-500/40 focus-visible:ring-2 focus-visible:ring-red-500/55'
            : 'bg-[#0a0a0a]/92 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/10 hover:ring-[#5EEAD4]/35 focus-visible:ring-2 focus-visible:ring-[#5EEAD4]/60',
        ].join(' ')}
        aria-label={`Progreso de la página: ${percent} por ciento. Clic para volver arriba.`}
      >
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0 m-auto -rotate-90 transition-opacity duration-300"
          aria-hidden
        >
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={onLightBg ? '#E5E7EB' : '#374151'}
            strokeWidth={STROKE}
            className="transition-[stroke] duration-300"
          />
          <motion.circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={onLightBg ? '#dc2626' : '#5EEAD4'}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            style={{ strokeDashoffset }}
            className="transition-[stroke] duration-300"
          />
        </svg>

        <span
          className={[
            'relative flex flex-col items-center leading-none transition-colors duration-300',
            onLightBg ? 'text-[#0C0C0C]' : 'text-white',
          ].join(' ')}
        >
          <span className="text-sm font-bold tabular-nums tracking-tight">{percent}</span>
          <span
            className={[
              'mt-px text-[8px] font-medium leading-none transition-colors duration-300',
              onLightBg ? 'text-[#0C0C0C]/65' : 'text-white/85',
            ].join(' ')}
          >
            %
          </span>
        </span>
      </button>
    </div>
  );
}
