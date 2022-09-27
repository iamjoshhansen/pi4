import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from './dashboard-page.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DashboardPageComponent],
  imports: [CommonModule, FormsModule],
})
export class DashboardPageModule {}
