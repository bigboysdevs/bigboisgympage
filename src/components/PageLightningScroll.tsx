import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { HERO_LIGHTNING_IMAGE } from '@/models/branding';

/** 2 vueltas completas: al llegar a Filosofía el rayo vuelve a la orientación inicial (scaleX(-1)). */
const SCROLL_ROTATION_TURNS = 2;
/** Balanceo vertical suave al entrar en Filosofía. */
const MAX_DRIFT_VH = 0.07;
/** Desplazamiento hacia la izquierda al bajar (fracción del ancho de pantalla). */
const MAX_DRIFT_VW = 0.055;

/**
 * Rayo fijo en pantalla (columna izquierda), detrás del título (z-5).
 * Scroll (#inicio → #filosofia): gira, baja un poco y se desplaza a la izquierda.
 */
export default function PageLightningScroll() {
  const rootRef = useRef<HTMLDivElement>(null);
  const boltRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (pathname !== '/') return;

    const bolt = boltRef.current;
    const root = rootRef.current;
    if (!bolt || !root) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;
    let refreshOnLoad: (() => void) | undefined;

    const setup = async () => {
      // PERF: GSAP + ScrollTrigger fuera del bundle inicial; el rayo CSS ya es visible.
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const inicio = document.getElementById('inicio');
      const filosofia = document.getElementById('filosofia');
      if (!inicio || !filosofia) return;

      ctx = gsap.context(() => {
        if (reducedMotion) {
          gsap.set(bolt, { y: 0, rotateY: 0 });
          gsap.set(root, { x: 0 });
          return;
        }

        const isMobile =
          window.matchMedia('(pointer: coarse)').matches ||
          window.matchMedia('(max-width: 767px)').matches;

        const scrollTrigger = {
          trigger: inicio,
          endTrigger: filosofia,
          start: 'top top',
          /** Termina al centrar Filosofía: el rayo queda en esa sección, orientación inicial. */
          end: 'center center',
          scrub: isMobile ? 1.15 : 0.85,
          invalidateOnRefresh: true,
        };

        gsap
          .timeline({ scrollTrigger })
          .fromTo(
            bolt,
            { rotateY: 0, y: 0 },
            {
              // En móvil: menos rotación 3D (más fluida).
              rotateY: 360 * (isMobile ? 1 : SCROLL_ROTATION_TURNS),
              y: () => window.innerHeight * (isMobile ? MAX_DRIFT_VH * 0.5 : MAX_DRIFT_VH),
              ease: 'none',
              force3D: true,
            },
            0,
          )
          .fromTo(
            root,
            { x: 0 },
            {
              x: () => -window.innerWidth * (isMobile ? MAX_DRIFT_VW * 0.6 : MAX_DRIFT_VW),
              ease: 'none',
              force3D: true,
            },
            0,
          );
      }, rootRef);

      ScrollTrigger.refresh();
      refreshOnLoad = () => ScrollTrigger.refresh();
      window.addEventListener('load', refreshOnLoad, { passive: true });
      window.addEventListener('resize', refreshOnLoad, { passive: true });
    };

    const t = window.setTimeout(() => {
      void setup();
    }, 80);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
      if (refreshOnLoad) {
        window.removeEventListener('load', refreshOnLoad);
        window.removeEventListener('resize', refreshOnLoad);
      }
      ctx?.revert();
    };
  }, [pathname]);

  if (pathname !== '/') return null;

  return (
    <div ref={rootRef} className="page-lightning-scroll" aria-hidden>
      <div ref={boltRef} className="page-lightning-scroll__bolt">
        <div
          className="page-lightning-scroll__img"
          style={{
            WebkitMaskImage: `url(${HERO_LIGHTNING_IMAGE})`,
            maskImage: `url(${HERO_LIGHTNING_IMAGE})`,
          }}
        />
      </div>
    </div>
  );
}
