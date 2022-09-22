import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApiEndpoint,
  ApiEndpointMap,
  SocketIoEvent,
  WordleBestGuessResponse,
  WordleGameEvent,
} from '@pi4/interfaces';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';

import { apiPrefix } from './api-prefix';

@Injectable({
  providedIn: 'root',
})
export class WordleService {
  private readonly wordleGameEventSubject = new Subject<WordleGameEvent>();
  public readonly wordleGameEvent$ = this.wordleGameEventSubject.asObservable();

  constructor(private socket: Socket, private http: HttpClient) {
    this.socket.on(SocketIoEvent.wordleGameEvent, (event: WordleGameEvent) =>
      this.wordleGameEventSubject.next(event)
    );
  }

  playWordle(startingWord: string) {
    this.socket.emit(SocketIoEvent.requestWordleGame, { startingWord });
  }

  fetchBestGuess() {
    return this.http.get<WordleBestGuessResponse>(
      `${apiPrefix}${ApiEndpointMap[ApiEndpoint.WordleBestGuess]()}`
    );
  }
}
