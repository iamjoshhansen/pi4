import { existsSync, mkdirSync, writeFileSync } from 'fs';
import puppeteer, { Page } from 'puppeteer';
import { bgGreen, bgBlack, bgCyan, inverse, red, green } from 'colors';
import { answers, normalizedCharacterCounts } from './answers';
import { compareDocumentPosition } from 'domutils';
import { Subject } from 'rxjs';
import { WordleGameEvent, WordleLetterState } from '@pi4/interfaces';
const { QueryHandler } = require('query-selector-shadow-dom/plugins/puppeteer');

export type Guess = string & { __brand: 'Guess' };
export type Boxes = string & { __brand: 'Boxes' };
export type WordleLog = string & { __brand: 'WordleLog' };

const theLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const letterCounts: Record<string, number> = {};
for (const letter of theLetters) {
  letterCounts[letter] = 5;
}

const stateColor = {
  [WordleLetterState.absent]: bgBlack,
  [WordleLetterState.present]: bgCyan,
  [WordleLetterState.correct]: bgGreen,
  [WordleLetterState.empty]: (x: string) => x,
};

class Stepper {
  private i = 0;

  get next() {
    return this.i++;
  }
}

const getScreenshots = true;

const logActive = true;

const logStep = (() => {
  if (logActive) {
    return (msg: string) => {
      console.log(msg);
    };
  }
  return (_msg: string) => {};
})();

class ScreenShooter {
  private readonly prefix = new Date().getTime();
  private readonly step = new Stepper();
  constructor(private readonly page: Page, public enabled = true) {
    if (!existsSync('shots')) {
      mkdirSync('shots');
    }
  }

  async snap(label: string) {
    if (getScreenshots) {
      await this.page.screenshot({
        path: `shots/${this.prefix}--${this.step.next}--${label}.png`,
      });
    }
  }
}

let needsShadowHandler = true;

