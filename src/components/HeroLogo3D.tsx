import { Suspense, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bounds, Center, OrbitControls, Resize, useGLTF } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { Group } from 'three';
import { HERO_GLTF_URL } from '../models/branding';

/** Encuadre del GLB dentro de Bounds (fijo; no usar para bajar en pantalla). */
const FIGURE_FIT_Y = -0.72;

/**
 * Cuánto bajar la figura en pantalla (solo cámara, la ventana canvas no se mueve).
 * Valores mayores = figura más abajo.
 */
export const HERO_FIGURE_RAISE = '16cm';

/** ~16cm en pantalla (empírico a fov/distancia del hero). */
export const HERO_FIGURE_SCREEN_RAISE = 0.29;

const HERO_FIGURE_SCREEN_OFFSET_BASE = 0.5;

export const HERO_FIGURE_SCREEN_OFFSET =
  HERO_FIGURE_SCREEN_OFFSET_BASE - HERO_FIGURE_SCREEN_RAISE;

const FIGURE_ROTATION: [number, number, number] = [0, -Math.PI / 2, 0];

/** Oscilación suave arriba/abajo (efecto flotando en el aire). */
function FloatingFigure({
  children,
  paused = false,
}: {
  children: ReactNode;
  paused?: boolean;
}) {
  const group = useRef<Group>(null);
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useFrame((state) => {
    if (reducedMotion || paused || !group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y = Math.sin(t * 0.75) * 0.012;
    group.current.rotation.z = Math.sin(t * 0.55) * 0.003;
  });

  return <group ref={group}>{children}</group>;
}

interface ModelProps {
  url: string;
}

/** Tras el fit de Bounds, empuja la figura hacia abajo sin mover el canvas. */
function FigureScreenOffset({ pushDown }: { pushDown: number }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  const applied = useRef(false);
  const frames = useRef(0);

  useFrame(() => {
    const orbit = controls as OrbitControlsImpl | undefined;
    if (applied.current || !orbit?.target || pushDown === 0) return;
    frames.current += 1;
    if (frames.current < 4) return;
    camera.position.y += pushDown;
    orbit.target.y += pushDown * 0.88;
    orbit.update();
    applied.current = true;
  });

  return null;
}

function FigureOrbitControls({
  setDragging,
}: {
  setDragging: (v: boolean) => void;
}) {
  const camera = useThree((s) => s.camera);
  if (!camera) return null;

  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      enableRotate
      enableZoom={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.65}
      autoRotate={false}
      target={[0, -0.08, 0]}
      minDistance={0.92}
      maxDistance={1.75}
      minPolarAngle={Math.PI * 0.22}
      maxPolarAngle={Math.PI * 0.78}
      onStart={() => setDragging(true)}
      onEnd={() => setDragging(false)}
    />
  );
}

function FigureModel({
  url,
  figureScreenOffset,
}: ModelProps & { figureScreenOffset: number }) {
  const { scene } = useGLTF(url);
  const [dragging, setDragging] = useState(false);

  return (
    <>
      <Bounds fit margin={0.5} maxDuration={0}>
        <Center>
          <group position={[0, FIGURE_FIT_Y, 0]} rotation={FIGURE_ROTATION}>
            <FloatingFigure paused={dragging}>
              <Resize>
                <primitive object={scene} />
              </Resize>
            </FloatingFigure>
          </group>
        </Center>
      </Bounds>
      <FigureScreenOffset pushDown={figureScreenOffset} />
      <FigureOrbitControls setDragging={setDragging} />
    </>
  );
}

export interface HeroLogo3DProps {
  modelUrl?: string;
  performanceMode: boolean;
  figureScreenOffset?: number;
}

export default function HeroLogo3D({
  modelUrl = HERO_GLTF_URL,
  performanceMode,
  figureScreenOffset = HERO_FIGURE_SCREEN_OFFSET,
}: HeroLogo3DProps) {
  const dpr: [number, number] = performanceMode ? [1, 1.25] : [1, 2];

  return (
    <div
      className="absolute inset-x-0 -top-24 bottom-0 h-[calc(100%+6rem)] w-full cursor-grab overflow-visible active:cursor-grabbing md:-top-28 md:h-[calc(100%+7rem)] lg:-top-32 lg:h-[calc(100%+8rem)]"
      style={{ touchAction: 'none' }}
      aria-label="Modelo 3D Big Boys Gym — clic y arrastra para girar"
    >
      <Canvas
        className="!bg-transparent h-full w-full"
        style={{ background: 'transparent', overflow: 'visible' }}
        camera={{ position: [0, 0.04, 1.48], fov: 34 }}
        dpr={dpr}
        gl={{
          alpha: true,
          antialias: !performanceMode,
          powerPreference: performanceMode ? 'low-power' : 'high-performance',
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
          const canvas = gl.domElement;
          canvas.addEventListener('webglcontextlost', (e) => e.preventDefault(), false);
        }}
      >
        <ambientLight intensity={0.52} />
        <directionalLight position={[6, 8, 5]} intensity={1.18} />
        <directionalLight position={[-5, 2, -4]} intensity={0.42} />
        <pointLight position={[0, 1.5, 2]} intensity={0.35} color="#ffffff" distance={8} />
        <Suspense fallback={null}>
          <FigureModel url={modelUrl} figureScreenOffset={figureScreenOffset} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(HERO_GLTF_URL);
