export function mapValues<I, K extends string, O = I>(
  data: Record<K, I>,
  callback: (val: I, key: K) => O,
): Record<K, O> {
  const obj: any = {};
  // @ts-ignore
  Object.keys(data).forEach((key) => (obj[key] = callback(data[key], key)));
  return obj as Record<K, O>;
}
