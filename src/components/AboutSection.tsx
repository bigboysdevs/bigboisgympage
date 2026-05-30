import FadeIn from './FadeIn';
import { ImageCursorTrail } from '@/components/v1/skiper18';
import { GYM_GALLERY } from '@/models/gymGallery';
import yearStatImage from '../assets/WhatsApp Image 2026-05-29 at 9.07.12 PM.jpeg';

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
        className="flex min-h-screen w-full flex-col justify-center px-5 py-20 sm:px-8 md:px-10"
      >
        <div className="relative ml-auto mr-[clamp(1.5rem,8vw,9rem)] flex w-full max-w-5xl flex-col items-center gap-6 sm:gap-8 md:gap-10">
          <FadeIn delay={0} y={28}>
            <h2
              id="filosofia-stat-label"
              className="filosofia-stat-label text-center font-black uppercase leading-none tracking-[0.12em] text-[#D7E2EA]"
              style={{ fontSize: 'clamp(1.35rem, 4.5vw, 3.25rem)' }}
            >
              Desde
            </h2>
          </FadeIn>

          <FadeIn delay={0.1} y={48}>
            <p
              className="filosofia-stat-year text-center font-black uppercase leading-[0.85] tracking-tighter"
              style={{
                fontSize: 'clamp(5.5rem, 26vw, 20rem)',
                backgroundImage: `url(${yearStatImage})`,
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
