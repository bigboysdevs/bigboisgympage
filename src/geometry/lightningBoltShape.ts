import * as THREE from 'three';

/** Silueta del rayo de `public/brand/image.png` (vista frontal, Y arriba). */
export function createLightningBoltShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0.48, 1);
  shape.lineTo(0.96, 1);
  shape.lineTo(0.34, 0.7);
  shape.lineTo(0.82, 0.7);
  shape.lineTo(0.18, 0.36);
  shape.lineTo(0.5, 0.36);
  shape.lineTo(0.04, 0.02);
  shape.lineTo(0.26, 0.2);
  shape.lineTo(0.3, 0);
  shape.lineTo(0.48, 0.14);
  shape.lineTo(0.48, 1);
  return shape;
}

export const LIGHTNING_EXTRUDE: THREE.ExtrudeGeometryOptions = {
  depth: 0.2,
  bevelEnabled: true,
  bevelThickness: 0.038,
  bevelSize: 0.038,
  bevelSegments: 2,
  curveSegments: 1,
};
