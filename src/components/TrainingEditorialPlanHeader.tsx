import TrainingEditorialMeta from './TrainingEditorialMeta';
import TrainingEditorialText from './TrainingEditorialText';
import type { EditorialWords } from '@/models/trainingEditorialLayout';
import type { TrainingPlan } from '@/models/trainingPlans';

type TrainingEditorialPlanHeaderProps = {
  words: EditorialWords;
  plan: TrainingPlan;
  split?: 'both' | 'sans' | 'serif';
  textClassName?: string;
  align?: 'start' | 'center' | 'end';
};

export default function TrainingEditorialPlanHeader({
  words,
  plan,
  split = 'both',
  textClassName = '',
  align = 'start',
}: TrainingEditorialPlanHeaderProps) {
  return (
    <div className={`entrenamientos-editorial__plan entrenamientos-editorial__plan--${align}`.trim()}>
      <TrainingEditorialText words={words} split={split} className={textClassName} />
      <TrainingEditorialMeta plan={plan} className="entrenamientos-editorial__meta--inline" />
    </div>
  );
}
