import { useEffect } from 'react';

const SCROLLING_CLASS = 'is-touch-scrolling';
const RESUME_MS = 140;

/**
 * En móvil: pausa animaciones CSS de marquees mientras el usuario hace scroll/touch,
 * para que el scroll nativo no pelee con transforms en curso.
 */
export default function MobileScrollMarqueePause() {
  useEffect(() => {
    const coarse =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(max-width: 767px)').matches;
    if (!coarse) return;

    const root = document.documentElement;
    let resumeTimer = 0;

    const pause = () => {
      root.classList.add(SCROLLING_CLASS);
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        root.classList.remove(SCROLLING_CLASS);
      }, RESUME_MS);
    };

    window.addEventListener('scroll', pause, { passive: true });
    window.addEventListener('touchmove', pause, { passive: true });

    return () => {
      window.removeEventListener('scroll', pause);
      window.removeEventListener('touchmove', pause);
      window.clearTimeout(resumeTimer);
      root.classList.remove(SCROLLING_CLASS);
    };
  }, []);

  return null;
}
