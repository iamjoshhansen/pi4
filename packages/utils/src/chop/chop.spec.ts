import { chop } from './chop';

describe('chop', () => {
  const map: Record<string, string[]> = {
    '1': ['1'],
    '12': ['12'],
    '123': ['123'],
    '1234': ['123', '4'],
    '12345': ['123', '45'],
    '123456': ['123', '456'],
    '1234567': ['123', '456', '7'],
    '12345678': ['123', '456', '78'],
    '123456789': ['123', '456', '789'],
  };

  Object.keys(map).forEach((key) => {
    const expected = map[key];
    it(`"${key}" -> ${JSON.stringify(expected)}`, () => {
      expect(JSON.stringify(chop(key, 3))).toEqual(JSON.stringify(expected));
    });
  });
});
