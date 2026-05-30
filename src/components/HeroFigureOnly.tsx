import { lazy, Suspense } from 'react';
import {
  HERO_FIGURE_FALLBACK_PNG,
  HERO_GLTF_URL,
} from '../models/branding';
import { useHeroFigureInteraction } from '../hooks/useHeroFigureInteraction';
import { useLogo3dPerformanceMode } from '../hooks/useLogo3dPerformanceMode';
import {
  HERO_FIGURE_SCREEN_OFFSET,
  HERO_VIDEO_FIGURE_SCREEN_OFFSET,
} from '@/models/heroLogo3dLayout';

const HeroLogo3D = lazy(() => import('./HeroLogo3D'));

type HeroFigureVariant = 'classic' | 'video';

const CLASSIC_ROOT = 'relative h-full w-full overflow-visible';
const CLASSIC_SLOT =
  'relative h-full min-h-[clamp(560px,78vh,920px)] w-full overflow-visible max-md:min-h-0 max-md:max-h-none max-md:h-full md:min-h-[clamp(640px,90vh,1000px)] lg:min-h-[clamp(680px,94vh,1040px)]';
const CLASSIC_VIEWPORT =
  'hero-figure-viewport relative z-10 h-[clamp(480px,70vh,860px)] w-full max-md:absolute max-md:inset-0 max-md:h-full max-md:min-h-0 max-md:max-h-none max-md:translate-x-0 max-md:overflow-visible overflow-visible -mt-24 pt-24 translate-y-24 md:h-[clamp(560px,84vh,940px)] md:-mt-28 md:pt-28 md:translate-y-28 lg:h-[clamp(600px,88vh,980px)] lg:-mt-32 lg:pt-32 lg:translate-y-32';

interface HeroFigureOnlyProps {
  modelUrl?: string;
  variant?: HeroFigureVariant;
}

function TinyLoader() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      aria-busy="true"
      aria-label="Cargando modelo"
    >
      <div
        className="h-7 w-7 animate-spin rounded-full border-2 border-white/15 border-t-red-600/80 motion-reduce:animate-none sm:h-8 sm:w-8"
        aria-hidden
      />
    </div>
  );
}

export default function HeroFigureOnly({
  modelUrl = HERO_GLTF_URL,
  variant = 'classic',
}: HeroFigureOnlyProps) {
  const mode = useLogo3dPerformanceMode();
  const canRotateFigure = useHeroFigureInteraction();
  const isVideo = variant === 'video';

  const rootClass = isVideo ? 'hero-video-figure-root' : CLASSIC_ROOT;
  const slotClass = isVideo ? 'hero-video-figure-canvas' : CLASSIC_SLOT;
  const viewportClass = isVideo ? 'hero-video-figure-viewport' : CLASSIC_VIEWPORT;
  const screenOffset = isVideo ? HERO_VIDEO_FIGURE_SCREEN_OFFSET : HERO_FIGURE_SCREEN_OFFSET;

  if (mode === 'deciding') {
    return (
      <div className={`${rootClass} ${slotClass} pointer-events-none`} aria-hidden />
    );
  }

  if (mode === 'static') {
    return (
      <div className={`${rootClass} pointer-events-none`}>
        <div className={slotClass}>
          <div className={viewportClass}>
            <img
              src={HERO_FIGURE_FALLBACK_PNG}
              alt="Big Boys Gym"
              className={
                isVideo
                  ? 'hero-video-figure-fallback h-full w-full object-contain object-bottom animate-figure-float'
                  : 'hero-figure-fallback absolute inset-0 object-contain object-center animate-figure-float md:scale-[1.22] lg:scale-[1.28]'
              }
              draggable={false}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={rootClass}>
      <div
        className={`${slotClass} ${
          canRotateFigure ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <Suspense fallback={<TinyLoader />}>
          <div className={viewportClass}>
            <HeroLogo3D
              modelUrl={modelUrl}
              performanceMode={mode === 'lite'}
              figureScreenOffset={screenOffset}
              enableRotate={canRotateFigure}
              variant={isVideo ? 'video' : 'hero'}
            />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
