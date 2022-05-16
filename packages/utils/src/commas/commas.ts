import { reverse } from '../reverse/reverse';
import { chop } from '../chop/chop';

export function commas(x: number): string {
  const sign = x < 0 ? '-' : '';
  const absString = `${Math.abs(x)}`;
  const hasDec = absString.includes('.');
  const [intString, decString] = absString.split('.');
  const revIntString = reverse(intString);
  const choppedRevInt = chop(revIntString, 3);
  const revIntStringWithCommas = choppedRevInt.join(',');
  const intStringWithCommas = reverse(revIntStringWithCommas);
  const dec = `.${decString}`;
  return `${sign}${intStringWithCommas}${hasDec ? dec : ''}`;
}
