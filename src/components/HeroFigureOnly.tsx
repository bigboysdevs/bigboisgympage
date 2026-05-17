import { lazy, Suspense } from 'react';
import {
  HERO_FIGURE_FALLBACK_PNG,
  HERO_GLTF_URL,
} from '../models/branding';
import { useLogo3dPerformanceMode } from '../hooks/useLogo3dPerformanceMode';
import GalacticWarpBackground from './GalacticWarpBackground';
import { HERO_FIGURE_RAISE, HERO_FIGURE_SCREEN_OFFSET } from './HeroLogo3D';

const HeroLogo3D = lazy(() => import('./HeroLogo3D'));

const FIGURE_ROOT_CLASS = 'relative h-full w-full overflow-visible';

/** Altura explícita: el Canvas 3D necesita px reales (inherit falla en el grid). */
/** Contenedor exterior: solo altura mínima; sin padding que empuje la figura. */
const FIGURE_CANVAS_SLOT_CLASS =
  'relative h-full min-h-[clamp(520px,72vh,860px)] w-full overflow-visible md:min-h-[clamp(600px,86vh,960px)] lg:min-h-[clamp(640px,90vh,1000px)]';

/** Ventana de recorte (canvas): posición fija; no añadir offset de figura aquí. */
const FIGURE_VIEWPORT_CLASS =
  'relative z-10 h-[clamp(440px,62vh,780px)] w-full overflow-visible -mt-24 pt-24 translate-y-24 md:h-[clamp(520px,78vh,880px)] md:-mt-28 md:pt-28 md:translate-y-28 lg:h-[clamp(560px,82vh,920px)] lg:-mt-32 lg:pt-32 lg:translate-y-32';

/** Solo desplaza la figura dentro de la ventana (PNG). Resta HERO_FIGURE_RAISE para subir. */
const FIGURE_CONTENT_OFFSET_CLASS =
  `translate-y-[calc(7rem-${HERO_FIGURE_RAISE})] md:translate-y-[calc(8rem-${HERO_FIGURE_RAISE})] lg:translate-y-[calc(9rem-${HERO_FIGURE_RAISE})]`;

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
              className={`absolute inset-0 scale-[1.22] object-contain object-center ${FIGURE_CONTENT_OFFSET_CLASS} md:scale-[1.28] md:object-right animate-figure-float`}
              draggable={false}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={FIGURE_ROOT_CLASS}>
      <div className={`${FIGURE_CANVAS_SLOT_CLASS} pointer-events-auto`}>
        {withBackdrop ? <FigureBackdrop lite={mode === 'lite'} /> : null}
        <Suspense fallback={<TinyLoader />}>
          <div className={`${FIGURE_VIEWPORT_CLASS} touch-none pointer-events-auto`}>
            <HeroLogo3D
              modelUrl={modelUrl}
              performanceMode={mode === 'lite'}
              figureScreenOffset={HERO_FIGURE_SCREEN_OFFSET}
            />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
