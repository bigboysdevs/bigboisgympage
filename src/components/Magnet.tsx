import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type MagnetProps = {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
};

export function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className = "",
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const expanded = {
        left: rect.left - padding,
        right: rect.right + padding,
        top: rect.top - padding,
        bottom: rect.bottom + padding,
      };
      const inside =
        clientX >= expanded.left &&
        clientX <= expanded.right &&
        clientY >= expanded.top &&
        clientY <= expanded.bottom;

      if (inside) {
        el.style.transition = activeTransition;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        setOffset({
          x: (clientX - cx) / strength,
          y: (clientY - cy) / strength,
        });
      } else {
        el.style.transition = inactiveTransition;
        setOffset({ x: 0, y: 0 });
      }
    },
    [activeTransition, inactiveTransition, padding, strength]
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [onMove]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        willChange: "transform",
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
    >
      {children}
    </div>
  );
}
