import { clamp } from './clamp';

function ascending(a: string, b: string) {
  return a < b ? -1 : 1;
}

describe('clamp', () => {
  describe('defaults boundaries to 0 and 1', () => {
    const tests = {
      '-1': 0,
      '-0.5': 0,
      '0': 0,
      '0.5': 0.5,
      '1': 1,
      '1.5': 1,
    };

    Object.keys(tests)
      .sort(ascending)
      .forEach((key) => {
        const input = parseFloat(key);
        it(`${input}`, () => {
          expect(clamp(input)).toEqual(tests[key]);
        });
      });
  });

  describe('defaults lower boundary to 0', () => {
    describe('single boundary (positive)', () => {
      const tests = {
        '-1': 0,
        '-0.5': 0,
        '0': 0,
        '0.5': 0.5,
        '1': 1,
        '1.5': 1.5,
        '7': 7,
        '7.5': 7,
        '8': 7,
      };

      Object.keys(tests)
        .sort(ascending)
        .forEach((key) => {
          const input = parseFloat(key);
          it(`${input}`, () => {
            expect(clamp(input, 7)).toEqual(tests[key]);
          });
        });
    });

    describe('single boundary (negative)', () => {
      const tests = {
        '-9': -7,
        '-7': -7,
        '-5': -5,
        '-1': -1,
        '-0.5': -0.5,
        '0': 0,
        '0.5': 0,
        '1': 0,
        '1.5': 0,
        '7': 0,
      };

      Object.keys(tests)
        .sort(ascending)
        .forEach((key) => {
          const input = parseFloat(key);
          it(`${input}`, () => {
            expect(clamp(input, -7)).toEqual(tests[key]);
          });
        });
    });
  });

  describe('both boundaries set', () => {
    describe('in normal order', () => {
      const tests = {
        '-1': 5,
        '0': 5,
        '1': 5,
        '5': 5,
        '6': 6,
        '9': 9,
        '10': 10,
        '11': 10,
        '12': 10,
      };

      Object.keys(tests)
        .sort(ascending)
        .forEach((key) => {
          const input = parseFloat(key);
          it(`${input}`, () => {
            expect(clamp(input, 5, 10)).toEqual(tests[key]);
          });
        });
    });

    describe('in reverse order', () => {
      const tests = {
        '-1': 5,
        '0': 5,
        '1': 5,
        '5': 5,
        '6': 6,
        '9': 9,
        '10': 10,
        '11': 10,
        '12': 10,
      };

      Object.keys(tests)
        .sort(ascending)
        .forEach((key) => {
          const input = parseFloat(key);
          it(`${input}`, () => {
            expect(clamp(input, 10, 5)).toEqual(tests[key]);
          });
        });
    });

    describe('neg/pos mix', () => {
      const tests = {
        '-2': -1,
        '-1.5': -1,
        '-1': -1,
        '-0.5': -0.5,
        '0': 0,
        '0.5': 0.5,
        '1': 1,
        '1.5': 1,
        '2': 1,
      };

      Object.keys(tests)
        .sort(ascending)
        .forEach((key) => {
          const input = parseFloat(key);
          it(`${input}`, () => {
            expect(clamp(input, -1, 1)).toEqual(tests[key]);
          });
        });
    });

    describe('neg/pos mix (reversed)', () => {
      const tests = {
        '-2': -1,
        '-1.5': -1,
        '-1': -1,
        '-0.5': -0.5,
        '0': 0,
        '0.5': 0.5,
        '1': 1,
        '1.5': 1,
        '2': 1,
      };

      Object.keys(tests)
        .sort(ascending)
        .forEach((key) => {
          const input = parseFloat(key);
          it(`${input}`, () => {
            expect(clamp(input, 1, -1)).toEqual(tests[key]);
          });
        });
    });

    describe('all negative', () => {
      const tests = {
        '-3': -2,
        '-2.5': -2,
        '-2': -2,
        '-1.5': -1.5,
        '-1': -1,
        '-0.5': -1,
        '0': -1,
        '0.5': -1,
        '1': -1,
        '1.5': -1,
        '2': -1,
      };

      Object.keys(tests)
        .sort(ascending)
        .forEach((key) => {
          const input = parseFloat(key);
          it(`${input}`, () => {
            expect(clamp(input, -1, -2)).toEqual(tests[key]);
          });
        });
    });

    describe('floating point', () => {
      const tests = {
        '0.0': 0.25,
        '0.1': 0.25,
        '0.2': 0.25,
        '0.3': 0.3,
        '0.4': 0.4,
        '0.5': 0.5,
        '0.6': 0.6,
        '0.7': 0.7,
        '0.8': 0.75,
        '0.9': 0.75,
        '1.0': 0.75,
      };

      Object.keys(tests)
        .sort(ascending)
        .forEach((key) => {
          const input = parseFloat(key);
          it(`${input}`, () => {
            expect(clamp(input, 0.25, 0.75)).toEqual(tests[key]);
          });
        });
    });
  });
});
