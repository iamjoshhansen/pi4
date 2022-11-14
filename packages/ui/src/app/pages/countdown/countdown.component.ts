import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, interval, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit, OnDestroy {
  private destroyed = new Subject<void>();

  private readonly dayCountSubject = new BehaviorSubject<string>('');
  public readonly dayCount$ = this.dayCountSubject.pipe(distinctUntilChanged());

  private readonly hhSubject = new BehaviorSubject<string>('');
  public readonly hh$ = this.hhSubject.pipe(distinctUntilChanged());

  private readonly mmSubject = new BehaviorSubject<string>('');
  public readonly mm$ = this.mmSubject.pipe(distinctUntilChanged());

  private readonly ssSubject = new BehaviorSubject<string>('');
  public readonly ss$ = this.ssSubject.pipe(distinctUntilChanged());

  arrival = new Date('December 7, 2022 7:00 am MST');

  ngOnInit(): void {
    this.update();

    interval(1000)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => this.update());
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  update() {
    const now = new Date();
    const eta = Math.max(0, (this.arrival.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const days = Math.floor(eta);
    const hours = (eta - days) * 24;
    const minutes = (hours - Math.floor(hours)) * 60;
    const seconds = (minutes - Math.floor(minutes)) * 60;
    const hh = Math.floor(hours)
      .toString()
      .padStart(2, '0');
    const mm = Math.floor(minutes)
      .toString()
      .padStart(2, '0');
    const ss = Math.floor(seconds)
      .toString()
      .padStart(2, '0');
    this.dayCountSubject.next(days.toString());
    // this.timeSubject.next(`${hh}:${mm}:${ss}`);
    this.hhSubject.next(hh);
    this.mmSubject.next(mm);
    this.ssSubject.next(ss);
  }
}
