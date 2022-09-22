import { latitude, longitude } from '@pi4/env';
import { CurrentWeatherResponse, SocketIoEvent } from '@pi4/interfaces';
import { BehaviorSubject, filter, interval, map, Observable } from 'rxjs';
import { Server, Socket } from 'socket.io';

import { WeatherService } from './weather.service';

// const YAML = require('json-to-pretty-yaml');

export class WeatherApp {
  private readonly api: string;
  private readonly key: string;
  private readonly io: Server;
  private readonly service: WeatherService;
  private readonly currentWeatherSubject = new BehaviorSubject<
    CurrentWeatherResponse | undefined
  >(undefined);
  public readonly currentWeather$ = this.currentWeatherSubject.pipe(
    // distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    filter(x => typeof x !== 'undefined'),
  ) as Observable<CurrentWeatherResponse>;
  get currentWeather() {
    return this.currentWeatherSubject.value;
  }

  public readonly currentTemp$ = this.currentWeather$.pipe(
    map(weather => weather.main.temp),
  );

  constructor(config: { io: Server; api: string; key: string }) {
    this.api = config.api;
    this.key = config.key;
    this.io = config.io;
    this.service = new WeatherService({ api: this.api, key: this.key });
  }

  async init() {
    // get weather now
    this.updateCurrentWeather();

    // get weather every 30 seconds
    interval(30 * 1000).subscribe(() => this.updateCurrentWeather());

    // listen for requests
    this.io.on('connection', (socket: Socket) => {
      socket.on(`get-weather:current`, async (cb: (weather: any) => void) => {
        if (!this.currentWeather) {
          await this.updateCurrentWeather();
        }
        cb(this.currentWeather);
      });
    });

    this.currentWeather$.subscribe(weather => {
      this.io.emit(SocketIoEvent.updateCurrentWeather, weather);
    });
  }

  async updateCurrentWeather() {
    const weather = await this.service.getCurrentWeather({
      latitude,
      longitude,
    });
    this.currentWeatherSubject.next(weather);
  }

  // async test() {
  //   const weather = await this.service.getCurrentWeather({
  //     latitude,
  //     longitude,
  //   });
  //   console.log(YAML.stringify(weather));
  // }
}
