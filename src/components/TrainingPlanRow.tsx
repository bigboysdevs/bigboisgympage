import { Dumbbell } from 'lucide-react';
import type { TrainingPlan } from '@/models/trainingPlans';

type TrainingPlanRowProps = {
  plan: TrainingPlan;
  isActive: boolean;
  isMobileLayout: boolean;
  onPointerHover: (plan: TrainingPlan, clientX: number, clientY: number) => void;
  onMobileSelect: (plan: TrainingPlan) => void;
};

export default function TrainingPlanRow({
  plan,
  isActive,
  isMobileLayout,
  onPointerHover,
  onMobileSelect,
}: TrainingPlanRowProps) {
  return (
    <article
      className={`entrenamientos-row group ${isActive ? 'entrenamientos-row--active' : ''} ${isMobileLayout ? 'entrenamientos-row--mobile' : ''}`}
      onMouseEnter={(e) => onPointerHover(plan, e.clientX, e.clientY)}
      onMouseMove={(e) => onPointerHover(plan, e.clientX, e.clientY)}
      onClick={() => {
        if (isMobileLayout) onMobileSelect(plan);
      }}
      role={isMobileLayout ? 'button' : undefined}
      tabIndex={isMobileLayout ? 0 : undefined}
      aria-pressed={isMobileLayout ? isActive : undefined}
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
