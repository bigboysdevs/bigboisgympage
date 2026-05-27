import { HERO_GLTF_URL } from '@/models/branding';

let preloaded = false;

/** MOBILE: precarga el GLB solo cuando el hero usará WebGL (no en modo static). */
export function preloadHeroGltf(url: string = HERO_GLTF_URL) {
  if (preloaded || typeof document === 'undefined') return;
  preloaded = true;

  const existing = document.querySelector(`link[rel="preload"][href="${url}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'fetch';
  link.href = url;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}
