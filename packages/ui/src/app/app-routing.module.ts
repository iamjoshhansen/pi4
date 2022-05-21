import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomePageModule } from './pages/home-page/home-page.module';
import { Pi4Component } from './pages/pi4/pi4.component';
import { Pi4Module } from './pages/pi4/pi4.module';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'pi4',
    component: Pi4Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HomePageModule, Pi4Module],
  exports: [RouterModule],
})
export class AppRoutingModule {}
