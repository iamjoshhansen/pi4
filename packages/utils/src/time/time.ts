import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';

function nearestSecondDate() {
  return new Date(Math.round(new Date().getTime() / 1000) * 1000);
}

export function getTimeObservables() {
  const secondSubject = new BehaviorSubject<Date>(nearestSecondDate());
  const second$ = secondSubject.asObservable();

  const minute$ = second$.pipe(
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

  const hour$ = second$.pipe(
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

  async function updateSecond() {
    const timeUntilNextSecond = 1000 - (new Date().getTime() % 1000);
    await new Promise(resolve => setTimeout(resolve, timeUntilNextSecond));
    const time = nearestSecondDate();
    secondSubject.next(time);
    setTimeout(() => updateSecond(), 0);
  }
  updateSecond();

  return {
    second$,
    minute$,
    hour$,
  };
}
