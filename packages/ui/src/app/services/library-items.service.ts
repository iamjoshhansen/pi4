import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LibraryItemsApiResponse } from '@pi4/interfaces';

@Injectable({
  providedIn: 'root',
})
export class LibraryItemsService {
  constructor(private http: HttpClient) {}

  fetch() {
    return this.http.get<LibraryItemsApiResponse>(
      'http://localhost:3000/library/items'
    );
  }
}
