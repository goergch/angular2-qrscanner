declare global  {
    interface Array<T> {
        remove(from: T): T[];
    }
}
export declare class FinderPattern {
    static MIN_SKIP: number;
    static MAX_MODULES: number;
    static INTEGER_MATH_SHIFT: number;
    static CENTER_QUORUM: number;
    x: any;
    y: any;
    count: any;
    estimatedModuleSize: any;
    constructor(posX: any, posY: any, estimatedModuleSize: any);
    readonly EstimatedModuleSize: any;
    readonly Count: any;
    readonly X: any;
    readonly Y: any;
    incrementCount: () => void;
    aboutEquals: (moduleSize: any, i: any, j: any) => boolean;
}
export declare class FinderPatternInfo {
    bottomLeft: any;
    topLeft: any;
    topRight: any;
    constructor(patternCenters: any);
    readonly BottomLeft: any;
    readonly TopLeft: any;
    readonly TopRight: any;
}
export declare class FinderPatternFinder {
    width: any;
    height: any;
    image: any;
    possibleCenters: any[];
    hasSkipped: boolean;
    crossCheckStateCount: number[];
    resultPointCallback: any;
    constructor(width: any, height: any);
    readonly CrossCheckStateCount: number[];
    orderBestPatterns: (patterns: any) => void;
    foundPatternCross: (stateCount: any) => boolean;
    centerFromEnd: (stateCount: any, end: any) => number;
    crossCheckVertical: (startI: any, centerJ: any, maxCount: any, originalStateCountTotal: any) => any;
    crossCheckHorizontal: (startJ: any, centerI: any, maxCount: any, originalStateCountTotal: any) => any;
    handlePossibleCenter: (stateCount: any, i: any, j: any) => boolean;
    selectBestPatterns: () => any[];
    findRowSkip: () => number;
    haveMultiplyConfirmedCenters: () => boolean;
    findFinderPattern: (image: any) => FinderPatternInfo;
}
export {};
