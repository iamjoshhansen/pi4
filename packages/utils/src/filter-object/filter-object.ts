type CallbackParams<V> = { val: V; key: string };

export function filterObject<V, T = Record<string, V>>(
  data: Record<string, V>,
  callback: (params: CallbackParams<V>) => boolean,
): Partial<T> {
  const obj: Partial<T> = {};
  Object.keys(data).forEach((key) => {
    // @ts-ignore
    const val = data[key];
    const keep = callback({ val, key });
    if (keep) {
      // @ts-ignore
      obj[key] = val;
    }
  });
  return obj;
}
