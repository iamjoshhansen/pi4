import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export enum BookStatus {
  out = 'checked-out',
  available = 'available',
  pendingHold = 'pending',
}

export type BookTitle = string & { __brand: 'BookTitle' };
export type BookSubtitle = string & { __brand: 'Subtitle' };
export type BookDueDate = string & { __brand: 'DueDate' };
export type BookOwner = string & { __brand: 'Owner' };
export type BookBarcode = string & { __brand: 'Barcode' };
export type BookVolume = string & { __brand: 'Volume' };

export interface Book {
  title: BookTitle;
  status: BookStatus;
  subtitles?: BookSubtitle[];
  due?: BookDueDate;
  barcode?: BookBarcode;
  volume?: BookVolume;
}

export type KnownBook = Book & { owner: BookOwner };

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor(private http: HttpClient) {}

  fetch() {
    return this.http.get<KnownBook[]>('http://localhost:3000/');
  }
}
