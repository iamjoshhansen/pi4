export function sortBy<T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  reverse = false,
) {
  return array.sort((a, b): number => {
    if (typeof a[key] === 'string') {
      return a[key].localeCompare(b[key]) * (reverse ? -1 : 1);
    }

    return a[key] === b[key]
      ? 0
      : a[key] < b[key]
      ? reverse
        ? 1
        : -1
      : reverse
      ? -1
      : 1;
  });
}
