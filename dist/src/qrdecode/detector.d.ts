export declare class PerspectiveTransform {
    a11: number;
    a12: number;
    a13: number;
    a21: number;
    a22: number;
    a23: number;
    a31: number;
    a32: number;
    a33: number;
    constructor(a11: number, a21: number, a31: number, a12: number, a22: number, a32: number, a13: number, a23: number, a33: number);
    transformPoints1: (points: any) => void;
    transformPoints2: (xValues: any, yValues: any) => void;
    buildAdjoint: () => PerspectiveTransform;
    times: (other: any) => PerspectiveTransform;
    static quadrilateralToQuadrilateral(x0: any, y0: any, x1: any, y1: any, x2: any, y2: any, x3: any, y3: any, x0p: any, y0p: any, x1p: any, y1p: any, x2p: any, y2p: any, x3p: any, y3p: any): PerspectiveTransform;
    static squareToQuadrilateral(x0: any, y0: any, x1: any, y1: any, x2: any, y2: any, x3: any, y3: any): PerspectiveTransform;
    static quadrilateralToSquare(x0: any, y0: any, x1: any, y1: any, x2: any, y2: any, x3: any, y3: any): PerspectiveTransform;
}
export declare class DetectorResult {
    bits: any;
    points: any;
    constructor(bits: any, points: any);
}
export declare class Detector {
    image: any;
    rawImage: any;
    width: number;
    height: number;
    constructor(image: any, rawImage: any, width: number, height: number);
    sizeOfBlackWhiteBlackRun(fromX: any, fromY: any, toX: any, toY: any): number;
    sizeOfBlackWhiteBlackRunBothWays(fromX: any, fromY: any, toX: any, toY: any): number;
    calculateModuleSizeOneWay: (pattern: any, otherPattern: any) => number;
    calculateModuleSize: (topLeft: any, topRight: any, bottomLeft: any) => number;
    distance: (pattern1: any, pattern2: any) => number;
    computeDimension: (topLeft: any, topRight: any, bottomLeft: any, moduleSize: any) => number;
    findAlignmentInRegion: (overallEstModuleSize: any, estAlignmentX: any, estAlignmentY: any, allowanceFactor: any) => any;
    createTransform: (topLeft: any, topRight: any, bottomLeft: any, alignmentPattern: any, dimension: any) => PerspectiveTransform;
    sampleGrid: (image: any, transform: any, dimension: any) => any;
    processFinderPatternInfo(info: any): any;
    detect: () => any;
}
