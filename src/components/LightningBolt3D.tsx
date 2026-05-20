import { useLayoutEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { Mesh } from 'three';
import { HERO_LIGHTNING_IMAGE } from '@/models/branding';

interface TexturedBoltProps {
  rotationY: number;
}

/** Plano 3D con la textura exacta de `public/brand/image.png` (no geometría inventada). */
function TexturedBolt({ rotationY }: TexturedBoltProps) {
  const meshRef = useRef<Mesh>(null);
  const smoothY = useRef(0);
  const texture = useTexture(HERO_LIGHTNING_IMAGE);

  useLayoutEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
  }, [texture]);

  useFrame(() => {
    if (!meshRef.current) return;
    smoothY.current = THREE.MathUtils.lerp(smoothY.current, rotationY, 0.1);
    meshRef.current.rotation.y = smoothY.current;
    meshRef.current.rotation.x =
      Math.sin(smoothY.current * 0.35) * 0.08 - 0.04;
  });

  return (
    <mesh ref={meshRef} scale={[1.85, 3.15, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        toneMapped={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export interface LightningBolt3DProps {
  rotationY: number;
  performanceLite?: boolean;
}

export default function LightningBolt3D({
  rotationY,
  performanceLite = false,
}: LightningBolt3DProps) {
  const dpr: [number, number] = performanceLite ? [1, 1.25] : [1, 2];

  return (
    <Canvas
      className="h-full w-full"
      style={{ background: 'transparent' }}
      camera={{ position: [0, 0, 2.4], fov: 42 }}
      dpr={dpr}
      gl={{
        alpha: true,
        antialias: !performanceLite,
        powerPreference: performanceLite ? 'low-power' : 'high-performance',
      }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x000000, 0);
        scene.background = null;
      }}
    >
      <TexturedBolt rotationY={rotationY} />
    </Canvas>
  );
}
