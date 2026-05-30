import { useEffect, useRef } from 'react';
import { TRAINING_PREVIEW_VIDEO } from '@/models/trainingPlans';

type TrainingEditorialVideoStripProps = {
  className?: string;
};

export default function TrainingEditorialVideoStrip({
  className = '',
}: TrainingEditorialVideoStripProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    const play = () => {
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {});
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.preload === 'none') {
            video.preload = 'metadata';
            video.load();
          }
          play();
        } else {
          video.pause();
        }
      },
      { rootMargin: '120px 0px', threshold: 0.12 },
    );

    observer.observe(root);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  return (
    <div ref={rootRef} className={`entrenamientos-editorial__strip ${className}`.trim()} aria-hidden>
      <video
        ref={videoRef}
        src={TRAINING_PREVIEW_VIDEO}
        className="entrenamientos-editorial__strip-video"
        muted
        loop
        playsInline
        preload="none"
      />
    </div>
  );
}
