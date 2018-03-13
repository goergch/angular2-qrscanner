import {Component, ViewChild, ViewEncapsulation, OnInit, AfterViewInit} from '@angular/core';
import {QrScannerComponent} from '../../src';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, AfterViewInit {


    decodedOutput(text: string) {
        console.log(text);
    }

    @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent ;



    ngOnInit() {

        // *** Use this code, if you want to define the used device ***
        // this.qrScannerComponent.getMediaDevices().then(devices => {
        //     console.log(devices);
        //     const videoDevices: MediaDeviceInfo[] = [];
        //     for (const device of devices) {
        //         if (device.kind.toString() === 'videoinput') {
        //             videoDevices.push(device);
        //         }
        //     }
        //     if (videoDevices.length > 0){
        //         let choosenDev;
        //         for (const dev of videoDevices){
        //             if (dev.label.includes('front')){
        //                 choosenDev = dev;
        //                 break;
        //             }
        //         }
        //         if (choosenDev) {
        //             this.qrScannerComponent.chooseCamera.next(choosenDev);
        //         } else {
        //             this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
        //         }
        //     }
        // });

        this.qrScannerComponent.capturedQr.subscribe(result => {
            console.log(result);
            // this.qrScannerComponent.stopScanning();
        });



    }

    ngAfterViewInit() {
        // *** Use this code, if you want the user to decide, which camera to use
        this.qrScannerComponent.startScanning(null);
    }
}
