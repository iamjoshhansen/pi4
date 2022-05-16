import { filterObject } from '../filter-object/filter-object';
import { valueCounts } from '../value-counts/value-counts';

export function getDuplicates<T extends string>(arr: T[]): Record<T, number> {
  const counts = valueCounts(arr);
  return filterObject(counts, ({ val }) => val > 1) as Record<T, number>;
}
