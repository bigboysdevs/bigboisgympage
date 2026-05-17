import FadeIn from './FadeIn';
import HeroFigureOnly from './HeroFigureOnly';

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen flex-col overflow-x-clip overflow-y-visible scroll-mt-8 pt-[4.75rem] md:pt-[5.25rem]"
    >
      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-5 sm:px-8 md:px-10 overflow-visible">
        <FadeIn delay={0.15} y={40} className="relative z-20 mt-2 bg-transparent sm:mt-2 md:mt-0">
          <h1
            className="hero-heading bg-transparent font-black uppercase leading-none tracking-tight w-full text-center sm:text-left text-[11vw] sm:text-[13vw] md:text-[14vw] lg:text-[15vw] whitespace-normal sm:whitespace-nowrap max-w-[100%]"
          >
            Big Boys GYM
          </h1>
        </FadeIn>

        <div className="relative z-[5] -mx-5 mt-0 w-[calc(100%+2.5rem)] overflow-visible sm:-mx-8 sm:w-[calc(100%+4rem)] md:-mx-10 md:w-[calc(100%+5rem)]">
          <HeroFigureOnly />
        </div>

        <div className="relative z-10 -mt-6 pb-7 pt-2 sm:-mt-8 sm:pb-8 md:pb-10">
          <FadeIn delay={0.35} y={20}>
            <p
              className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[200px] sm:max-w-[280px] md:max-w-[320px]"
              style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
            >
              Big Boys Gym — hierro, constancia y comunidad. Sin atajos.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
