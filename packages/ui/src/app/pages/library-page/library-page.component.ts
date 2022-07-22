import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LibraryItemsApiResponse, LibraryItemStatus } from '@pi4/interfaces';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  Subject,
  takeUntil,
} from 'rxjs';
import { LoadState } from 'src/app/enums/load-state';
import { LibraryItemsService } from 'src/app/services/library-items.service';

@Component({
  selector: 'app-library-page',
  templateUrl: './library-page.component.html',
  styleUrls: ['./library-page.component.scss'],
})
export class LibraryPageComponent implements OnInit, OnDestroy {
  private destroyed = new Subject<void>();
  LoadState = LoadState;

  private readonly loadStateSubject = new BehaviorSubject<LoadState>(
    LoadState.unset
  );
  public readonly loadState$ = this.loadStateSubject.pipe(
    distinctUntilChanged()
  );
  error?: HttpErrorResponse;

  private readonly dataSubject =
    new BehaviorSubject<LibraryItemsApiResponse | null>(null);
  public readonly data$ = this.dataSubject.pipe(
    filter((x) => x !== null),
    distinctUntilChanged()
  ) as unknown as Observable<LibraryItemsApiResponse>;

  checkedOutItems$ = this.data$.pipe(
    map((data) => {
      return {
        ...data,
        items: data.items.filter(
          (item) => item.status === LibraryItemStatus.checkedOut
        ),
      };
    }),
    map((data) => {
      const dates = [...new Set(data.items.map((item) => item.due))].sort();
      return dates.map((due) => ({
        due,
        items: data.items
          .filter((item) => item.due === due)
          // .map((row) => {
          //   const book = copy(row);
          //   delete book.due;
          //   return book;
          // })
          .sort((a, b) =>
            a.title.toLowerCase().localeCompare(b.title.toLowerCase())
          ),
      }));
    })
  );
  checkedOutItemsCount$ = this.checkedOutItems$.pipe(
    map((items) => items?.length || 0)
  );

  constructor(private libraryItemsService: LibraryItemsService) {}

  ngOnInit(): void {
    this.loadStateSubject.next(LoadState.loading);
    this.libraryItemsService
      .fetch()
      .pipe(
        takeUntil(this.destroyed),
        map((data) => ({ error: false, data })),
        catchError((er: HttpErrorResponse) => {
          this.error = er;
          this.loadStateSubject.next(LoadState.error);
          return of({ error: true, data: null });
        })
      )
      .subscribe(({ error, data }) => {
        if (error) {
          return;
        }
        this.dataSubject.next(data);
        this.loadStateSubject.next(LoadState.ready);
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
  }
}
