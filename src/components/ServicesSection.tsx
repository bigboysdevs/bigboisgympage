import FadeIn from './FadeIn';

const services = [
  {
    number: '01',
    name: 'Entrenamiento mensual',
    price: '$110.000',
    description:
      'Acceso al box y a las sesiones del plan mensual. Entrena con la estructura del gym y el acompañamiento del equipo Big Boys.',
  },
  {
    number: '02',
    name: 'Personalizado alto rendimiento',
    price: '$500.000',
    description:
      'Entrenamientos personalizados con plan de alimentación y manejo de cargas para deportistas de alto rendimiento de cualquier deporte.',
  },
  {
    number: '03',
    name: 'Personalizado hipertrofia y fitness',
    price: '$500.000',
    description:
      'Plan personalizado de hipertrofia y fitness con alimentación a tu medida. Volumen, técnica e intensidad pensados para tus objetivos.',
  },
  {
    number: '04',
    name: 'Entrenamiento personalizado Big Boys Kits',
    price: '$500.000',
    description:
      'Programa personalizado con el kit Big Boys: seguimiento cercano, plan de entrenamiento y todo lo que necesitas para avanzar con el sello del gym.',
  },
];

export default function ServicesSection() {
  return (
    <section
      id="entrenamientos"
      className="flex flex-col px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] scroll-mt-8"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <FadeIn effect="inView" delay={0} y={40}>
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
            effect="inView"
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
                <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4">
                  <span
                    className="font-medium uppercase"
                    style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)', color: '#0C0C0C' }}
                  >
                    {service.name}
                  </span>
                  <span
                    className="font-semibold tabular-nums"
                    style={{ fontSize: 'clamp(1.1rem, 2.4vw, 2.25rem)', color: '#dc2626' }}
                  >
                    {service.price}
                  </span>
                </div>
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
