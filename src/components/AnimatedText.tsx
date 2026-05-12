import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useMemo, useRef } from "react";

const ABOUT_TEXT =
  "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!";

function AnimatedChar({
  char,
  index,
  total,
  progress,
}: {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const denom = Math.max(1, total - 1);
  const t = index / denom;
  const spread = 0.06;
  const opacity = useTransform(
    progress,
    [Math.max(0, t - spread), Math.min(1, t + spread)],
    [0.2, 1],
    { clamp: true }
  );

  return (
    <span className="relative inline-block whitespace-pre">
      <span className="invisible">{char === " " ? "\u00A0" : char}</span>
      <motion.span className="absolute left-0 top-0 inline-block" style={{ opacity }}>
        {char === " " ? "\u00A0" : char}
      </motion.span>
    </span>
  );
}

export function AnimatedText() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  const chars = useMemo(() => ABOUT_TEXT.split(""), []);

  return (
    <p
      ref={ref}
      className="mx-auto max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA]"
      style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
    >
      {chars.map((char, index) => (
        <AnimatedChar
          key={`${index}-${char}`}
          char={char}
          index={index}
          total={chars.length}
          progress={scrollYProgress}
        />
      ))}
    </p>
  );
}
