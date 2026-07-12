import { useMemo } from 'react';
import { GYM_GALLERY } from '@/models/gymGallery';
import { shuffleArray } from '@/utils/shuffleArray';

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
  direction: MarqueeDirection;
  reducedMotion: boolean;
};

/** Marquee 100% CSS (2 copias) — no usa RAF ni pelea con el touch scroll. */
function MarqueeRow({ items, direction, reducedMotion }: MarqueeRowProps) {
  const trackItems = useMemo(() => [...items, ...items], [items]);

  return (
    <div className="marquee-gallery__track-wrap pointer-events-none">
      <div className="marquee-gallery__track overflow-hidden w-full">
        <div
          role="presentation"
          aria-hidden
          className={[
            'marquee-gallery__row flex gap-3 sm:gap-4',
            reducedMotion
              ? ''
              : direction === 'left'
                ? 'marquee-gallery__row--css-left'
                : 'marquee-gallery__row--css-right',
          ].join(' ')}
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
  const { row1, row2 } = useShuffledMarqueeRows();
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  return (
    <section
      className="marquee-gallery relative z-[10] mt-[clamp(2.5rem,9vh,6.5rem)] w-full overflow-hidden bg-transparent pb-10 pt-2 sm:pt-3 md:pt-4"
      aria-label="Galería de entrenamiento"
    >
      <p className="sr-only">
        Galería en movimiento continuo: una fila va a la izquierda y la otra a la derecha.
      </p>
      <div className="relative flex flex-col gap-1 sm:gap-1.5 md:gap-2">
        <MarqueeRow items={row1} direction="left" reducedMotion={reducedMotion} />
        <MarqueeRow items={row2} direction="right" reducedMotion={reducedMotion} />
      </div>
    </section>
  );
}
