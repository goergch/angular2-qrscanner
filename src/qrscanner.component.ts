import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { QRCode } from './qrdecode/qrcode'

/**
 * QrScanner will scan for a QRCode from your Web-cam and return its
 * string representation by drawing the captured image onto a 2D Canvas
 * and use LazarSoft/jsqrcode to check for a valid QRCode every 500ms
 *
 * @usage:
 * <qr-scanner
 *     [debug]="false"          debug flag for console.log spam              (default: false)
 *     [canvasWidth]="640"      canvas width                                 (default: 640)
 *     [canvasHeight]="480"     canvas height                                (default: 480)
 *     [mirror]="false"         should the image be a mirror?                (default: false)
 *     [stopAfterScan]="true"   should the scanner stop after first success? (default: true)
 *     [updateTime]="500"       miliseconds between new capture              (default: 500)
 *     (onRead)="decodedOutput(string)" </qr-scanner>
 *
 * @public
 * startScanning() {void}       Method called by ngInit to find devices and start scanning.
 * stopScanning() {void}        Method called by ngDestroy (or on successful qr-scan) to stop scanning
 *
 * Both of these methods can be called to control the scanner if `stopAfterScan` is set to `false`
 */
@Component({
    moduleId: 'module.id',
    selector: 'qr-scanner',
    styles: [
        ':host video {height: auto; width: 100%;}',
        ':host .mirrored { transform: rotateY(180deg); -webkit-transform:rotateY(180deg); -moz-transform:rotateY(180deg); }'
    ],
    template: `
        <ng-container [ngSwitch]="supported">
            <ng-container *ngSwitchDefault>
                <canvas #qrCanvas [width]="canvasWidth" [height]="canvasHeight" hidden="true"></canvas>
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
export class QrScannerComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() canvasWidth = 640;
    @Input() canvasHeight = 480;
    @Input() facing: 'environment' | string = 'environment';
    @Input() debug = false;
    @Input() mirror = false;
    @Input() stopAfterScan = true;
    @Input() updateTime = 500;

    @Output() onRead: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('videoWrapper') videoWrapper: ElementRef;
    @ViewChild('qrCanvas') qrCanvas: ElementRef;

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
    public supported = true;

    private captureTimeout: any;

    constructor(private renderer: Renderer2, private element: ElementRef) {
        this.nativeElement = this.element.nativeElement;
        this.supported = this.isCanvasSupported();
    }

    ngOnInit() {
        if (this.debug) {
            console.log(`[QrScanner] QR Scanner init, facing ${this.facing}`);
        }
    }

    ngAfterViewInit(): void {
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
        if (this.stream) {
            let tracks = this.stream.getTracks();
            if (tracks && tracks.length && tracks)
                tracks[0].stop();
        }
        this.stop = true;
    }

    private isCanvasSupported(): boolean {
        const canvas = this.renderer.createElement('canvas');
        return !!(canvas.getContext && canvas.getContext('2d'));
    }

    private initCanvas(w: number, h: number): void {
        this.qrCanvas.nativeElement.style.width = `${w}px`;
        this.qrCanvas.nativeElement.style.height = `${h}px`;
        this.gCtx = this.qrCanvas.nativeElement.getContext('2d');
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
            self.captureTimeout = setTimeout(captureToCanvas, self.updateTime);
        }

        function error(): void {
            self.gUM = false;
            return;
        }

        function captureToCanvas(): void {
            if (self.stop || !self.isDeviceConnected) {
                return;
            }
            if (self.gUM) {
                try {
                    self.gCtx.drawImage(self.videoElement, 0, 0, self.canvasWidth, self.canvasHeight);
                    self.qrCode.decode(self.qrCanvas.nativeElement);
                } catch (e) {
                    if (this.debug) {
                        console.log(e);
                    }
                    self.captureTimeout = setTimeout(captureToCanvas, self.updateTime);
                }
            }
        }

        if (this.isDeviceConnected && !this.captureTimeout) {
            this.captureTimeout = setTimeout(captureToCanvas, this.updateTime);
            return;
        }

        const _navigator: any = navigator;

        if (!this.videoElement) {
            this.videoElement = this.renderer.createElement('video');
            this.videoElement.setAttribute('autoplay', 'true');
            this.renderer.appendChild(this.videoWrapper.nativeElement, this.videoElement);
        }


        if (!this.mirror) { this.videoElement.classList.add('mirrored') }


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
        this.captureTimeout = setTimeout(captureToCanvas, this.updateTime);
    }

    private get findMediaDevices(): Promise<{ deviceId: { exact: string }, facingMode: string } | boolean> {

        const videoDevice =
            (dvc: MediaDeviceInfo) => dvc.kind === 'videoinput' && dvc.label.search(/back/i) > -1;

        return new Promise((resolve, reject) => {
            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                try {
                    navigator.mediaDevices.enumerateDevices()
                        .then((devices: MediaDeviceInfo[]) => {
                            const device = devices.find((_device: MediaDeviceInfo) => videoDevice(_device));
                            if (device) {
                                resolve({ 'deviceId': { 'exact': device.deviceId }, 'facingMode': this.facing });
                            } else {
                                resolve(true);
                            }
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
            this.initCanvas(this.canvasHeight, this.canvasWidth);
            this.qrCode = new QRCode();
            this.qrCode.myCallback = (decoded: string) => this.decodeCallback(decoded);

            this.findMediaDevices.then((options) => this.connectDevice(options));
        }
    }
}
