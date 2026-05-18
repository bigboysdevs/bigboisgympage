import { useLayoutEffect, useState, type RefObject } from 'react';
import { useLocation } from 'react-router-dom';

const FULL_MASK = 'linear-gradient(to bottom, #000 0%, #000 100%)';

function buildMask(holeStartPct: number, holeEndPct: number): string {
  const start = Math.max(0, Math.min(100, holeStartPct));
  const end = Math.max(start, Math.min(100, holeEndPct));
  const feather = 0.4;

  return `linear-gradient(to bottom,
    #000 0%,
    #000 ${(start - feather).toFixed(2)}%,
    transparent ${start.toFixed(2)}%,
    transparent ${end.toFixed(2)}%,
    #000 ${(end + feather).toFixed(2)}%,
    #000 100%)`;
}

/** Recorta el rayo en la sección blanca (#entrenamientos); un solo PNG de arriba a abajo. */
export function usePageLightningMask(
  backdropRef: RefObject<HTMLDivElement | null>
): string | undefined {
  const { pathname } = useLocation();
  const [maskImage, setMaskImage] = useState<string | undefined>(FULL_MASK);

  useLayoutEffect(() => {
    const backdrop = backdropRef.current;
    const shell = backdrop?.parentElement;
    if (!backdrop || !shell) return;

    const update = () => {
      const white = document.getElementById('entrenamientos');
      const shellHeight = shell.offsetHeight;

      if (!white || pathname !== '/' || shellHeight <= 0) {
        setMaskImage(FULL_MASK);
        return;
      }

      const shellTop = shell.getBoundingClientRect().top + window.scrollY;
      const whiteTop = white.getBoundingClientRect().top + window.scrollY - shellTop;
      const whiteBottom = whiteTop + white.offsetHeight;

      setMaskImage(
        buildMask((whiteTop / shellHeight) * 100, (whiteBottom / shellHeight) * 100)
      );
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(shell);
    const white = document.getElementById('entrenamientos');
    if (white) ro.observe(white);

    window.addEventListener('resize', update, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [backdropRef, pathname]);

  return maskImage;
}
