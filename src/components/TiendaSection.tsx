import FadeIn from './FadeIn';
import ContactButton from './ContactButton';

export default function TiendaSection() {
  return (
    <section
      id="tienda"
      className="relative scroll-mt-8 border-t border-[#D7E2EA]/15 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-28"
      style={{ backgroundColor: '#0C0C0C' }}
      aria-labelledby="tienda-heading"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        <FadeIn delay={0} y={32}>
          <h2
            id="tienda-heading"
            className="hero-heading font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.25rem, 8vw, 4.5rem)' }}
          >
            Tienda Big Boys
          </h2>
        </FadeIn>
        <FadeIn delay={0.12} y={24}>
          <p
            className="text-[#D7E2EA]/85 font-light leading-relaxed max-w-xl"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
          >
            Equipamiento, accesorios y suplementación seleccionada para quienes entrenan en serio.
            Próximamente pedidos online y recogida en box.
          </p>
        </FadeIn>
        <FadeIn delay={0.22} y={20}>
          <ContactButton
            label="Avisarme"
            href="mailto:contacto@bigboysgym.com?subject=Tienda%20Big%20Boys%20Gym"
          />
        </FadeIn>
      </div>
    </section>
  );
}
