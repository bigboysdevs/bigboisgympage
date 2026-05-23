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

const FIGURE_MODEL_X_MOBILE = 0.14;
/** Cámara a la izquierda => figura grande a la derecha (estilo referencia móvil). */
const FIGURE_VIEW_PAN_X_MOBILE = -0.36;
/** Móvil: zoom dramático; el CSS responsive ajusta escala por pantalla. */
const FIGURE_BOUNDS_MARGIN_MOBILE = 0.42;

const FIGURE_CAMERA_Z_DESKTOP = 1.48;
const FIGURE_CAMERA_Z_MOBILE = 1.26;
const FIGURE_CAMERA_FOV_DESKTOP = 34;
const FIGURE_CAMERA_FOV_MOBILE = 36;
const FIGURE_ORBIT_MIN_DESKTOP = 0.92;
const FIGURE_ORBIT_MAX_DESKTOP = 1.75;
const FIGURE_ORBIT_MIN_MOBILE = 0.92;
const FIGURE_ORBIT_MAX_MOBILE = 1.75;
const FIGURE_FIT_Y_MOBILE = -0.66;
/** Empuje vertical en móvil: figura anclada abajo-derecha. */
export const FIGURE_SCREEN_OFFSET_PUSH_MOBILE = 0.11;

type LockedFigureLayout = {
  modelX: number;
  viewPanX: number;
  boundsMargin: number;
  fitY: number;
  cameraZ: number;
  cameraFov: number;
  minOrbitDistance: number;
  maxOrbitDistance: number;
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
          fitY: FIGURE_FIT_Y,
          cameraZ: FIGURE_CAMERA_Z_DESKTOP,
          cameraFov: FIGURE_CAMERA_FOV_DESKTOP,
          minOrbitDistance: FIGURE_ORBIT_MIN_DESKTOP,
          maxOrbitDistance: FIGURE_ORBIT_MAX_DESKTOP,
          profile: 'desktop',
        }
      : {
          modelX: FIGURE_MODEL_X_MOBILE,
          viewPanX: FIGURE_VIEW_PAN_X_MOBILE,
          boundsMargin: FIGURE_BOUNDS_MARGIN_MOBILE,
          fitY: FIGURE_FIT_Y_MOBILE,
          cameraZ: FIGURE_CAMERA_Z_MOBILE,
          cameraFov: FIGURE_CAMERA_FOV_MOBILE,
          minOrbitDistance: FIGURE_ORBIT_MIN_MOBILE,
          maxOrbitDistance: FIGURE_ORBIT_MAX_MOBILE,
          profile: 'mobile',
        };
  }
  return (
    locked.current ?? {
      modelX: FIGURE_MODEL_X_DESKTOP,
      viewPanX: FIGURE_VIEW_PAN_X_DESKTOP,
      boundsMargin: FIGURE_BOUNDS_MARGIN_DESKTOP,
      fitY: FIGURE_FIT_Y,
      cameraZ: FIGURE_CAMERA_Z_DESKTOP,
      cameraFov: FIGURE_CAMERA_FOV_DESKTOP,
      minOrbitDistance: FIGURE_ORBIT_MIN_DESKTOP,
      maxOrbitDistance: FIGURE_ORBIT_MAX_DESKTOP,
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

/** Iluminación del logo 3D (valores moderados para no quemar highlights). */
const LOGO_LIGHT_AMBIENT = 1.05;
const LOGO_LIGHT_KEY = 2.05;
const LOGO_LIGHT_FILL = 0.95;
const LOGO_LIGHT_RIM = 1.05;
const LOGO_TONE_EXPOSURE = 1.55;

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
  enableRotate,
  minDistance,
  maxDistance,
}: {
  setDragging: (v: boolean) => void;
  orbitTargetX: number;
  orbitTargetY: number;
  enableRotate: boolean;
  minDistance: number;
  maxDistance: number;
}) {
  const camera = useThree((s) => s.camera);
  if (!camera) return null;

  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      enableRotate={enableRotate}
      enableZoom={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.85}
      autoRotate={false}
      target={[orbitTargetX, orbitTargetY, 0]}
      minDistance={minDistance}
      maxDistance={maxDistance}
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
  enableRotate,
}: ModelProps & { figureScreenOffset: number; enableRotate: boolean }) {
  const { scene } = useGLTF(url);
  const [dragging, setDragging] = useState(false);
  const layout = useLockedFigureLayout();
  const {
    modelX,
    viewPanX,
    boundsMargin,
    fitY,
    minOrbitDistance,
    maxOrbitDistance,
    profile,
  } = layout;
  const orbitTargetX = modelX + viewPanX * 0.92;
  const orbitTargetY = -0.08;
  const pushDown =
    profile === 'mobile' ? FIGURE_SCREEN_OFFSET_PUSH_MOBILE : figureScreenOffset;

  return (
    <>
      <Bounds fit observe={false} margin={boundsMargin} maxDuration={0}>
        <Center>
          <group position={[modelX, fitY, 0]} rotation={FIGURE_ROTATION}>
            <FloatingFigure paused={dragging}>
              <Resize>
                <primitive object={scene} />
              </Resize>
            </FloatingFigure>
          </group>
        </Center>
      </Bounds>
      <FigureScreenOffset
        pushDown={pushDown}
        viewPanX={viewPanX}
        orbitTargetX={orbitTargetX}
        orbitTargetY={orbitTargetY}
        lockCameraOnResize={profile === 'desktop'}
      />
      <FigureOrbitControls
        setDragging={setDragging}
        orbitTargetX={orbitTargetX}
        orbitTargetY={orbitTargetY}
        enableRotate={enableRotate}
        minDistance={minOrbitDistance}
        maxDistance={maxOrbitDistance}
      />
    </>
  );
}

