import { Component, OnInit } from '@angular/core';
import { map, of } from 'rxjs';
import { TimeService } from 'src/app/services/time.service';
import { WakeLockService } from 'src/app/services/wake-lock.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
  second$ = this.timeService.second$;
  date$ = this.timeService.date$;
  month$ = this.timeService.month$;
  year$ = this.timeService.year$;
  ampm$ = this.timeService.ampm$;

  currentTemp$ = this.weatherService.currentTemp$.pipe(
    map((temp) => Math.round(temp))
  );

  static id = 0;

  private id: number;

  awake$ = this.wakeLockService.active$;

  constructor(
    private weatherService: WeatherService,
    private timeService: TimeService,
    private wakeLockService: WakeLockService
  ) {
    this.id = DashboardPageComponent.id++;
  }

  ngOnInit(): void {
    this.stayAwake();
  }

  ngOnDestroy() {
    this.allowSleep();
  }

  stayAwake() {
    this.wakeLockService.addReason(`dashboard-${this.id}`);
  }

  allowSleep() {
    this.wakeLockService.removeReason(`dashboard-${this.id}`);
  }
}
