import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChloeLogPageComponent } from './pages/chloe-log-page/chloe-log-page.component';
import { ChloeLogPageModule } from './pages/chloe-log-page/chloe-log-page.module';

import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { DashboardPageModule } from './pages/dashboard-page/dashboard-page.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomePageModule } from './pages/home-page/home-page.module';
import { LibraryPageComponent } from './pages/library-page/library-page.component';
import { LibraryPageModule } from './pages/library-page/library-page.module';
import { Pi4Component } from './pages/pi4/pi4.component';
import { Pi4Module } from './pages/pi4/pi4.module';
import { WordlePageComponent } from './pages/wordle-page/wordle-page.component';
import { WordlePageModule } from './pages/wordle-page/wordle-page.module';

const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: HomePageComponent,
  },
  {
    path: 'library',
    title: 'Library',
    component: LibraryPageComponent,
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    component: DashboardPageComponent,
  },
  {
    path: 'pi4',
    title: 'Pi4',
    component: Pi4Component,
  },
  {
    path: 'wordle',
    title: 'Wordle Solver',
    component: WordlePageComponent,
  },
  {
    path: 'chloe',
    title: 'Chloe',
    component: ChloeLogPageComponent,
  },
];

@NgModule({
  imports: [
    ChloeLogPageModule,
    DashboardPageModule,
    HomePageModule,
    LibraryPageModule,
    Pi4Module,
    RouterModule.forRoot(routes),
    WordlePageModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
