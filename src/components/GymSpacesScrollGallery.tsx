import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import PlanImage from './PlanImage';
import { GYM_SPACE_SCROLL_ITEMS, type GymSpaceScrollItem } from '@/models/gymSpaces';

const ITEMS = GYM_SPACE_SCROLL_ITEMS;
const SLIDE_COUNT = ITEMS.length;

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

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          pin: pin,
          pinSpacing: false,
          anticipatePin: 1,
          scrub: 0.85,
          ...(total > 1
            ? {
                snap: {
                  snapTo: 1 / (total - 1),
                  duration: { min: 0.25, max: 0.55 },
                  delay: 0.02,
                  ease: 'power2.inOut',
                },
              }
            : {}),
          onUpdate: (self) => {
            const idx =
              total > 1 ? Math.round(self.progress * (total - 1)) : 0;
            setActiveIndex((prev) => (prev === idx ? prev : idx));
          },
          invalidateOnRefresh: true,
        });

        slideRefs.current.forEach((slide, i) => {
          if (!slide) return;

          if (total <= 1) {
            gsap.set(slide, { opacity: 1, scale: 1 });
            return;
          }

          const step = 1 / (total - 1);
          const enter = Math.max(0, i * step - step * 0.42);
          const center = i * step;
          const exit = Math.min(1, i * step + step * 0.42);

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.85,
            },
          });

          if (i === 0) {
            tl.set(slide, { opacity: 1, scale: 1 })
              .to(slide, { opacity: 0, scale: 1.05, ease: 'none', duration: exit - center }, center);
          } else if (i === total - 1) {
            tl.set(slide, { opacity: 0, scale: 1.05 }, 0)
              .to(slide, { opacity: 1, scale: 1, ease: 'none', duration: center - enter }, enter)
              .to(slide, { opacity: 1, scale: 1, ease: 'none', duration: 1 - center }, center);
          } else {
            tl.set(slide, { opacity: 0, scale: 1.05 }, 0)
              .to(slide, { opacity: 1, scale: 1, ease: 'none', duration: center - enter }, enter)
              .to(slide, { opacity: 0, scale: 1.04, ease: 'none', duration: exit - center }, center);
          }
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
      style={{ height: `${SLIDE_COUNT * 100}vh` }}
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
              className={`gym-spaces-scroll__img${item.imageFit === 'contain' ? ' gym-spaces-scroll__img--contain' : ''}`}
              style={
                item.imagePosition
                  ? { objectPosition: item.imagePosition }
                  : undefined
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
