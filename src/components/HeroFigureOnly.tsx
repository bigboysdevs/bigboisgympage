import { lazy, Suspense } from 'react';
import {
  HERO_FIGURE_FALLBACK_PNG,
  HERO_GLTF_URL,
} from '../models/branding';
import { useLogo3dPerformanceMode } from '../hooks/useLogo3dPerformanceMode';

const HeroLogo3D = lazy(() => import('./HeroLogo3D'));

/** Rellena el contenedor del hero (altura definida por el padre absoluto top→bottom). */
const FIGURE_SLOT_CLASS = 'relative h-full w-full min-h-0';

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

/**
 * Únicamente la figura 3D (o PNG si el perfil es estático): encaja donde antes iba el retrato del hero.
 * Sin ventana, sin panel negro, sin scanlines.
 */
export default function HeroFigureOnly({
  modelUrl = HERO_GLTF_URL,
}: HeroFigureOnlyProps) {
  const mode = useLogo3dPerformanceMode();

  if (mode === 'deciding') {
    return <div className={FIGURE_SLOT_CLASS} aria-hidden />;
  }

  if (mode === 'static') {
    return (
      <div className={FIGURE_SLOT_CLASS}>
        <img
          src={HERO_FIGURE_FALLBACK_PNG}
          alt="Big Boys Gym"
          className="h-full w-full object-contain object-center"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className={`${FIGURE_SLOT_CLASS} isolate`}>
      <Suspense fallback={<TinyLoader />}>
        <HeroLogo3D modelUrl={modelUrl} performanceMode={mode === 'lite'} />
      </Suspense>
    </div>
  );
}
