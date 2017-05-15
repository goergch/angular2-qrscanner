"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var qrcode_1 = require("./qrdecode/qrcode");
var QrScannerComponent = (function () {
    function QrScannerComponent(renderer, element) {
        this.renderer = renderer;
        this.element = element;
        this.width = 640;
        this.height = 480;
        this.facing = 'environment';
        this.debug = false;
        this.mirror = false;
        this.stopAfterScan = false;
        this.onRead = new core_1.EventEmitter();
        this.qrCode = null;
        this.isDeviceConnected = false;
        this.gUM = false;
        this.isWebkit = false;
        this.isMoz = false;
        this.stop = false;
        this.supported = false;
        this.nativeElement = this.element.nativeElement;
        this.supported = this.isCanvasSupported();
    }
    QrScannerComponent.prototype.ngOnInit = function () {
        if (this.debug) {
            console.log("[QrScanner] QR Scanner init, facing " + this.facing);
        }
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
        this.stream.getTracks()[0].stop();
        this.stop = true;
    };
    QrScannerComponent.prototype.isCanvasSupported = function () {
        var canvas = this.renderer.createElement('canvas');
        return !!(canvas.getContext() && canvas.getContext('2d'));
    };
    QrScannerComponent.prototype.initCanvas = function (w, h) {
        this.qrCanvas.width = w;
        this.qrCanvas.height = h;
        this.gCtx = this.qrCanvas.getContext('2d');
        this.gCtx.clearRect(0, 0, w, h);
        if (!this.mirror) {
            this.gCtx.translate(-1, 1);
        }
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
            this.captureTimeout = setTimeout(captureToCanvas, 500);
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
                    self.gCtx.drawImage(self.videoElement, 0, 0, self.width, self.height);
                    self.qrCode.decode(self.qrCanvas);
                }
                catch (e) {
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
        var _navigator = navigator;
        this.videoElement = this.renderer.createElement('videoWrapper');
        this.videoElement.setAttribute('autoplay', 'true');
        this.renderer.appendChild(this.videoWrapper, this.videoElement);
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
        this.captureTimeout = setTimeout(captureToCanvas, 500);
    };
    Object.defineProperty(QrScannerComponent.prototype, "findMediaDevices", {
        get: function () {
            var _this = this;
            var videoDevice = function (device) { return device.kind === 'videoinput' && device.label.search(/back/i) > -1; };
            return new Promise(function (resolve, reject) {
                if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                    try {
                        navigator.mediaDevices.enumerateDevices()
                            .then(function (devices) {
                            var device = devices.find(function (_device) { return videoDevice(_device); });
                            var options = { 'deviceId': { 'exact': device.deviceId }, 'facingMode': _this.facing };
                            resolve(options);
                        });
                    }
                    catch (e) {
                        if (_this.debug) {
                            console.log(e);
                        }
                        reject(e);
                    }
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
            this.initCanvas(this.height, this.width);
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
                styles: [':host videoWrapper {height: auto; width: 100%;}'],
                template: "\n        <ng-container [ngSwitch]=\"supported\">\n            <ng-container *ngSwitchDefault>\n                <canvas #qrCanvas hidden=\"true\"></canvas>\n                <div #videoWrapper></div>\n            </ng-container>\n            <ng-container *ngSwitchCase=\"false\">\n                <p>\n                    You are using an <strong>outdated</strong> browser.\n                    Please <a href=\"http://browsehappy.com/\">upgrade your browser</a> to improve your experience.\n                </p>\n            </ng-container>\n        </ng-container>"
            },] },
];
/** @nocollapse */
QrScannerComponent.ctorParameters = function () { return [
    { type: core_1.Renderer2, },
    { type: core_1.ElementRef, },
]; };
QrScannerComponent.propDecorators = {
    'width': [{ type: core_1.Input },],
    'height': [{ type: core_1.Input },],
    'facing': [{ type: core_1.Input },],
    'debug': [{ type: core_1.Input },],
    'mirror': [{ type: core_1.Input },],
    'stopAfterScan': [{ type: core_1.Input },],
    'onRead': [{ type: core_1.Output },],
    'videoWrapper': [{ type: core_1.ViewChild, args: ['videoWrapper',] },],
    'qrCanvas': [{ type: core_1.ViewChild, args: ['qrCanvas',] },],
};
exports.QrScannerComponent = QrScannerComponent;
//# sourceMappingURL=qrscanner.component.js.map