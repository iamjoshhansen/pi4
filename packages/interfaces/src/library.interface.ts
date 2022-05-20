export type LibraryOwnerId = string & { __brand: 'Library Owner Id' };
export type LibraryItemTitle = string & { __brand: 'Library Item Title' };
export type LibraryItemSubtitle = string & { __brand: 'Library Item Subtitle' };
export type LibraryItemBarcode = string & { __brand: 'Library Item Barcode' };
export type LibraryItemDue = string & { __brand: 'Library Item Due' };
export type LibraryItemVolume = string & { __brand: 'Library Item Volume' };

export enum LibraryItemStatus {
  checkedOut = 'checked-out',
  returned = 'returned',
  available = 'available',
  pendingHold = 'pending',
}

export type LibraryCardNumber = string & { __brand: 'Library Card Number' };
export type LibraryCardPin = string & { __brand: 'Library Card Pin' };
export type LibraryCardName = string & { __brand: 'Library Card Name' };

export interface LibraryItemRow {
  ownerId: LibraryOwnerId;
  title: LibraryItemTitle;
  subtitles: LibraryItemSubtitle[];
  barcode: LibraryItemBarcode;
  status: LibraryItemStatus;
  due: LibraryItemDue;
  volume?: LibraryItemVolume;
}

export interface LibraryCardRow {
  ownerId: LibraryOwnerId;
  card: LibraryCardNumber;
  pin: LibraryCardPin;
  name: LibraryCardName;
}

export interface LibraryItemsApiResponse {
  owners: Record<LibraryOwnerId, LibraryCardName>;
  items: LibraryItemRow[];
}
