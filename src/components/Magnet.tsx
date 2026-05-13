import {
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type HTMLAttributes,
  type RefObject,
} from 'react';

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Área donde se escucha el puntero (p. ej. el `<section>` del Hero). Si se omite, se usa el ancestro `<section>` o el propio nodo del imán. */
  interactionRootRef?: RefObject<HTMLElement | null>;
  padding?: number;
  disabled?: boolean;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  innerClassName?: string;
}

export default function Magnet({
  children,
  interactionRootRef,
  padding = 100,
  disabled = false,
  strength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out',
  className = '',
  innerClassName = '',
  style,
  ...props
}: MagnetProps) {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) {
      setPosition({ x: 0, y: 0 });
      setIsActive(false);
      return;
    }

    const resolveInteractionTarget = (): HTMLElement | null => {
      if (interactionRootRef?.current) return interactionRootRef.current;
      const root = ref.current;
      if (!root) return null;
      return root.closest('section') ?? root;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const magnetEl = ref.current;
      if (!magnetEl) return;

      const { left, top, width, height } = magnetEl.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const halfW = width / 2 + padding;
      const halfH = height / 2 + padding;
      const near =
        Math.abs(centerX - e.clientX) < halfW && Math.abs(centerY - e.clientY) < halfH;

      const nextX = near ? (e.clientX - centerX) / strength : 0;
      const nextY = near ? (e.clientY - centerY) / strength : 0;

      setIsActive((prev) => (prev === near ? prev : near));
      setPosition((prev) =>
        prev.x === nextX && prev.y === nextY ? prev : { x: nextX, y: nextY },
      );
    };

    const handleMouseLeave = () => {
      setIsActive((prev) => (prev ? false : prev));
      setPosition((prev) => (prev.x === 0 && prev.y === 0 ? prev : { x: 0, y: 0 }));
    };

    const target = resolveInteractionTarget();
    if (!target) return;

    target.addEventListener('mousemove', handleMouseMove, { passive: true });
    target.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      target.removeEventListener('mousemove', handleMouseMove);
      target.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [padding, disabled, strength, interactionRootRef]);

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      {...props}
    >
      <div
        className={innerClassName}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: isActive ? activeTransition : inactiveTransition,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}
