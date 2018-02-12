import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { QrScannerModule } from '../../src';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    QrScannerModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
