import {
  AfterViewInit,
  Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output,
  ViewChild, Renderer2
} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {QRCode} from './lib/qr-decoder/qrcode';


@Component({
  selector: 'qr-scanner',
  styles: [
    ':host video {height: auto; width: 100%;}',
    ':host .mirrored { transform: rotateY(180deg); -webkit-transform:rotateY(180deg); -moz-transform:rotateY(180deg); }',
    ':host {}'
  ],
  template: `
    <ng-container [ngSwitch]="isCanvasSupported">
      <ng-container *ngSwitchDefault>
        <canvas #qrCanvas hidden="true"></canvas>
        <div #videoWrapper [style.width]="canvasWidth" [style.height]="canvasHeight"></div>
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
  @Input() debug = false;
  @Input() stopAfterScan = true;
  @Input() updateTime = 500;

  @Output() capturedQr: EventEmitter<string> = new EventEmitter();
  @Output() foundCameras: EventEmitter<MediaDeviceInfo[]> = new EventEmitter();

  @ViewChild('videoWrapper') videoWrapper: ElementRef;
  @ViewChild('qrCanvas') qrCanvas: ElementRef;

  @Input() chooseCamera: Subject<MediaDeviceInfo> = new Subject();

  private chooseCamera$: Subscription;

  public gCtx: CanvasRenderingContext2D;
  public videoElement: HTMLVideoElement;
  public qrCode: QRCode;
  public stream: MediaStream;
  public captureTimeout: number;

  get isCanvasSupported(): boolean {
    const canvas = this.renderer.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  }

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
  }

  ngOnDestroy() {
    this.chooseCamera$.unsubscribe();
    this.stopScanning();
  }

  ngAfterViewInit() {
    if (this.debug) console.log('[QrScanner] ViewInit, isSupported: ', this.isCanvasSupported);
    if (this.isCanvasSupported) {
      this.gCtx = this.qrCanvas.nativeElement.getContext('2d');
      this.gCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.qrCode = new QRCode();
      this.qrCode.myCallback = (decoded: string) => this.QrDecodeCallback(decoded);
    }
    this.chooseCamera$ = this.chooseCamera.subscribe((camera: MediaDeviceInfo) => this.useDevice(camera));
    this.getMediaDevices().then(devices => this.foundCameras.next(devices));
  }

  startScanning(device: MediaDeviceInfo) {
    if (!device) {
      console.log(`[QrScanner] a MediaDeviceInfo is needed. Grab one with getMediaDevices`);
      return;
    }
    this.useDevice(device);
  }

  stopScanning() {

    if (this.captureTimeout) {
      clearTimeout(this.captureTimeout);
      this.captureTimeout = 0;
    }

    const stream = this.stream && this.stream.getTracks().length && this.stream;
    if (stream)
      stream.getTracks().forEach(track => track.enabled && track.stop())
  }

  getMediaDevices(): Promise<MediaDeviceInfo[]> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return Promise.resolve([]);
    return navigator.mediaDevices.enumerateDevices()
      .then((devices: MediaDeviceInfo[]) => devices)
      .catch((error: any): any[] => {
        if (this.debug) console.warn('Error', error);
        return [];
      });
  }

  private QrDecodeCallback(decoded: string) {
    this.capturedQr.next(decoded);
    if (this.stopAfterScan) {
      clearTimeout(this.captureTimeout);
      this.captureTimeout = 0;
    }
  }

  private setStream(stream: any) {
    this.stream = stream;
    this.videoElement.src = window.URL.createObjectURL(stream);
    this.captureTimeout = setTimeout(() => {}, 0);
  }

  private useDevice(_device: MediaDeviceInfo) {
    const _navigator: any = navigator;
    const device = { video: {deviceId: { exact: _device.deviceId }, facingMode: '' }, audio: false};

    if (this.captureTimeout) this.stopScanning();

    if (!this.videoElement) {
      this.videoElement = this.renderer.createElement('video');
      this.videoElement.setAttribute('autoplay', 'true');
      this.renderer.appendChild(this.videoWrapper.nativeElement, this.videoElement);
    }

    if (_navigator.getUserMedia) {
      _navigator.getUserMedia(device,
        (stream: ObjectURLOptions) => this.setStream(stream),
        (error: any) => this.debug && console.warn('Error', error));
    } else if (_navigator.webkitGetUserMedia) {
      _navigator.webkitGetUserMedia(device,
        (stream: ObjectURLOptions) => this.setStream(stream),
        (error: any) => this.debug && console.warn('Error', error));
    } else if (_navigator.mozGetUserMedia) {
      _navigator.mozGetUserMedia(device,
        (stream: any) => this.debug && this.setStream(stream),
        (error: any) => console.warn('Error', error));
    }
  }

}
