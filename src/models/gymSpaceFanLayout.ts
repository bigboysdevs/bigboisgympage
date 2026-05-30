/** Posiciones del abanico (7 tarjetas) — calibradas al layout de referencia. */
export type FanCardPose = {
  rotate: number;
  x: number;
  y: number;
  scale: number;
  zIndex: number;
};

export const FAN_POSES_7: FanCardPose[] = [
  { rotate: -34, x: 10, y: 58, scale: 0.88, zIndex: 1 },
  { rotate: -22, x: 6, y: 38, scale: 0.93, zIndex: 2 },
  { rotate: -11, x: 3, y: 18, scale: 0.98, zIndex: 4 },
  { rotate: 0, x: 0, y: 0, scale: 1.14, zIndex: 7 },
  { rotate: 11, x: -3, y: 18, scale: 0.98, zIndex: 4 },
  { rotate: 22, x: -6, y: 38, scale: 0.93, zIndex: 2 },
  { rotate: 34, x: -10, y: 58, scale: 0.88, zIndex: 1 },
];

export const FAN_ACTIVE_POSE: FanCardPose = {
  rotate: 0,
  x: 0,
  y: -44,
  scale: 1.2,
  zIndex: 50,
};

export function getFanPose(index: number, total: number, isActive: boolean): FanCardPose {
  if (isActive) return FAN_ACTIVE_POSE;

  if (total === 7 && FAN_POSES_7[index]) {
    return FAN_POSES_7[index];
  }

  const center = (total - 1) / 2;
  const offset = index - center;
  const t = center > 0 ? Math.abs(offset) / center : 0;

  return {
    rotate: offset * (34 / Math.max(center, 1)),
    x: -offset * 4,
    y: t * 72,
    scale: 1.06 - t * 0.26,
    zIndex: Math.max(1, Math.round(total - Math.abs(offset))),
  };
}
