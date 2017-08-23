import { OnInit, EventEmitter, OnDestroy, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
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
export declare class QrScannerComponent implements OnInit, OnDestroy, AfterViewInit {
    private renderer;
    private element;
    canvasWidth: number;
    canvasHeight: number;
    facing: 'environment' | string;
    debug: boolean;
    mirror: boolean;
    stopAfterScan: boolean;
    updateTime: number;
    onRead: EventEmitter<string>;
    videoWrapper: ElementRef;
    qrCanvas: ElementRef;
    private gCtx;
    private qrCode;
    private isDeviceConnected;
    private gUM;
    private videoElement;
    private isWebkit;
    private isMoz;
    private stream;
    private stop;
    private nativeElement;
    supported: boolean;
    private captureTimeout;
    constructor(renderer: Renderer2, element: ElementRef);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    startScanning(): void;
    stopScanning(): void;
    private isCanvasSupported();
    private initCanvas(w, h);
    private connectDevice(options);
    private readonly findMediaDevices;
    private decodeCallback(decoded);
    private load();
}
