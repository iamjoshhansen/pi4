export function shortenedNumber(n: number, decimalPlaces = 0): string {
  // 10^x:       0+  3+   6+   9+   12+  15+  18+  21+  24+
  const units = ['', 'K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y'];

  if (n === 0 || n === -Infinity) {
    return n.toFixed(decimalPlaces);
  }

  const int = Math.floor(n);
  const digits = int
    .toString()
    .split('')
    .filter((c) => c !== '-').length;
  const unitIndex = Math.floor((digits - 1) / 3);
  const unit = units[unitIndex];

  const divisor = Math.pow(10, unitIndex * 3);
  const val = int / divisor;

  if (decimalPlaces === 0 || val == Math.floor(val)) {
    const abbr = Math.round(val);
    return `${abbr}${unit}`;
  }

  const valDivisor = Math.pow(10, decimalPlaces);
  const abbr = (Math.round(val * valDivisor) / valDivisor).toString();
  const [abbrInt, abbrDec] = abbr.split('.');

  return `${abbrInt}.${(abbrDec || '').padEnd(decimalPlaces, '0')}${unit}`;
}
