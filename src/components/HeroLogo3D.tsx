import { Suspense, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bounds, Center, OrbitControls, Resize, useGLTF } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { Group } from 'three';
import { HERO_GLTF_URL } from '../models/branding';

const FIGURE_ROTATION: [number, number, number] = [0, -Math.PI / 2, 0];

/** Oscilación suave arriba/abajo (efecto flotando en el aire). */
function FloatingFigure({ children }: { children: ReactNode }) {
  const group = useRef<Group>(null);
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useFrame((state) => {
    if (reducedMotion || !group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y = Math.sin(t * 1.15) * 0.07;
    group.current.rotation.z = Math.sin(t * 0.75) * 0.018;
  });

  return <group ref={group}>{children}</group>;
}

/** Ajuste de cámara una sola vez tras el fit (sin reajustes al scroll). */
function HeadroomAfterFit() {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  const applied = useRef(false);

  useFrame(() => {
    const orbit = controls as OrbitControlsImpl | undefined;
    if (applied.current || !orbit?.target) return;
    camera.position.y += 0.14;
    orbit.target.y += 0.08;
    orbit.update();
    applied.current = true;
  });

  return null;
}

interface ModelProps {
  url: string;
}

function FigureModel({ url }: ModelProps) {
  const { scene } = useGLTF(url);

  return (
    <>
      <Bounds fit margin={0.5} maxDuration={0}>
        <Center>
          <group position={[0, -0.88, 0]} rotation={FIGURE_ROTATION}>
            <FloatingFigure>
              <Resize>
                <primitive object={scene} />
              </Resize>
            </FloatingFigure>
          </group>
        </Center>
      </Bounds>
      <HeadroomAfterFit />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableRotate={false}
        enableZoom={false}
        enableDamping={false}
        autoRotate={false}
        target={[0, 0.14, 0]}
        minDistance={1.1}
        maxDistance={2.2}
      />
    </>
  );
}

export interface HeroLogo3DProps {
  modelUrl?: string;
  performanceMode: boolean;
}

export default function HeroLogo3D({
  modelUrl = HERO_GLTF_URL,
  performanceMode,
}: HeroLogo3DProps) {
  const dpr: [number, number] = performanceMode ? [1, 1.25] : [1, 2];

  return (
    <div
      className="absolute inset-0 h-full w-full overflow-visible"
      style={{ touchAction: 'pan-y' }}
      aria-label="Modelo 3D Big Boys Gym"
    >
      <Canvas
        className="!bg-transparent h-full w-full"
        style={{ background: 'transparent', overflow: 'visible' }}
        camera={{ position: [0, 0.28, 1.68], fov: 40 }}
        dpr={dpr}
        gl={{
          alpha: true,
          antialias: !performanceMode,
          powerPreference: performanceMode ? 'low-power' : 'high-performance',
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
        }}
      >
        <ambientLight intensity={0.52} />
        <directionalLight position={[6, 8, 5]} intensity={1.18} />
        <directionalLight position={[-5, 2, -4]} intensity={0.42} />
        <pointLight position={[0, 1.5, 2]} intensity={0.35} color="#fecaca" distance={8} />
        <Suspense fallback={null}>
          <FigureModel url={modelUrl} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(HERO_GLTF_URL);
