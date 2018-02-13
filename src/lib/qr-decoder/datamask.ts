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

export class DataMask000{
	unmaskBitMatrix(bits:any,  dimension:any):any
	{
		for (var i = 0; i < dimension; i++)
		{
			for (var j = 0; j < dimension; j++)
			{
				if (this.isMasked(i, j))
				{
					bits.flip(j, i);
				}
			}
		}
	}
	isMasked=function( i:any,  j:any)
	{
		return ((i + j) & 0x01) == 0;
	}
}

export class DataMask001{
	unmaskBitMatrix(bits:any,  dimension:any):any
	{
		for (var i = 0; i < dimension; i++)
		{
			for (var j = 0; j < dimension; j++)
			{
				if (this.isMasked(i, j))
				{
					bits.flip(j, i);
				}
			}
		}
	}
	isMasked=function( i:any,  j:any)
	{
		return (i & 0x01) == 0;
	}
}


export class DataMask010{
	unmaskBitMatrix(bits:any,  dimension:any):any
	{
		for (var i = 0; i < dimension; i++)
		{
			for (var j = 0; j < dimension; j++)
			{
				if (this.isMasked(i, j))
				{
					bits.flip(j, i);
				}
			}
		}
	}
	isMasked=function( i:any,  j:any)
	{
		return j % 3 == 0;
	}
}
export class DataMask011{
	unmaskBitMatrix(bits:any,  dimension:any):any
	{
		for (var i = 0; i < dimension; i++)
		{
			for (var j = 0; j < dimension; j++)
			{
				if (this.isMasked(i, j))
				{
					bits.flip(j, i);
				}
			}
		}
	}
	isMasked=function( i:any,  j:any)
	{
		return (i + j) % 3 == 0;
	}
}

export class DataMask100{
	unmaskBitMatrix(bits:any,  dimension:any):any
	{
		for (var i = 0; i < dimension; i++)
		{
			for (var j = 0; j < dimension; j++)
			{
				if (this.isMasked(i, j))
				{
					bits.flip(j, i);
				}
			}
		}
	}

	URShift( number:any,  bits:any):any
	{
		if (number >= 0)
			return number >> bits;
		else
			return (number >> bits) + (2 << ~bits);
	}

	isMasked=function( i:any,  j:any)
	{
		return (((this.URShift(i, 1)) + (j / 3)) & 0x01) == 0;
	}
}
export class DataMask101{
	unmaskBitMatrix(bits:any,  dimension:any):any
	{
		for (var i = 0; i < dimension; i++)
		{
			for (var j = 0; j < dimension; j++)
			{
				if (this.isMasked(i, j))
				{
					bits.flip(j, i);
				}
			}
		}
	}
	isMasked=function( i:any,  j:any)
	{
		var temp = i * j;
		return (temp & 0x01) + (temp % 3) == 0;
	}
}

export class DataMask110{
	unmaskBitMatrix(bits:any,  dimension:any):any
	{
		for (var i = 0; i < dimension; i++)
		{
			for (var j = 0; j < dimension; j++)
			{
				if (this.isMasked(i, j))
				{
					bits.flip(j, i);
				}
			}
		}
	}
	isMasked=function( i:any,  j:any)
	{
		var temp = i * j;
		return (((temp & 0x01) + (temp % 3)) & 0x01) == 0;
	}
}

export class DataMask111{
	unmaskBitMatrix(bits:any,  dimension:any):any
	{
		for (var i = 0; i < dimension; i++)
		{
			for (var j = 0; j < dimension; j++)
			{
				if (this.isMasked(i, j))
				{
					bits.flip(j, i);
				}
			}
		}
	}
	isMasked=function( i:any,  j:any)
	{
		return ((((i + j) & 0x01) + ((i * j) % 3)) & 0x01) == 0;
	}
}

export class DataMask{
	static DATA_MASKS = new Array(new DataMask000(), new DataMask001(), new DataMask010(), new DataMask011(), new DataMask100(), new DataMask101(), new DataMask110(), new DataMask111());
	static forReference(reference:any):any
	{
		if (reference < 0 || reference > 7)
		{
			throw "System.ArgumentException";
		}
		return DataMask.DATA_MASKS[reference];
	}
}


