import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordlePageComponent } from './wordle-page.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [WordlePageComponent],
  exports: [WordlePageComponent],
  imports: [CommonModule, FormsModule],
})
export class WordlePageModule {}
