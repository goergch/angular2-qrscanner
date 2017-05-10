import { OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { QRCode } from './qrdecode/qrcode';
export declare class QrScannerComponent implements OnInit, OnDestroy {
    width: number;
    height: number;
    facing: string;
    onRead: EventEmitter<string>;
    gCanvas: HTMLCanvasElement;
    gCtx: CanvasRenderingContext2D;
    qrCode: QRCode;
    stype: number;
    gUM: boolean;
    v: HTMLVideoElement;
    webkit: boolean;
    moz: boolean;
    stream: any;
    stop: boolean;
    constructor();
    ngOnInit(): void;
    ngOnDestroy(): void;
    startScanning(): void;
    stopScanning(): void;
    isCanvasSupported(): boolean;
    initCanvas(w: number, h: number): void;
    setwebcam2(options: any): void;
    setwebcam(): void;
    load(): void;
}
