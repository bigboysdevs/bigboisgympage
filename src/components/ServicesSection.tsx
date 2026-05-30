import FadeIn from './FadeIn';
import TrainingEditorialDesktop from './TrainingEditorialDesktop';
import TrainingEditorialMobile from './TrainingEditorialMobile';

export default function ServicesSection() {
  return (
    <section
      id="entrenamientos"
      className="entrenamientos-section relative z-[10] scroll-mt-8"
      aria-labelledby="entrenamientos-heading"
    >
      <div className="entrenamientos-section__inner">
        <FadeIn effect="inView" delay={0} y={40}>
          <h2 id="entrenamientos-heading" className="entrenamientos-section__heading">
            Entrenamientos
          </h2>
        </FadeIn>

        <div className="entrenamientos-editorial-mobile md:hidden">
          <TrainingEditorialMobile />
        </div>

        <div className="entrenamientos-editorial-desktop hidden md:block">
          <TrainingEditorialDesktop />
        </div>
      </div>
    </section>
  );
}
