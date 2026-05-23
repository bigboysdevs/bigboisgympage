import FadeIn from './FadeIn';
import HeroFigureOnly from './HeroFigureOnly';

const TITLE_LINES = ['Big', 'Boys'] as const;

/** Estilo fachada del gym — amarillo neón, borde negro, inclinado (.hero-facade-title) */
const TITLE_LINE_CLASS =
  'hero-facade-title text-[11vw] sm:text-[13vw] md:text-[14vw] lg:text-[15vw]';

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative z-[20] flex min-h-[100svh] flex-col overflow-visible scroll-mt-8 bg-transparent pt-[4.75rem] md:pt-[5.25rem]"
    >
      <div className="relative flex min-h-0 flex-1 flex-col overflow-visible">
        <div className="hero-figure-layer pointer-events-none absolute inset-0 z-[22] flex -mx-5 justify-center overflow-visible sm:-mx-8 md:z-[25] md:pointer-events-auto md:mx-0 md:block md:touch-none md:justify-end">
          <HeroFigureOnly withBackdrop={false} />
        </div>

        <div className="hero-title-layer pointer-events-none relative z-[40] flex flex-col justify-start px-5 pb-4 sm:px-8 sm:pb-5 md:px-10 md:pb-6 md:pr-2 lg:pr-3">
          <FadeIn
            effect="inView"
            delay={0.15}
            y={32}
            className="hero-title-layer pointer-events-none !bg-transparent shadow-none"
            style={{ background: 'transparent', backgroundColor: 'transparent' }}
          >
            <h1 className="pointer-events-none flex w-fit flex-col bg-transparent text-left">
              {TITLE_LINES.map((line) => (
                <span key={line} className={TITLE_LINE_CLASS}>
                  {line}
                </span>
              ))}
            </h1>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
