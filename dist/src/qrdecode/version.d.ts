import { BitMatrix } from "./bitmat";
export declare class ECB {
    count: any;
    dataCodewords: any;
    constructor(count: any, dataCodewords: any);
    readonly Count: any;
    readonly DataCodewords: any;
}
export declare class ECBlocks {
    ecCodewordsPerBlock: any;
    ecBlocks: any;
    constructor(ecCodewordsPerBlock: any, ecBlocks1: any, ecBlocks2?: any);
    readonly ECCodewordsPerBlock: any;
    readonly TotalECCodewords: number;
    readonly NumBlocks: number;
    getECBlocks: () => any;
}
export declare class Version {
    versionNumber: any;
    alignmentPatternCenters: any;
    ecBlocks: any;
    totalCodewords: any;
    constructor(versionNumber: any, alignmentPatternCenters: any, ecBlocks1: any, ecBlocks2: any, ecBlocks3: any, ecBlocks4: any);
    readonly VersionNumber: any;
    readonly AlignmentPatternCenters: any;
    readonly TotalCodewords: any;
    readonly DimensionForVersion: number;
    buildFunctionPattern: () => BitMatrix;
    getECBlocksForLevel: (ecLevel: any) => any;
    static VERSION_DECODE_INFO: number[];
    static VERSIONS: Version[];
    static getVersionForNumber(versionNumber: any): Version;
    static getProvisionalVersionForDimension(dimension: any): Version;
    static decodeVersionInformation(versionBits: any): Version;
    static buildVersions(): Version[];
}
