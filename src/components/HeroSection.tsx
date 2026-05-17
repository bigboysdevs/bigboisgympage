import FadeIn from './FadeIn';
import HeroFigureOnly from './HeroFigureOnly';

const TAGLINE =
  'Big Boys Gym — hierro, constancia y comunidad. Sin atajos.';

const TITLE_LINES = ['Big', 'Boys', 'GYM'] as const;

/** Mismo estilo que el h1 original: gradiente .hero-heading en index.css */
const TITLE_LINE_CLASS =
  'hero-heading block bg-transparent font-black uppercase leading-[0.88] tracking-tight text-[11vw] sm:text-[13vw] md:text-[14vw] lg:text-[15vw]';

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen flex-col overflow-visible scroll-mt-8 pt-[4.75rem] md:pt-[5.25rem]"
    >
      <div className="relative flex min-h-0 flex-1 flex-col overflow-visible">
        {/* Figura: capa inferior, solo ocupa la zona derecha en desktop */}
        <div
          className="absolute inset-x-0 top-0 z-20 -mx-5 min-h-[clamp(520px,72vh,860px)] w-[calc(100%+2.5rem)] overflow-visible sm:-mx-8 sm:w-[calc(100%+4rem)] md:inset-x-auto md:right-0 md:top-6 md:mx-0 md:w-[min(100%,64%)] md:min-h-0 lg:top-8"
        >
          <HeroFigureOnly />
        </div>

        {/* Título encima del 3D: mismas letras, tamaño y gradiente .hero-heading */}
        <div className="relative z-40 flex flex-col justify-start px-5 pb-36 pt-0 sm:px-8 sm:pb-40 md:px-10 md:pb-44 md:pt-1 md:pr-2 lg:pr-3">
          <FadeIn effect="inView" delay={0.15} y={32} className="bg-transparent">
            <h1 className="flex flex-col text-left">
              {TITLE_LINES.map((line) => (
                <span key={line} className={TITLE_LINE_CLASS}>
                  {line}
                </span>
              ))}
            </h1>
          </FadeIn>
        </div>

        {/* Tagline flotante sin barra negra */}
        <FadeIn
          effect="inView"
          delay={0.28}
          y={12}
          className="pointer-events-none absolute bottom-6 left-5 z-40 bg-transparent sm:bottom-8 sm:left-8 md:bottom-10 md:left-10"
        >
          <p
            className="max-w-[280px] bg-transparent font-light uppercase leading-snug tracking-wide text-[#D7E2EA]/90 sm:max-w-xs md:max-w-sm"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.125rem)' }}
          >
            {TAGLINE}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
