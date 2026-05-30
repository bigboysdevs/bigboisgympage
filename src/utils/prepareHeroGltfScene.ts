import type { Mesh, Object3D } from 'three';
import { Vector3 } from 'three';

const BACKDROP_NAME = /plane|backdrop|background|card|base|studio|floor|bg|panel|quad/i;

/** Oculta planos de estudio del GLB y deja fondo transparente. */
export function prepareHeroGltfScene(root: Object3D) {
  const size = new Vector3();

  root.traverse((obj) => {
    if (!('isMesh' in obj) || !(obj as Mesh).isMesh) return;

    const mesh = obj as Mesh;

    if (BACKDROP_NAME.test(mesh.name)) {
      mesh.visible = false;
      return;
    }

    mesh.geometry.computeBoundingBox();
    const box = mesh.geometry.boundingBox;
    if (!box) return;

    box.getSize(size);
    const minDim = Math.min(size.x, size.y, size.z);
    const maxDim = Math.max(size.x, size.y, size.z);

    if (minDim < 0.06 && maxDim > 0.45) {
      mesh.visible = false;
    }
  });
}
