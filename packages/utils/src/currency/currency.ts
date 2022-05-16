import { commas } from '../commas/commas';

export function currency(amount: number): string {
  const [intStr, dec] = amount.toFixed(2).split('.');
  const int = parseInt(intStr, 10);
  return `$${commas(int)}.${dec}`;
}
