import { Injectable } from '@angular/core';
import { CurrentWeatherResponse, SocketIoEvent } from '@pi4/interfaces';
import { Socket } from 'ngx-socket-io';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  Observable,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly currentWeatherSubject = new BehaviorSubject<
    CurrentWeatherResponse | undefined
  >(undefined);
  public readonly currentWeather$ = this.currentWeatherSubject.pipe(
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    filter((x) => typeof x !== 'undefined')
  ) as Observable<CurrentWeatherResponse>;
  get currentWeather() {
    return this.currentWeatherSubject.value;
  }

  public readonly currentTemp$ = this.currentWeather$.pipe(
    map((weather) => weather.main.temp)
  );

  constructor(private socket: Socket) {
    socket.on(
      SocketIoEvent.updateCurrentWeather,
      (weather: CurrentWeatherResponse) => {
        this.currentWeatherSubject.next(weather);
      }
    );

    socket.emit('get-weather:current', (weather: CurrentWeatherResponse) => {
      this.currentWeatherSubject.next(weather);
    });
  }
}
