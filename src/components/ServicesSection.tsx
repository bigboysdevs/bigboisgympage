import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import FadeIn from './FadeIn';
import TrainingPlanRow from './TrainingPlanRow';
import TrainingPlanPreviewVideo from './TrainingPlanPreviewVideo';
import { TRAINING_PLANS, type TrainingPlan } from '@/models/trainingPlans';

const DESKTOP_PREVIEW = { width: 240, height: 300, offsetX: 32, offsetY: -80, padding: 16 } as const;

function clampPreviewPosition(clientX: number, clientY: number, bounds: DOMRect) {
  const rawX = clientX - bounds.left + DESKTOP_PREVIEW.offsetX;
  const rawY = clientY - bounds.top + DESKTOP_PREVIEW.offsetY;
  const minX = DESKTOP_PREVIEW.padding;
  const minY = DESKTOP_PREVIEW.padding;
  const maxX = bounds.width - DESKTOP_PREVIEW.width - DESKTOP_PREVIEW.padding;
  const maxY = bounds.height - DESKTOP_PREVIEW.height - DESKTOP_PREVIEW.padding;

  return {
    x: Math.min(Math.max(rawX, minX), Math.max(minX, maxX)),
    y: Math.min(Math.max(rawY, minY), Math.max(minY, maxY)),
  };
}

function TrainingPlanMobileVideo({ plan }: { plan: TrainingPlan }) {
  return (
    <motion.div
      className="entrenamientos-mobile-video"
      initial={{ opacity: 0, height: 0, marginTop: 0 }}
      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="entrenamientos-mobile-video__frame">
        <TrainingPlanPreviewVideo />
        <div className="entrenamientos-mobile-video__overlay" aria-hidden />
        <p className="entrenamientos-mobile-video__caption">{plan.name}</p>
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [activePlan, setActivePlan] = useState<TrainingPlan | null>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const previewX = useSpring(pointerX, { stiffness: 280, damping: 28, mass: 0.45 });
  const previewY = useSpring(pointerY, { stiffness: 280, damping: 28, mass: 0.45 });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobileLayout(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const showDesktopPreview = useCallback(
    (plan: TrainingPlan, clientX: number, clientY: number) => {
      const section = sectionRef.current;
      if (!section) return;

      const bounds = section.getBoundingClientRect();
      const inside =
        clientX >= bounds.left &&
        clientX <= bounds.right &&
        clientY >= bounds.top &&
        clientY <= bounds.bottom;

      if (!inside) {
        setActivePlan(null);
        return;
      }

      const preview = clampPreviewPosition(clientX, clientY, bounds);
      pointerX.set(preview.x);
      pointerY.set(preview.y);
      setActivePlan(plan);
    },
    [pointerX, pointerY],
  );

  const handlePointerHover = useCallback(
    (plan: TrainingPlan, clientX: number, clientY: number) => {
      if (isMobileLayout) return;
      showDesktopPreview(plan, clientX, clientY);
    },
    [isMobileLayout, showDesktopPreview],
  );

  const handleMobileSelect = useCallback((plan: TrainingPlan) => {
    setActivePlan((current) => (current?.number === plan.number ? null : plan));
  }, []);

  useEffect(() => {
    if (isMobileLayout) return;

    const section = sectionRef.current;
    if (!section) return;

    const onSectionLeave = () => setActivePlan(null);
    section.addEventListener('mouseleave', onSectionLeave);
    return () => section.removeEventListener('mouseleave', onSectionLeave);
  }, [isMobileLayout]);

  return (
    <section
      ref={sectionRef}
      id="entrenamientos"
      className="entrenamientos-section relative z-[10] scroll-mt-8"
      aria-labelledby="entrenamientos-heading"
    >
      <div className="entrenamientos-section__inner">
        <FadeIn effect="inView" delay={0} y={40}>
          <h2 id="entrenamientos-heading" className="entrenamientos-section__heading">
            Entrenamientos
          </h2>
        </FadeIn>

        <div className="entrenamientos-list">
          {TRAINING_PLANS.map((plan, i) => (
            <FadeIn key={plan.number} effect="inView" delay={i * 0.08} y={24}>
              <div className="entrenamientos-list__item">
                <TrainingPlanRow
                  plan={plan}
                  isActive={activePlan?.number === plan.number}
                  isMobileLayout={isMobileLayout}
                  onPointerHover={handlePointerHover}
                  onMobileSelect={handleMobileSelect}
                />
                <AnimatePresence initial={false}>
                  {isMobileLayout && activePlan?.number === plan.number ? (
                    <TrainingPlanMobileVideo plan={plan} />
                  ) : null}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {!isMobileLayout ? (
        <div className="entrenamientos-hover-layer pointer-events-none absolute inset-0 z-20 overflow-hidden">
          <AnimatePresence>
            {activePlan ? (
              <motion.div
                key={activePlan.number}
                className="entrenamientos-hover-preview absolute overflow-hidden rounded-xl shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
                style={{
                  width: DESKTOP_PREVIEW.width,
                  height: DESKTOP_PREVIEW.height,
                  x: previewX,
                  y: previewY,
                }}
                initial={{ opacity: 0, scale: 0.86, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 2 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden
              >
                <TrainingPlanPreviewVideo />
                <div className="entrenamientos-hover-preview__overlay" />
                <p className="entrenamientos-hover-preview__caption">{activePlan.name}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}
    </section>
  );
}
