import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, Center, OrbitControls, Resize, useGLTF } from '@react-three/drei';
import { HERO_GLTF_URL } from '../models/branding';

interface ModelProps {
  url: string;
  performanceMode: boolean;
}

function FigureModel({ url, performanceMode }: ModelProps) {
  const { scene } = useGLTF(url);

  return (
    <>
      <Bounds fit clip observe margin={1.45} maxDuration={0.35}>
        <Center>
          <Resize>
            <primitive object={scene} />
          </Resize>
        </Center>
      </Bounds>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate
        autoRotateSpeed={performanceMode ? 0.28 : 0.48}
        minPolarAngle={Math.PI * 0.22}
        maxPolarAngle={Math.PI * 0.78}
        minDistance={1.6}
        maxDistance={12}
      />
    </>
  );
}

export interface HeroLogo3DProps {
  modelUrl?: string;
  performanceMode: boolean;
}

/** Solo el modelo: canvas transparente, sin caja ni fondo. */
export default function HeroLogo3D({
  modelUrl = HERO_GLTF_URL,
  performanceMode,
}: HeroLogo3DProps) {
  const dpr: [number, number] = performanceMode ? [1, 1.25] : [1, 2];

  return (
    <div className="absolute inset-0">
      <Canvas
        className="!bg-transparent touch-none"
        style={{ background: 'transparent' }}
        camera={{ position: [0, 0.12, 4.25], fov: 42 }}
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
        <ambientLight intensity={0.58} />
        <directionalLight position={[6, 8, 5]} intensity={1.15} />
        <directionalLight position={[-5, 2, -4]} intensity={0.4} />
        <Suspense fallback={null}>
          <FigureModel url={modelUrl} performanceMode={performanceMode} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(HERO_GLTF_URL);
