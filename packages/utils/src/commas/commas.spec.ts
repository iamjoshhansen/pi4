import { commas } from './commas';

describe('commas', () => {
  it(`0 -> 0`, () => {
    expect(commas(0)).toEqual('0');
  });

  const map: Record<string, string> = {
    '1': '1',
    '12': '12',
    '123': '123',
    '1234': '1,234',
    '12345': '12,345',
    '123456': '123,456',
    '1234567': '1,234,567',
    '12345678': '12,345,678',
    '123456789': '123,456,789',

    '12345678.9': '12,345,678.9',
    '1234567.89': '1,234,567.89',
    '123456.789': '123,456.789',
    '12345.6789': '12,345.6789',
    '1234.56789': '1,234.56789',
    '123.456789': '123.456789',
    '12.3456789': '12.3456789',
    '1.23456789': '1.23456789',
    '.123456789': '0.123456789',

    '123456789123456789123456789': '1.2345678912345679e+26',
  };
  const maxKeyLength = Math.max(...Object.keys(map).map(key => key.length));

  describe('positive', () => {
    Object.keys(map).forEach(key => {
      const input = parseFloat(key);
      const expected = map[key];
      it(`${key.padStart(maxKeyLength)} -> ${expected}`, () => {
        expect(commas(input)).toEqual(expected);
      });
    });
  });

  describe('negative', () => {
    Object.keys(map).forEach(key => {
      const input = -parseFloat(key);
      const expected = `-${map[key]}`;
      it(`${`-${key}`.padStart(maxKeyLength + 1)} -> ${expected}`, () => {
        expect(commas(input)).toEqual(expected);
      });
    });
  });
});
