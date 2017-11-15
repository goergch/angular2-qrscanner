/*
  Ported to JavaScript by Lazar Laszlo 2011

  lazarsoft@gmail.com, www.lazarsoft.info

*/

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
import {ErrorCorrectionLevel} from "./errorlevel"


export class FormatInformation {
	static FORMAT_INFO_MASK_QR = 0x5412;
	static FORMAT_INFO_DECODE_LOOKUP = new Array(new Array(0x5412, 0x00), new Array(0x5125, 0x01), new Array(0x5E7C, 0x02), new Array(0x5B4B, 0x03), new Array(0x45F9, 0x04), new Array(0x40CE, 0x05), new Array(0x4F97, 0x06), new Array(0x4AA0, 0x07), new Array(0x77C4, 0x08), new Array(0x72F3, 0x09), new Array(0x7DAA, 0x0A), new Array(0x789D, 0x0B), new Array(0x662F, 0x0C), new Array(0x6318, 0x0D), new Array(0x6C41, 0x0E), new Array(0x6976, 0x0F), new Array(0x1689, 0x10), new Array(0x13BE, 0x11), new Array(0x1CE7, 0x12), new Array(0x19D0, 0x13), new Array(0x0762, 0x14), new Array(0x0255, 0x15), new Array(0x0D0C, 0x16), new Array(0x083B, 0x17), new Array(0x355F, 0x18), new Array(0x3068, 0x19), new Array(0x3F31, 0x1A), new Array(0x3A06, 0x1B), new Array(0x24B4, 0x1C), new Array(0x2183, 0x1D), new Array(0x2EDA, 0x1E), new Array(0x2BED, 0x1F));
	static BITS_SET_IN_HALF_BYTE = new Array(0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4);
	static L = new ErrorCorrectionLevel(0, 0x01, "L");
	static M = new ErrorCorrectionLevel(1, 0x00, "M");
	static Q = new ErrorCorrectionLevel(2, 0x03, "Q");
	static H = new ErrorCorrectionLevel(3, 0x02, "H");
	static FOR_BITS = new Array(FormatInformation.M, FormatInformation.L, FormatInformation.H, FormatInformation.Q);
	errorCorrectionLevel: any;
	dataMask: any;

	constructor(formatInfo: any) {
		this.errorCorrectionLevel = ErrorCorrectionLevel.forBits((formatInfo >> 3) & 0x03);
		this.dataMask = (formatInfo & 0x07);
	}

	get ErrorCorrectionLevel() {
		return this.errorCorrectionLevel;
	};

	get DataMask() {
		return this.dataMask;
	};

	GetHashCode () {
		return (this.errorCorrectionLevel.ordinal() << 3) | this.dataMask;
	}

	Equals = function (o: any) {
		var other = o;
		return this.errorCorrectionLevel == other.errorCorrectionLevel && this.dataMask == other.dataMask;
	}

	static URShift(number: any, bits: any): any {
		if (number >= 0)
			return number >> bits;
		else
			return (number >> bits) + (2 << ~bits);
	}

	static numBitsDiffering (a: any, b: any) {
		a ^= b; // a now has a 1 bit exactly where its bit differs with b's
		// Count bits set quickly with a series of lookups:
		return FormatInformation.BITS_SET_IN_HALF_BYTE[a & 0x0F]
			+ FormatInformation.BITS_SET_IN_HALF_BYTE[(this.URShift(a, 4) & 0x0F)]
			+ FormatInformation.BITS_SET_IN_HALF_BYTE[(this.URShift(a, 8) & 0x0F)]
			+ FormatInformation.BITS_SET_IN_HALF_BYTE[(this.URShift(a, 12) & 0x0F)]
			+ FormatInformation.BITS_SET_IN_HALF_BYTE[(this.URShift(a, 16) & 0x0F)]
			+ FormatInformation.BITS_SET_IN_HALF_BYTE[(this.URShift(a, 20) & 0x0F)]
			+ FormatInformation.BITS_SET_IN_HALF_BYTE[(this.URShift(a, 24) & 0x0F)]
			+ FormatInformation.BITS_SET_IN_HALF_BYTE[(this.URShift(a, 28) & 0x0F)];
	}

	static decodeFormatInformation (maskedFormatInfo: any) {
		var formatInfo = this.doDecodeFormatInformation(maskedFormatInfo);
		if (formatInfo != null) {
			return formatInfo;
		}
		// Should return null, but, some QR codes apparently
		// do not mask this info. Try again by actually masking the pattern
		// first
		return this.doDecodeFormatInformation(maskedFormatInfo ^ FormatInformation.FORMAT_INFO_MASK_QR);
	}

	static doDecodeFormatInformation (maskedFormatInfo: any) {
		// Find the int in FORMAT_INFO_DECODE_LOOKUP with fewest bits differing
		var bestDifference = 0xffffffff;
		var bestFormatInfo = 0;
		for (var i = 0; i < FormatInformation.FORMAT_INFO_DECODE_LOOKUP.length; i++) {
			var decodeInfo = FormatInformation.FORMAT_INFO_DECODE_LOOKUP[i];
			var targetInfo = decodeInfo[0];
			if (targetInfo == maskedFormatInfo) {
				// Found an exact match
				return new FormatInformation(decodeInfo[1]);
			}
			var bitsDifference = FormatInformation.numBitsDiffering(maskedFormatInfo, targetInfo);
			if (bitsDifference < bestDifference) {
				bestFormatInfo = decodeInfo[1];
				bestDifference = bitsDifference;
			}
		}
		// Hamming distance of the 32 masked codes is 7, by construction, so <= 3 bits
		// differing means we found a match
		if (bestDifference <= 3) {
			return new FormatInformation(bestFormatInfo);
		}
		return null;
	}

	static forBits (bits: any) {
		{
			if (bits < 0 || bits >= FormatInformation.FOR_BITS.length) {
				throw "ArgumentException";
			}
			return FormatInformation.FOR_BITS[bits];
		}
	}
}

