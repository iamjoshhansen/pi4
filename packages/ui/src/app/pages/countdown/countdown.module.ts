import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownComponent } from './countdown.component';
import { CountdownRoutingModule } from './countdown-routing.module';

@NgModule({
  declarations: [CountdownComponent],
  exports: [CountdownComponent],
  imports: [CommonModule, CountdownRoutingModule],
})
export class CountdownModule {}
