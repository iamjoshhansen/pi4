import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import {
  BooksService,
  BookSubtitle,
  BookTitle,
  KnownBook,
} from 'src/app/services/books.service';
import { copy } from '@pi4/utils';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  private destroyed = new Subject<void>();
  LoadState = LoadState;

  private readonly loadStateSubject = new BehaviorSubject<LoadState>(
    LoadState.unset
  );
  public readonly loadState$ = this.loadStateSubject.pipe(
    distinctUntilChanged()
  );
  error?: HttpErrorResponse;

  private readonly dataSubject = new BehaviorSubject<KnownBook[] | null>(null);
  public readonly data$ = this.dataSubject.pipe(
    filter((x) => x !== null),
    distinctUntilChanged()
  ) as unknown as Observable<KnownBook[]>;

  checkedOutItems$ = this.data$.pipe(
    // map((items) => items.filter((item) => item.status === BookStatus.out))
    map((items) => {
      const dates = [...new Set(items.map((item) => item.due))].sort();
      return dates.map((due) => ({
        due,
        items: items
          .filter((item) => item.due === due)
          .map((item) => {
            const book = copy(item);
            delete book.due;
            return book;
          })
          .sort((a, b) =>
            a.title.toLowerCase().localeCompare(b.title.toLowerCase())
          ),
      }));
    })
  );
  checkedOutItemsCount$ = this.checkedOutItems$.pipe(
    map((items) => items?.length || 0)
  );

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.loadStateSubject.next(LoadState.loading);
    this.booksService
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
