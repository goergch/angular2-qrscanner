"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var qrcode_1 = require("./qrdecode/qrcode");
var QrScannerComponent = (function () {
    function QrScannerComponent() {
        this.onRead = new core_1.EventEmitter();
        this.qrCode = new qrcode_1.QRCode();
        this.stype = 0;
        this.gUM = false;
        this.vidhtml = '<video id="v" autoplay></video>';
        this.webkit = false;
        this.moz = false;
        this.stop = false;
    }
    QrScannerComponent.prototype.ngOnInit = function () {
        console.log("QR Scanner init, facing " + this.facing);
        this.load();
    };
    QrScannerComponent.prototype.ngOnDestroy = function () {
        this.stopScanning();
    };
    QrScannerComponent.prototype.stopScanning = function () {
        this.stream.getTracks()[0].stop();
        this.stop = true;
    };
    QrScannerComponent.prototype.isCanvasSupported = function () {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };
    QrScannerComponent.prototype.initCanvas = function (w, h) {
        this.gCanvas = document.getElementById("qr-canvas");
        this.gCanvas.style.width = w + "px";
        this.gCanvas.style.height = h + "px";
        this.gCanvas.width = w;
        this.gCanvas.height = h;
        this.gCtx = this.gCanvas.getContext("2d");
        this.gCtx.clearRect(0, 0, w, h);
    };
    QrScannerComponent.prototype.setwebcam2 = function (options) {
        var self = this;
        function success(stream) {
            self.stream = stream;
            if (self.webkit || self.moz)
                self.v.src = window.URL.createObjectURL(stream);
            else
                self.v.src = stream;
            self.gUM = true;
            setTimeout(captureToCanvas, 500);
        }
        function error(error) {
            this.gUM = false;
            return;
        }
        function captureToCanvas() {
            if (self.stop == true)
                return;
            if (self.stype != 1)
                return;
            if (self.gUM) {
                try {
                    self.gCtx.drawImage(self.v, 0, 0);
                    try {
                        self.qrCode.decode(self.gCanvas);
                    }
                    catch (e) {
                        console.log(e);
                        setTimeout(captureToCanvas, 500);
                    }
                    ;
                }
                catch (e) {
                    console.log(e);
                    setTimeout(captureToCanvas, 500);
                }
                ;
            }
        }
        console.log(options);
        // document.getElementById("result").innerHTML="- scanning -";
        if (this.stype == 1) {
            setTimeout(captureToCanvas, 500);
            return;
        }
        var n = navigator;
        document.getElementById("outdiv").innerHTML = this.vidhtml;
        this.v = document.getElementById("v");
        if (n.getUserMedia) {
            this.webkit = true;
            n.getUserMedia({ video: options, audio: false }, success, error);
        }
        else if (n.webkitGetUserMedia) {
            this.webkit = true;
            n.webkitGetUserMedia({ video: options, audio: false }, success, error);
        }
        else if (n.mozGetUserMedia) {
            this.moz = true;
            n.mozGetUserMedia({ video: options, audio: false }, success, error);
        }
        // document.getElementById("qrimg").style.opacity=0.2;
        // document.getElementById("webcamimg").style.opacity=1.0;
        this.stype = 1;
        setTimeout(captureToCanvas, 500);
    };
    QrScannerComponent.prototype.setwebcam = function () {
        var options = true;
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            try {
                var self = this;
                navigator.mediaDevices.enumerateDevices()
                    .then(function (devices) {
                    devices.forEach(function (device) {
                        if (device.kind === 'videoinput') {
                            if (device.label.toLowerCase().search("back") > -1)
                                options = { 'deviceId': { 'exact': device.deviceId }, 'facingMode': 'environment' };
                        }
                        console.log(device.kind + ": " + device.label + " id = " + device.deviceId + "facingMode = " + device);
                    });
                    self.setwebcam2(options);
                });
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            console.log("no navigator.mediaDevices.enumerateDevices");
            this.setwebcam2(options);
        }
    };
    QrScannerComponent.prototype.load = function () {
        var self = this;
        function read(a) {
            self.onRead.emit(a);
            self.stream.getTracks()[0].stop();
            self.stop = true;
        }
        if (this.isCanvasSupported()) {
            this.initCanvas(800, 600);
            this.qrCode.myCallback = read;
            this.setwebcam();
        }
        else {
            document.getElementById("mainbody").style.display = "inline";
            document.getElementById("mainbody").innerHTML = '<p id="mp1">QR code scanner for HTML5 capable browsers</p><br>' +
                '<br><p id="mp2">sorry your browser is not supported</p><br><br>' +
                '<p id="mp1">try <a href="http://www.mozilla.com/firefox"><img src="firefox.png"/></a> or <a href="http://chrome.google.com"><img src="chrome_logo.gif"/></a> or <a href="http://www.opera.com"><img src="Opera-logo.png"/></a></p>';
        }
    };
    return QrScannerComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], QrScannerComponent.prototype, "facing", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], QrScannerComponent.prototype, "onRead", void 0);
QrScannerComponent = __decorate([
    core_1.Component({
        moduleId: 'module.id',
        selector: 'qr-scanner',
        template: "\n    <canvas id=\"qr-canvas\" width=\"640\" height=\"480\" hidden=\"true\"></canvas>\n    <div id=\"outdiv\"></div>\n    <div id=\"mainbody\"></div>\n"
    }),
    __metadata("design:paramtypes", [])
], QrScannerComponent);
exports.QrScannerComponent = QrScannerComponent;
//# sourceMappingURL=qrscanner.component.js.map