export function round(value: number, decimal = 0): number {
  return Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

export function roundToString(value: number, decimal = 0): string {
  const rounded = round(value, decimal).toString();
  if (decimal === 0) {
    return rounded;
  }
  const [int, dec] = rounded.split('.');
  return `${int}.${(dec ?? '').padEnd(decimal, '0')}`;
}
