import { useState } from 'react';
import { GALLERY_IMG_SIZES, galleryImageSrcSet } from '@/utils/responsiveImages';

interface PlanImageProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

function responsiveSrcSet(path: string): string | undefined {
  if (!path.includes('/gallery/')) return undefined;
  return galleryImageSrcSet(path);
}

/** Muestra foto del plan en `public/programs/` o galería temporal si aún no existe. */
export default function PlanImage({ src, fallbackSrc, alt, className, style }: PlanImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const srcSet = responsiveSrcSet(currentSrc) ?? responsiveSrcSet(fallbackSrc);

  return (
    <img
      src={currentSrc}
      srcSet={srcSet}
      sizes={srcSet ? GALLERY_IMG_SIZES : undefined}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
    />
  );
}
