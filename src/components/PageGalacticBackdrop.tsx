import { useLocation } from 'react-router-dom';
import GalacticWarpBackground from './GalacticWarpBackground';
import { useLogo3dPerformanceMode } from '../hooks/useLogo3dPerformanceMode';

/** Un solo warp galáctico para toda la home (debajo del rayo y del contenido). */
export default function PageGalacticBackdrop() {
  const { pathname } = useLocation();
  const mode = useLogo3dPerformanceMode();

  if (pathname !== '/') return null;

  return (
    <div className="page-galactic-backdrop" aria-hidden>
      <GalacticWarpBackground lite={mode === 'lite'} />
    </div>
  );
}
