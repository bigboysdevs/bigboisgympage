import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import PlanImage from './PlanImage';
import { GYM_SPACE_SCROLL_ITEMS, type GymSpaceScrollItem } from '@/models/gymSpaces';

const ITEMS = GYM_SPACE_SCROLL_ITEMS;
const SLIDE_COUNT = ITEMS.length;
/** vh de scroll por cada transición entre slides */
const SCROLL_PER_SLIDE_VH = 100;

function getSnapPoints(total: number) {
  if (total <= 1) return [0];
  return Array.from({ length: total }, (_, i) => i / (total - 1));
}

function getSlideOpacity(index: number, progress: number, total: number) {
  if (total <= 1) return index === 0 ? 1 : 0;

  const step = 1 / (total - 1);
  const distance = Math.abs(progress - index * step) / step;
  if (distance >= 1) return 0;

  const solid = 0.55;
  if (distance <= solid) return 1;
  return 1 - (distance - solid) / (1 - solid);
}

function getActiveIndex(progress: number, total: number) {
  if (total <= 1) return 0;
  const points = getSnapPoints(total);
  let closest = 0;
  let minDist = Infinity;
  for (let i = 0; i < points.length; i++) {
    const dist = Math.abs(progress - points[i]!);
    if (dist < minDist) {
      minDist = dist;
      closest = i;
    }
  }
  return closest;
}

function SideNav({ activeIndex, total }: { activeIndex: number; total: number }) {
  const progress = total > 1 ? activeIndex / (total - 1) : 0;

  return (
    <nav className="gym-spaces-scroll__side" aria-label="Progreso de espacios">
      <div className="gym-spaces-scroll__side-track" aria-hidden>
        <span
          className="gym-spaces-scroll__side-indicator"
          style={{ top: `${progress * 100}%` }}
          aria-hidden
        />
      </div>
      <ol className="gym-spaces-scroll__side-list">
        {ITEMS.map((item, index) => {
          const state =
            index === activeIndex ? 'active' : index > activeIndex ? 'upcoming' : 'past';

          return (
            <li
              key={item.id}
              className={`gym-spaces-scroll__side-step gym-spaces-scroll__side-step--${state}`}
              style={
                {
                  '--step-position': total > 1 ? index / (total - 1) : 0,
                } as React.CSSProperties
              }
              aria-current={index === activeIndex ? 'step' : undefined}
            >
              <span className="gym-spaces-scroll__side-num">{index + 1}</span>
              <span className="sr-only">
                {item.title} — {index === activeIndex ? 'actual' : index < activeIndex ? 'visto' : 'pendiente'}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function SlideCaption({ item }: { item: GymSpaceScrollItem }) {
  return (
    <motion.div
      key={item.id}
      className="gym-spaces-scroll__content"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <h3 className="gym-spaces-scroll__content-title">{item.title}</h3>
    </motion.div>
  );
}

export default function GymSpacesScrollGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollHeightVh =
    SLIDE_COUNT <= 1 ? 100 : 100 + (SLIDE_COUNT - 1) * SCROLL_PER_SLIDE_VH;

  useLayoutEffect(() => {
    if (reduceMotion) return;

    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    const setup = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const total = SLIDE_COUNT;
      const snapPoints = getSnapPoints(total);

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          pin: pin,
          pinSpacing: false,
          anticipatePin: 1,
          scrub: 0.35,
          snap:
            total > 1
              ? {
                  snapTo: (value) => {
                    let nearest = snapPoints[0]!;
                    let minDist = Math.abs(value - nearest);
                    for (const point of snapPoints) {
                      const dist = Math.abs(value - point);
                      if (dist < minDist) {
                        minDist = dist;
                        nearest = point;
                      }
                    }
                    return nearest;
                  },
                  duration: { min: 0.45, max: 0.75 },
                  delay: 0.05,
                  ease: 'power2.inOut',
                }
              : undefined,
          onUpdate: (self) => {
            const progress = self.progress;

            slideRefs.current.forEach((slide, i) => {
              if (!slide) return;
              const opacity = getSlideOpacity(i, progress, total);
              gsap.set(slide, { opacity, scale: 1, zIndex: opacity > 0.05 ? i + 1 : 0 });
            });

            const idx = getActiveIndex(progress, total);
            setActiveIndex((prev) => (prev === idx ? prev : idx));
          },
          invalidateOnRefresh: true,
        });
      }, section);

      ScrollTrigger.refresh();
    };

    void setup();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduceMotion]);

  const activeItem = ITEMS[activeIndex];

  if (reduceMotion) {
    return (
      <div className="gym-spaces-scroll gym-spaces-scroll--static">
        <div className="gym-spaces-scroll__pin">
          <PlanImage
            src={ITEMS[0].image}
            fallbackSrc={ITEMS[0].fallbackImage}
            alt={ITEMS[0].title}
            className="gym-spaces-scroll__img"
          />
          <div className="gym-spaces-scroll__scrim" aria-hidden />
          <SideNav activeIndex={0} total={SLIDE_COUNT} />
          <div className="gym-spaces-scroll__content-wrap">
            <SlideCaption item={ITEMS[0]} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="gym-spaces-scroll"
      style={{ height: `${scrollHeightVh}vh` }}
      aria-roledescription="carousel"
      aria-label="Galería de espacios del gym"
    >
      <div ref={pinRef} className="gym-spaces-scroll__pin">
        {ITEMS.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => {
              slideRefs.current[index] = el;
            }}
            className="gym-spaces-scroll__slide"
            style={{ zIndex: index + 1, opacity: index === 0 ? 1 : 0 }}
            aria-hidden={index !== activeIndex}
          >
            <PlanImage
              src={item.image}
              fallbackSrc={item.fallbackImage}
              alt={item.title}
              className="gym-spaces-scroll__img"
              style={
                item.imagePosition ? { objectPosition: item.imagePosition } : undefined
              }
            />
            <div className="gym-spaces-scroll__scrim" aria-hidden />
          </div>
        ))}

        <SideNav activeIndex={activeIndex} total={SLIDE_COUNT} />

        <div className="gym-spaces-scroll__content-wrap" aria-live="polite">
          <AnimatePresence mode="wait">
            <SlideCaption key={activeItem.id} item={activeItem} />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
