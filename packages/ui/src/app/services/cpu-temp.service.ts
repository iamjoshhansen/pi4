import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  Observable,
} from 'rxjs';
import { SocketIoEvent } from '@pi4/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CpuTempService {
  private readonly cpuTempSubject = new BehaviorSubject<number | undefined>(
    undefined
  );
  public readonly cpuTemp$ = this.cpuTempSubject.pipe(
    filter((x) => typeof x !== 'undefined'),
    distinctUntilChanged()
  ) as unknown as Observable<number>;

  constructor(private socket: Socket) {
    this.socket.on(SocketIoEvent.cpuTempChange, (data: number) => {
      // console.log({ data });
      this.cpuTempSubject.next(data);
    });

    this.socket.emit(SocketIoEvent.requestCpuTemp);
  }
}
