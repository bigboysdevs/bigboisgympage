import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GYM_GALLERY } from '@/models/gymGallery';
import { shuffleArray } from '@/utils/shuffleArray';
import { useHorizontalDragOffset } from '../hooks/useHorizontalDragOffset';
import { wrapMarqueeOffset } from '../utils/marqueeLoop';

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

const SCROLL_BASE_OFFSET = -200;
const SCROLL_FACTOR = 0.3;
const NUDGE_PX = 220;

function MarqueeArrow({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  const label =
    direction === 'left' ? 'Desplazar galería a la izquierda' : 'Desplazar galería a la derecha';

  return (
    <button
      type="button"
      className={`marquee-gallery__arrow marquee-gallery__arrow--${direction}`}
      aria-label={label}
      onClick={onClick}
    >
      <Icon className="marquee-gallery__arrow-icon" aria-hidden />
    </button>
  );
}

type MarqueeRowProps = {
  items: readonly string[];
  /** Scroll de página: fila 2 va en sentido contrario a la 1 */
  scrollDirection: 1 | -1;
  scrollBase: number;
};

function MarqueeRow({ items, scrollDirection, scrollBase }: MarqueeRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const loopWidthRef = useRef(0);
  const drag = useHorizontalDragOffset();

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

  const applyTransform = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const scrollX = scrollDirection === 1 ? scrollBase : -scrollBase;
    const dragRaw = drag.getOffset();
    const loop = loopWidthRef.current;
    const dragLooped = loop > 0 ? wrapMarqueeOffset(dragRaw, loop) : dragRaw;
    const x = scrollX + dragLooped;
    el.style.transform = `translateX(${x}px)`;
  }, [scrollDirection, drag, scrollBase]);

  useEffect(() => {
    applyTransform();
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
  }, [applyTransform, measureLoop, items]);

  const dragHandlers = {
    onPointerDown: drag.onPointerDown,
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
      drag.onPointerMove(e);
      applyTransform();
    },
    onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => {
      drag.onPointerUp(e, loopWidthRef.current);
      applyTransform();
    },
    onPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => {
      drag.onPointerCancel(e, loopWidthRef.current);
      applyTransform();
    },
  };

  const nudge = useCallback(
    (direction: 'left' | 'right') => {
      const delta = direction === 'left' ? -NUDGE_PX : NUDGE_PX;
      drag.nudgeBy(delta, loopWidthRef.current);
      applyTransform();
    },
    [drag, applyTransform],
  );

  return (
    <div className="marquee-gallery__track-wrap">
      <MarqueeArrow direction="left" onClick={() => nudge('left')} />
      <MarqueeArrow direction="right" onClick={() => nudge('right')} />
      <div className="marquee-gallery__track overflow-hidden w-full">
        <div
          ref={trackRef}
          role="region"
          aria-label="Galería — arrastra en horizontal (carrete infinito)"
          className="marquee-gallery__row flex cursor-grab gap-3 active:cursor-grabbing sm:gap-4"
          style={{ willChange: 'transform', touchAction: 'pan-y' }}
          {...dragHandlers}
        >
          {[...items, ...items, ...items].map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="marquee-gallery__card flex-shrink-0 overflow-hidden rounded-2xl sm:rounded-3xl"
            >
              <img
                src={src}
                alt="Big Boys Gym — galería"
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
  const [scrollBase, setScrollBase] = useState(SCROLL_BASE_OFFSET);
  const { row1, row2 } = useShuffledMarqueeRows();

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const scrolled = window.scrollY - sectionTop + window.innerHeight;
      setScrollBase(scrolled * SCROLL_FACTOR + SCROLL_BASE_OFFSET);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="marquee-gallery relative z-[10] mt-[clamp(2.5rem,9vh,6.5rem)] w-full overflow-hidden bg-transparent pb-10 pt-2 sm:pt-3 md:pt-4"
      aria-label="Galería de entrenamiento"
    >
      <p className="sr-only">
        Al bajar o subir la página las filas se mueven con el scroll. Puedes arrastrar las fotos en
        horizontal en un carrete infinito, o usar las flechas izquierda y derecha.
      </p>
      <div className="relative flex flex-col gap-1 sm:gap-1.5 md:gap-2">
        <MarqueeRow items={row1} scrollDirection={1} scrollBase={scrollBase} />
        <MarqueeRow items={row2} scrollDirection={-1} scrollBase={scrollBase} />
      </div>
    </section>
  );
}
