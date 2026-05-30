import { useEffect, useMemo, useRef } from 'react';
import { HERO_VIDEO_POSTER, HERO_VIDEO_URL } from '@/models/heroVideo';

export default function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    const tryPlay = () => {
      void video.play().catch(() => {
        /* Autoplay bloqueado: el poster cubre el frame inicial. */
      });
    };

    tryPlay();
    video.addEventListener('loadeddata', tryPlay, { once: true });
    return () => video.removeEventListener('loadeddata', tryPlay);
  }, [reducedMotion]);

  return (
    <div className="hero-video-bg pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <video
        ref={videoRef}
        className="hero-video-bg__media h-full w-full object-cover"
        src={HERO_VIDEO_URL}
        poster={HERO_VIDEO_POSTER}
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload="auto"
        tabIndex={-1}
      />
      <div className="hero-video-bg__scrim absolute inset-0" />
    </div>
  );
}
