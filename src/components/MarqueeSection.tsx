import { useCallback, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { GYM_GALLERY } from '@/models/gymGallery';
import { shuffleArray } from '@/utils/shuffleArray';
import { wrapMarqueeOffset } from '../utils/marqueeLoop';

/** Duración de una vuelta completa del carrete (ms). */
const MARQUEE_LOOP_MS = 48_000;
/** En móvil: más lento = menos carga de GPU al scrollear. */
const MARQUEE_LOOP_MS_MOBILE = 64_000;

/** Mezcla la galería y reparte mitades disjuntas entre fila superior e inferior. */
function splitShuffledGallery(items: readonly string[]) {
  const shuffled = shuffleArray(items);
  const splitAt = Math.ceil(shuffled.length / 2);
  return {
    row1: shuffled.slice(0, splitAt),
    row2: shuffled.slice(splitAt),
  };
}

function useShuffledMarqueeRows() {
  return useMemo(() => splitShuffledGallery(GYM_GALLERY), []);
}

function useIsMobileScroll() {
  return useMemo(
    () =>
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(max-width: 767px)').matches),
    [],
  );
}

type MarqueeDirection = 'left' | 'right';

type MarqueeRowProps = {
  items: readonly string[];
  direction: MarqueeDirection;
  loopMs: number;
  /** Pausa el RAF cuando la sección no está visible. */
  isActiveRef: MutableRefObject<boolean>;
};

function MarqueeRow({ items, direction, loopMs, isActiveRef }: MarqueeRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const loopWidthRef = useRef(0);
  const offsetRef = useRef(0);
  const lastTsRef = useRef(0);
  const rafRef = useRef(0);

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const measureLoop = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length < items.length) return;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
    let width = 0;
    for (let i = 0; i < items.length; i++) {
      const child = track.children[i] as HTMLElement;
      width += child.offsetWidth + (i < items.length - 1 ? gap : 0);
    }
    if (width > 0) loopWidthRef.current = width;
  }, [items.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    measureLoop();

    const ro = new ResizeObserver(() => {
      measureLoop();
    });
    ro.observe(track);

    const onImgLoad = () => measureLoop();
    track.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', onImgLoad, { once: true });
    });

    return () => ro.disconnect();
  }, [measureLoop, items]);

  useEffect(() => {
    if (reducedMotion) {
      const el = trackRef.current;
      if (el) el.style.transform = '';
      return;
    }

    lastTsRef.current = performance.now();

    const tick = (now: number) => {
      if (isActiveRef.current) {
        const el = trackRef.current;
        const loop = loopWidthRef.current;
        if (el && loop > 0) {
          const dt = Math.min((now - lastTsRef.current) / 1000, 0.064);
          lastTsRef.current = now;

          const baseSpeed = loop / (loopMs / 1000);
          const signedBase = direction === 'left' ? -baseSpeed : baseSpeed;

          offsetRef.current += signedBase * dt;
          const x = wrapMarqueeOffset(offsetRef.current, loop);
          offsetRef.current = x;
          el.style.transform = `translate3d(${x}px,0,0)`;
        }
      } else {
        lastTsRef.current = now;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [direction, reducedMotion, loopMs, isActiveRef]);

  // En móvil: 2 copias bastan; en desktop: 3 para el bucle más largo.
  const copies = useIsMobileScroll() ? 2 : 3;
  const trackItems = useMemo(() => {
    const out: string[] = [];
    for (let c = 0; c < copies; c++) out.push(...items);
    return out;
  }, [items, copies]);

  return (
    <div className="marquee-gallery__track-wrap pointer-events-none">
      <div className="marquee-gallery__track overflow-hidden w-full">
        <div
          ref={trackRef}
          role="presentation"
          aria-hidden
          className="marquee-gallery__row flex gap-3 sm:gap-4"
          style={{ willChange: reducedMotion ? undefined : 'transform' }}
        >
          {trackItems.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="marquee-gallery__card flex-shrink-0 overflow-hidden rounded-2xl sm:rounded-3xl"
            >
              <img
                src={src}
                alt=""
                className="pointer-events-none h-full w-full select-none object-cover"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isActiveRef = useRef(true);
  const { row1, row2 } = useShuffledMarqueeRows();
  const isMobile = useIsMobileScroll();
  const loopMs = isMobile ? MARQUEE_LOOP_MS_MOBILE : MARQUEE_LOOP_MS;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        isActiveRef.current = entry?.isIntersecting ?? false;
      },
      { rootMargin: '20% 0px', threshold: 0 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="marquee-gallery relative z-[10] mt-[clamp(2.5rem,9vh,6.5rem)] w-full overflow-hidden bg-transparent pb-10 pt-2 sm:pt-3 md:pt-4"
      aria-label="Galería de entrenamiento"
    >
      <p className="sr-only">
        Galería en movimiento continuo: una fila va a la izquierda y la otra a la derecha.
      </p>
      <div className="relative flex flex-col gap-1 sm:gap-1.5 md:gap-2">
        <MarqueeRow
          items={row1}
          direction="left"
          loopMs={loopMs}
          isActiveRef={isActiveRef}
        />
        <MarqueeRow
          items={row2}
          direction="right"
          loopMs={loopMs}
          isActiveRef={isActiveRef}
        />
      </div>
    </section>
  );
}
