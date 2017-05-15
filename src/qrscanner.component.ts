import {Component, OnInit, Input, Output, EventEmitter, OnDestroy, Renderer2, ElementRef, ViewChild} from '@angular/core';
import { QRCode } from './qrdecode/qrcode'


@Component({
    moduleId: 'module.id',
    selector: 'qr-scanner',
    styles: [':host videoWrapper {height: auto; width: 100%;}'],
    templateUrl: './qrscanner.component.html',
})
export class QrScannerComponent implements OnInit, OnDestroy {

    @Input() width = 640;
    @Input() height = 480;
    @Input() facing: 'environment' | string = 'experimental';
    @Input() debug = false;

    @Output() onRead: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('videoWrapper') videoWrapper: HTMLDivElement;

    private gCanvas: HTMLCanvasElement;
    private gCtx: CanvasRenderingContext2D;
    private qrCode: QRCode = null;
    private stype = 0;
    private gUM = false;
    private videoElement: HTMLVideoElement;

    private webkit = false;
    private moz = false;
    private stream: any;
    private stop = false;

    private nativeElement: ElementRef;
    private supported = false;

    constructor(private renderer: Renderer2, private element: ElementRef) {
        this.nativeElement = this.element.nativeElement;
        this.supported = this.isCanvasSupported();
    }

    ngOnInit(): void {
        if (this.debug) {
            console.log(`QR Scanner init, facing ${this.facing}`);
        }

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

    private isCanvasSupported(): boolean {
        const canvas = this.renderer.createElement('canvas');
        return !!(canvas.getContext() && canvas.getContext('2d'));
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

    connectDevice(options: any): void {

        let self = this;
        function success(stream: any): void {
            self.stream = stream;
            if (self.webkit || self.moz) {
                self.videoElement.src = window.URL.createObjectURL(stream);
            } else {
                self.videoElement.src = stream;
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
                    self.gCtx.drawImage(self.videoElement, 0, 0, self.width, self.height);
                    self.qrCode.decode(self.gCanvas);
                } catch (e) {
                    if (this.debug) {
                        console.log(e);
                    }
                    setTimeout(captureToCanvas, 500);
                };
            }
        }

        if (this.stype === 1) {
            setTimeout(captureToCanvas, 500);
            return;
        }

        let n: any = navigator;
        this.videoElement = this.renderer.createElement('videoWrapper');
        this.videoElement.setAttribute('autoplay', 'true');
        this.renderer.appendChild(this.videoWrapper, this.videoElement);

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

    findMediaDevices(): void {

        let options: any = true;
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            try {
                let self = this;
                navigator.mediaDevices.enumerateDevices()
                    .then(function (devices: MediaDeviceInfo[]) {
                        devices.forEach((device: MediaDeviceInfo) => {
                            if (device.kind === 'videoinput' && device.label.toLowerCase().search('back') > -1) {
                                options = { 'deviceId': { 'exact': device.deviceId }, 'facingMode': this.facingMode };
                            }
                        });
                        self.connectDevice(options);
                    });
            } catch (e) {
                if (this.debug) {
                    console.log(e);
                }
            }
        } else {
            if (this.debug) {
                console.log('no navigator.mediaDevices.enumerateDevices');
            }
            this.connectDevice(options);
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

            this.findMediaDevices();
        }
    }
}
