import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { ReactNode, CSSProperties } from 'react';
import { useRef } from 'react';

interface FadeInProps {
  children: ReactNode;
  /** `scroll`: ligado al scroll (sube/baja). `inView`: fade al entrar/salir de pantalla. */
  effect?: 'scroll' | 'inView';
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}

export default function FadeIn({
  children,
  effect = 'scroll',
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  if (effect === 'inView') {
    return (
      <motion.div
        ref={ref}
        variants={{
          hidden: { opacity: 0, x, y },
          visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: { duration, ease: [0.25, 0.1, 0.25, 1], delay },
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: '50px', amount: 0.2 }}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    );
  }

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const t = Math.min(delay * 0.07, 0.22);

  const opacity = useTransform(
    scrollYProgress,
    [0 + t, 0.18 + t, 0.82 - t * 0.5, 1],
    [0, 1, 1, 0],
    { clamp: true },
  );

  const translateY = useTransform(
    scrollYProgress,
    [0 + t, 0.28 + t],
    [y, 0],
    { clamp: true },
  );

  const translateX = useTransform(
    scrollYProgress,
    [0 + t, 0.28 + t],
    [x, 0],
    { clamp: true },
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity, x: translateX, y: translateY, ...style }}
    >
      {children}
    </motion.div>
  );
}
