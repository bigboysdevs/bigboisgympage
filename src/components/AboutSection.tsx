import ContactButton from './ContactButton';
import FadeIn from './FadeIn';
import AnimatedText from './AnimatedText';

const FILOSOFIA =
  'En Big Boys Gym creemos en el trabajo duro, la técnica impecable y el respeto mutuo. No vendemos atajos: construimos atletas que aguantan la presión dentro y fuera del box. Cada sesión es una oportunidad de superarte — nosotros ponemos el plan, tú traes la actitud.';

export default function AboutSection() {
  return (
    <section
      id="filosofia"
      className="min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 scroll-mt-8"
    >
      <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24 max-w-4xl w-full">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 w-full">
          <FadeIn delay={0} y={40}>
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight text-center w-full"
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
            >
              Nuestra filosofía
            </h2>
          </FadeIn>

          <AnimatedText
            text={FILOSOFIA}
            className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
        </div>

        <FadeIn delay={0.3} y={20}>
          <ContactButton label="Ver entrenamientos" href="#entrenamientos" />
        </FadeIn>
      </div>
    </section>
  );
}
