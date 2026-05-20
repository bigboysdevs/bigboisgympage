import { useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/** Atenúa el rayo sobre la sección blanca #entrenamientos. */
export function usePageLightningFade(): number {
  const { pathname } = useLocation();
  const [opacity, setOpacity] = useState(1);

  useLayoutEffect(() => {
    if (pathname !== '/') {
      setOpacity(1);
      return;
    }

    const update = () => {
      const white = document.getElementById('entrenamientos');
      if (!white) {
        setOpacity(1);
        return;
      }

      const rect = white.getBoundingClientRect();
      const vh = window.innerHeight;
      const overlap =
        Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      const ratio = Math.max(0, Math.min(1, overlap / (vh * 0.55)));

      setOpacity(1 - ratio * 0.92);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [pathname]);

  return opacity;
}
