import FadeIn from './FadeIn';
import HeroFigureOnly from './HeroFigureOnly';

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen flex-col overflow-x-clip overflow-y-visible scroll-mt-8 pt-[4.75rem] md:pt-[5.25rem]"
    >
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-visible px-5 sm:px-8 md:px-10">
        <div className="relative -mx-5 w-[calc(100%+2.5rem)] sm:-mx-8 sm:w-[calc(100%+4rem)] md:-mx-10 md:w-[calc(100%+5rem)]">
          <FadeIn
            effect="inView"
            delay={0.15}
            y={40}
            className="relative z-[1] mt-2 bg-transparent sm:mt-2 md:mt-0"
          >
            <h1 className="hero-heading pointer-events-none w-full max-w-[100%] whitespace-normal bg-transparent text-center font-black uppercase leading-none tracking-tight sm:text-left sm:whitespace-nowrap text-[11vw] sm:text-[13vw] md:text-[14vw] lg:text-[15vw]">
              Big Boys GYM
            </h1>
          </FadeIn>

          <div className="relative z-[10] -mt-[clamp(2.75rem,11vw,7rem)] sm:-mt-[clamp(3rem,10vw,6.5rem)] md:-mt-[6.5rem] lg:-mt-[7.5rem]">
            <HeroFigureOnly />
          </div>
        </div>

        <div className="relative z-20 -mt-6 pb-7 pt-2 sm:-mt-8 sm:pb-8 md:pb-10">
          <FadeIn delay={0.35} y={20}>
            <p
              className="max-w-[200px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[280px] md:max-w-[320px]"
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
