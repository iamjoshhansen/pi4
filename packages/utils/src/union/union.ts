export function union<T>(a: T[], b: T[]): T[] {
  const u: T[] = [];
  a.forEach((aItem) => {
    if (b.includes(aItem)) {
      u.push(aItem);
    }
  });
  return u;
}
