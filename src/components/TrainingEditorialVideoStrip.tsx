import { useEffect, useRef } from 'react';
import { TRAINING_PREVIEW_VIDEO } from '@/models/trainingPlans';

type TrainingEditorialVideoStripProps = {
  className?: string;
};

export default function TrainingEditorialVideoStrip({
  className = '',
}: TrainingEditorialVideoStripProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {});
    }

    return () => {
      video.pause();
    };
  }, []);

  return (
    <div className={`entrenamientos-editorial__strip ${className}`.trim()} aria-hidden>
      <video
        ref={videoRef}
        src={TRAINING_PREVIEW_VIDEO}
        className="entrenamientos-editorial__strip-video"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
      />
    </div>
  );
}
