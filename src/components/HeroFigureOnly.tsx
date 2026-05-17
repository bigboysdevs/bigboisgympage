import { lazy, Suspense } from 'react';
import {
  HERO_FIGURE_FALLBACK_PNG,
  HERO_GLTF_URL,
} from '../models/branding';
import { useLogo3dPerformanceMode } from '../hooks/useLogo3dPerformanceMode';
import GalacticWarpBackground from './GalacticWarpBackground';

const HeroLogo3D = lazy(() => import('./HeroLogo3D'));

const FIGURE_ROOT_CLASS =
  'relative isolate w-full overflow-visible pointer-events-none';

const FIGURE_CANVAS_SLOT_CLASS =
  'relative w-full h-[clamp(520px,88vh,1100px)] overflow-visible';

/** Galaxia solo en la zona baja para no tapar el titulo de fondo. */
function FigureBackdrop({ lite }: { lite?: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 top-[22%] z-0 overflow-hidden sm:top-[20%] md:top-[18%]"
      aria-hidden
    >
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
        className="h-9 w-9 rounded-full border-2 border-white/15 border-t-red-600/80 animate-spin motion-reduce:animate-none"
        aria-hidden
      />
    </div>
  );
}

interface HeroFigureOnlyProps {
  modelUrl?: string;
}

export default function HeroFigureOnly({
  modelUrl = HERO_GLTF_URL,
}: HeroFigureOnlyProps) {
  const mode = useLogo3dPerformanceMode();

  if (mode === 'deciding') {
    return <div className={FIGURE_ROOT_CLASS} aria-hidden />;
  }

  if (mode === 'static') {
    return (
      <div className={FIGURE_ROOT_CLASS}>
        <div className={FIGURE_CANVAS_SLOT_CLASS}>
          <FigureBackdrop lite />
          <img
            src={HERO_FIGURE_FALLBACK_PNG}
            alt="Big Boys Gym"
            className="relative z-10 h-full w-full scale-110 object-contain object-center animate-figure-float"
            draggable={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={FIGURE_ROOT_CLASS}>
      <div className={`${FIGURE_CANVAS_SLOT_CLASS} pointer-events-auto`}>
        <FigureBackdrop lite={mode === 'lite'} />
        <Suspense fallback={<TinyLoader />}>
          <div className="relative z-10 h-full w-full">
            <HeroLogo3D modelUrl={modelUrl} performanceMode={mode === 'lite'} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
