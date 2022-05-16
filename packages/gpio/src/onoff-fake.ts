import { Gpio as RealGpio, BinaryValue, ValueCallback } from 'onoff';
import { EventEmitter } from 'events';

interface GpioOptions {
  debounceTimeout?: number;
  activeLow?: boolean;
}

type Direction = 'in' | 'out' | 'high' | 'low';
type Edge = 'none' | 'falling' | 'rising' | 'both';

export class GpioFake implements RealGpio {
  private _edge: Edge;
  private emitter = new EventEmitter();

  constructor(
    public gpio: number,
    direction: Direction,
    edge?: Edge,
    options?: GpioOptions,
  ) {
    this.opts = options || {};
    this._edge = edge || 'none';
    this._direction = direction;
  }

  static accessible = true;

  gpioPath = '?';
  opts: GpioOptions;
  readBuffer = Buffer.from('');
  listeners = [];
  private _valueFd: BinaryValue = 0;

  async read(): Promise<BinaryValue> {
    return this.readSync();
  }
  readSync(): BinaryValue {
    return this._valueFd;
  }

  async write(value: BinaryValue): Promise<void> {
    this.writeSync(value);
  }
  writeSync(value: BinaryValue): void {
    let changeDetected = false;
    if (value !== this._valueFd) {
      changeDetected = true;
    }
    this._valueFd = value;
    if (changeDetected) {
      this.emitter.emit('change', [undefined, value]);
    }
  }

  watch(callback: ValueCallback): void {
    this.emitter.on('change', (err: Error, value: BinaryValue) => {
      callback(err, value);
    });
  }

  unwatch(): void {}
  unwatchAll(): void {}

  private _direction: Direction;
  direction(): Direction {
    return this._direction;
  }
  setDirection(value: Direction): void {
    this._direction = value;
  }

  edge(): Edge {
    return this._edge;
  }
  setEdge(value: Edge): void {
    this._edge = value;
  }

  private isActiveLow = false;
  activeLow(): boolean {
    return this.isActiveLow;
  }
  setActiveLow(invert?: boolean): void {
    this.isActiveLow = invert || false;
  }

  options(): GpioOptions {
    return this.opts;
  }

  unexport(): void {}
}
