import { BitMatrix } from "./bitmat";
export declare class BitMatrixParser {
    bitMatrix: BitMatrix;
    parsedVersion: any;
    parsedFormatInfo: any;
    constructor(bitmatrix: BitMatrix);
    copyBit(i: any, j: any, versionBits: any): any;
    readFormatInformation(): any;
    readVersion(): any;
    readCodewords(): any;
}
