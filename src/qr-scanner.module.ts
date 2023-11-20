import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrScannerComponent } from './qr-scanner.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [QrScannerComponent],
  exports: [QrScannerComponent]
})
export class NgQrScannerModule {
  static forRoot(): ModuleWithProviders<NgQrScannerModule> {
    return {
      ngModule: NgQrScannerModule
    };
  }
}
