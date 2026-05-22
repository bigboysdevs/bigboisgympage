import { Suspense, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bounds, Center, OrbitControls, Resize, useGLTF } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { TOUCH } from 'three';
import type { Group, Vector3 } from 'three';
import { HERO_GLTF_URL } from '../models/branding';

/** Encuadre del GLB dentro de Bounds (fijo; no usar para bajar en pantalla). */
const FIGURE_FIT_Y = -0.72;

/**
 * Encuadre fijado al cargar (no cambia con F12).
 * Cámara un poco a la IZQUIERDA => la figura se ve a la DERECHA (junto al título).
 */
const FIGURE_MODEL_X_DESKTOP = 0.02;
const FIGURE_VIEW_PAN_X_DESKTOP = -0.18;
const FIGURE_BOUNDS_MARGIN_DESKTOP = 0.54;

const FIGURE_MODEL_X_MOBILE = 0.1;
/** Cámara a la izquierda => figura a la derecha, sin salir del viewport. */
const FIGURE_VIEW_PAN_X_MOBILE = -0.28;
const FIGURE_BOUNDS_MARGIN_MOBILE = 0.68;

type LockedFigureLayout = {
  modelX: number;
  viewPanX: number;
  boundsMargin: number;
  profile: 'desktop' | 'mobile';
};

function useLockedFigureLayout(): LockedFigureLayout {
  const locked = useRef<LockedFigureLayout | null>(null);
  if (locked.current === null && typeof window !== 'undefined') {
    const desktop = window.matchMedia('(min-width: 768px)').matches;
    locked.current = desktop
      ? {
          modelX: FIGURE_MODEL_X_DESKTOP,
          viewPanX: FIGURE_VIEW_PAN_X_DESKTOP,
          boundsMargin: FIGURE_BOUNDS_MARGIN_DESKTOP,
          profile: 'desktop',
        }
      : {
          modelX: FIGURE_MODEL_X_MOBILE,
          viewPanX: FIGURE_VIEW_PAN_X_MOBILE,
          boundsMargin: FIGURE_BOUNDS_MARGIN_MOBILE,
          profile: 'mobile',
        };
  }
  return (
    locked.current ?? {
      modelX: FIGURE_MODEL_X_DESKTOP,
      viewPanX: FIGURE_VIEW_PAN_X_DESKTOP,
      boundsMargin: FIGURE_BOUNDS_MARGIN_DESKTOP,
      profile: 'desktop',
    }
  );
}

/**
 * Cuánto bajar la figura en pantalla (solo cámara, la ventana canvas no se mueve).
 * Valores mayores = figura más abajo.
 */
export const HERO_FIGURE_RAISE = '16cm';

/** ~16cm en pantalla (empírico a fov/distancia del hero). */
export const HERO_FIGURE_SCREEN_RAISE = 0.29;

const HERO_FIGURE_SCREEN_OFFSET_BASE = 0.52;

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

type CameraSnapshot = {
  position: Vector3;
  target: Vector3;
};

const NARROW_CANVAS_MAX_WIDTH = 767;

/** Aplica offset una vez; en desktop ancho restaura cámara al redimensionar (F12). */
function FigureScreenOffset({
  pushDown,
  viewPanX,
  orbitTargetX,
  orbitTargetY,
  lockCameraOnResize,
}: {
  pushDown: number;
  viewPanX: number;
  orbitTargetX: number;
  orbitTargetY: number;
  lockCameraOnResize: boolean;
}) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  const size = useThree((s) => s.size);
  const applied = useRef(false);
  const frames = useRef(0);
  const snapshot = useRef<CameraSnapshot | null>(null);
  const dragging = useRef(false);

  const restoreCamera = () => {
    if (!snapshot.current || dragging.current) return;
    const orbit = controls as OrbitControlsImpl | undefined;
    if (!orbit?.target) return;
    camera.position.copy(snapshot.current.position);
    orbit.target.copy(snapshot.current.target);
    orbit.update();
  };

  useLayoutEffect(() => {
    const orbit = controls as OrbitControlsImpl | undefined;
    if (!orbit) return;

    const onStart = () => {
      dragging.current = true;
    };
    const onEnd = () => {
      dragging.current = false;
    };

    orbit.addEventListener('start', onStart);
    orbit.addEventListener('end', onEnd);
    return () => {
      orbit.removeEventListener('start', onStart);
      orbit.removeEventListener('end', onEnd);
    };
  }, [controls]);

  useFrame(() => {
    const orbit = controls as OrbitControlsImpl | undefined;
    if (applied.current || !orbit?.target) return;
    frames.current += 1;
    if (frames.current < 4) return;

    camera.position.x += viewPanX;
    camera.position.y += pushDown;
    orbit.target.x = orbitTargetX;
    orbit.target.y = orbitTargetY + pushDown * 0.88;
    orbit.update();

    snapshot.current = {
      position: camera.position.clone(),
      target: orbit.target.clone(),
    };
    applied.current = true;
  });

  useLayoutEffect(() => {
    if (!lockCameraOnResize) return;
    if (size.width <= NARROW_CANVAS_MAX_WIDTH) return;
    restoreCamera();
  }, [lockCameraOnResize, size.width, size.height]);

  return null;
}

function FigureOrbitControls({
  setDragging,
  orbitTargetX,
  orbitTargetY,
}: {
  setDragging: (v: boolean) => void;
  orbitTargetX: number;
  orbitTargetY: number;
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
      rotateSpeed={0.85}
      autoRotate={false}
      target={[orbitTargetX, orbitTargetY, 0]}
      minDistance={0.92}
      maxDistance={1.75}
      minPolarAngle={Math.PI * 0.22}
      maxPolarAngle={Math.PI * 0.78}
      touches={{
        ONE: TOUCH.ROTATE,
        TWO: TOUCH.DOLLY_ROTATE,
      }}
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
  const layout = useLockedFigureLayout();
  const { modelX, viewPanX, boundsMargin, profile } = layout;
  const orbitTargetX = modelX + viewPanX * 0.92;
  const orbitTargetY = -0.08;

  return (
    <>
      <Bounds fit observe={false} margin={boundsMargin} maxDuration={0}>
        <Center>
          <group position={[modelX, FIGURE_FIT_Y, 0]} rotation={FIGURE_ROTATION}>
            <FloatingFigure paused={dragging}>
              <Resize>
                <primitive object={scene} />
              </Resize>
            </FloatingFigure>
          </group>
        </Center>
      </Bounds>
      <FigureScreenOffset
        pushDown={figureScreenOffset}
        viewPanX={viewPanX}
        orbitTargetX={orbitTargetX}
        orbitTargetY={orbitTargetY}
        lockCameraOnResize={profile === 'desktop'}
      />
      <FigureOrbitControls
        setDragging={setDragging}
        orbitTargetX={orbitTargetX}
        orbitTargetY={orbitTargetY}
      />
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
      className="absolute inset-x-0 -top-24 bottom-0 h-[calc(100%+6rem)] w-full max-md:translate-x-0 cursor-grab overflow-visible active:cursor-grabbing md:-top-28 md:h-[calc(100%+7rem)] lg:-top-32 lg:h-[calc(100%+8rem)]"
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
          canvas.style.touchAction = 'none';
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
