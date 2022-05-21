import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';

const socketConfig: SocketIoConfig = {
  url: `http://${window.location.hostname}:${environment.ioPort}`,
  options: {},
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(socketConfig),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
