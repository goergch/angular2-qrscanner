import { OnInit, EventEmitter } from '@angular/core';
import { QRCode } from './qrdecode/qrcode';
export declare class QrScannerComponent implements OnInit {
    facing: string;
    onRead: EventEmitter<string>;
    gCanvas: HTMLCanvasElement;
    gCtx: CanvasRenderingContext2D;
    qrCode: QRCode;
    stype: number;
    gUM: boolean;
    vidhtml: string;
    v: HTMLVideoElement;
    webkit: boolean;
    moz: boolean;
    stream: any;
    stop: boolean;
    constructor();
    ngOnInit(): void;
    isCanvasSupported(): boolean;
    initCanvas(w: number, h: number): void;
    setwebcam2(options: any): void;
    setwebcam(): void;
    load(): void;
}
