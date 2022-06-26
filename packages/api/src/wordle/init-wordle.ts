import { ApiEndpoint, SocketIoEvent, WordleGameEvent } from '@pi4/interfaces';
import { Express, Request, Response } from 'express';
import { Subject } from 'rxjs';
import { Server, Socket } from 'socket.io';

import { bestStartingWordleGuess } from './answers';
import { Guess, playWordle } from './wordle';

let wordleId = 0;

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
        wordleId++;

        const sub = events.subscribe(ev => {
          console.log(`Wordle ${wordleId}: ${ev.event}`);
          io.emit(SocketIoEvent.wordleGameEvent, ev);
        });

        try {
          await playWordle(startingWord ?? bestStartingWordleGuess, events);
        } catch (er: any) {
          const emission: WordleGameEvent = {
            event: 'error',
            message: er.message,
          };
          console.log(`CAUGHT ERROR`, er);
          io.emit(SocketIoEvent.wordleGameEvent, emission);
        }
        sub.unsubscribe();
      },
    );
  });
}
