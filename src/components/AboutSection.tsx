import FadeIn from './FadeIn';
import { ImageCursorTrail } from '@/components/v1/skiper18';
import { FILOSOFIA_YEAR_STAT_IMAGE, GYM_GALLERY } from '@/models/gymGallery';

export default function AboutSection() {
  return (
    <section
      id="filosofia"
      className="relative z-[10] scroll-mt-8 overflow-hidden bg-transparent"
      aria-labelledby="filosofia-stat-label"
    >
      <ImageCursorTrail
        items={GYM_GALLERY}
        maxNumberOfImages={8}
        distance={20}
        imgClass="h-24 w-24 sm:h-32 sm:w-32"
        className="filosofia-section flex w-full flex-col justify-center px-5 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14"
      >
        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-3 sm:gap-4">
          <FadeIn delay={0} y={16}>
            <h2
              id="filosofia-stat-label"
              className="filosofia-stat-label text-center font-black uppercase leading-none tracking-[0.12em] text-white"
              style={{ fontSize: 'clamp(1.75rem, 5.5vw, 4.25rem)' }}
            >
              Desde
            </h2>
          </FadeIn>

          <FadeIn delay={0.1} y={20}>
            <p
              className="filosofia-stat-year text-center font-black uppercase leading-[0.85] tracking-tighter"
              style={{
                fontSize: 'clamp(5rem, 24vw, 16rem)',
                backgroundImage: `url(${FILOSOFIA_YEAR_STAT_IMAGE})`,
              }}
              aria-hidden
            >
              1992
            </p>
          </FadeIn>

          <p className="sr-only">Big Boys Gym — desde 1992</p>
        </div>
      </ImageCursorTrail>
    </section>
  );
}
