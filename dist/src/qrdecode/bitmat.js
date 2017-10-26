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
var BitMatrix = /** @class */ (function () {
    function BitMatrix(width, height) {
        if (!height)
            height = width;
        if (width < 1 || height < 1) {
            throw "Both dimensions must be greater than 0";
        }
        this.width = width;
        this.height = height;
        this.rowSize = width >> 5;
        if ((width & 0x1f) != 0) {
            this.rowSize++;
        }
        this.bits = new Array(this.rowSize * height);
        for (var i = 0; i < this.bits.length; i++)
            this.bits[i] = 0;
    }
    Object.defineProperty(BitMatrix.prototype, "Width", {
        get: function () {
            return this.width;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(BitMatrix.prototype, "Height", {
        get: function () {
            return this.height;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(BitMatrix.prototype, "Dimension", {
        get: function () {
            if (this.width != this.height) {
                throw "Can't call getDimension() on a non-square matrix";
            }
            return this.width;
        },
        enumerable: true,
        configurable: true
    });
    ;
    BitMatrix.prototype.URShift = function (number, bits) {
        if (number >= 0)
            return number >> bits;
        else
            return (number >> bits) + (2 << ~bits);
    };
    BitMatrix.prototype.get_Renamed = function (x, y) {
        var offset = y * this.rowSize + (x >> 5);
        return ((this.URShift(this.bits[offset], (x & 0x1f))) & 1) != 0;
    };
    BitMatrix.prototype.set_Renamed = function (x, y) {
        var offset = y * this.rowSize + (x >> 5);
        this.bits[offset] |= 1 << (x & 0x1f);
    };
    BitMatrix.prototype.flip = function (x, y) {
        var offset = y * this.rowSize + (x >> 5);
        this.bits[offset] ^= 1 << (x & 0x1f);
    };
    BitMatrix.prototype.clear = function () {
        var max = this.bits.length;
        for (var i = 0; i < max; i++) {
            this.bits[i] = 0;
        }
    };
    BitMatrix.prototype.setRegion = function (left, top, width, height) {
        if (top < 0 || left < 0) {
            throw "Left and top must be nonnegative";
        }
        if (height < 1 || width < 1) {
            throw "Height and width must be at least 1";
        }
        var right = left + width;
        var bottom = top + height;
        if (bottom > this.height || right > this.width) {
            throw "The region must fit inside the matrix";
        }
        for (var y = top; y < bottom; y++) {
            var offset = y * this.rowSize;
            for (var x = left; x < right; x++) {
                this.bits[offset + (x >> 5)] |= 1 << (x & 0x1f);
            }
        }
    };
    return BitMatrix;
}());
exports.BitMatrix = BitMatrix;
//# sourceMappingURL=bitmat.js.map