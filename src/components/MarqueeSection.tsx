import { useCallback, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { GYM_GALLERY } from '@/models/gymGallery';
import { shuffleArray } from '@/utils/shuffleArray';
import { wrapMarqueeOffset } from '../utils/marqueeLoop';

/** Duración de una vuelta completa del carrete (ms). */
const MARQUEE_LOOP_MS = 48_000;
/** Extra de velocidad al hacer scroll (px/s por delta de scroll). */
const SCROLL_BOOST_GAIN = 3.2;
/** Decaimiento del boost de scroll. */
const SCROLL_BOOST_DECAY = 0.92;

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

type MarqueeDirection = 'left' | 'right';

type MarqueeRowProps = {
  items: readonly string[];
  /**
   * Dirección base de esta fila.
   * La otra fila usa la opuesta: siempre una a la derecha y la otra a la izquierda.
   */
  baseDirection: MarqueeDirection;
  /**
   * Si el scroll invierte el sentido (subir/bajar).
   * true = invertir respecto a baseDirection.
   */
  invertRef: MutableRefObject<boolean>;
  scrollBoostRef: MutableRefObject<number>;
};

function MarqueeRow({
  items,
  baseDirection,
  invertRef,
  scrollBoostRef,
}: MarqueeRowProps) {
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
      const el = trackRef.current;
      const loop = loopWidthRef.current;
      if (el && loop > 0) {
        const dt = Math.min((now - lastTsRef.current) / 1000, 0.064);
        lastTsRef.current = now;

        const baseSpeed = loop / (MARQUEE_LOOP_MS / 1000);
        let dir: MarqueeDirection = baseDirection;
        if (invertRef.current) {
          dir = baseDirection === 'left' ? 'right' : 'left';
        }
        const signedBase = dir === 'left' ? -baseSpeed : baseSpeed;

        // Boost del scroll: misma lógica de sentido (bajar → izq, subir → der)
        // y con signo según la fila para que sigan opuestas.
        const scrollSign = baseDirection === 'left' ? 1 : -1;
        const boostSpeed = -scrollBoostRef.current * SCROLL_BOOST_GAIN * scrollSign;

        offsetRef.current += (signedBase + boostSpeed) * dt;
        const x = wrapMarqueeOffset(offsetRef.current, loop);
        offsetRef.current = x;
        el.style.transform = `translateX(${x}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [baseDirection, reducedMotion, invertRef, scrollBoostRef]);

  return (
    <div className="marquee-gallery__track-wrap">
      <div className="marquee-gallery__track overflow-hidden w-full">
        <div
          ref={trackRef}
          role="presentation"
          aria-hidden
          className="marquee-gallery__row flex gap-3 sm:gap-4"
          style={{ willChange: reducedMotion ? undefined : 'transform' }}
        >
          {[...items, ...items, ...items].map((src, i) => (
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
  const { row1, row2 } = useShuffledMarqueeRows();
  const scrollBoostRef = useRef(0);
  /** Al subir se invierten los sentidos (siguen opuestos entre sí). */
  const invertRef = useRef(false);
  const lastScrollYRef = useRef(
    typeof window !== 'undefined' ? window.scrollY : 0,
  );

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    if (reducedMotion) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastScrollYRef.current;
        lastScrollYRef.current = y;
        if (delta === 0) return;

        // Bajar = sentidos base; subir = invertidos (siguen una izq / una der)
        invertRef.current = delta < 0;
        scrollBoostRef.current += delta;
        scrollBoostRef.current *= SCROLL_BOOST_DECAY;
      });
    };

    const decay = () => {
      scrollBoostRef.current *= SCROLL_BOOST_DECAY;
      if (Math.abs(scrollBoostRef.current) < 0.05) scrollBoostRef.current = 0;
      rafDecay = requestAnimationFrame(decay);
    };
    let rafDecay = requestAnimationFrame(decay);

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rafDecay);
    };
  }, [reducedMotion]);

  return (
    <section
      className="marquee-gallery relative z-[10] mt-[clamp(2.5rem,9vh,6.5rem)] w-full overflow-hidden bg-transparent pb-10 pt-2 sm:pt-3 md:pt-4"
      aria-label="Galería de entrenamiento"
    >
      <p className="sr-only">
        Galería en movimiento continuo: una fila va a la izquierda y la otra a la derecha. Al
        subir o bajar la página se invierten los sentidos, siempre opuestos.
      </p>
      <div className="relative flex flex-col gap-1 sm:gap-1.5 md:gap-2">
        <MarqueeRow
          items={row1}
          baseDirection="left"
          invertRef={invertRef}
          scrollBoostRef={scrollBoostRef}
        />
        <MarqueeRow
          items={row2}
          baseDirection="right"
          invertRef={invertRef}
          scrollBoostRef={scrollBoostRef}
        />
      </div>
    </section>
  );
}
