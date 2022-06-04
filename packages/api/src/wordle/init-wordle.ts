import { ApiEndpoint, SocketIoEvent, WordleGameEvent } from '@pi4/interfaces';
import { Express, Request, Response } from 'express';
import { Subject } from 'rxjs';
import { Server, Socket } from 'socket.io';

import { bestStartingWordleGuess } from './answers';
import { Guess, playWordle } from './wordle';

export function initWordle(app: Express, io: Server) {
  app.get(ApiEndpoint.WordleBestGuess, (_req: Request, res: Response) => {
    res.json({
      guess: bestStartingWordleGuess,
    });
  });

  io.on('connection', (client: Socket) => {
    client.on(
      SocketIoEvent.requestWordleGame,
      async ({ startingWord }: { startingWord?: Guess }) => {
        const events = new Subject<WordleGameEvent>();

        const sub = events.subscribe(ev => {
          io.emit(SocketIoEvent.wordleGameEvent, ev);
        });

        await playWordle(startingWord ?? bestStartingWordleGuess, events);
        sub.unsubscribe();
      },
    );
  });
}
