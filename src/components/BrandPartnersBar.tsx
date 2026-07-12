import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  BRAND_PARTNERS_MARQUEE_MS,
  PARTNER_BRANDS,
} from '@/models/partnerBrands';
import { wrapMarqueeOffset } from '@/utils/marqueeLoop';

function PartnerLogo({ name, logoSrc }: { name: string; logoSrc: string }) {
  return (
    <div className="brand-partners-bar__link flex shrink-0 items-center px-6 sm:px-8 md:px-10">
      <img
        src={logoSrc}
        alt={name}
        className="brand-partners-bar__logo pointer-events-none h-7 w-auto max-w-[9rem] select-none object-contain object-center opacity-80 sm:h-8 md:h-9"
        width={140}
        height={36}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}

export default function BrandPartnersBar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const loopWidthRef = useRef(0);
  const marqueeStartRef = useRef(0);
  const rafRef = useRef(0);

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const loop = useMemo(() => [...PARTNER_BRANDS, ...PARTNER_BRANDS], []);

  const measureLoop = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length < PARTNER_BRANDS.length) return;

    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
    let width = 0;

    for (let i = 0; i < PARTNER_BRANDS.length; i++) {
      const child = track.children[i] as HTMLElement;
      width += child.offsetWidth + (i < PARTNER_BRANDS.length - 1 ? gap : 0);
    }

    if (width > 0) loopWidthRef.current = width;
  }, []);

  const applyTransform = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const loop = loopWidthRef.current;

    let autoOffset = 0;
    if (!reducedMotion && loop > 0 && marqueeStartRef.current > 0) {
      const elapsed = performance.now() - marqueeStartRef.current;
      const progress = (elapsed % BRAND_PARTNERS_MARQUEE_MS) / BRAND_PARTNERS_MARQUEE_MS;
      autoOffset = -progress * loop;
    }

    const x = loop > 0 ? wrapMarqueeOffset(autoOffset, loop) : 0;

    if (reducedMotion && x === 0) {
      el.style.transform = '';
      return;
    }

    el.style.transform = `translateX(${x}px)`;
  }, [reducedMotion]);

  useEffect(() => {
    marqueeStartRef.current = performance.now();

    const tick = () => {
      applyTransform();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [applyTransform]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    measureLoop();
    applyTransform();

    const ro = new ResizeObserver(() => {
      measureLoop();
      applyTransform();
    });
    ro.observe(track);

    const onImgLoad = () => {
      measureLoop();
      applyTransform();
    };
    track.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', onImgLoad, { once: true });
    });

    return () => ro.disconnect();
  }, [applyTransform, measureLoop]);

  return (
    <section
      className="brand-partners-bar relative z-[15] mt-[clamp(2.5rem,8vh,5rem)] w-full border-y border-white/10 bg-[#0a0a0a]/90 py-5 backdrop-blur-[2px] sm:py-6"
      aria-label="Marcas aliadas"
    >
      <div className="mx-auto flex max-w-[100vw] flex-col items-center">
        <p className="sr-only">Carrusel automático de marcas aliadas.</p>

        <div
          className="brand-partners-bar__viewport relative w-full overflow-hidden"
          aria-hidden
        >
          <div className="brand-partners-bar__fade brand-partners-bar__fade--left" aria-hidden />
          <div className="brand-partners-bar__fade brand-partners-bar__fade--right" aria-hidden />

          <div
            ref={trackRef}
            className="brand-partners-bar__track pointer-events-none flex w-max items-center"
          >
            {loop.map((brand, index) => (
              <PartnerLogo
                key={`${brand.id}-${index}`}
                name={brand.name}
                logoSrc={brand.logoSrc}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
