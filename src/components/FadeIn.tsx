import { motion } from "framer-motion";
import { useMemo, type ReactNode } from "react";

type FadeInOwnProps = {
  as?: "div" | "section" | "article" | "header" | "footer" | "nav";
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
};

const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export function FadeIn({
  as = "div",
  children,
  className,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
}: FadeInOwnProps) {
  const MotionComponent = useMemo(() => motion.create(as), [as]);

  return (
    <MotionComponent
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: easing }}
    >
      {children}
    </MotionComponent>
  );
}
