"use strict";
/*
  Ported to JavaScript by Lazar Laszlo 2011
  
  lazarsoft@gmail.com, www.lazarsoft.info
  
*/
Object.defineProperty(exports, "__esModule", { value: true });
/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var DataMask000 = (function () {
    function DataMask000() {
        this.isMasked = function (i, j) {
            return ((i + j) & 0x01) == 0;
        };
    }
    DataMask000.prototype.unmaskBitMatrix = function (bits, dimension) {
        for (var i = 0; i < dimension; i++) {
            for (var j = 0; j < dimension; j++) {
                if (this.isMasked(i, j)) {
                    bits.flip(j, i);
                }
            }
        }
    };
    return DataMask000;
}());
exports.DataMask000 = DataMask000;
var DataMask001 = (function () {
    function DataMask001() {
        this.isMasked = function (i, j) {
            return (i & 0x01) == 0;
        };
    }
    DataMask001.prototype.unmaskBitMatrix = function (bits, dimension) {
        for (var i = 0; i < dimension; i++) {
            for (var j = 0; j < dimension; j++) {
                if (this.isMasked(i, j)) {
                    bits.flip(j, i);
                }
            }
        }
    };
    return DataMask001;
}());
exports.DataMask001 = DataMask001;
var DataMask010 = (function () {
    function DataMask010() {
        this.isMasked = function (i, j) {
            return j % 3 == 0;
        };
    }
    DataMask010.prototype.unmaskBitMatrix = function (bits, dimension) {
        for (var i = 0; i < dimension; i++) {
            for (var j = 0; j < dimension; j++) {
                if (this.isMasked(i, j)) {
                    bits.flip(j, i);
                }
            }
        }
    };
    return DataMask010;
}());
exports.DataMask010 = DataMask010;
var DataMask011 = (function () {
    function DataMask011() {
        this.isMasked = function (i, j) {
            return (i + j) % 3 == 0;
        };
    }
    DataMask011.prototype.unmaskBitMatrix = function (bits, dimension) {
        for (var i = 0; i < dimension; i++) {
            for (var j = 0; j < dimension; j++) {
                if (this.isMasked(i, j)) {
                    bits.flip(j, i);
                }
            }
        }
    };
    return DataMask011;
}());
exports.DataMask011 = DataMask011;
var DataMask100 = (function () {
    function DataMask100() {
        this.isMasked = function (i, j) {
            return (((this.URShift(i, 1)) + (j / 3)) & 0x01) == 0;
        };
    }
    DataMask100.prototype.unmaskBitMatrix = function (bits, dimension) {
        for (var i = 0; i < dimension; i++) {
            for (var j = 0; j < dimension; j++) {
                if (this.isMasked(i, j)) {
                    bits.flip(j, i);
                }
            }
        }
    };
    DataMask100.prototype.URShift = function (number, bits) {
        if (number >= 0)
            return number >> bits;
        else
            return (number >> bits) + (2 << ~bits);
    };
    return DataMask100;
}());
exports.DataMask100 = DataMask100;
var DataMask101 = (function () {
    function DataMask101() {
        this.isMasked = function (i, j) {
            var temp = i * j;
            return (temp & 0x01) + (temp % 3) == 0;
        };
    }
    DataMask101.prototype.unmaskBitMatrix = function (bits, dimension) {
        for (var i = 0; i < dimension; i++) {
            for (var j = 0; j < dimension; j++) {
                if (this.isMasked(i, j)) {
                    bits.flip(j, i);
                }
            }
        }
    };
    return DataMask101;
}());
exports.DataMask101 = DataMask101;
var DataMask110 = (function () {
    function DataMask110() {
        this.isMasked = function (i, j) {
            var temp = i * j;
            return (((temp & 0x01) + (temp % 3)) & 0x01) == 0;
        };
    }
    DataMask110.prototype.unmaskBitMatrix = function (bits, dimension) {
        for (var i = 0; i < dimension; i++) {
            for (var j = 0; j < dimension; j++) {
                if (this.isMasked(i, j)) {
                    bits.flip(j, i);
                }
            }
        }
    };
    return DataMask110;
}());
exports.DataMask110 = DataMask110;
var DataMask111 = (function () {
    function DataMask111() {
        this.isMasked = function (i, j) {
            return ((((i + j) & 0x01) + ((i * j) % 3)) & 0x01) == 0;
        };
    }
    DataMask111.prototype.unmaskBitMatrix = function (bits, dimension) {
        for (var i = 0; i < dimension; i++) {
            for (var j = 0; j < dimension; j++) {
                if (this.isMasked(i, j)) {
                    bits.flip(j, i);
                }
            }
        }
    };
    return DataMask111;
}());
exports.DataMask111 = DataMask111;
var DataMask = (function () {
    function DataMask() {
    }
    DataMask.forReference = function (reference) {
        if (reference < 0 || reference > 7) {
            throw "System.ArgumentException";
        }
        return DataMask.DATA_MASKS[reference];
    };
    DataMask.DATA_MASKS = new Array(new DataMask000(), new DataMask001(), new DataMask010(), new DataMask011(), new DataMask100(), new DataMask101(), new DataMask110(), new DataMask111());
    return DataMask;
}());
exports.DataMask = DataMask;
//# sourceMappingURL=datamask.js.map