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

export class ErrorCorrectionLevel{

	static forBits( bits:any)
	{
		if (bits < 0 || bits >= this.FOR_BITS.length)
		{
			throw "ArgumentException";
		}
		return this.FOR_BITS[bits];
	}

	static L = new ErrorCorrectionLevel(0, 0x01, "L");
	static M = new ErrorCorrectionLevel(1, 0x00, "M");
	static Q = new ErrorCorrectionLevel(2, 0x03, "Q");
	static H = new ErrorCorrectionLevel(3, 0x02, "H");
	static FOR_BITS = new Array( ErrorCorrectionLevel.M, ErrorCorrectionLevel.L, ErrorCorrectionLevel.H, ErrorCorrectionLevel.Q);


	ordinal_Renamed_Field:any;
	bits:any;
	name:any;
	constructor(ordinal:any ,  bits:any, name:any){

		this.ordinal_Renamed_Field = ordinal;
		this.bits = bits;
		this.name = name;
	}

	get Bits()
	{
		return this.bits;
	};
	get Name()
	{
		return this.name;
	};
	ordinal()
	{
		return this.ordinal_Renamed_Field;
	}

}