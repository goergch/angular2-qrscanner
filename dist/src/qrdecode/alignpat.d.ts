export declare class AlignmentPattern {
    x: any;
    y: any;
    count: number;
    estimatedModuleSize: any;
    constructor(posX: any, posY: any, estimatedModuleSize: any);
    readonly EstimatedModuleSize: any;
    readonly Count: number;
    readonly X: number;
    readonly Y: number;
    incrementCount: () => void;
    aboutEquals: (moduleSize: any, i: any, j: any) => boolean;
}
export declare class AlignmentPatternFinder {
    image: any;
    possibleCenters: any[];
    startX: any;
    startY: any;
    width: any;
    height: any;
    moduleSize: any;
    crossCheckStateCount: number[];
    resultPointCallback: any;
    imageWidth: number;
    imageHeight: number;
    constructor(image: any, startX: any, startY: any, width: any, height: any, moduleSize: any, imageWidth: number, imageHeight: number, resultPointCallback: any);
    centerFromEnd: (stateCount: any, end: any) => number;
    foundPatternCross: (stateCount: any) => boolean;
    crossCheckVertical: (startI: any, centerJ: any, maxCount: any, originalStateCountTotal: any) => any;
    handlePossibleCenter: (stateCount: any, i: any, j: any) => AlignmentPattern;
    find: () => any;
}
