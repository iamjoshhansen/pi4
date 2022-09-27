import { readFileSync, existsSync } from 'fs';
import { OutputPin } from '@pi4/gpio';

type ChangeCallback = (active: boolean) => void;

export class FanCPU {
  public readonly pin: number;
  public maxTemp: number;
  public minTemp: number;
  private readonly io: OutputPin;

  private callbacks = new Set<ChangeCallback>();

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
    this.io = new OutputPin(this.pin);
  }

  onChange(cb: ChangeCallback) {
    this.callbacks.add(cb);

    return () => {
      this.callbacks.delete(cb);
    };
  }

  run() {
    this.active = false;

    setInterval(() => {
      const temp = this.temp;
      // console.log(`Temp: ${temp}`);
      if (temp > this.maxTemp && !this.active) {
        this.active = true;
        for (const cb of this.callbacks) {
          cb(this.active);
        }
        console.log(`turning fan on`);
      } else if (temp < this.minTemp && this.active) {
        this.active = false;
        for (const cb of this.callbacks) {
          cb(this.active);
        }
        console.log(`turning fan off`);
      }
    }, 1000);
  }

  private set active(val: boolean) {
    this.io.write(val);
  }
  private get active() {
    return this.io.state;
  }

  get isActive() {
    return this.active;
  }

  get temp(): number {
    const path = '/sys/class/thermal/thermal_zone0/temp';
    if (!existsSync(path)) {
      return 30 + ((Math.sin(new Date().getTime() / (1000 * 5)) + 1) / 2) * 50;
    }
    const rawTemp = readFileSync(path).toString();
    const temp = parseInt(rawTemp, 10);
    return temp / 1000;
  }
}
