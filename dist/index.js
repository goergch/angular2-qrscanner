"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var qrscanner_component_1 = require("./src/qrscanner.component");
__export(require("./src/qrscanner.component"));
var QrScannerModule = /** @class */ (function () {
    function QrScannerModule() {
    }
    QrScannerModule_1 = QrScannerModule;
    QrScannerModule.forRoot = function () {
        return {
            ngModule: QrScannerModule_1
        };
    };
    QrScannerModule = QrScannerModule_1 = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule
            ],
            declarations: [
                qrscanner_component_1.QrScannerComponent
            ],
            exports: [
                qrscanner_component_1.QrScannerComponent
            ]
        })
    ], QrScannerModule);
    return QrScannerModule;
    var QrScannerModule_1;
}());
exports.QrScannerModule = QrScannerModule;
//# sourceMappingURL=index.js.map