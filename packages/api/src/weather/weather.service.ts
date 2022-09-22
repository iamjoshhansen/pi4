const fetch = require('node-fetch');
import { queryParams } from '@pi4/utils';

export class WeatherService {
  private readonly api: string;
  private readonly key: string;

  constructor(config: { api: string; key: string }) {
    this.api = config.api;
    this.key = config.key;
  }

  async getCurrentWeather({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) {
    const endpoint = `${this.api}/weather${queryParams({
      appid: this.key,
      lat: latitude,
      lon: longitude,
      lang: 'json',
      units: 'imperial',
    })}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  }
}
