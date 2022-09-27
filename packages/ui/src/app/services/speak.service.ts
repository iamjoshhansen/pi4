import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class SpeakService {
  constructor(private socket: Socket) {}

  say(message: string) {
    return new Promise<void>((resolve, reject) => {
      if (!message) {
        reject(`Empty message`);
        return;
      }
      console.log(`Sending speaking message:`, message);
      try {
        this.socket.emit(`speak`, message, (er?: string) =>
          er ? reject(er) : resolve()
        );
      } catch (er) {
        reject(er);
      }
    });
  }
}
