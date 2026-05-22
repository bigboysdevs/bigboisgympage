import FadeIn from './FadeIn';
import AnimatedText from './AnimatedText';

const FILOSOFIA =
  'En Big Boys Gym creemos en el trabajo duro, la técnica impecable y el respeto mutuo. No vendemos atajos: construimos atletas que aguantan la presión dentro y fuera del box. Cada sesión es una oportunidad de superarte — nosotros ponemos el plan, tú traes la actitud.';

export default function AboutSection() {
  return (
    <section
      id="filosofia"
      className="relative z-[10] flex min-h-screen flex-col justify-center overflow-hidden bg-transparent px-5 py-20 scroll-mt-8 sm:px-8 md:px-10"
    >
      <div className="relative ml-auto mr-[clamp(1.5rem,8vw,9rem)] flex w-full max-w-4xl flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading w-full text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Nuestra filosofía
          </h2>
        </FadeIn>

        <AnimatedText
          text={FILOSOFIA}
          className="max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA] [overflow-wrap:normal] [word-break:normal]"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
        />
      </div>
    </section>
  );
}
