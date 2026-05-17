import { motion, MotionValue, useTransform } from 'framer-motion';
import LiveProjectButton from './LiveProjectButton';
import PlanImage from './PlanImage';
import type { GymSpace } from '@/models/gymSpaces';

export type ProjectData = GymSpace;

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  totalCards: number;
  progress: MotionValue<number>;
}

export default function ProjectCard({ project, index, totalCards, progress }: ProjectCardProps) {
  const rangeStart = index / totalCards;
  const rangeEnd = 1;
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(progress, [rangeStart, rangeEnd], [1, targetScale]);

  return (
    <div className="sticky top-24 flex h-[85vh] items-start justify-center md:top-32">
      <motion.div
        style={{
          scale,
          top: `${index * 28}px`,
          backgroundColor: '#0C0C0C',
        }}
        className="absolute flex w-full max-w-[1760px] origin-top flex-col gap-6 rounded-[40px] border-2 border-[#D7E2EA] p-4 sm:gap-8 sm:rounded-[50px] sm:p-6 md:gap-10 md:rounded-[60px] md:p-8"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center gap-6 sm:gap-8 md:gap-10">
            <span
              className="font-black uppercase leading-none text-[#D7E2EA]"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {project.number}
            </span>
            <div className="flex flex-col gap-2 sm:gap-4 md:gap-6">
              <span
                className="font-medium uppercase text-[#D7E2EA]/70"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {project.category}
              </span>
              <span
                className="font-light tracking-wide text-[#D7E2EA]"
                style={{ fontSize: 'clamp(0.9rem, 2vw, 2rem)' }}
              >
                {project.name}
              </span>
            </div>
          </div>

          <LiveProjectButton href={project.href} label={project.ctaLabel} />
        </div>

        <div className="flex w-full flex-col gap-4 md:flex-row md:gap-5">
          <div className="flex w-full flex-col gap-4 md:w-[40%] md:gap-5">
            <PlanImage
              src={project.images.col1[0]}
              fallbackSrc={project.fallbackImages.col1[0]}
              alt={`${project.name} — foto 1`}
              className="w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            />
            <PlanImage
              src={project.images.col1[1]}
              fallbackSrc={project.fallbackImages.col1[1]}
              alt={`${project.name} — foto 2`}
              className="w-full rounded-[30px] object-cover sm:rounded-[40px] md:rounded-[60px]"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            />
          </div>

          <PlanImage
            src={project.images.col2}
            fallbackSrc={project.fallbackImages.col2}
            alt={`${project.name} — principal`}
            className="w-full self-stretch rounded-[30px] object-cover sm:rounded-[40px] md:rounded-[60px] md:h-auto md:w-[60%]"
          />
        </div>
      </motion.div>
    </div>
  );
}
