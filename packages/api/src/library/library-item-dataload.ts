import {
  LibraryItemBarcode,
  LibraryItemRow,
  LibraryItemStatus,
} from '@pi4/interfaces';
import { getBooks } from '../get-books';
import { getLibraryCardCollection } from '../mongo/db';
import { getLibraryItemCollection } from '../mongo/library-items';

export async function runLibraryItemDataload() {
  const libraryCardCollection = await getLibraryCardCollection();
  const libraryItemCollection = await getLibraryItemCollection();

  console.log(``);
  console.log(`# Library Items`);

  for await (const { card, pin, ownerId, name } of libraryCardCollection.find(
    {},
  )) {
    const returnedItems = await libraryItemCollection
      .find({ ownerId, status: LibraryItemStatus.checkedOut })
      .toArray();
    const returnedItemBarcodes = new Map<LibraryItemBarcode, LibraryItemRow>(
      returnedItems.map(item => [item.barcode, item]),
    );

    console.log(``);
    console.log(`## ${name}`);
    const activeItems = await getBooks(card, pin);
    for (const { barcode, title, subtitles, due, volume } of activeItems) {
      if (returnedItemBarcodes.has(barcode)) {
        // this is *still* active
        await libraryItemCollection.findOneAndUpdate(
          { ownerId, barcode },
          {
            $set: {
              title,
              subtitles,
              due,
              volume,
            },
          },
        );
        returnedItemBarcodes.delete(barcode);
        console.log(`  – ${title}`);
      } else {
        // this is a new item
        await libraryItemCollection.insertOne({
          ownerId,
          title,
          subtitles,
          barcode,
          status: LibraryItemStatus.checkedOut,
          due,
          volume,
        });
        console.log(`  ⇢ ${title}`);
      }
    }

    for (const [barcode, { title }] of returnedItemBarcodes) {
      await libraryItemCollection.findOneAndUpdate(
        { ownerId, barcode },
        {
          $set: {
            status: LibraryItemStatus.returned,
          },
        },
      );
      console.log(`  ⏎ ${title}`);
    }
  }

  console.log(``);
  console.log(`..done loading library items`);
}
