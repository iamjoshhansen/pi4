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

  constructor() {
    const { second$, minute$, hour$ } = getTimeObservables();
    this.second$ = second$;
    this.minute$ = minute$;
    this.hour$ = hour$;
  }
}
