import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryPageComponent } from './library-page.component';

@NgModule({
  declarations: [LibraryPageComponent],
  exports: [LibraryPageComponent],
  imports: [CommonModule],
})
export class LibraryPageModule {}
