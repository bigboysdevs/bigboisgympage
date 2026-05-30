import type { TrainingPlan } from '@/models/trainingPlans';

type TrainingEditorialMetaProps = {
  plan: TrainingPlan;
  className?: string;
};

export default function TrainingEditorialMeta({ plan, className = '' }: TrainingEditorialMetaProps) {
  return (
    <p className={`entrenamientos-editorial__meta ${className}`.trim()}>
      <span>{plan.displayName}</span>
      <span className="entrenamientos-editorial__meta-sep" aria-hidden>
        ·
      </span>
      <span>{plan.meta}</span>
      <span className="entrenamientos-editorial__meta-sep" aria-hidden>
        ·
      </span>
      <span>{plan.price}</span>
    </p>
  );
}
