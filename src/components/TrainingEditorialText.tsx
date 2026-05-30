import type { EditorialWords } from '@/models/trainingEditorialLayout';

type TrainingEditorialTextProps = {
  words: EditorialWords;
  split?: 'both' | 'sans' | 'serif';
  className?: string;
};

export default function TrainingEditorialText({
  words,
  split = 'both',
  className = '',
}: TrainingEditorialTextProps) {
  const showSans = split === 'both' || split === 'sans';
  const showSerif = split === 'both' || split === 'serif';

  return (
    <div className={`entrenamientos-editorial__line ${className}`.trim()}>
      {showSans ? (
        <span className="entrenamientos-editorial__sans">{words.sans}</span>
      ) : null}
      {showSerif ? (
        <span className="entrenamientos-editorial__serif">{words.serif}</span>
      ) : null}
    </div>
  );
}
