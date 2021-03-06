import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LibraryItemsApiResponse } from '@pi4/interfaces';
import { environment } from 'src/environments/environment';
import { apiPrefix } from './api-prefix';

@Injectable({
  providedIn: 'root',
})
export class LibraryItemsService {
  constructor(private http: HttpClient) {}

  fetch() {
    return this.http.get<LibraryItemsApiResponse>(`${apiPrefix}/library/items`);
  }
}
