import { useState } from 'react';

interface PlanImageProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Muestra foto del plan en `public/programs/` o galería temporal si aún no existe. */
export default function PlanImage({ src, fallbackSrc, alt, className, style }: PlanImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
    />
  );
}
