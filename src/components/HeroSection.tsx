import FadeIn from './FadeIn';
import HeroFigureOnly from './HeroFigureOnly';

const TAGLINE =
  'Big Boys Gym — hierro, constancia y comunidad. Sin atajos.';

const TITLE_LINES = ['Big', 'Boys', 'GYM'] as const;

/** Mismo tamaño por línea que el h1 original en una sola fila. */
const TITLE_LINE_CLASS =
  'hero-heading block bg-transparent font-black uppercase leading-[0.88] tracking-tight text-[11vw] sm:text-[13vw] md:text-[14vw] lg:text-[15vw]';

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen flex-col overflow-x-clip scroll-mt-8 pt-[4.75rem] md:pt-[5.25rem]"
    >
      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-5 sm:px-8 md:px-10">
        <div className="grid flex-1 grid-cols-1 items-center gap-6 md:grid-cols-[minmax(0,42%)_minmax(0,1fr)] md:gap-4 lg:grid-cols-[minmax(0,40%)_minmax(0,1fr)] lg:gap-8">
          <div className="relative z-20 flex flex-col justify-center pt-1 md:py-6 md:pr-2 lg:pr-4">
            <FadeIn effect="inView" delay={0.15} y={32} className="bg-transparent">
              <h1 className="flex flex-col text-left">
                {TITLE_LINES.map((line) => (
                  <span key={line} className={TITLE_LINE_CLASS}>
                    {line}
                  </span>
                ))}
              </h1>
            </FadeIn>

            <FadeIn
              effect="inView"
              delay={0.28}
              y={16}
              className="mt-5 hidden max-w-xs md:block"
            >
              <p
                className="font-light uppercase leading-snug tracking-wide text-[#D7E2EA]/90"
                style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.125rem)' }}
              >
                {TAGLINE}
              </p>
            </FadeIn>
          </div>

          <div className="relative z-10 -mx-5 w-[calc(100%+2.5rem)] sm:-mx-8 sm:w-[calc(100%+4rem)] md:mx-0 md:w-full">
            <HeroFigureOnly />
          </div>
        </div>

        <FadeIn delay={0.35} y={20} className="pb-7 pt-3 md:hidden sm:pb-8">
          <p
            className="max-w-[280px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1rem)' }}
          >
            {TAGLINE}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

