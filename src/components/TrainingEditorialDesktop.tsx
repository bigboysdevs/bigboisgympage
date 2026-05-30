import FadeIn from './FadeIn';
import TrainingEditorialPlanHeader from './TrainingEditorialPlanHeader';
import TrainingEditorialVideoStrip from './TrainingEditorialVideoStrip';
import { getDesktopEditorialRows } from '@/models/trainingEditorialLayout';

export default function TrainingEditorialDesktop() {
  const rows = getDesktopEditorialRows();

  return (
    <div className="entrenamientos-editorial entrenamientos-editorial--desktop">
      {rows.map((row, rowIndex) => (
        <FadeIn key={row.meta?.number ?? rowIndex} effect="inView" delay={rowIndex * 0.07} y={24}>
          <div className={`entrenamientos-editorial__row entrenamientos-editorial__row--${rowIndex}`}>
            {row.cells.map((cell, cellIndex) => {
              if (cell.kind === 'text') {
                const plan = row.meta;
                const textOnRight = rowIndex === 1 || rowIndex === 3;

                if (plan) {
                  return (
                    <TrainingEditorialPlanHeader
                      key={`${rowIndex}-${cellIndex}`}
                      words={cell.words}
                      plan={plan}
                      split={cell.split}
                      textClassName="entrenamientos-editorial__line--desktop"
                      align={textOnRight ? 'end' : 'start'}
                    />
                  );
                }

                return null;
              }

              return (
                <div
                  key={`${rowIndex}-${cellIndex}`}
                  className="entrenamientos-editorial__strip-wrap"
                  style={{ flex: cell.flex }}
                >
                  <TrainingEditorialVideoStrip className="entrenamientos-editorial__strip--desktop" />
                </div>
              );
            })}
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
