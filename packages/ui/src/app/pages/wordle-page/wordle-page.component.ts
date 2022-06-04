import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WordleService } from 'src/app/services/wordle.service';

@Component({
  selector: 'app-wordle-page',
  templateUrl: './wordle-page.component.html',
  styleUrls: ['./wordle-page.component.scss'],
})
export class WordlePageComponent implements OnInit, OnDestroy {
  private destroyed = new Subject<void>();

  bestGuess = '';

  complete = false;

  blocks = '';

  // events: any[] = [];

  guesses: { character: string; state?: string }[][] = [];

  constructor(private wordleService: WordleService) {}

  ngOnInit(): void {
    this.wordleService
      .fetchBestGuess()
      .subscribe(({ guess }) => (this.bestGuess = guess));

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
            this.blocks = `Wordle\n\n${event.blocks.join('\n')}`;
            break;
        }
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  playWordle() {
    this.wordleService.playWordle(this.bestGuess);
  }
}
