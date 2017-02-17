import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QrScannerComponent} from './src/qrscanner.component';

export * from './src/qrscanner.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    QrScannerComponent
  ],
  exports: [
    QrScannerComponent
  ]
})
export class QrScannerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: QrScannerModule
    };
  }
}
