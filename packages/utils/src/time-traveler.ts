export type Y = number & { __brand: 'Year' };
export type M = number & { __brand: 'Month' };
export type D = number & { __brand: 'Day' };
export type Q = number & { __brand: 'Quarter' };

export abstract class TimeTraveler<T> {
  abstract format(format: string): string;

  abstract equals(target: T | string | Date): boolean;

  abstract toString(): string;

  abstract prev(count?: number): T;

  abstract next(count?: number): T;
}
