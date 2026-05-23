import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HERO_LIGHTNING_IMAGE } from '@/models/branding';

gsap.registerPlugin(ScrollTrigger);

const SCROLL_ROTATION_TURNS = 1.6;
/** Balanceo vertical mínimo — el rayo no abandona el viewport. */
const MAX_DRIFT_VH = 0.05;

/**
 * Rayo fijo en pantalla (columna izquierda), detrás del título (z-1).
 * Scroll (#inicio → #filosofia): solo gira; permanece siempre visible.
 */
export default function PageLightningScroll() {
  const rootRef = useRef<HTMLDivElement>(null);
  const boltRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (pathname !== '/') return;

    const bolt = boltRef.current;
    if (!bolt) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let ctx: gsap.Context | undefined;

    const setup = () => {
      const inicio = document.getElementById('inicio');
      const filosofia = document.getElementById('filosofia');
      if (!inicio || !filosofia) return;

      ctx = gsap.context(() => {
        if (reducedMotion) {
          gsap.set(bolt, { y: 0, rotateY: 0 });
          return;
        }

        gsap.to(bolt, {
          rotateY: 360 * SCROLL_ROTATION_TURNS,
          y: () => window.innerHeight * MAX_DRIFT_VH,
          ease: 'none',
          scrollTrigger: {
            trigger: inicio,
            endTrigger: filosofia,
            start: 'top top',
            end: 'center center',
            scrub: 0.85,
            invalidateOnRefresh: true,
          },
        });
      }, rootRef);

      ScrollTrigger.refresh();
    };

    const refreshOnLoad = () => ScrollTrigger.refresh();
    const t = window.setTimeout(setup, 80);

    window.addEventListener('load', refreshOnLoad, { passive: true });
    window.addEventListener('resize', refreshOnLoad, { passive: true });

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('load', refreshOnLoad);
      window.removeEventListener('resize', refreshOnLoad);
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
