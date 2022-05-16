import { venDiagram } from '../ven-diagram/ven-diagram';

export function getListChanges<T>(oldList: T[], newList: T[]) {
  const [removed, unchanged, added] = venDiagram(oldList, newList);
  return { removed, unchanged, added };
}
