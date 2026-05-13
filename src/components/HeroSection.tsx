import { useRef } from 'react';
import ContactButton from './ContactButton';
import FadeIn from './FadeIn';
import Magnet from './Magnet';

const HERO_IMAGE =
  'https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png';

export default function HeroSection() {
  const heroSectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="inicio"
      ref={heroSectionRef}
      className="min-h-screen flex flex-col overflow-y-visible relative scroll-mt-8 pt-[4.75rem] md:pt-[5.25rem]"
      style={{ overflowX: 'clip' }}
    >
      <div className="flex flex-col flex-1 px-5 sm:px-8 md:px-10 relative z-0">
        <FadeIn delay={0.15} y={40} className="mt-2 sm:mt-2 md:mt-0 overflow-hidden">
          <h1
            className="hero-heading font-black uppercase leading-none tracking-tight w-full text-center sm:text-left text-[11vw] sm:text-[13vw] md:text-[14vw] lg:text-[15vw] whitespace-normal sm:whitespace-nowrap max-w-[100%]"
          >
            Big Boys GYM
          </h1>
        </FadeIn>

        <div className="flex-1" />

        <div className="flex justify-between items-end gap-4 pb-7 sm:pb-8 md:pb-10">
          <FadeIn delay={0.35} y={20}>
            <p
              className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[200px] sm:max-w-[280px] md:max-w-[320px]"
              style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
            >
              Big Boys Gym — hierro, constancia y comunidad. Sin atajos.
            </p>
          </FadeIn>

          <FadeIn delay={0.5} y={20}>
            <ContactButton label="Únete" href="#entrenamientos" />
          </FadeIn>
        </div>
      </div>

      <Magnet
        interactionRootRef={heroSectionRef}
        padding={150}
        strength={3}
        activeTransition="transform 0.3s ease-out"
        inactiveTransition="transform 0.6s ease-in-out"
        className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0"
      >
        <FadeIn delay={0.6} y={30}>
          <img
            src={HERO_IMAGE}
            alt="Hero portrait"
            className="w-full h-auto object-contain"
          />
        </FadeIn>
      </Magnet>
    </section>
  );
}
