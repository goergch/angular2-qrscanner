import {Component, OnInit, Input, Output, EventEmitter, OnDestroy, Renderer2, ElementRef, ViewChild} from '@angular/core';
import { QRCode } from './qrdecode/qrcode'


@Component({
    moduleId: 'module.id',
    selector: 'qr-scanner',
    styles: [':host videoWrapper {height: auto; width: 100%;}'],
    template: `
        <ng-container [ngSwitch]="supported">
            <ng-container *ngSwitchDefault>
                <canvas #qrCanvas hidden="true"></canvas>
                <div #videoWrapper></div>
            </ng-container>
            <ng-container *ngSwitchCase="false">
                <p>
                    You are using an <strong>outdated</strong> browser.
                    Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.
                </p>
            </ng-container>
        </ng-container>`
})
export class QrScannerComponent implements OnInit, OnDestroy {

    @Input() width = 640;
    @Input() height = 480;
    @Input() facing: 'environment' | string = 'environment';
    @Input() debug = false;
    @Input() mirror = false;
    @Input() stopAfterScan = false;

    @Output() onRead: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('videoWrapper') videoWrapper: HTMLDivElement;
    @ViewChild('qrCanvas') qrCanvas: HTMLCanvasElement;

    private gCtx: CanvasRenderingContext2D;
    private qrCode: QRCode = null;
    private isDeviceConnected = false;
    private gUM = false;
    private videoElement: HTMLVideoElement;

    private isWebkit = false;
    private isMoz = false;
    private stream: any;
    private stop = false;

    private nativeElement: ElementRef;
    private supported = false;

    private captureTimeout: any;

    constructor(private renderer: Renderer2, private element: ElementRef) {
        this.nativeElement = this.element.nativeElement;
        this.supported = this.isCanvasSupported();
    }

    ngOnInit(): void {
        if (this.debug) {
            console.log(`[QrScanner] QR Scanner init, facing ${this.facing}`);
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

        if (this.captureTimeout) {
            clearTimeout(this.captureTimeout);
            this.captureTimeout = false;
        }

        this.stream.getTracks()[0].stop();
        this.stop = true;
    }

    private isCanvasSupported(): boolean {
        const canvas = this.renderer.createElement('canvas');
        return !!(canvas.getContext() && canvas.getContext('2d'));
    }

    private initCanvas(w: number, h: number): void {
        // this.qrCanvas.style.width = `${w}px`;
        // this.qrCanvas.style.height = `${h}px`;
        this.qrCanvas.width = w;
        this.qrCanvas.height = h;
        this.gCtx = this.qrCanvas.getContext('2d');
        this.gCtx.clearRect(0, 0, w, h);
        if (!this.mirror) { this.gCtx.translate(-1, 1); }
    }

    private connectDevice(options: any): void {

        const self = this;

        function success(stream: any): void {
            self.stream = stream;
            if (self.isWebkit || self.isMoz) {
                self.videoElement.src = window.URL.createObjectURL(stream);
            } else {
                self.videoElement.src = stream;
            }
            self.gUM = true;
            this.captureTimeout = setTimeout(captureToCanvas, 500);
        }

        function error(error: any): void {
            this.gUM = false;
            return;
        }

        function captureToCanvas(): void {
            if (self.stop || !self.isDeviceConnected) {
                return;
            }
            if (self.gUM) {
                try {
                    self.gCtx.drawImage(self.videoElement, 0, 0, self.width, self.height);
                    self.qrCode.decode(self.qrCanvas);
                } catch (e) {
                    if (this.debug) {
                        console.log(e);
                    }
                    this.captureTimeout = setTimeout(captureToCanvas, 500);
                }
            }
        }

        if (this.isDeviceConnected && !this.captureTimeout) {
            this.captureTimeout = setTimeout(captureToCanvas, 500);
            return;
        }

        const _navigator: any = navigator;

        this.videoElement = this.renderer.createElement('videoWrapper');
        this.videoElement.setAttribute('autoplay', 'true');
        this.renderer.appendChild(this.videoWrapper, this.videoElement);

        if (_navigator.getUserMedia) {
            this.isWebkit = true;
            _navigator.getUserMedia({ video: options, audio: false }, success, error);
        } else if (_navigator.webkitGetUserMedia) {
            this.isWebkit = true;
            _navigator.webkitGetUserMedia({ video: options, audio: false }, success, error);
        } else if (_navigator.mozGetUserMedia) {
            this.isMoz = true;
            _navigator.mozGetUserMedia({ video: options, audio: false }, success, error);
        }

        this.isDeviceConnected = true;
        this.captureTimeout = setTimeout(captureToCanvas, 500);
    }

    private get findMediaDevices(): Promise<{deviceId: { exact: string }, facingMode: string } | boolean> {

        const videoDevice =
            (device: MediaDeviceInfo) => device.kind === 'videoinput' && device.label.search(/back/i) > -1;
        return new Promise((resolve, reject) => {
            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                try {
                    navigator.mediaDevices.enumerateDevices()
                        .then((devices: MediaDeviceInfo[]) => {
                            const device = devices.find((_device: MediaDeviceInfo) => videoDevice(_device));
                            const options = { 'deviceId': { 'exact': device.deviceId }, 'facingMode': this.facing };
                            resolve(options);
                        });
                } catch (e) {
                    if (this.debug) {
                        console.log(e);
                    }
                    reject(e);
                }
            } else {
                if (this.debug) {
                    console.log('[QrScanner] no navigator.mediaDevices.enumerateDevices');
                }
                resolve(true);
            }
        })
    }

    private decodeCallback(decoded: string) {
        this.onRead.emit(decoded);
        if (this.stopAfterScan) {
            this.stopScanning();
        }
    }

    private load(): void {
        this.stop = false;
        this.isDeviceConnected = false;

        if (this.supported) {
            this.initCanvas(this.height, this.width);
            this.qrCode = new QRCode();
            this.qrCode.myCallback = (decoded: string) => this.decodeCallback(decoded);

            this.findMediaDevices.then((options) => this.connectDevice(options));
        }
    }
}
