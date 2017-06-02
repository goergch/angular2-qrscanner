export declare class GridSampler {
    width: number;
    height: number;
    constructor(width: any, height: any);
    checkAndNudgePoints(image: any, points: any): void;
    sampleGrid3(image: any, rawImage: any, dimension: any, transform: any): any;
    sampleGridx(image: any, dimension: any, p1ToX: any, p1ToY: any, p2ToX: any, p2ToY: any, p3ToX: any, p3ToY: any, p4ToX: any, p4ToY: any, p1FromX: any, p1FromY: any, p2FromX: any, p2FromY: any, p3FromX: any, p3FromY: any, p4FromX: any, p4FromY: any): any;
}
