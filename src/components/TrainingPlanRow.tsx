import { Dumbbell } from 'lucide-react';
import type { TrainingPlan } from '@/models/trainingPlans';

type TrainingPlanRowProps = {
  plan: TrainingPlan;
  isActive: boolean;
  onPointerHover: (plan: TrainingPlan, clientX: number, clientY: number) => void;
  onPointerDown: (plan: TrainingPlan, clientX: number, clientY: number) => void;
  onPointerDrag: (plan: TrainingPlan, clientX: number, clientY: number) => void;
  onPointerRelease: () => void;
};

export default function TrainingPlanRow({
  plan,
  isActive,
  onPointerHover,
  onPointerDown,
  onPointerDrag,
  onPointerRelease,
}: TrainingPlanRowProps) {
  return (
    <article
      className={`entrenamientos-row group ${isActive ? 'entrenamientos-row--active' : ''}`}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') onPointerHover(plan, e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (e.pointerType === 'mouse') {
          onPointerHover(plan, e.clientX, e.clientY);
          return;
        }

        if (e.pointerType === 'touch') {
          onPointerDrag(plan, e.clientX, e.clientY);
        }
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== 'touch') return;
        e.currentTarget.setPointerCapture(e.pointerId);
        onPointerDown(plan, e.clientX, e.clientY);
      }}
      onPointerUp={(e) => {
        if (e.pointerType !== 'touch') return;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        onPointerRelease();
      }}
      onPointerCancel={(e) => {
        if (e.pointerType !== 'touch') return;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        onPointerRelease();
      }}
      aria-label={`${plan.name} — ${plan.price}`}
    >
      <span className="entrenamientos-row__tag">{plan.tag}</span>

      <h3 className="entrenamientos-row__title">
        {plan.displayName}
        <span className="entrenamientos-row__flag" aria-hidden>
          ⚡
        </span>
      </h3>

      <span className="entrenamientos-row__meta">{plan.meta}</span>

      <span className="entrenamientos-row__badge">
        <Dumbbell className="entrenamientos-row__badge-icon" strokeWidth={2.25} aria-hidden />
        {plan.badge}
      </span>

      <span className="entrenamientos-row__price">{plan.price}</span>
    </article>
  );
}
