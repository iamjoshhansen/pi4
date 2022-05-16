import { clamp } from '../clamp/clamp';
import { lerp } from '../lerp/lerp';

interface Channels {
  r: number;
  g: number;
  b: number;
  a: number;
}

export class Color {
  private channels: Channels;
  private readonly _source: string | Channels;
  get source() {
    return this._source;
  }

  /** @example rgba(1, 2, 3) */
  get rgb() {
    const { r, g, b } = this.channels;
    return `rgb(${r}, ${g}, ${b})`;
  }

  /** @example rgba(1, 2, 3, 0.5) */
  get rgba() {
    const { r, g, b, a } = this.channels;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  /** @example #112233 */
  get hex() {
    const r = Color.decToHex(this.channels.r);
    const g = Color.decToHex(this.channels.g);
    const b = Color.decToHex(this.channels.b);
    return `#${r}${g}${b}`;
  }

  /** @example #11223399 */
  get hexA() {
    const r = Color.decToHex(this.channels.r);
    const g = Color.decToHex(this.channels.g);
    const b = Color.decToHex(this.channels.b);
    const a = Color.decToHex(this.channels.a * 255);
    return `#${r}${g}${b}${a}`;
  }

  get r(): number {
    return this.channels.r;
  }

  set r(val: string | number) {
    this.channels.r = Color.colorValue(val);
  }

  get g(): number {
    return this.channels.g;
  }
  set g(val: string | number) {
    this.channels.g = Color.colorValue(val);
  }

  get b(): number {
    return this.channels.b;
  }
  set b(val: string | number) {
    this.channels.b = Color.colorValue(val);
  }

  get a(): number {
    return this.channels.a;
  }
  set a(val: string | number) {
    this.channels.a = Math.round(Color.colorValue(val, 1));
  }

  clone() {
    return new Color(this.rgba);
  }

  blendedWith(color: Color, amount = 0.5) {
    return new Color(
      lerp(this.r, color.r, amount),
      lerp(this.g, color.g, amount),
      lerp(this.b, color.b, amount),
      lerp(this.a, color.a, amount),
    );
  }

  static hexToDec(hex: string): number {
    return parseInt(hex, 16);
  }

  static decToHex(val: number): string {
    return val.toString(16).split('.')[0].padStart(2, '0');
  }

  static colorValue(val: string | number, max = 255): number {
    if (typeof val == 'string') {
      return clamp(Color.hexToDec(val.padStart(2, '0')) * (max / 255), 0, max);
    }
    return clamp(val, 0, max);
  }

  /**
   * @param r number: Red [0-255]
   * @param g number: Green [0-255]
   * @param b number: Blue [0-255]
   * @param a number: Alpha [0-1]
   */
  constructor(r: number, g: number, b: number, a?: number);
  /**
   * @param code string: color code
   * @example #09f
   * @example #0099ff
   * @example #0099ff33
   * @example rgb(0,50,100)
   * @example rgba(0,50,100,0.5)
   */
  constructor(code: string);
  constructor(...args: any[]) {
    if (arguments.length === 1) {
      const value: string = args[0];
      this._source = value;

      const style = Color.getCurrentValue(value);
      if (style === '') {
        throw new Error(`Cannot resolve color from '${this.source}'`);
      }
      this.channels = Color.getChannels(style);
    } else {
      this.channels = {
        r: args[0] as number,
        g: args[1] as number,
        b: args[2] as number,
        a: (args[3] ?? 1) as number,
      };
      this._source = JSON.parse(JSON.stringify(this.channels));
    }
  }

  toString() {
    return this.hexA;
  }

  static getCurrentValue(value: string) {
    if (value.startsWith('--')) {
      return getComputedStyle(document.body, null)
        .getPropertyValue(value)
        .trim();
    }

    if (value.startsWith('var(--')) {
      return getComputedStyle(document.body, null)
        .getPropertyValue(value.substring(4, value.length - 1))
        .trim();
    }

    return value;
  }

  static getChannels(value: string): Channels {
    if (value.startsWith('#')) {
      if (value.length === 4) {
        return {
          r: Color.hexToDec(`${value.charAt(1)}${value.charAt(1)}`),
          g: Color.hexToDec(`${value.charAt(2)}${value.charAt(2)}`),
          b: Color.hexToDec(`${value.charAt(3)}${value.charAt(3)}`),
          a: 1,
        };
      }

      if (value.length === 7) {
        return {
          r: Color.hexToDec(`${value.substring(1, 3)}`),
          g: Color.hexToDec(`${value.substring(3, 5)}`),
          b: Color.hexToDec(`${value.substring(5, 7)}`),
          a: 1,
        };
      }

      if (value.length === 9) {
        return {
          r: Color.hexToDec(`${value.substring(1, 3)}`),
          g: Color.hexToDec(`${value.substring(3, 5)}`),
          b: Color.hexToDec(`${value.substring(5, 7)}`),
          a: Color.hexToDec(`${value.substring(7, 9)}`) * (100 / 256),
        };
      }
    }

    if (value.startsWith('rgb')) {
      const [r, g, b, a] = value
        .substring(value.indexOf('(') + 1, value.length - 1)
        .split(',');
      return {
        r: parseInt(r, 10),
        g: parseInt(g, 10),
        b: parseInt(b, 10),
        a: parseFloat(a ?? '1'),
      };
    }

    throw new Error(`Invalid color code: '${value}'`);
  }

  set(
    values: Partial<{
      r: string | number;
      g: string | number;
      b: string | number;
      a: string | number;
    }>,
  ): this {
    if ('r' in values) {
      this.channels.r = Color.colorValue(values.r!);
    }
    if ('g' in values) {
      this.channels.g = Color.colorValue(values.g!);
    }
    if ('b' in values) {
      this.channels.b = Color.colorValue(values.b!);
    }
    if ('a' in values) {
      this.channels.a = Color.colorValue(values.a!, 1);
    }
    return this;
  }
}
