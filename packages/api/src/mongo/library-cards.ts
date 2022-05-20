import { LibraryCardRow } from '@pi4/interfaces';

import { dbCollection } from './db';

export async function getLibraryCardCollection() {
  return await dbCollection<LibraryCardRow>('library-cards');
}
