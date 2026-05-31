import FadeIn from './FadeIn';
import GymSpacesScrollGallery from './GymSpacesScrollGallery';

export default function ProjectsSection() {
  return (
    <section
      id="espacios"
      className="gym-spaces-section relative z-10 scroll-mt-8"
      aria-labelledby="espacios-heading"
    >
      <div className="gym-spaces-section__header">
        <FadeIn delay={0} y={40}>
          <h2
            id="espacios-heading"
            className="hero-heading w-full text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Espacios GYM
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-center font-light leading-relaxed text-white/65">
            Conoce las zonas del box — cada espacio pensado para un tipo de entrenamiento.
          </p>
        </FadeIn>
      </div>

      <GymSpacesScrollGallery />
    </section>
  );
}
