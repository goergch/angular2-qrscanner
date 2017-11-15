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


import {PerspectiveTransform} from "./perpesctivetransform";

import {BitMatrix} from "./bitmat"


export class GridSampler{

	width: number;
	height: number;

	constructor(width:any, height:any){
		this.width = width;
		this.height = height;
	}

	checkAndNudgePoints( image:any,  points:any): void
	{
		var width = this.width;
		var height = this.height;
		// Check and nudge points from start until we see some that are OK:
		var nudged = true;
		for (var offset = 0; offset < points.length && nudged; offset += 2)
		{
			var x = Math.floor (points[offset]);
			var y = Math.floor( points[offset + 1]);
			if (x < - 1 || x > width || y < - 1 || y > height)
			{
				throw "Error.checkAndNudgePoints ";
			}
			nudged = false;
			if (x == - 1)
			{
				points[offset] = 0.0;
				nudged = true;
			}
			else if (x == width)
			{
				points[offset] = width - 1;
				nudged = true;
			}
			if (y == - 1)
			{
				points[offset + 1] = 0.0;
				nudged = true;
			}
			else if (y == height)
			{
				points[offset + 1] = height - 1;
				nudged = true;
			}
		}
		// Check and nudge points from end:
		nudged = true;
		for (var offset = points.length - 2; offset >= 0 && nudged; offset -= 2)
		{
			var x = Math.floor( points[offset]);
			var y = Math.floor( points[offset + 1]);
			if (x < - 1 || x > width || y < - 1 || y > height)
			{
				throw "Error.checkAndNudgePoints ";
			}
			nudged = false;
			if (x == - 1)
			{
				points[offset] = 0.0;
				nudged = true;
			}
			else if (x == width)
			{
				points[offset] = width - 1;
				nudged = true;
			}
			if (y == - 1)
			{
				points[offset + 1] = 0.0;
				nudged = true;
			}
			else if (y == height)
			{
				points[offset + 1] = height - 1;
				nudged = true;
			}
		}
	}



	sampleGrid3( image:any,rawImage: any,  dimension:any,  transform:any): any
	{
		var bits = new BitMatrix(dimension, dimension);
		var points = new Array(dimension << 1);
		for (var y = 0; y < dimension; y++)
		{
			var max = points.length;
			var iValue =  y + 0.5;
			for (var x = 0; x < max; x += 2)
			{
				points[x] =  (x >> 1) + 0.5;
				points[x + 1] = iValue;
			}
			transform.transformPoints1(points);
			// Quick check to see if points transformed to something inside the image;
			// sufficient to check the endpoints
			this.checkAndNudgePoints(image, points);
			try
			{
				for (var x = 0; x < max; x += 2)
				{
					var xpoint = (Math.floor( points[x]) * 4) + (Math.floor( points[x + 1]) * this.width * 4);
					var bit = image[Math.floor( points[x])+ this.width* Math.floor( points[x + 1])];
					rawImage.data[xpoint] = bit?255:0;
					rawImage.data[xpoint+1] = bit?255:0;
					rawImage.data[xpoint+2] = 0;
					rawImage.data[xpoint+3] = 255;
					//bits[x >> 1][ y]=bit;
					if(bit)
						bits.set_Renamed(x >> 1, y);
				}
			}
			catch ( aioobe)
			{
				// This feels wrong, but, sometimes if the finder patterns are misidentified, the resulting
				// transform gets "twisted" such that it maps a straight line of points to a set of points
				// whose endpoints are in bounds, but others are not. There is probably some mathematical
				// way to detect this about the transformation that I don't know yet.
				// This results in an ugly runtime exception despite our clever checks above -- can't have
				// that. We could check each point's coordinates but that feels duplicative. We settle for
				// catching and wrapping ArrayIndexOutOfBoundsException.
				throw "Error.checkAndNudgePoints";
			}
		}
		return bits;
	}

	sampleGridx( image:any,  dimension:any,  p1ToX:any,  p1ToY:any,  p2ToX:any,  p2ToY:any,  p3ToX:any,  p3ToY:any,  p4ToX:any,  p4ToY:any,  p1FromX:any,  p1FromY:any,  p2FromX:any,  p2FromY:any,  p3FromX:any,  p3FromY:any,  p4FromX:any,  p4FromY:any): any
	{


		var transform = PerspectiveTransform.quadrilateralToQuadrilateral(p1ToX, p1ToY, p2ToX, p2ToY, p3ToX, p3ToY, p4ToX, p4ToY, p1FromX, p1FromY, p2FromX, p2FromY, p3FromX, p3FromY, p4FromX, p4FromY);

		return this.sampleGrid3(image, {}, dimension, transform);
	}

}





