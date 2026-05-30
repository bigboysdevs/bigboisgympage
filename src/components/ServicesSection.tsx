import FadeIn from './FadeIn';
import { TRAINING_PLANS } from '@/models/trainingPlans';

export default function ServicesSection() {
  return (
    <section
      id="entrenamientos"
      className="relative z-[10] flex min-h-[min(100vh,920px)] w-full flex-col scroll-mt-8 rounded-t-[40px] px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <FadeIn effect="inView" delay={0} y={40}>
        <h2
          className="mb-16 w-full text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)', color: '#0C0C0C' }}
        >
          Entrenamientos
        </h2>
      </FadeIn>

      <div className="flex w-full flex-col items-center">
        {TRAINING_PLANS.map((service, i) => (
          <FadeIn
            key={service.number}
            effect="inView"
            delay={i * 0.1}
            y={30}
            className="flex w-full max-w-5xl flex-col items-center"
          >
            {i > 0 && (
              <div
                className="w-full"
                style={{ borderTop: '1px solid rgba(12, 12, 12, 0.15)' }}
              />
            )}
            <div className="flex w-full items-start gap-6 py-8 sm:gap-8 sm:py-10 md:gap-10 md:py-12">
              <span
                className="flex-shrink-0 font-black uppercase leading-none"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)', color: '#0C0C0C' }}
              >
                {service.number}
              </span>

              <div className="flex flex-col gap-2 pt-1 sm:gap-4 md:gap-5">
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
                  className="max-w-2xl font-light leading-relaxed"
                  style={{
                    fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)',
                    color: '#0C0C0C',
                    opacity: 0.6,
                  }}
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
