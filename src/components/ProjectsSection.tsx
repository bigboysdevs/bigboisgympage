import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import ProjectCard from './ProjectCard';
import FadeIn from './FadeIn';

const programs = [
  {
    number: '01',
    category: 'Plan 10 semanas',
    name: 'Hypertrophy Engine',
    href: '#entrenamientos',
    images: {
      col1: [
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85',
      ],
      col2:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1400&q=85',
    },
  },
  {
    number: '02',
    category: 'Plan 8 semanas',
    name: 'MetCon Assault',
    href: '#entrenamientos',
    images: {
      col1: [
        'https://images.unsplash.com/photo-1434682880608-969413d07d4b?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1599058945522-734d051e8e27?auto=format&fit=crop&w=900&q=85',
      ],
      col2:
        'https://images.unsplash.com/photo-1540497077382-69212b239b72?auto=format&fit=crop&w=1400&q=85',
    },
  },
  {
    number: '03',
    category: 'Plan competición',
    name: 'Total Strength',
    href: '#entrenamientos',
    images: {
      col1: [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1517963879433-6ad2b056d17b?auto=format&fit=crop&w=900&q=85',
      ],
      col2:
        'https://images.unsplash.com/photo-1526506118085-60ce8714f8c8?auto=format&fit=crop&w=1400&q=85',
    },
  },
];

export default function ProjectsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="rutinas"
      ref={containerRef}
      className="relative px-5 sm:px-8 md:px-10 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 scroll-mt-8"
      style={{ backgroundColor: '#0C0C0C' }}
    >
      <div className="flex flex-col items-center py-20 sm:py-24 md:py-32">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center w-full"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Programas destacados
          </h2>
        </FadeIn>
      </div>

      {programs.map((project, index) => (
        <ProjectCard
          key={project.number}
          project={project}
          index={index}
          totalCards={programs.length}
          progress={scrollYProgress}
        />
      ))}
    </section>
  );
}
