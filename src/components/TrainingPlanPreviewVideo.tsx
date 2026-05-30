import { useEffect, useRef } from 'react';
import { TRAINING_PREVIEW_VIDEO } from '@/models/trainingPlans';

export default function TrainingPlanPreviewVideo() {
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
  }, []);

  return (
    <video
      ref={videoRef}
      src={TRAINING_PREVIEW_VIDEO}
      className="h-full w-full object-cover"
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden
    />
  );
}
