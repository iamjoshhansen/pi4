import { execGenerator } from '../exec-generator/exec-generator';

export function chop(str: string, size: number) {
  const re = new RegExp('.{1,' + size + '}', 'g');
  const results = execGenerator(re, str);
  return [...results];
}
