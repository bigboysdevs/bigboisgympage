/** MOBILE: rutas de imagen responsive (logo + galería 640w) sin afectar desktop ≥1024px. */

const MOBILE_MAX_PX = 1023;

export function encodeAssetPath(path: string): string {
  const slash = path.lastIndexOf('/');
  if (slash === -1) return encodeURIComponent(decodeURIComponent(path));
  const dir = path.slice(0, slash + 1);
  const file = path.slice(slash + 1);
  return `${dir}${encodeURIComponent(decodeURIComponent(file))}`;
}

export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(`(max-width: ${MOBILE_MAX_PX}px)`).matches;
}

export function galleryImageSrcSet(path: string): string {
  const file = path.split('/').pop();
  if (!file) return encodeAssetPath(path);
  const mobile = encodeAssetPath(`/gallery/mobile/${file}`);
  const full = encodeAssetPath(path);
  return `${mobile} 640w, ${full} 1280w`;
}

export const GALLERY_IMG_SIZES = '(max-width: 1023px) 72vw, (max-width: 640px) 55vw, 360px';

export const NAV_LOGO_SRCSET = `${encodeAssetPath('/big-boys-gym-logo-transparent-mobile.png')} 240w, ${encodeAssetPath('/big-boys-gym-logo-transparent.png')} 876w`;

export const NAV_LOGO_SIZES = '(max-width: 1023px) 120px, 200px';

export const HERO_FALLBACK_SIZES = '(max-width: 1023px) 80vw, 50vw';
