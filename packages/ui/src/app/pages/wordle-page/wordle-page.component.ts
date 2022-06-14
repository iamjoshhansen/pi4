import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  delay,
  distinctUntilChanged,
  map,
  Subject,
  takeUntil,
} from 'rxjs';
import { WordleService } from 'src/app/services/wordle.service';
import { copyToClipboard } from 'src/app/utils/copy-to-clipboard';

@Component({
  selector: 'app-wordle-page',
  templateUrl: './wordle-page.component.html',
  styleUrls: ['./wordle-page.component.scss'],
})
export class WordlePageComponent implements OnInit, OnDestroy {
  private destroyed = new Subject<void>();

  private actualBestGuess = '';

  private readonly bestGuessSubject = new BehaviorSubject<string>('');
  public readonly bestGuess$ = this.bestGuessSubject.asObservable();
  get bestGuess() {
    return this.bestGuessSubject.value;
  }
  set bestGuess(val: string) {
    const clean = val
      .toUpperCase()
      .split('')
      .filter((c) => !!c.match(/[A-Z]/))
      .join('');
    // console.log({ val, clean });
    this.bestGuessSubject.next(clean.substring(clean.length - 5));
  }

  complete = false;
  isPlaying = false;
  hasStarted = false;

  public copyText = 'Copy';
  private readonly ogCopyText = this.copyText;

  blocks = '';

  // events: any[] = [];

  guesses: { character: string; state?: string }[][] = [];

  constructor(private wordleService: WordleService) {}

  setGuess(event: any) {
    this.bestGuess = event.target.value;
  }

  ngOnInit(): void {
    this.wordleService.fetchBestGuess().subscribe(({ guess }) => {
      this.actualBestGuess = guess;
      this.bestGuess = guess;
    });

    this.wordleService.wordleGameEvent$
      .pipe(takeUntil(this.destroyed))
      .subscribe((event) => {
        // this.events.push(event);

        switch (event.event) {
          case 'start':
            this.complete = false;
            this.guesses = [];
            this.blocks = '';
            break;
          case 'guess':
            this.guesses.push(
              event.word.split('').map((character) => ({ character }))
            );
            break;
          case 'status':
            this.guesses[this.guesses.length - 1].forEach(
              (letter, i) => (letter.state = event.status[i])
            );
            break;
          case 'finish':
            this.complete = true;
            this.isPlaying = false;
            const dayCount = Math.floor(
              (new Date().getTime() - new Date('2021-06-19').getTime()) /
                (1000 * 60 * 60 * 24)
            );
            const count =
              this.guesses.length > 6 ? 'X' : this.guesses.length.toString();
            this.blocks = `Wordle ${dayCount} ${count}/6*\n\n${event.blocks.join(
              '\n'
            )}`;
            break;
        }
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  playWordle() {
    this.isPlaying = true;
    this.hasStarted = true;
    this.wordleService.playWordle(this.bestGuess);
  }

  copyBragText() {
    copyToClipboard(this.blocks);
    this.copyText = 'Copied!';
    setTimeout(() => {
      this.copyText = this.ogCopyText;
    }, 1000);
  }

  reset() {
    this.hasStarted = false;
  }

  clearInput() {
    this.bestGuess = '';
  }

  checkForEmpty() {
    if (this.bestGuess === '') {
      this.bestGuess = this.actualBestGuess;
    }
  }
}
