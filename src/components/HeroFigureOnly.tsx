import { lazy, Suspense } from 'react';
import {
  HERO_FIGURE_FALLBACK_PNG,
  HERO_GLTF_URL,
} from '../models/branding';
import { useLogo3dPerformanceMode } from '../hooks/useLogo3dPerformanceMode';

const HeroLogo3D = lazy(() => import('./HeroLogo3D'));

/** Sin “ventana”: altura fluida, desborda arriba/abajo si hace falta. */
const FIGURE_ROOT_CLASS =
  'relative isolate w-full overflow-visible pointer-events-none';

const FIGURE_CANVAS_SLOT_CLASS =
  'relative w-full h-[clamp(520px,88vh,1100px)] overflow-visible';

function TinyLoader() {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
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
          <img
            src={HERO_FIGURE_FALLBACK_PNG}
            alt="Big Boys Gym"
            className="h-full w-full object-contain object-center scale-110"
            draggable={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={FIGURE_ROOT_CLASS}>
      <div className={`${FIGURE_CANVAS_SLOT_CLASS} pointer-events-auto`}>
        <Suspense fallback={<TinyLoader />}>
          <HeroLogo3D modelUrl={modelUrl} performanceMode={mode === 'lite'} />
        </Suspense>
      </div>
    </div>
  );
}
