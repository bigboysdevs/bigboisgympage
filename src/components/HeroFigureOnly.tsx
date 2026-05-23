import { lazy, Suspense } from 'react';
import {
  HERO_FIGURE_FALLBACK_PNG,
  HERO_GLTF_URL,
} from '../models/branding';
import { useHeroFigureInteraction } from '../hooks/useHeroFigureInteraction';
import { useLogo3dPerformanceMode } from '../hooks/useLogo3dPerformanceMode';
import GalacticWarpBackground from './GalacticWarpBackground';
import { HERO_FIGURE_RAISE, HERO_FIGURE_SCREEN_OFFSET } from './HeroLogo3D';

const HeroLogo3D = lazy(() => import('./HeroLogo3D'));

const FIGURE_ROOT_CLASS = 'relative h-full w-full overflow-visible';

/** Desktop: alturas originales. Móvil: sin marco, ocupa todo el hero. */
const FIGURE_CANVAS_SLOT_CLASS =
  'relative h-full min-h-[clamp(560px,78vh,920px)] w-full overflow-visible max-md:min-h-0 max-md:max-h-none max-md:h-full md:min-h-[clamp(640px,90vh,1000px)] lg:min-h-[clamp(680px,94vh,1040px)]';

/** Desktop: ventana original. Móvil: capa responsive (.hero-figure-viewport en CSS). */
const FIGURE_VIEWPORT_CLASS =
  'hero-figure-viewport relative z-10 h-[clamp(480px,70vh,860px)] w-full max-md:absolute max-md:inset-0 max-md:h-full max-md:min-h-0 max-md:max-h-none max-md:translate-x-0 max-md:overflow-visible overflow-visible -mt-24 pt-24 translate-y-24 md:h-[clamp(560px,84vh,940px)] md:-mt-28 md:pt-28 md:translate-y-28 lg:h-[clamp(600px,88vh,980px)] lg:-mt-32 lg:pt-32 lg:translate-y-32';

/** Solo desplaza la figura dentro de la ventana (PNG). Resta HERO_FIGURE_RAISE para subir. */
const FIGURE_CONTENT_OFFSET_CLASS =
  `max-md:translate-x-0 max-md:translate-y-0 md:translate-y-[calc(8rem-${HERO_FIGURE_RAISE})] md:object-right lg:translate-y-[calc(9rem-${HERO_FIGURE_RAISE})]`;

function FigureBackdrop({ lite }: { lite?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-visible" aria-hidden>
      <GalacticWarpBackground lite={lite} />
    </div>
  );
}

function TinyLoader() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      aria-busy="true"
      aria-label="Cargando modelo"
    >
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-red-600/80 motion-reduce:animate-none"
        aria-hidden
      />
    </div>
  );
}

interface HeroFigureOnlyProps {
  modelUrl?: string;
  withBackdrop?: boolean;
}

export default function HeroFigureOnly({
  modelUrl = HERO_GLTF_URL,
  withBackdrop = true,
}: HeroFigureOnlyProps) {
  const mode = useLogo3dPerformanceMode();
  const canRotateFigure = useHeroFigureInteraction();

  if (mode === 'deciding') {
    return (
      <div
        className={`${FIGURE_ROOT_CLASS} ${FIGURE_CANVAS_SLOT_CLASS} pointer-events-none`}
        aria-hidden
      />
    );
  }

  if (mode === 'static') {
    return (
      <div className={`${FIGURE_ROOT_CLASS} pointer-events-none`}>
        <div className={FIGURE_CANVAS_SLOT_CLASS}>
          {withBackdrop ? <FigureBackdrop lite /> : null}
          <div className={FIGURE_VIEWPORT_CLASS}>
            <img
              src={HERO_FIGURE_FALLBACK_PNG}
              alt="Big Boys Gym"
              className={`hero-figure-fallback absolute inset-0 object-contain object-center animate-figure-float md:scale-[1.22] lg:scale-[1.28] ${FIGURE_CONTENT_OFFSET_CLASS}`}
              draggable={false}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={FIGURE_ROOT_CLASS}>
      <div
        className={`${FIGURE_CANVAS_SLOT_CLASS} ${
          canRotateFigure ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {withBackdrop ? <FigureBackdrop lite={mode === 'lite'} /> : null}
        <Suspense fallback={<TinyLoader />}>
          <div className={FIGURE_VIEWPORT_CLASS}>
            <HeroLogo3D
              modelUrl={modelUrl}
              performanceMode={mode === 'lite'}
              figureScreenOffset={HERO_FIGURE_SCREEN_OFFSET}
              enableRotate={canRotateFigure}
            />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
