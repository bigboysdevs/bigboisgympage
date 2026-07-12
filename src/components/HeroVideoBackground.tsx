import { useEffect, useMemo, useRef } from 'react';
import { HERO_VIDEO_POSTER, HERO_VIDEO_URL } from '@/models/heroVideo';

export default function HeroVideoBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
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

  // En móvil: pausar el video al salir del viewport (libera GPU durante el scroll).
  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video || reducedMotion) return;

    const isMobile =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(max-width: 767px)').matches;
    if (!isMobile) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      className="hero-video-bg pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <video
        ref={videoRef}
        className="hero-video-bg__media h-full w-full object-cover"
        src={HERO_VIDEO_URL}
        poster={HERO_VIDEO_POSTER}
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
        tabIndex={-1}
      />
      <div className="hero-video-bg__scrim absolute inset-0" />
    </div>
  );
}
