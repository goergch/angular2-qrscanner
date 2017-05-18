"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var qrcode_1 = require("./qrdecode/qrcode");
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
var QrScannerComponent = (function () {
    function QrScannerComponent(renderer, element) {
        this.renderer = renderer;
        this.element = element;
        this.canvasWidth = 640;
        this.canvasHeight = 480;
        this.facing = 'environment';
        this.debug = false;
        this.mirror = false;
        this.stopAfterScan = true;
        this.updateTime = 500;
        this.onRead = new core_1.EventEmitter();
        this.qrCode = null;
        this.isDeviceConnected = false;
        this.gUM = false;
        this.isWebkit = false;
        this.isMoz = false;
        this.stop = false;
        this.supported = true;
        this.nativeElement = this.element.nativeElement;
        this.supported = this.isCanvasSupported();
    }
    QrScannerComponent.prototype.ngOnInit = function () {
        if (this.debug) {
            console.log("[QrScanner] QR Scanner init, facing " + this.facing);
        }
    };
    QrScannerComponent.prototype.ngAfterViewInit = function () {
        this.load();
    };
    QrScannerComponent.prototype.ngOnDestroy = function () {
        this.stopScanning();
    };
    QrScannerComponent.prototype.startScanning = function () {
        this.load();
    };
    QrScannerComponent.prototype.stopScanning = function () {
        if (this.captureTimeout) {
            clearTimeout(this.captureTimeout);
            this.captureTimeout = false;
        }
        if (this.stream.getTracks().length > 0) {
            this.stream.getTracks()[0].stop();
        }
        this.stop = true;
    };
    QrScannerComponent.prototype.isCanvasSupported = function () {
        var canvas = this.renderer.createElement('canvas');
        return !!(canvas.getContext && canvas.getContext('2d'));
    };
    QrScannerComponent.prototype.initCanvas = function (w, h) {
        this.qrCanvas.nativeElement.style.width = w + "px";
        this.qrCanvas.nativeElement.style.height = h + "px";
        this.gCtx = this.qrCanvas.nativeElement.getContext('2d');
        this.gCtx.clearRect(0, 0, w, h);
        // if (!this.mirror) { this.gCtx.translate(-1, 1); }
    };
    QrScannerComponent.prototype.connectDevice = function (options) {
        var self = this;
        function success(stream) {
            self.stream = stream;
            if (self.isWebkit || self.isMoz) {
                self.videoElement.src = window.URL.createObjectURL(stream);
            }
            else {
                self.videoElement.src = stream;
            }
            self.gUM = true;
            self.captureTimeout = setTimeout(captureToCanvas, self.updateTime);
        }
        function error(error) {
            this.gUM = false;
            return;
        }
        function captureToCanvas() {
            if (self.stop || !self.isDeviceConnected) {
                return;
            }
            if (self.gUM) {
                try {
                    self.gCtx.drawImage(self.videoElement, 0, 0, self.canvasWidth, self.canvasHeight);
                    self.qrCode.decode(self.qrCanvas.nativeElement);
                }
                catch (e) {
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
        var _navigator = navigator;
        this.videoElement = this.renderer.createElement('video');
        this.videoElement.setAttribute('autoplay', 'true');
        if (!this.mirror) {
            this.videoElement.classList.add('mirrored');
        }
        this.renderer.appendChild(this.videoWrapper.nativeElement, this.videoElement);
        if (_navigator.getUserMedia) {
            this.isWebkit = true;
            _navigator.getUserMedia({ video: options, audio: false }, success, error);
        }
        else if (_navigator.webkitGetUserMedia) {
            this.isWebkit = true;
            _navigator.webkitGetUserMedia({ video: options, audio: false }, success, error);
        }
        else if (_navigator.mozGetUserMedia) {
            this.isMoz = true;
            _navigator.mozGetUserMedia({ video: options, audio: false }, success, error);
        }
        this.isDeviceConnected = true;
        this.captureTimeout = setTimeout(captureToCanvas, this.updateTime);
    };
    Object.defineProperty(QrScannerComponent.prototype, "findMediaDevices", {
        get: function () {
            var _this = this;
            var videoDevice = function (dvc) { return dvc.kind === 'videoinput' && dvc.label.search(/back/i) > -1; };
            return new Promise(function (resolve, reject) {
                if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                    navigator.mediaDevices.enumerateDevices()
                        .then(function (devices) {
                        var device = devices.find(function (_device) { return videoDevice(_device); });
                        if (device) {
                            resolve({ 'deviceId': { 'exact': device.deviceId }, 'facingMode': _this.facing });
                        }
                        else {
                            resolve(true);
                        }
                    })
                        .catch(function (error) { reject(error); });
                }
                else {
                    if (_this.debug) {
                        console.log('[QrScanner] no navigator.mediaDevices.enumerateDevices');
                    }
                    resolve(true);
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    QrScannerComponent.prototype.decodeCallback = function (decoded) {
        this.onRead.emit(decoded);
        if (this.stopAfterScan) {
            this.stopScanning();
        }
    };
    QrScannerComponent.prototype.load = function () {
        var _this = this;
        this.stop = false;
        this.isDeviceConnected = false;
        if (this.supported) {
            this.initCanvas(this.canvasHeight, this.canvasWidth);
            this.qrCode = new qrcode_1.QRCode();
            this.qrCode.myCallback = function (decoded) { return _this.decodeCallback(decoded); };
            this.findMediaDevices.then(function (options) { return _this.connectDevice(options); });
        }
    };
    return QrScannerComponent;
}());
QrScannerComponent.decorators = [
    { type: core_1.Component, args: [{
                moduleId: 'module.id',
                selector: 'qr-scanner',
                styles: [
                    ':host video {height: auto; width: 100%;}',
                    ':host .mirrored { transform: rotateY(180deg); -webkit-transform:rotateY(180deg); -moz-transform:rotateY(180deg); }'
                ],
                template: "\n        <ng-container [ngSwitch]=\"supported\">\n            <ng-container *ngSwitchDefault>\n                <canvas #qrCanvas [width]=\"canvasWidth\" [height]=\"canvasHeight\" hidden=\"true\"></canvas>\n                <div #videoWrapper></div>\n            </ng-container>\n            <ng-container *ngSwitchCase=\"false\">\n                <p>\n                    You are using an <strong>outdated</strong> browser.\n                    Please <a href=\"http://browsehappy.com/\">upgrade your browser</a> to improve your experience.\n                </p>\n            </ng-container>\n        </ng-container>"
            },] },
];
/** @nocollapse */
QrScannerComponent.ctorParameters = function () { return [
    { type: core_1.Renderer2, },
    { type: core_1.ElementRef, },
]; };
QrScannerComponent.propDecorators = {
    'canvasWidth': [{ type: core_1.Input },],
    'canvasHeight': [{ type: core_1.Input },],
    'facing': [{ type: core_1.Input },],
    'debug': [{ type: core_1.Input },],
    'mirror': [{ type: core_1.Input },],
    'stopAfterScan': [{ type: core_1.Input },],
    'updateTime': [{ type: core_1.Input },],
    'onRead': [{ type: core_1.Output },],
    'videoWrapper': [{ type: core_1.ViewChild, args: ['videoWrapper',] },],
    'qrCanvas': [{ type: core_1.ViewChild, args: ['qrCanvas',] },],
};
exports.QrScannerComponent = QrScannerComponent;
//# sourceMappingURL=qrscanner.component.js.map