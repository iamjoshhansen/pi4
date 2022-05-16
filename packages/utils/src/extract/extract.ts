export function extract<T, K extends keyof T>(obj: T, key: K): T[K] {
  const value = obj[key];
  delete obj[key];
  return value;
}
