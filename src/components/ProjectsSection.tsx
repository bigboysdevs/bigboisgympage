import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import ProjectCard from './ProjectCard';
import FadeIn from './FadeIn';
import { GYM_SPACES } from '@/models/gymSpaces';

export default function ProjectsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="espacios"
      ref={containerRef}
      className="relative z-10 -mt-10 scroll-mt-8 rounded-t-[40px] px-5 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10"
      style={{ backgroundColor: '#0C0C0C' }}
    >
      <div className="flex flex-col items-center py-20 sm:py-24 md:py-32">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading w-full text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Espacios GYM
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-center font-light leading-relaxed text-[#D7E2EA]/65">
            Conoce las zonas del box — cada espacio pensado para un tipo de entrenamiento.
          </p>
        </FadeIn>
      </div>

      <div className="relative">
        {GYM_SPACES.map((space, index) => (
          <ProjectCard
            key={space.number}
            project={space}
            index={index}
            totalCards={GYM_SPACES.length}
            progress={scrollYProgress}
          />
        ))}
        <div className="h-[100vh] min-h-[640px] shrink-0" aria-hidden />
      </div>
    </section>
  );
}
