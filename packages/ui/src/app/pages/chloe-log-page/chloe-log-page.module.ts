import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChloeLogPageComponent } from './chloe-log-page.component';

@NgModule({
  declarations: [ChloeLogPageComponent],
  exports: [ChloeLogPageComponent],
  imports: [CommonModule],
})
export class ChloeLogPageModule {}
