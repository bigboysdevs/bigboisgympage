import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  prevPx: number;
  prevPy: number;
  accent: boolean;
}

export interface GalacticWarpBackgroundProps {
  lite?: boolean;
}

const BASE_BG = '#0C0C0C';

function createStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
    z: Math.random(),
    prevPx: 0,
    prevPy: 0,
    accent: Math.random() > 0.88,
  }));
}

export default function GalacticWarpBackground({ lite = false }: GalacticWarpBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const starCount = lite ? 90 : reducedMotion ? 120 : 220;
    const speed = lite ? 0.0045 : reducedMotion ? 0 : 0.0075;
    const stars = createStars(starCount);

    let width = 0;
    let height = 0;
    let frameId = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawStatic = () => {
      ctx.fillStyle = BASE_BG;
      ctx.fillRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      for (const star of stars) {
        const k = 180 * (0.2 + star.z);
        const px = star.x * k + cx;
        const py = star.y * k + cy;
        const alpha = 0.15 + star.z * 0.55;
        ctx.fillStyle =
          star.z > 0.7
            ? `rgba(254, 202, 202, ${alpha * 0.5})`
            : `rgba(215, 226, 234, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, 0.6 + star.z * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawWarp = () => {
      ctx.fillStyle = 'rgba(12, 12, 12, 0.2)';
      ctx.fillRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      for (const star of stars) {
        star.z -= speed;
        if (star.z <= 0.02) {
          star.x = (Math.random() - 0.5) * 2;
          star.y = (Math.random() - 0.5) * 2;
          star.z = 1;
          star.prevPx = cx;
          star.prevPy = cy;
        }

        const k = 220 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;
        const streak = Math.min(1 / star.z, 1) * (lite ? 0.65 : 1);
        const alpha = Math.min(0.15 + (1 - star.z) * 0.85, 1) * streak;

        ctx.strokeStyle =
          star.accent && star.z < 0.4
            ? `rgba(248, 113, 113, ${alpha * 0.9})`
            : `rgba(215, 226, 234, ${alpha})`;
        ctx.lineWidth = Math.max(0.35, (1 - star.z) * 1.6);
        ctx.beginPath();
        ctx.moveTo(star.prevPx, star.prevPy);
        ctx.lineTo(px, py);
        ctx.stroke();

        star.prevPx = px;
        star.prevPy = py;
      }
    };

    const loop = () => {
      if (width > 0 && height > 0) {
        if (reducedMotion) drawStatic();
        else drawWarp();
      }
      frameId = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(resize);
    const parent = canvas.parentElement;
    if (parent) ro.observe(parent);
    frameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
    };
  }, [lite]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 50% 45%, transparent 0%, rgba(12,12,12,0.2) 52%, transparent 82%)',
        }}
      />
    </div>
  );
}
