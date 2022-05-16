export function lerp(start: number, end: number, percent: number) {
  return start + (end - start) * percent;
}
