import FadeIn from './FadeIn';
import HeroVideoBackground from './HeroVideoBackground';
import { HERO_LIGHTNING_IMAGE } from '@/models/branding';

const TITLE_LINES = ['Big', 'Boys', 'Gym'] as const;

const TITLE_CLASS =
  'hero-facade-title hero-video-hero__title text-[clamp(1.85rem,6.5vw,3.75rem)] sm:text-[clamp(2rem,6vw,4rem)]';

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="hero-video-hero relative z-[20] min-h-[100svh] w-full overflow-hidden scroll-mt-8"
    >
      <HeroVideoBackground />

      <div className="hero-video-hero__foreground pointer-events-none absolute inset-x-0 bottom-0 z-[25] px-4 pb-[clamp(1.25rem,4.5vh,2.75rem)] sm:px-6 md:pb-[clamp(1.5rem,5vh,3rem)]">
        <div className="hero-video-brand-anchor pointer-events-none">
          <FadeIn
            effect="inView"
            delay={0.1}
            y={20}
            className="hero-video-brand-stack pointer-events-none relative"
          >
            <div className="hero-video-lockup relative z-[1] flex items-end justify-center">
              <h1 className="flex flex-col items-start text-left leading-none">
                {TITLE_LINES.map((line) => (
                  <span key={line} className={TITLE_CLASS}>
                    {line}
                  </span>
                ))}
              </h1>

              <div className="hero-video-bolt pointer-events-none shrink-0" aria-hidden>
                <div
                  className="hero-video-bolt__img h-full w-full"
                  style={{
                    WebkitMaskImage: `url(${HERO_LIGHTNING_IMAGE})`,
                    maskImage: `url(${HERO_LIGHTNING_IMAGE})`,
                  }}
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
