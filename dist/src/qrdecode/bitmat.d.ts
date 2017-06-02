export declare class BitMatrix {
    width: number;
    height: number;
    rowSize: number;
    bits: any;
    constructor(width: number, height?: number);
    readonly Width: number;
    readonly Height: number;
    readonly Dimension: number;
    URShift(number: any, bits: any): any;
    get_Renamed(x: any, y: any): any;
    set_Renamed(x: any, y: any): any;
    flip(x: any, y: any): void;
    clear(): void;
    setRegion(left: any, top: any, width: any, height: any): void;
}
