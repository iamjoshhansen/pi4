import { Component, OnInit } from '@angular/core';
import { second$ } from '@pi4/utils';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
  private readonly timeSubject = new BehaviorSubject<number>(0);
  public readonly time$ = this.timeSubject.pipe(distinctUntilChanged());

  constructor() {}

  ngOnInit(): void {
    second$.subscribe((second) => this.timeSubject.next(second.getTime()));
  }
}
