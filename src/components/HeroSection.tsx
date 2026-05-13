import ContactButton from './ContactButton';
import FadeIn from './FadeIn';
import HeroFigureOnly from './HeroFigureOnly';

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen flex-col overflow-x-clip scroll-mt-8 pt-[4.75rem] md:pt-[5.25rem]"
    >
      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-5 sm:px-8 md:px-10">
        <FadeIn delay={0.15} y={40} className="mt-2 sm:mt-2 md:mt-0 overflow-hidden">
          <h1
            className="hero-heading font-black uppercase leading-none tracking-tight w-full text-center sm:text-left text-[11vw] sm:text-[13vw] md:text-[14vw] lg:text-[15vw] whitespace-normal sm:whitespace-nowrap max-w-[100%]"
          >
            Big Boys GYM
          </h1>
        </FadeIn>

        {/* Figura en flujo normal: sube y baja con el scroll de la página */}
        <div className="relative z-[5] mt-6 w-full flex-1 min-h-0">
          <FadeIn delay={0.6} y={30} className="block h-full w-full min-h-0">
            <HeroFigureOnly />
          </FadeIn>
        </div>

        <div className="relative z-10 mt-auto flex justify-between items-end gap-4 pb-7 pt-6 sm:pb-8 md:pb-10">
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
    </section>
  );
}
