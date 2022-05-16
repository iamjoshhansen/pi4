export function sum(xs: number[]) {
  return xs.reduce((a: number, c: number) => a + c, 0);
}

export function sumFromProperty<T>(items: T[], key: keyof T): number {
  return items.reduce((a, c) => {
    const val = typeof c[key] === 'number' ? (c[key] as unknown as number) : 0;
    return a + val;
  }, 0);
}

export function sumEach<T>(items: T[], cb: (item: T) => number): number {
  return items.reduce((a, c) => a + cb(c), 0);
}
