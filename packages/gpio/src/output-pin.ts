import { BehaviorSubject } from 'rxjs';
import { Gpio } from './onoff-env';

const pins: OutputPin[] = [];

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

const ONVALUE = 1;

export class OutputPin {
  private pin = new Gpio(this.id, 'out');
  private stateSource = new BehaviorSubject<boolean>(
    this.pin.readSync() === ONVALUE,
  );
  public state$ = this.stateSource.asObservable();

  private accessible = Gpio.accessible;

  constructor(readonly id: number) {
    pins.push(this);
  }

  unexport() {
    this.pin.unexport();
  }

  get state(): boolean {
    return this.stateSource.value;
  }

  set state(val: boolean) {
    this.write(val);
  }

  write(val: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      // console.log(`Writing to pin ${this.id}: ${val}`);
      if (this.accessible) {
        // console.log(`  Accessible!`);
        this.pin.write(val ? 0 : 1, (err: Error) => {
          if (err) {
            // console.log(`  Nope!`);
            // console.log(`  `, err);
            reject(err);
          } else {
            // console.log(`  Done: ${val}`);
            this.stateSource.next(val);
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  async read(): Promise<boolean> {
    return (await this.pin.read()) === 1;
  }
}
