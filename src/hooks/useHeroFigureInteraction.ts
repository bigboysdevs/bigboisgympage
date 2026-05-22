import { useLayoutEffect, useState } from 'react';

/** Rotar el modelo 3D solo en desktop; en móvil el scroll y los taps pasan a la página. */
export function useHeroFigureInteraction(): boolean {
  const [canRotate, setCanRotate] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const apply = () => setCanRotate(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return canRotate;
}
