import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Desplaza a la sección cuando la URL trae hash (p. ej. /#entrenamientos). */
export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname !== '/' || !hash) return;

    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (!el) return;

    const timer = window.setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
