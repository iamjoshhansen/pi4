import { Express, Request, Response } from 'express';
import { getLibraryCardCollection } from '../mongo/library-cards';
import { getLibraryItemCollection } from '../mongo/library-items';
import { LibraryCardName, LibraryOwnerId } from '@pi4/interfaces';
import { runLibraryItemDataload } from './library-item-dataload';

const prefix = 'library';

export function initLibrary(app: Express) {
  console.log(`Initializing Library`);

  app.get(`/${prefix}/items`, async (req: Request, res: Response) => {
    // clear all
    // await Promise.all(caches.map(cache => cache.clear()));

    // await new Promise(resolve => setTimeout(resolve, 2000));

    // res.statusCode = 400;
    // res.send(null);

    // read all

    const ownerIds = new Set<LibraryOwnerId>();
    const libraryItemCollection = await getLibraryItemCollection();
    const libraryCardCollection = await getLibraryCardCollection();

    const itemCursor = await libraryItemCollection.find({});

    const items = await itemCursor.toArray();

    items.forEach(item => ownerIds.add(item.ownerId));
    const owners: Record<LibraryOwnerId, LibraryCardName> = {};
    for (const ownerId of ownerIds) {
      const card = await libraryCardCollection.findOne({ ownerId });
      if (card) {
        const name = card.name;
        owners[ownerId] = name;
      }
    }

    res.json({ owners, items });
  });

  void runLibraryItemDataload();
  setInterval(() => {
    void runLibraryItemDataload();
  }, 1000 * 60 * 60);
}
