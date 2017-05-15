"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var qrscanner_component_1 = require("./src/qrscanner.component");
__export(require("./src/qrscanner.component"));
var QrScannerModule = (function () {
    function QrScannerModule() {
    }
    QrScannerModule.forRoot = function () {
        return {
            ngModule: QrScannerModule
        };
    };
    return QrScannerModule;
}());
QrScannerModule.decorators = [
    { type: core_1.NgModule, args: [{
                imports: [
                    common_1.CommonModule
                ],
                declarations: [
                    qrscanner_component_1.QrScannerComponent
                ],
                exports: [
                    qrscanner_component_1.QrScannerComponent
                ]
            },] },
];
/** @nocollapse */
QrScannerModule.ctorParameters = function () { return []; };
exports.QrScannerModule = QrScannerModule;
//# sourceMappingURL=index.js.map