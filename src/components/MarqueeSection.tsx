import { useCallback, useEffect, useRef, useState } from 'react';
import { useHorizontalDragOffset } from '../hooks/useHorizontalDragOffset';
import { wrapMarqueeOffset } from '../utils/marqueeLoop';

/** Fotos reales del gym en `public/gallery/`. */
const GYM_GALLERY = [
  '/gallery/362dad12-6e49-4136-affe-ba1ca9700caf.jpg',
  '/gallery/70a73709-9078-4c5b-9ada-25f8df250fd0.jpg',
  '/gallery/24ec4dca-b6de-4cb2-b9c1-1dc7fec68472.jpg',
  '/gallery/5fb53f6c-3da1-4d64-9c05-76b44d2a5a41.jpg',
  '/gallery/e9faccdf-4785-4f78-8d11-7403e03ec843.jpg',
  '/gallery/image3.jpg',
  '/gallery/Image%202.jpg',
  '/gallery/image.jpg',
] as const;

function rotateGallery<T>(items: readonly T[], shift: number): T[] {
  const n = items.length;
  if (n === 0) return [];
  const s = ((shift % n) + n) % n;
  return [...items.slice(s), ...items.slice(0, s)];
}

const ROW_1 = [...GYM_GALLERY];
const ROW_2 = rotateGallery(GYM_GALLERY, Math.ceil(GYM_GALLERY.length / 2));

const SCROLL_BASE_OFFSET = -200;
const SCROLL_FACTOR = 0.3;

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

  return (
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
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollBase, setScrollBase] = useState(SCROLL_BASE_OFFSET);

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
      className="marquee-gallery relative z-[10] w-full overflow-hidden bg-transparent pt-24 pb-10 sm:pt-32 md:pt-40"
      aria-label="Galería de entrenamiento"
    >
      <p className="sr-only">
        Al bajar o subir la página las filas se mueven con el scroll. Puedes arrastrar las fotos en
        horizontal en un carrete infinito.
      </p>
      <div className="relative flex flex-col gap-3 sm:gap-4 md:gap-5">
        <MarqueeRow items={ROW_1} scrollDirection={1} scrollBase={scrollBase} />
        <MarqueeRow items={ROW_2} scrollDirection={-1} scrollBase={scrollBase} />
      </div>
    </section>
  );
}
