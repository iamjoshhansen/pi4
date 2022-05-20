import { LibraryItemRow } from '@pi4/interfaces';

import { dbCollection } from './db';

export async function getLibraryItemCollection() {
  return await dbCollection<LibraryItemRow>('library-items');
}
