export function valueCounts<T extends string>(arr: T[]) {
  const counts: any = {};
  arr.forEach((val) => (counts[val] = (counts[val] ?? 0) + 1));
  return counts as Record<T, number>;
}
