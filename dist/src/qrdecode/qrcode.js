"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var detector_1 = require("./detector");
var decoder_1 = require("./decoder");
/*
   Copyright 2011 Lazar Laszlo (lazarsoft@gmail.com, www.lazarsoft.info)
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var QRCode = /** @class */ (function () {
    function QRCode() {
        this.debug = false;
        this.maxImgSize = 1024 * 1024;
        this.sizeOfDataLengthInfo = [[10, 9, 8, 8], [12, 11, 16, 10], [14, 13, 16, 12]];
    }
    QRCode.prototype.decode = function (canvas) {
        var context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.imagedata = context.getImageData(0, 0, this.width, this.height);
        this.result = this.process(context);
        if (this.myCallback != null)
            this.myCallback(this.result);
        return this.result;
    };
    QRCode.prototype.process = function (context) {
        var start = new Date().getTime();
        var image = this.grayScaleToBitmap(this.grayscale());
        if (this.debug) {
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var point = (x * 4) + (y * this.width * 4);
                    this.imagedata.data[point] = image[x + y * this.width] ? 0 : 0;
                    this.imagedata.data[point + 1] = image[x + y * this.width] ? 0 : 0;
                    this.imagedata.data[point + 2] = image[x + y * this.width] ? 255 : 0;
                }
            }
            context.putImageData(this.imagedata, 0, 0);
        }
        var detector = new detector_1.Detector(image, this.imagedata, this.width, this.height);
        var qRCodeMatrix = detector.detect();
        if (this.debug)
            context.putImageData(this.imagedata, 0, 0);
        var decoder = new decoder_1.Decoder();
        var reader = decoder.decode(qRCodeMatrix.bits);
        var data = reader.DataByte;
        var str = "";
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++)
                str += String.fromCharCode(data[i][j]);
        }
        var end = new Date().getTime();
        var time = end - start;
        console.log(time);
        return str;
    };
    QRCode.prototype.grayScaleToBitmap = function (grayScale) {
        var middle = this.getMiddleBrightnessPerArea(grayScale);
        var sqrtNumArea = middle.length;
        var areaWidth = Math.floor(this.width / sqrtNumArea);
        var areaHeight = Math.floor(this.height / sqrtNumArea);
        var bitmap = new Array(this.height * this.width);
        for (var ay = 0; ay < sqrtNumArea; ay++) {
            for (var ax = 0; ax < sqrtNumArea; ax++) {
                for (var dy = 0; dy < areaHeight; dy++) {
                    for (var dx = 0; dx < areaWidth; dx++) {
                        bitmap[areaWidth * ax + dx + (areaHeight * ay + dy) * this.width] = (grayScale[areaWidth * ax + dx + (areaHeight * ay + dy) * this.width] < middle[ax][ay]) ? true : false;
                    }
                }
            }
        }
        return bitmap;
    };
    QRCode.prototype.grayscale = function () {
        var ret = new Array(this.width * this.height);
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var gray = this.getPixel(x, y);
                ret[x + y * this.width] = gray;
            }
        }
        return ret;
    };
    QRCode.prototype.getPixel = function (x, y) {
        if (this.width < x) {
            throw "point error";
        }
        if (this.height < y) {
            throw "point error";
        }
        var point = (x * 4) + (y * this.width * 4);
        var p = (this.imagedata.data[point] * 33 + this.imagedata.data[point + 1] * 34 + this.imagedata.data[point + 2] * 33) / 100;
        return p;
    };
    QRCode.prototype.getMiddleBrightnessPerArea = function (image) {
        var numSqrtArea = 4;
        //obtain middle brightness((min + max) / 2) per area
        var areaWidth = Math.floor(this.width / numSqrtArea);
        var areaHeight = Math.floor(this.height / numSqrtArea);
        var minmax = new Array(numSqrtArea);
        for (var i = 0; i < numSqrtArea; i++) {
            minmax[i] = new Array(numSqrtArea);
            for (var i2 = 0; i2 < numSqrtArea; i2++) {
                minmax[i][i2] = new Array(0, 0);
            }
        }
        for (var ay = 0; ay < numSqrtArea; ay++) {
            for (var ax = 0; ax < numSqrtArea; ax++) {
                minmax[ax][ay][0] = 0xFF;
                for (var dy = 0; dy < areaHeight; dy++) {
                    for (var dx = 0; dx < areaWidth; dx++) {
                        var target = image[areaWidth * ax + dx + (areaHeight * ay + dy) * this.width];
                        if (target < minmax[ax][ay][0])
                            minmax[ax][ay][0] = target;
                        if (target > minmax[ax][ay][1])
                            minmax[ax][ay][1] = target;
                    }
                }
                //minmax[ax][ay][0] = (minmax[ax][ay][0] + minmax[ax][ay][1]) / 2;
            }
        }
        var middle = new Array(numSqrtArea);
        for (var i3 = 0; i3 < numSqrtArea; i3++) {
            middle[i3] = new Array(numSqrtArea);
        }
        for (var ay = 0; ay < numSqrtArea; ay++) {
            for (var ax = 0; ax < numSqrtArea; ax++) {
                middle[ax][ay] = Math.floor((minmax[ax][ay][0] + minmax[ax][ay][1]) / 2);
                //Console.out.print(middle[ax][ay] + ",");
            }
            //Console.out.println("");
        }
        //Console.out.println("");
        return middle;
    };
    return QRCode;
}());
exports.QRCode = QRCode;
//
//
// Array.prototype.remove = function(from, to) {
//   var rest = this.slice((to || from) + 1 || this.length);
//   this.length = from < 0 ? this.length + from : from;
//   return this.push.apply(this, rest);
// };
//# sourceMappingURL=qrcode.js.map