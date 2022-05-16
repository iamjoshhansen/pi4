import { readFileSync, existsSync } from 'fs';
import { OutputPin } from '@pi4/gpio';

export class FanCPU {
  public readonly pin: number;
  public maxTemp: number;
  public minTemp: number;

  constructor({
    pin,
    maxTemp = 70,
    minTemp = maxTemp - 10,
  }: {
    pin: number;
    maxTemp?: number;
    minTemp?: number;
  }) {
    this.pin = pin;
    this.maxTemp = maxTemp;
    this.minTemp = minTemp;
  }

  run() {
    const pin = new OutputPin(this.pin);
    pin.write(true);
    console.log(`CPU Fan is running (pin ${this.pin})`);
  }

  get temp(): number {
    const path = '/sys/class/thermal/thermal_zone0/temp';
    if (!existsSync(path)) {
      return;
    }
    const rawTemp = readFileSync(path).toString();
    const temp = parseInt(rawTemp, 10);
    return temp / 1000;
  }
}
