export function zipObject<K extends string, V>(keys: K[], values: V[]) {
  const ret: Record<string, V> = {};
  keys.forEach((key, i) => (ret[key] = values[i]));
  return ret as Record<K, V>;
}
