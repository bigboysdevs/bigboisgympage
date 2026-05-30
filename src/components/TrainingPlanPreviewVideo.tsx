import { useEffect, useRef } from 'react';
import type { TrainingPlan } from '@/models/trainingPlans';

const FALLBACK_VIDEO = '/videos/hero.mp4';

type TrainingPlanPreviewVideoProps = {
  plan: TrainingPlan;
};

export default function TrainingPlanPreviewVideo({ plan }: TrainingPlanPreviewVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {});
    }

    return () => {
      video.pause();
    };
  }, [plan.number]);

  return (
    <video
      ref={videoRef}
      key={plan.number}
      src={plan.video || FALLBACK_VIDEO}
      poster={plan.image}
      className="h-full w-full object-cover"
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      aria-hidden
    />
  );
}