export interface HeroLogo3DProps {
  modelUrl?: string;
  performanceMode: boolean;
  figureScreenOffset?: number;
  enableRotate?: boolean;
}

export default function HeroLogo3D({
  modelUrl = HERO_GLTF_URL,
  performanceMode,
  figureScreenOffset = HERO_FIGURE_SCREEN_OFFSET,
  enableRotate = true,
}: HeroLogo3DProps) {
  const dpr: [number, number] = performanceMode ? [1, 1.25] : [1, 2];
  const { cameraZ, cameraFov } = useLockedFigureLayout();

  return (
    <div
      className={`absolute inset-x-0 -top-24 bottom-[-2rem] h-[calc(100%+8rem)] w-full max-md:inset-0 max-md:top-0 max-md:h-full max-md:bottom-0 max-md:translate-x-0 overflow-visible md:-top-28 md:bottom-[-2.5rem] md:h-[calc(100%+9rem)] lg:-top-32 lg:bottom-[-3rem] lg:h-[calc(100%+10rem)] ${
        enableRotate
          ? 'cursor-grab active:cursor-grabbing'
          : 'pointer-events-none cursor-default'
      }`}
      style={{ touchAction: enableRotate ? 'none' : 'pan-y' }}
      aria-label={
        enableRotate
          ? 'Modelo 3D Big Boys Gym — clic y arrastra para girar'
          : 'Modelo 3D Big Boys Gym'
      }
    >
      <Canvas
        className="!bg-transparent h-full w-full"
        style={{ background: 'transparent', overflow: 'visible' }}
        camera={{ position: [0, 0.04, cameraZ], fov: cameraFov }}
        dpr={dpr}
        gl={{
          alpha: true,
          antialias: !performanceMode,
          powerPreference: performanceMode ? 'low-power' : 'high-performance',
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMappingExposure = LOGO_TONE_EXPOSURE;
          scene.background = null;
          const canvas = gl.domElement;
          canvas.style.touchAction = enableRotate ? 'none' : 'pan-y';
          canvas.style.pointerEvents = enableRotate ? 'auto' : 'none';
          canvas.addEventListener('webglcontextlost', (e) => e.preventDefault(), false);
        }}
      >
        <ambientLight intensity={LOGO_LIGHT_AMBIENT} />
        <directionalLight position={[6, 8, 5]} intensity={LOGO_LIGHT_KEY} />
        <directionalLight position={[-5, 2, -4]} intensity={LOGO_LIGHT_FILL} />
        <pointLight position={[0, 1.5, 2]} intensity={LOGO_LIGHT_RIM} color="#ffffff" distance={8} />
        <Suspense fallback={null}>
          <FigureModel
            url={modelUrl}
            figureScreenOffset={figureScreenOffset}
            enableRotate={enableRotate}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(HERO_GLTF_URL);
