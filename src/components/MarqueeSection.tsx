import { useEffect, useRef } from 'react';

/** Fotos reales del gym en `public/gallery/`. Añade más archivos ahí y enlázalos aquí. */
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

/** Fila 1: orden original. Fila 2: mismo set rotado (mitad del array) — secuencia distinta. */
const ROW_1 = [...GYM_GALLERY];
const ROW_2 = rotateGallery(GYM_GALLERY, Math.ceil(GYM_GALLERY.length / 2));

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const scrolled = window.scrollY - sectionTop + window.innerHeight;
      const offset = scrolled * 0.3;

      if (row1Ref.current) {
        row1Ref.current.style.transform = `translateX(${offset - 200}px)`;
      }
      if (row2Ref.current) {
        row2Ref.current.style.transform = `translateX(${-(offset - 200)}px)`;
      }
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
      className="relative z-[10] w-full overflow-hidden bg-transparent pt-24 sm:pt-32 md:pt-40 pb-10"
      aria-label="Galería de entrenamiento"
    >
      <div className="relative flex flex-col gap-3">
        <div className="overflow-hidden w-full">
          <div
            ref={row1Ref}
            className="flex gap-3"
            style={{
              willChange: 'transform',
              transform: 'translateX(-200px)',
            }}
          >
            {[...ROW_1, ...ROW_1, ...ROW_1].map((src, i) => (
              <div
                key={i}
                className="flex-shrink-0 rounded-2xl overflow-hidden"
                style={{ width: '420px', height: '270px' }}
              >
                <img
                  src={src}
                  alt="Big Boys Gym — galería"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden w-full">
          <div
            ref={row2Ref}
            className="flex gap-3"
            style={{
              willChange: 'transform',
              transform: 'translateX(200px)',
            }}
          >
            {[...ROW_2, ...ROW_2, ...ROW_2].map((src, i) => (
              <div
                key={i}
                className="flex-shrink-0 rounded-2xl overflow-hidden"
                style={{ width: '420px', height: '270px' }}
              >
                <img
                  src={src}
                  alt="Big Boys Gym — galería"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
