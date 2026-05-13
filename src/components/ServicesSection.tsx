import FadeIn from './FadeIn';

const services = [
  {
    number: '01',
    name: 'CrossFit',
    description:
      'WODs exigentes, gimnásticos y levantamientos olímpicos. Mejora tu motor, tu potencia y tu capacidad de trabajo bajo fatiga con el respaldo de nuestros coaches.',
  },
  {
    number: '02',
    name: 'Powerlifting',
    description:
      'Squat, press banca y peso muerto con periodización clara. Técnica, volumen e intensidad controlada para sumar kilos al barra con seguridad.',
  },
  {
    number: '03',
    name: 'Funcional',
    description:
      'Movimientos multiarticulares, core sólido y transferencia al día a día. Ideal para reforzar postura, resistencia y fuerza general sin perder agilidad.',
  },
  {
    number: '04',
    name: 'Strong & conditioning',
    description:
      'Bloques de fuerza estructural combinados con trabajo metabólico. Pensado para atletas que quieren masa útil y condición al mismo tiempo.',
  },
  {
    number: '05',
    name: 'Movilidad & recovery',
    description:
      'Sesiones enfocadas en rangos articulares, estabilidad y descarga. Complementa tus bloques duros y reduce el riesgo de lesión a largo plazo.',
  },
];

export default function ServicesSection() {
  return (
    <section
      id="entrenamientos"
      className="flex flex-col px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] scroll-mt-8"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="font-black uppercase leading-none tracking-tight text-center w-full mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)', color: '#0C0C0C' }}
        >
          Entrenamientos
        </h2>
      </FadeIn>

      <div className="flex flex-col w-full items-center">
        {services.map((service, i) => (
          <FadeIn
            key={service.number}
            delay={i * 0.1}
            y={30}
            className="flex flex-col items-center w-full max-w-5xl"
          >
            {i > 0 && (
              <div
                className="w-full"
                style={{ borderTop: '1px solid rgba(12, 12, 12, 0.15)' }}
              />
            )}
            <div className="flex items-start gap-6 sm:gap-8 md:gap-10 py-8 sm:py-10 md:py-12 w-full">
              <span
                className="font-black uppercase leading-none flex-shrink-0"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)', color: '#0C0C0C' }}
              >
                {service.number}
              </span>

              <div className="flex flex-col gap-2 sm:gap-4 md:gap-5 pt-1">
                <span
                  className="font-medium uppercase"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)', color: '#0C0C0C' }}
                >
                  {service.name}
                </span>
                <span
                  className="font-light leading-relaxed max-w-2xl"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)', color: '#0C0C0C', opacity: 0.6 }}
                >
                  {service.description}
                </span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
