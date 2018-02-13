import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgQrScannerModule } from '../../src';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    NgQrScannerModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
