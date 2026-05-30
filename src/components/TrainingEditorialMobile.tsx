import FadeIn from './FadeIn';
import TrainingEditorialPlanHeader from './TrainingEditorialPlanHeader';
import TrainingEditorialVideoStrip from './TrainingEditorialVideoStrip';
import { getMobileEditorialBlocks } from '@/models/trainingEditorialLayout';

export default function TrainingEditorialMobile() {
  const blocks = getMobileEditorialBlocks();

  return (
    <div className="entrenamientos-editorial entrenamientos-editorial--mobile">
      {blocks.map((block, index) => {
        if (block.type === 'text') {
          return (
            <FadeIn key={`text-${block.plan.number}`} effect="inView" delay={index * 0.04} y={18}>
              <TrainingEditorialPlanHeader
                words={block.words}
                plan={block.plan}
                align="center"
              />
            </FadeIn>
          );
        }

        return (
          <FadeIn key={`video-${index}`} effect="inView" delay={index * 0.04} y={12}>
            <TrainingEditorialVideoStrip />
          </FadeIn>
        );
      })}
    </div>
  );
}
