/** Layout constants for hero 3D figure — separated so HeroLogo3D can lazy-load without pulling Three.js. */

export const HERO_FIGURE_RAISE = '16cm';

/** ~16cm en pantalla (empírico a fov/distancia del hero). */
export const HERO_FIGURE_SCREEN_RAISE = 0.29;

const HERO_FIGURE_SCREEN_OFFSET_BASE = 0.52;

export const HERO_FIGURE_SCREEN_OFFSET =
  HERO_FIGURE_SCREEN_OFFSET_BASE - HERO_FIGURE_SCREEN_RAISE;

export const FIGURE_SCREEN_OFFSET_PUSH_MOBILE = 0.11;

/** Encuadre compacto del GLB sobre el video del hero (sin pan lateral). */
export const HERO_VIDEO_FIGURE_SCREEN_OFFSET = 0;