async function wordleGame(): Promise<Wordle> {
  if (needsShadowHandler) {
    await puppeteer.registerCustomQueryHandler('shadow', QueryHandler);
    needsShadowHandler = false;
  }

  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto('https://www.nytimes.com/games/wordle/index.html', {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForTimeout(1000);

  const closeHandle = await page.waitForSelector('shadow/.close-icon');
  if (!closeHandle) {
    throw new Error(`Cannot find close handle'`);
  }

  await closeHandle.click();
  await page.waitForTimeout(1000);

  return new Wordle(page);
}

function underline(word: string, start: number, length = 1) {
  const a = word.substring(0, start);
  const b = word.substring(start, start + length);
  const c = word.substring(start + length);
  return `${a}${inverse(b)}${c}`;
}

export class Wordle {
  private screenshooter: ScreenShooter;

  private wordAttemptCount = 0;
  get attempts() {
    return this.wordAttemptCount;
  }

  private _words: Guess[] = [];
  get guesses() {
    return this._words;
  }

  private _states: WordleLetterState[][] = [];
  get states() {
    return this._states;
  }

  constructor(private readonly page: Page) {
    this.screenshooter = new ScreenShooter(page);
  }

  static log(word: Guess, states: WordleLetterState[]) {
    return word
      .split('')
      .map((letter, i) => stateColor[states[i]](letter))
      .join('') as WordleLog;
  }

  static boxWord(states: WordleLetterState[]): Boxes {
    return states
      .map(state => {
        return {
          [WordleLetterState.absent]: WordleBox.absent,
          [WordleLetterState.empty]: '🟥',
          [WordleLetterState.present]: WordleBox.present,
          [WordleLetterState.correct]: WordleBox.correct,
        }[state];
      })
      .join('') as Boxes;
  }

  async guess(word: Guess) {
    if (this.wordAttemptCount > 5) {
      throw new Error(`Out of guesses`);
    }

    this._words.push(word.toUpperCase() as Guess);

    await this.page.keyboard.type(word);
    await this.page.waitForTimeout(250);

    // await this.screenshooter.snap(`type: ${word}`);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(2000);

    const allStatus = await this.getFullSstatus();
    const latest = allStatus[this.wordAttemptCount++];
    this._states.push(latest);
    return latest;
  }

  nextGuess(): Guess {
    const possibleAnswers = this.possibleAnswers();
    possibleAnswers.sort(Wordle.sortAnswers);
    return possibleAnswers[0];
  }

  possibleAnswers(): Guess[] {
    // all absent letters
    const absentLetters = new Set<string>();

    // missplaced slots
    const missplaced: Set<string>[] = [
      new Set<string>(),
      new Set<string>(),
      new Set<string>(),
      new Set<string>(),
      new Set<string>(),
    ];
    const letterMinCounts = new Map<string, number>();
    const letterExactCounts = new Map<string, number>();
    // const neverLetters = new Set<string>();

    // correct letters
    const correctLetters = new Array(5).fill(null);

    // console.log();
    // console.log(`=========`);
    this.guesses.forEach((guess, i) => {
      const state = this.states[i];
      // console.log(`= ${Wordle.log(guess, state)} =`);
    });
    // console.log(`=========`);
    // console.log();

    this.guesses.forEach((guess, g) => {
      const states = this.states[g];
      const letters = guess.split('');

      const letterCounts = new Map<string, number>();

      const statesPerLetterMap = new Map<
        string,
        Map<WordleLetterState, number>
      >();

      letters.forEach((char, c) => {
        const state = states[c];

        const letterCount = letterCounts.get(char) ?? 0;
        letterCounts.set(char, letterCount + 1);

        const statesPerLetter =
          statesPerLetterMap.get(char) ?? new Map<WordleLetterState, number>();
        const letterStateCount = statesPerLetter.get(state) ?? 0;
        statesPerLetter.set(state, letterStateCount + 1);
        statesPerLetterMap.set(char, statesPerLetter);

        switch (state) {
          case WordleLetterState.absent:
            absentLetters.add(char);
            break;
          case WordleLetterState.present:
            missplaced[c].add(char);
            break;
          case WordleLetterState.correct:
            correctLetters[c] = char;
        }
      });

      // console.log(`  # ${guess}`);
      const lettersInWord = new Set(letters);
      for (const letter of lettersInWord) {
        const stateCounts = statesPerLetterMap.get(letter);
        const absent = stateCounts?.get(WordleLetterState.absent) ?? 0;
        const correct = stateCounts?.get(WordleLetterState.correct) ?? 0;
        const present = stateCounts?.get(WordleLetterState.present) ?? 0;

        // console.log(
        //   `    ${letter} - absent: ${absent} correct: ${correct} present: ${present}`,
        // );

        if (absent === 0) {
          if (correct + present === 0) {
            letterExactCounts.set(letter, correct + present);
          } else {
            letterMinCounts.set(letter, correct + present);
          }
        } else {
          letterExactCounts.set(letter, correct + present);
          // if (correct + present === 0) {
          //   letterExactCounts.set(letter, 0);
          // } else {
          // }
        }
      }

      // console.log(`    - letterMinCounts: `, letterMinCounts);
      // console.log(`    - letterExactCounts: `, letterExactCounts);
    });

    // console.log(
    //   `  - correct letters: ${correctLetters
    //     .map(c => (c === null ? '_' : c))
    //     .join('')}`,
    // );
    // console.log(`  - letterMinCounts: `, letterMinCounts);
    // console.log(`  - letterExactCounts: `, letterExactCounts);
    // console.log(`  - missplaced: `, missplaced);
    // console.log();

    return (answers.map(answer => answer.toUpperCase()) as Guess[]).filter(
      guess => {
        const characters = guess.split('');
        const letterCounts = new Map<string, number>();
        characters.forEach(char => {
          const letterCount = letterCounts.get(char) ?? 0;
          letterCounts.set(char, letterCount + 1);
        });

        // follows all correct letters
        const followsAllCorrect = characters.every((c, i) => {
          const req = correctLetters[i];
          if (!req) {
            return true;
          }
          const follows = c == req;
          if (!follows) {
            // console.log(
            //   red(
            //     `  - ${underline(
            //       guess,
            //       i,
            //     )}: Fails to follow correct letter: must be ${req}`,
            //   ),
            // );
          }
          return follows;
        });

        if (!followsAllCorrect) {
          return false;
        }

        // // avoids never letters
        // const avoidsNeverLetters = characters.every(c => !neverLetters.has(c));
        // if (!avoidsNeverLetters) {
        //   return false;
        // }

        // followsExactCount
        let followsExactCount = true;
        letterExactCounts.forEach((reqCount, letter) => {
          const actualCount = letterCounts.get(letter) ?? 0;
          if (reqCount !== actualCount) {
            // console.log(
            //   red(
            //     `  - ${guess}: Needs exactly ${reqCount} of '${letter}' has ${actualCount}`,
            //   ),
            // );
            followsExactCount = false;
          }
        });
        // const followsExactCount = characters.every(c => {
        //   const reqCount = letterExactCounts.get(c);
        //   if (typeof reqCount === 'undefined') {
        //     return true;
        //   }
        //   const actualCount = letterCounts.get(c) ?? 0;
        //   const follows = actualCount === reqCount;
        //   if (!follows) {
        //     console.log(
        //       red(
        //         `  - ${guess}: Needs exactly ${reqCount} of '${c}' has ${actualCount}`,
        //       ),
        //     );
        //   }
        //   return follows;
        // });
        if (!followsExactCount) {
          return false;
        }

        // followsMinCount
        let followsMinCount = true;
        letterMinCounts.forEach((minCount, letter) => {
          const actualCount = letterCounts.get(letter) ?? 0;
          if (actualCount < minCount) {
            // console.log(
            //   red(
            //     `  - ${guess}: Needs at least ${minCount} of '${letter}' has ${actualCount}`,
            //   ),
            // );
            followsMinCount = false;
          }
        });
        // console.log(`    - ${letterCounts}`);
        // const followsMinCount = characters.every(c => {
        //   const minCount = letterMinCounts.get(c);
        //   const actualCount = letterCounts.get(c) ?? 0;
        //   console.log(
        //     `    -${c}  has ${actualCount}, min count: ${c}: ${minCount}`,
        //   );
        //   if (typeof minCount === 'undefined') {
        //     return true;
        //   }
        //   const follows = actualCount >= minCount;
        //   if (!follows) {
        //     console.log(
        //       red(
        //         `  - ${guess}: Fails to follow min '${c}' count of ${minCount}`,
        //       ),
        //     );
        //   }
        //   return follows;
        // });

        if (!followsMinCount) {
          return false;
        }

        // avoids missplaced letters
        const avoidsMissplacedLetters = characters.every((c, i) => {
          const req = missplaced[i];
          const follows = !req.has(c);
          if (!follows) {
            // console.log(
            //   red(
            //     `  - ${guess}: Fails to avoid missplaced (${i}) letter: ${c}`,
            //   ),
            // );
          }
          return follows;
        });

        if (!avoidsMissplacedLetters) {
          return false;
        }

        // console.log(green(`  - ${guess}`));
        return true;
      },
    );
  }

  static sortAnswers(a: Guess, b: Guess): number {
    return 0;
  }

  async close() {
    this.page.close();
  }

  private async getFullSstatus() {
    const ret: WordleLetterState[][] = [];

    const rows = await this.page.$$(`shadow/#board div.row`);
    for (const row of rows) {
      const r: WordleLetterState[] = [];

      const tiles = await row.$$('shadow/div.tile');
      for (const tile of tiles) {
        if (tile === null) {
          continue;
        }
        const state: WordleLetterState = await this.page.evaluate(
          el => el.getAttribute('data-state'),
          tile,
        );

        r.push(state);
      }

      ret.push(r);
    }

    return ret;
  }
}

enum WordleBox {
  absent = '⬛',
  present = '🟨',
  correct = '🟩',
}

function randomWordleBox() {
  return [WordleBox.absent, WordleBox.present, WordleBox.correct][
    Math.floor(Math.random() * 3)
  ];
}
function randomWordleBoxWord() {
  return Array(6).fill(null).map(randomWordleBox).join('') as Boxes;
}

export async function playWordle(
  startingWord: Guess,
  events?: Subject<WordleGameEvent>,
) {
  events?.next({
    event: 'start',
  });

  const wordle = await wordleGame();

  const words: Guess[] = [startingWord];
  const blocks: Boxes[] = [];
  let solved = false;

  const allowedGuessCount = 6;
  for (let i = 0; i < allowedGuessCount; i++) {
    const word = words[i];

    events?.next({
      event: 'guess',
      word,
    });

    const status = await wordle.guess(word);

    events?.next({
      event: 'status',
      status,
    });

    const wordBlocks = Wordle.boxWord(status);
    blocks.push(wordBlocks);

    solved = status.every(x => x === WordleLetterState.correct);

    if (solved) {
      // console.log(`🎉 Solved!!!`);
      break;
    }

    // console.log(`   ${randomWordleBoxWord()}`);

    // console.log(`   ...finding possible answers`);

    if (i < allowedGuessCount - 1) {
      const nextWord = wordle.nextGuess();
      // console.log(`   ...picked next word to guess:`, nextWord);
      words.push(nextWord);
    }
  }

  // console.log(`-------------`);
  // console.log();
  // console.log(
  //   `Guesses\n  ${words
  //     .map((word, i) => Wordle.log(word, wordle.states[i]))
  //     .join('\n  ')}`,
  // );
  // console.log();
  // console.log(`Wordle\n\n${blocks.join('\n')}`);

  // // await wordle.close();
  // console.log();
  // console.log(inverse(green(` Done `)));

  events?.next({
    event: 'finish',
    solved,
    answer: words[words.length - 1],
    states: wordle.states,
    blocks,
    words,
  });

  wordle.close();

  return {
    solved,
    words,
    states: wordle.states,
    blocks,
  };
}
