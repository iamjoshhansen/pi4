import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { TimeService } from 'src/app/services/time.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
  second$ = this.timeService.second$;

  currentTemp$ = this.weatherService.currentTemp$.pipe(
    map((temp) => Math.round(temp))
  );

  constructor(
    private weatherService: WeatherService,
    private timeService: TimeService
  ) {}

  ngOnInit(): void {
    //
  }
}
