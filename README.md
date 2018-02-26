# angular2-qrscanner
QrScanner will scan for a QRCode from your Web-cam and return its
string representation by drawing the captured image onto a 2D Canvas
and use [@LazarSoft/jsqrcode](https://github.com/LazarSoft/jsqrcode) to check for a valid QRCode every *Xms*

### usage
```bash
$ npm install --save angular2-qrscanner
```

```typescript
// app.module.ts
import { NgQrScannerModule } from 'angular2-qrscanner';
@NgModule({
  declarations: [
    // ...
  ],
  imports: [
    // ...
    NgQrScannerModule,
  ],
  providers: [],
  bootstrap: [
      
  ]
})
export class AppModule { }
```

```html
<!-- app.component.html -->
<qr-scanner
        [debug]="false"
        [canvasWidth]="1080" <!-- canvas width                                 (default: 640) -->
        [canvasHeight]="720" <!-- canvas height                                (default: 480) -->
        [stopAfterScan]="true" <!-- should the scanner stop after first success? (default: true) -->
        [updateTime]="500"> <!-- miliseconds between new capture              (default: 500) -->
</qr-scanner>

```

```typescript
// app.component.ts

import {Component, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
import {QrScannerComponent} from 'angular2-qrscanner';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {


    @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent ;

    ngOnInit() {
        this.qrScannerComponent.getMediaDevices().then(devices => {
            console.log(devices);
            const videoDevices: MediaDeviceInfo[] = [];
            for (const device of devices) {
                if (device.kind.toString() === 'videoinput') {
                    videoDevices.push(device);
                }
            }
            if (videoDevices.length > 0){
                let choosenDev;
                for (const dev of videoDevices){
                    if (dev.label.includes('front')){
                        choosenDev = dev;
                        break;
                    }
                }
                if (choosenDev) {
                    this.qrScannerComponent.chooseCamera.next(choosenDev);
                } else {
                    this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
                }
            }
        });

        this.qrScannerComponent.capturedQr.subscribe(result => {
            console.log(result);
        });
    }
}


```
