import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type TouchEvent,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GALLERY_IMG_SIZES, galleryImageSrcSet } from '@/utils/responsiveImages';

export type ImageCursorTrailProps = {
  items: readonly string[];
  maxNumberOfImages?: number;
  distance?: number;
  imgClass?: string;
  className?: string;
  children?: ReactNode;
};

type TrailImage = {
  id: number;
  src: string;
  x: number;
  y: number;
  rotation: number;
};

const IMAGE_LIFETIME_MS = 1100;
const TOUCH_SPAWN_INTERVAL_MS = 120;
const TOUCH_DISTANCE_PX = 48;

function isFinePointer(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/**
 * Rastro de imágenes al mover el cursor (inspirado en Skiper UI skiper18 / befreaky.co).
 */
export function ImageCursorTrail({
  items,
  maxNumberOfImages = 8,
  distance = 20,
  imgClass = 'h-32 w-32',
  className = '',
  children,
}: ImageCursorTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [trailImages, setTrailImages] = useState<TrailImage[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const imageIndexRef = useRef(0);
  const idRef = useRef(0);
  const timeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const lastTouchSpawnRef = useRef(0);
  const touchMaxImages = Math.min(maxNumberOfImages, 4);

  const scheduleRemoval = useCallback((id: number) => {
    const existing = timeoutsRef.current.get(id);
    if (existing) clearTimeout(existing);

    const timeout = setTimeout(() => {
      setTrailImages((prev) => prev.filter((img) => img.id !== id));
      timeoutsRef.current.delete(id);
    }, IMAGE_LIFETIME_MS);

    timeoutsRef.current.set(id, timeout);
  }, []);

  const spawnAt = useCallback(
    (clientX: number, clientY: number, minDistance: number, maxImages: number) => {
      const container = containerRef.current;
      if (!container || items.length === 0) return;

      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (lastPosRef.current) {
        const dx = x - lastPosRef.current.x;
        const dy = y - lastPosRef.current.y;
        if (Math.hypot(dx, dy) < minDistance) return;
      }

      lastPosRef.current = { x, y };

      const src = items[imageIndexRef.current % items.length];
      imageIndexRef.current += 1;

      const id = idRef.current++;
      const rotation = (Math.random() - 0.5) * 28;

      setTrailImages((prev) => {
        const next = [...prev, { id, src, x, y, rotation }];
        if (next.length > maxImages) {
          const dropped = next.slice(0, next.length - maxImages);
          dropped.forEach((img) => {
            const t = timeoutsRef.current.get(img.id);
            if (t) clearTimeout(t);
            timeoutsRef.current.delete(img.id);
          });
          return next.slice(-maxImages);
        }
        return next;
      });

      scheduleRemoval(id);
    },
    [items, scheduleRemoval],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      // MOBILE: omitir mousemove en dispositivos táctiles (solo touch handler).
      if (!isFinePointer()) return;
      spawnAt(event.clientX, event.clientY, distance, maxNumberOfImages);
    },
    [distance, maxNumberOfImages, spawnAt],
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const now = performance.now();
      if (now - lastTouchSpawnRef.current < TOUCH_SPAWN_INTERVAL_MS) return;
      lastTouchSpawnRef.current = now;
      const touch = event.touches[0];
      if (touch) spawnAt(touch.clientX, touch.clientY, TOUCH_DISTANCE_PX, touchMaxImages);
    },
    [spawnAt, touchMaxImages],
  );

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`.trim()}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <AnimatePresence mode="popLayout">
          {trailImages.map((img) => (
            <motion.img
              key={img.id}
              src={img.src}
              srcSet={galleryImageSrcSet(img.src)}
              sizes={GALLERY_IMG_SIZES}
              alt=""
              draggable={false}
              loading="lazy"
              decoding="async"
              className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-md object-cover shadow-[0_12px_40px_rgba(0,0,0,0.45)] ${imgClass}`}
              style={{
                left: img.x,
                top: img.y,
              }}
              initial={{ opacity: 0, scale: 0.35, rotate: img.rotation - 10 }}
              animate={{ opacity: 0.92, scale: 1, rotate: img.rotation }}
              exit={{ opacity: 0, scale: 0.45, rotate: img.rotation + 12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </AnimatePresence>
      </div>

      {children ? <div className="relative z-[1]">{children}</div> : null}
    </div>
  );
}
