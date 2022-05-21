import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pi4Component } from './pi4.component';

@NgModule({
  declarations: [Pi4Component],
  exports: [Pi4Component],
  imports: [CommonModule],
})
export class Pi4Module {}
