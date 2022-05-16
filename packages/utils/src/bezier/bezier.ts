export interface Point {
  x: number;
  y: number;
}

export function bezier(
  t: number,
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
): Point {
  const cX = 3 * (p1.x - p0.x);
  const bX = 3 * (p2.x - p1.x) - cX;
  const aX = p3.x - p0.x - cX - bX;

  const cY = 3 * (p1.y - p0.y);
  const bY = 3 * (p2.y - p1.y) - cY;
  const aY = p3.y - p0.y - cY - bY;

  const x = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0.x;
  const y = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + p0.y;

  return { x, y };
}

export function cubicBezier(
  t: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): Point {
  return bezier(
    t,
    { x: 0, y: 0 },
    { x: x1, y: y1 },
    { x: x2, y: y2 },
    { x: 1, y: 1 },
  );
}

export function cubicBezierTimingCurve(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): (x: number) => number {
  return (t: number): number => cubicBezier(t, x1, y1, x2, y2).y;
}
