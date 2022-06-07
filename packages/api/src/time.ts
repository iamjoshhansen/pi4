import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';

function nearestSecondDate() {
  return new Date(Math.round(new Date().getTime() / 1000) * 1000);
}

const secondSubject = new BehaviorSubject<Date>(nearestSecondDate());
export const second$ = secondSubject.asObservable();

async function updateSecond() {
  const timeUntilNextSecond = 1000 - (new Date().getTime() % 1000);
  await new Promise(resolve => setTimeout(resolve, timeUntilNextSecond));
  secondSubject.next(nearestSecondDate());
  setTimeout(() => updateSecond(), 0);
}
updateSecond();

export const minute$ = second$.pipe(
  map(
    date =>
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        0,
        0,
      ),
  ),
  distinctUntilChanged((a, b) => a.getTime() === b.getTime()),
);

export const hour$ = second$.pipe(
  map(
    date =>
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        0,
        0,
        0,
      ),
  ),
  distinctUntilChanged((a, b) => a.getTime() === b.getTime()),
);
