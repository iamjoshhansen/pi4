import { Injectable } from '@angular/core';
import { getTimeObservables } from '@pi4/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  public readonly second$: Observable<Date>;
  public readonly minute$: Observable<Date>;
  public readonly hour$: Observable<Date>;
  public readonly date$: Observable<Date>;
  public readonly month$: Observable<Date>;
  public readonly year$: Observable<Date>;
  public readonly ampm$: Observable<'am' | 'pm'>;

  constructor() {
    const { second$, minute$, hour$, date$, month$, year$, ampm$ } =
      getTimeObservables();
    this.second$ = second$;
    this.minute$ = minute$;
    this.hour$ = hour$;
    this.date$ = date$;
    this.month$ = month$;
    this.year$ = year$;
    this.ampm$ = ampm$;
  }
}
