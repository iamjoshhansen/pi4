export function unique<T extends string | number | boolean>(items: T[]): T[] {
  return [...new Set(items)];
}
