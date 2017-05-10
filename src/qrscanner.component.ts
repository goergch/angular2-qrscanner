import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { QRCode } from './qrdecode/qrcode'


@Component({
    moduleId: 'module.id',
    selector: 'qr-scanner',
    template: `
    <canvas id="qr-canvas" width="640" height="480" hidden="true"></canvas>
    <div id="outdiv"></div>
    <div id="mainbody"></div>
`
})
export class QrScannerComponent implements OnInit, OnDestroy {

    @Input() width = 640;
    @Input() height = 480;
    @Input() facing: string;
    @Output() onRead: EventEmitter<string> = new EventEmitter<string>();
    gCanvas: HTMLCanvasElement;
    gCtx: CanvasRenderingContext2D;
    qrCode: QRCode = null;
    stype = 0;
    gUM = false;
    v: HTMLVideoElement;
    webkit = false;
    moz = false;
    stream: any;
    stop = false;

    constructor() { }

    ngOnInit(): void {
        console.log(`QR Scanner init, facing ${this.facing}`);
        this.load();
    }

    ngOnDestroy() {
        this.stopScanning();
    }

    startScanning(): void {
        this.load();
    }

    stopScanning(): void {
        this.stream.getTracks()[0].stop();
        this.stop = true;

    }

    isCanvasSupported(): boolean {
        const elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));

    }
    initCanvas(w: number, h: number): void {
        this.gCanvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
        this.gCanvas.style.width = w + 'px';
        this.gCanvas.style.height = h + 'px';
        this.gCanvas.width = w;
        this.gCanvas.height = h;
        this.gCtx = this.gCanvas.getContext('2d');
        this.gCtx.clearRect(0, 0, w, h);
    }

    setwebcam2(options: any): void {

        let self = this;
        function success(stream: any): void {
            self.stream = stream;
            if (self.webkit || self.moz) {
                self.v.src = window.URL.createObjectURL(stream);
            } else {
                self.v.src = stream;
            }
            self.gUM = true;
            setTimeout(captureToCanvas, 500);
        }

        function error(error: any): void {
            this.gUM = false;
            return;
        }

        function captureToCanvas(): void {
            if (self.stop === true || self.stype !== 1) {
                return;
            }
            if (self.gUM) {
                try {
                    self.gCtx.drawImage(self.v, 0, 0, self.width, self.height);
                    self.qrCode.decode(self.gCanvas);
                } catch (e) {
                    console.log(e);
                    setTimeout(captureToCanvas, 500);
                };
            }
        }

        if (this.stype === 1) {
            setTimeout(captureToCanvas, 500);
            return;
        }

        let n: any = navigator;
        document.getElementById('outdiv').innerHTML = `<video id="v" autoplay height="${this.height}" width="${this.width}"></video>`;
        this.v = document.getElementById('v') as HTMLVideoElement;

        if (n.getUserMedia) {
            this.webkit = true;
            n.getUserMedia({ video: options, audio: false }, success, error);
        } else if (n.webkitGetUserMedia) {
            this.webkit = true;
            n.webkitGetUserMedia({ video: options, audio: false }, success, error);
        } else if (n.mozGetUserMedia) {
            this.moz = true;
            n.mozGetUserMedia({ video: options, audio: false }, success, error);
        }

        this.stype = 1;
        setTimeout(captureToCanvas, 500);
    }



    setwebcam(): void {

        let options: any = true;
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            try {
                let self = this;
                navigator.mediaDevices.enumerateDevices()
                    .then(function (devices: any) {
                        devices.forEach(function (device: any) {
                            if (device.kind === 'videoinput' && device.label.toLowerCase().search('back') > -1) {
                                options = { 'deviceId': { 'exact': device.deviceId }, 'facingMode': 'environment' };
                            }
                        });
                        self.setwebcam2(options);
                    });
            } catch (e) {
                console.log(e);
            }
        } else {
            console.log('no navigator.mediaDevices.enumerateDevices');
            this.setwebcam2(options);
        }

    }


    load(): void {

        let self = this;
        this.stop = false;
        this.stype = 0;
        function read(a: string): void {
            self.onRead.emit(a);
            self.stream.getTracks()[0].stop();
            self.stop = true;

        }
        if (this.isCanvasSupported()) {
            this.initCanvas(this.height, this.width);
            this.qrCode = new QRCode();
            this.qrCode.myCallback = read;

            this.setwebcam();
        } else {
            document.getElementById('mainbody').style.display = 'inline';
            document.getElementById('mainbody').innerHTML = `
                <p id="mp1">QR code scanner for HTML5 capable browsers</p><br>
                <br><p id="mp2">sorry your browser is not supported</p><br><br>
                <p id="mp1">try
                    <a href="http://www.mozilla.com/firefox"><img src="firefox.png"/></a> or
                    <a href="http://chrome.google.com"><img src="chrome_logo.gif"/></a> or
                    <a href="http://www.opera.com"><img src="Opera-logo.png"/></a>
                </p>`;
        }
    }
}
