import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useMemo, useRef } from "react";
import { LiveProjectButton } from "../components/LiveProjectButton";
import { FadeIn } from "../components/FadeIn";

type Project = {
  number: string;
  category: string;
  name: string;
  col1a: string;
  col1b: string;
  col2: string;
};

const PROJECTS: Project[] = [
  {
    number: "01",
    category: "Client",
    name: "Nextlevel Studio",
    col1a:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
    col1b:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
    col2:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
  },
  {
    number: "02",
    category: "Personal",
    name: "Aura Brand Identity",
    col1a:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
    col1b:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
    col2:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
  },
  {
    number: "03",
    category: "Client",
    name: "Solaris Digital",
    col1a:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
    col1b:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
    col2:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
  },
];

const TOTAL = PROJECTS.length;

function ProjectCard({
  project,
  index,
  scrollYProgress,
}: {
  project: Project;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const targetScale = 1 - (TOTAL - 1 - index) * 0.03;

  const scale = useTransform(scrollYProgress, (p) => {
    const segment = 1 / TOTAL;
    const segStart = index * segment;
    const segEnd = (index + 1) * segment;
    if (p <= segStart) return 1;
    if (p >= segEnd) return targetScale;
    const t = (p - segStart) / (segEnd - segStart);
    return 1 + (targetScale - 1) * t;
  });

  const radius = "rounded-[40px] sm:rounded-[50px] md:rounded-[60px]";

  return (
    <div className="pointer-events-none flex justify-center px-5 sm:px-8 md:px-10">
      <motion.div
        style={{
          scale,
          top: index * 28,
          zIndex: index + 1,
          transformOrigin: "top center",
        }}
        className={`pointer-events-auto relative w-full max-w-6xl border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 ${radius}`}
      >
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap items-end gap-4 md:gap-8">
            <p
              className="font-black leading-none text-[#D7E2EA]"
              style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
            >
              {project.number}
            </p>
            <div className="flex flex-col gap-1 pb-1">
              <span className="text-sm font-medium uppercase tracking-widest text-[#D7E2EA]/70">
                {project.category}
              </span>
              <span
                className="font-medium uppercase text-[#D7E2EA]"
                style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
              >
                {project.name}
              </span>
            </div>
          </div>
          <LiveProjectButton type="button" className="shrink-0 self-start md:self-auto" />
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-4">
          <div className="flex w-full flex-col gap-3 md:w-[40%]">
            <div
              className={`overflow-hidden ${radius}`}
              style={{ height: "clamp(130px, 16vw, 230px)" }}
            >
              <img
                src={project.col1a}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div
              className={`overflow-hidden ${radius}`}
              style={{ height: "clamp(160px, 22vw, 340px)" }}
            >
              <img
                src={project.col1b}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className={`w-full overflow-hidden md:flex md:w-[60%] md:min-h-0 ${radius}`}>
            <img
              src={project.col2}
              alt=""
              className="h-full min-h-[280px] w-full flex-1 object-cover sm:min-h-[320px] md:min-h-full"
              loading="lazy"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heightVh = useMemo(() => TOTAL * 85, []);

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] sm:-mt-12 sm:rounded-t-[50px] md:-mt-14 md:rounded-t-[60px]"
    >
      <FadeIn delay={0} y={40} className="px-5 pb-10 pt-16 sm:px-8 md:px-10 md:pb-14 md:pt-20">
        <h2
          className="hero-heading text-center font-black uppercase leading-none tracking-tight"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          Project
        </h2>
      </FadeIn>

      <div ref={containerRef} style={{ height: `${heightVh}vh` }}>
        {PROJECTS.map((project, index) => (
          <div key={project.name} className="relative h-[85vh]">
            <div className="sticky top-24 md:top-32">
              <ProjectCard
                project={project}
                index={index}
                scrollYProgress={scrollYProgress}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
