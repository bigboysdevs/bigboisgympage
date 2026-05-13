import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bounds, Center, Grid, OrbitControls, Resize, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { HERO_GLTF_URL } from '../models/branding';

/** Rotación fija del modelo (radianes) [X, Y, Z]. Volteada hacia la derecha (~90° en Y). */
const FIGURE_ROTATION: [number, number, number] = [0, -Math.PI / 2, 0];

/** Rejilla + anillos que orbitan en Y; la figura no forma parte de este grupo. */
function OrbitalBackdrop({ speed = 0.1 }: { speed?: number }) {
  const group = useRef<THREE.Group>(null);
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useFrame((_, dt) => {
    if (reducedMotion || !group.current) return;
    group.current.rotation.y += dt * speed;
  });

  return (
    <group ref={group}>
      <Grid
        args={[28, 28]}
        position={[0, -2.12, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        infiniteGrid
        fadeDistance={24}
        fadeStrength={1.4}
        sectionColor="#b91c1c"
        cellColor="#450a0a"
        sectionSize={1}
        cellSize={1}
        sectionThickness={0.9}
        cellThickness={0.55}
      />
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -2.02 + i * 0.015, 0]}
          renderOrder={-2}
        >
          <ringGeometry args={[2.05 + i * 0.52, 2.12 + i * 0.52, 112]} />
          <meshBasicMaterial
            color="#ef4444"
            transparent
            opacity={0.14 - i * 0.035}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

interface ModelProps {
  url: string;
}

function FigureModel({ url }: ModelProps) {
  const { scene } = useGLTF(url);

  return (
    <>
      <Bounds fit clip observe margin={0.74} maxDuration={0.35}>
        <Center>
          <group position={[0, -0.62, 0]} rotation={FIGURE_ROTATION}>
            <Resize>
              <primitive object={scene} />
            </Resize>
          </group>
        </Center>
      </Bounds>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableRotate={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate={false}
        target={[0, 0.04, 0]}
        minDistance={1.25}
        maxDistance={2.35}
      />
    </>
  );
}

export interface HeroLogo3DProps {
  modelUrl?: string;
  performanceMode: boolean;
}

/** Modelo estático (sin auto-giro) + fondo orbital detrás. */
export default function HeroLogo3D({
  modelUrl = HERO_GLTF_URL,
  performanceMode,
}: HeroLogo3DProps) {
  const dpr: [number, number] = performanceMode ? [1, 1.25] : [1, 2];

  return (
    <div
      className="absolute inset-0 translate-y-[3cm]"
      style={{ touchAction: 'pan-y' }}
    >
      <Canvas
        className="!bg-transparent touch-none"
        style={{ background: 'transparent' }}
        camera={{ position: [0, 0.48, 2.02], fov: 36 }}
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
        <OrbitalBackdrop speed={performanceMode ? 0.06 : 0.1} />
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
