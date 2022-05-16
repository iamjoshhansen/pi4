import { union } from '../union/union';

export function venDiagram<T>(a: T[] = [], b: T[] = []): [T[], T[], T[]] {
  const safeA = a || [];
  const safeB = b || [];
  const same = union(safeA, safeB);
  const onlyA = new Set<T>(safeA.filter((x) => !safeB.includes(x)));
  const onlyB = new Set<T>(safeB.filter((x) => !safeA.includes(x)));

  return [[...onlyA], same, [...onlyB]];
}
