import { BehaviorSubject } from 'rxjs';
import { Gpio } from './onoff-env';
import { Gpio as GpioType, BinaryValue } from 'onoff';

const pins: InputPin[] = [];

process.on('SIGINT', () => {
  pins.forEach(pin => {
    console.log({
      msg: `unexporting pin`,
      pin: pin.id,
    });
    pin.unexport();
    process.exit(0);
  });
});

const ONVALUE: BinaryValue = 1;

export class InputPin {
  private pin: GpioType = new Gpio(this.id, 'in', 'both');
  private stateSource = new BehaviorSubject<boolean>(
    this.pin.readSync() === ONVALUE,
  );
  public state$ = this.stateSource.asObservable();

  constructor(readonly id: number, initialValue = false) {
    if (typeof initialValue !== 'undefined') {
      this.stateSource.next(initialValue);
    }
    this.pin.watch((err, val) => {
      if (err) {
        console.error(err);
      } else {
        const state = val === ONVALUE;
        if (this.stateSource.value !== state) {
          this.stateSource.next(state);
        }
      }
    });

    pins.push(this);
  }

  unexport() {
    this.pin.unexport();
  }

  get state(): boolean {
    return this.stateSource.value;
  }

  async read(): Promise<boolean> {
    return (await this.pin.read()) === 1;
  }

  fakeWrite(state: boolean) {
    this.stateSource.next(state);
  }
}
