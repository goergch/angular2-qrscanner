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
    [canvasWidth]="100"                    <!-- canvas width                                 (default: 640) -->
    [canvasHeight]="100"                   <!-- canvas height                                (default: 480) -->
    [debug]="false"                        <!-- debug flag for console.log spam              (default: false) -->         
    [updateTime]="500"                     <!-- miliseconds between new capture              (default: 500) -->
    [stopAfterScan]="true"                 <!-- should the scanner stop after first success? (default: true) -->
    [chooseCamera]="chosenCameraSubject"   <!-- MediaDevice to be used by QrScanner          (NO DEFAULT!!) -->
    (foundCameras)="listCameras($event)">  <!-- The list of MediaDevices found by QrScanner                 -->
    (capturedQr)="decoded($event)"
  </qr-scanner>
```

```typescript
// app.component.ts

import { Component } from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  chosenCameraSubject = new Subject();

  decodedOutput($event: string) {
    console.log('Decoded', $event);
  }

  listCameras($event: MediaDeviceInfo[]) {
    console.log('MediaDeviceInfo', $event);
    this.chosenCameraSubject.next($event.filter(device => device.kind === 'videoinput')[0])
  }
}

```