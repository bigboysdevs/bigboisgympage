/** Bucle para el arrastre (rango [-loopWidth, 0)). */
export function wrapMarqueeOffset(offset: number, loopWidth: number): number {
  if (loopWidth <= 0 || !Number.isFinite(offset)) return 0;
  let mod = offset % loopWidth;
  if (mod > 0) mod -= loopWidth;
  return mod;
}

export function normalizeDragOffset(offset: number, loopWidth: number): number {
  if (loopWidth <= 0) return 0;
  let mod = offset % loopWidth;
  if (mod > loopWidth / 2) mod -= loopWidth;
  if (mod < -loopWidth / 2) mod += loopWidth;
  return mod;
}
