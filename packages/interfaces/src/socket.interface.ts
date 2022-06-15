export enum SocketIoEvent {
  requestCpuTemp = 'request-cpu-temp',
  cpuTempChange = 'cpu-temp-change',

  // wordle
  requestWordleGame = 'request-wordle-game',
  wordleGameEvent = 'wordle-game-event',
}

export enum WordleLetterState {
  absent = 'absent',
  present = 'present',
  empty = 'empty',
  correct = 'correct',
}

export type WordleGameEvent =
  | {
      event: 'start';
    }
  | {
      event: 'error';
      message: string;
    }
  | {
      event: 'guess';
      word: string;
    }
  | {
      event: 'status';
      status: WordleLetterState[];
    }
  | {
      event: 'finish';
      solved: boolean;
      answer?: string;
      words: string[];
      states: WordleLetterState[][];
      blocks: string[];
    };
