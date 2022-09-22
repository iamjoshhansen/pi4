import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WakeLockService {
  private reasonsToStayAwake = new Set<string>();
  private readonly countSubject = new BehaviorSubject<number>(0);
  public readonly count$ = this.countSubject.pipe(distinctUntilChanged());
  public readonly oughtToBeAwake$ = this.count$.pipe(
    map((count) => count > 0),
    distinctUntilChanged()
  );

  private readonly activeSubject = new BehaviorSubject<boolean>(false);
  public readonly active$ = this.activeSubject.pipe(distinctUntilChanged());
  get active() {
    return this.activeSubject.value;
  }

  private wakeLock?: any;

  constructor() {
    this.oughtToBeAwake$.subscribe((oughtToBeAwake) => {
      if (oughtToBeAwake && !this.active) {
        this.requestWakeLock();
        return;
      }

      if (!oughtToBeAwake && this.active) {
        this.releaseWakeLock();
        return;
      }
    });
  }

  private update() {
    this.countSubject.next(this.reasonsToStayAwake.size);
  }

  addReason(reason: string) {
    this.reasonsToStayAwake.add(reason);
    this.update();
  }

  removeReason(reason: string) {
    this.reasonsToStayAwake.delete(reason);
    this.update();
  }

  private async requestWakeLock() {
    try {
      console.log(`requesting wake lock`);
      // @ts-ignore
      this.wakeLock = await navigator.wakeLock.request('screen');
      this.wakeLock.addEventListener('release', () => {
        this.activeSubject.next(false);
      });
      this.activeSubject.next(true);
    } catch (er) {
      console.error(`Failed to request wakeLock`);
    }
  }

  private async releaseWakeLock() {
    if (!this.wakeLock) {
      return;
    }
    try {
      console.log(`releasing wake lock`);
      await this.wakeLock.release();
      delete this.wakeLock;
    } catch {}
  }
}
