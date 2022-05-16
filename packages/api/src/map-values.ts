export function mapValues<I, O = I>(
  data: Record<string, I>,
  callback: (val: I, key: string) => O,
): Record<string, O> {
  const obj: Record<string, O> = {};
  Object.keys(data).forEach(key => (obj[key] = callback(data[key], key)));
  return obj;
}
