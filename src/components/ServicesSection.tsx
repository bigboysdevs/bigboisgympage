import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import FadeIn from './FadeIn';
import TrainingPlanRow from './TrainingPlanRow';
import { TRAINING_PLANS, type TrainingPlan } from '@/models/trainingPlans';
import { GYM_GALLERY } from '@/models/gymGallery';

const FALLBACK_IMAGE = GYM_GALLERY[0];

function getPreviewMetrics(bounds: DOMRect) {
  const isNarrow = bounds.width < 768;

  return {
    width: isNarrow ? Math.min(168, bounds.width * 0.42) : 240,
    height: isNarrow ? Math.min(210, bounds.height * 0.26) : 300,
    offsetX: isNarrow ? 18 : 32,
    offsetY: isNarrow ? -52 : -80,
    padding: 16,
  };
}

function clampPreviewPosition(clientX: number, clientY: number, bounds: DOMRect) {
  const metrics = getPreviewMetrics(bounds);
  const rawX = clientX - bounds.left + metrics.offsetX;
  const rawY = clientY - bounds.top + metrics.offsetY;
  const minX = metrics.padding;
  const minY = metrics.padding;
  const maxX = bounds.width - metrics.width - metrics.padding;
  const maxY = bounds.height - metrics.height - metrics.padding;

  return {
    x: Math.min(Math.max(rawX, minX), Math.max(minX, maxX)),
    y: Math.min(Math.max(rawY, minY), Math.max(minY, maxY)),
    width: metrics.width,
    height: metrics.height,
  };
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const touchActiveRef = useRef(false);
  const [hoveredPlan, setHoveredPlan] = useState<TrainingPlan | null>(null);
  const [imageSize, setImageSize] = useState({ width: 240, height: 300 });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const imageX = useSpring(pointerX, { stiffness: 280, damping: 28, mass: 0.45 });
  const imageY = useSpring(pointerY, { stiffness: 280, damping: 28, mass: 0.45 });

  const activatePlan = useCallback(
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
        setHoveredPlan(null);
        return;
      }

      const preview = clampPreviewPosition(clientX, clientY, bounds);
      setHoveredPlan(plan);
      setImageSize({ width: preview.width, height: preview.height });
      pointerX.set(preview.x);
      pointerY.set(preview.y);
    },
    [pointerX, pointerY],
  );

  const handlePointerHover = useCallback(
    (plan: TrainingPlan, clientX: number, clientY: number) => {
      if (touchActiveRef.current) return;
      activatePlan(plan, clientX, clientY);
    },
    [activatePlan],
  );

  const handlePointerDown = useCallback(
    (plan: TrainingPlan, clientX: number, clientY: number) => {
      touchActiveRef.current = true;
      activatePlan(plan, clientX, clientY);
    },
    [activatePlan],
  );

  const handlePointerDrag = useCallback(
    (plan: TrainingPlan, clientX: number, clientY: number) => {
      if (!touchActiveRef.current) return;
      activatePlan(plan, clientX, clientY);
    },
    [activatePlan],
  );

  const handlePointerRelease = useCallback(() => {
    touchActiveRef.current = false;
    setHoveredPlan(null);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onSectionLeave = () => {
      if (touchActiveRef.current) return;
      setHoveredPlan(null);
    };

    section.addEventListener('mouseleave', onSectionLeave);
    return () => section.removeEventListener('mouseleave', onSectionLeave);
  }, []);

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
              <TrainingPlanRow
                plan={plan}
                isActive={hoveredPlan?.number === plan.number}
                onPointerHover={handlePointerHover}
                onPointerDown={handlePointerDown}
                onPointerDrag={handlePointerDrag}
                onPointerRelease={handlePointerRelease}
              />
            </FadeIn>
          ))}
        </div>
      </div>

      <div className="entrenamientos-hover-layer pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <AnimatePresence>
          {hoveredPlan ? (
            <motion.div
              key={hoveredPlan.number}
              className="entrenamientos-hover-image absolute overflow-hidden rounded-xl shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
              style={{
                width: imageSize.width,
                height: imageSize.height,
                x: imageX,
                y: imageY,
              }}
              initial={{ opacity: 0, scale: 0.86, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 2 }}
              exit={{ opacity: 0, scale: 0.9, rotate: 6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden
            >
              <img
                src={hoveredPlan.image || FALLBACK_IMAGE}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <div className="entrenamientos-hover-image__overlay" />
              <p className="entrenamientos-hover-image__caption">{hoveredPlan.name}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
