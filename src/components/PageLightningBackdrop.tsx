import { useRef } from 'react';
import { HERO_LIGHTNING_IMAGE } from '@/models/branding';
import { usePageLightningMask } from '@/hooks/usePageLightningMask';

/** Un rayo: mitad izquierda, altura de toda la página (hero → legal), detrás del contenido. */
export default function PageLightningBackdrop() {
  const backdropRef = useRef<HTMLDivElement>(null);
  const maskImage = usePageLightningMask(backdropRef);

  return (
    <div
      ref={backdropRef}
      className="page-lightning-bg"
      aria-hidden
      style={{
        WebkitMaskImage: maskImage,
        maskImage,
      }}
    >
      <div
        className="page-lightning-bg__img"
        style={{
          WebkitMaskImage: `url(${HERO_LIGHTNING_IMAGE})`,
          maskImage: `url(${HERO_LIGHTNING_IMAGE})`,
        }}
      />
    </div>
  );
}
