export function clamp(x: number, max = 1, min = 0) {
  const actualMin = Math.min(min, max);
  const actualMax = Math.max(min, max);
  return Math.min(actualMax, Math.max(actualMin, x));
}
