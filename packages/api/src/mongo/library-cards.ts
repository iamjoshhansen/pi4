import { ObjectId } from 'mongodb';
import { dbCollection } from './db';

export type LibraryCardOwner = string & { __brand: 'LibraryCardOwner' };
export type LibraryCardNumber = string & { __brand: 'LibraryCardNumber' };
export type LibraryCardPin = string & { __brand: 'LibraryCardPin' };

export interface LibraryCardRow {
  _id: ObjectId;
  owner: LibraryCardOwner;
  card: LibraryCardNumber;
  pin: LibraryCardPin;
}

export async function getLibraryCardCollection() {
  return await dbCollection<LibraryCardRow>('library-cards');
}
