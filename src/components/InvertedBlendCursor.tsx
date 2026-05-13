import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const SIZE = 46;
const HALF = SIZE / 2;

const spring = { stiffness: 420, damping: 34, mass: 0.12 };

/**
 * Cursor tipo showcase (p. ej. motion.page): círculo blanco + mix-blend-difference
 * (inversión cromática sobre el contenido), seguimiento suave con resorte y cursor nativo oculto.
 */
export default function InvertedBlendCursor() {
  const x = useMotionValue(-SIZE * 6);
  const y = useMotionValue(-SIZE * 6);
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);
  const enabledRef = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => {
      enabledRef.current = mq.matches && !reduceMotion.matches;
      if (enabledRef.current) {
        root.classList.add('use-blend-cursor');
      } else {
        root.classList.remove('use-blend-cursor');
        x.set(-SIZE * 6);
        y.set(-SIZE * 6);
      }
    };

    sync();
    mq.addEventListener('change', sync);
    reduceMotion.addEventListener('change', sync);

    const onMove = (e: MouseEvent) => {
      if (!enabledRef.current) return;
      x.set(e.clientX - HALF);
      y.set(e.clientY - HALF);
    };

    const onLeave = () => {
      x.set(-SIZE * 6);
      y.set(-SIZE * 6);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      root.classList.remove('use-blend-cursor');
      mq.removeEventListener('change', sync);
      reduceMotion.removeEventListener('change', sync);
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[200] rounded-full bg-white mix-blend-difference will-change-transform"
      style={{
        width: SIZE,
        height: SIZE,
        x: springX,
        y: springY,
      }}
      aria-hidden
    />
  );
}
