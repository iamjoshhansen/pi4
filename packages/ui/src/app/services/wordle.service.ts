import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {
  SocketIoEvent,
  WordleGameEvent,
  ApiEndpointMap,
  ApiEndpoint,
  WordleBestGuessResponse,
} from '@pi4/interfaces';
import { HttpClient } from '@angular/common/http';
import { apiPrefix } from './api-prefix';
import { BehaviorSubject, Subject } from 'rxjs';

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
