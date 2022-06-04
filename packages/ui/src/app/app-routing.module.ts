import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomePageModule } from './pages/home-page/home-page.module';
import { Pi4Component } from './pages/pi4/pi4.component';
import { Pi4Module } from './pages/pi4/pi4.module';
import { WordlePageComponent } from './pages/wordle-page/wordle-page.component';
import { WordlePageModule } from './pages/wordle-page/wordle-page.module';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'pi4',
    component: Pi4Component,
  },
  {
    path: 'wordle',
    component: WordlePageComponent,
  },
];

@NgModule({
  imports: [
    HomePageModule,
    Pi4Module,
    RouterModule.forRoot(routes),
    WordlePageModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
