import { ErrorCorrectionLevel } from "./errorlevel";
export declare class FormatInformation {
    static FORMAT_INFO_MASK_QR: number;
    static FORMAT_INFO_DECODE_LOOKUP: number[][];
    static BITS_SET_IN_HALF_BYTE: number[];
    static L: ErrorCorrectionLevel;
    static M: ErrorCorrectionLevel;
    static Q: ErrorCorrectionLevel;
    static H: ErrorCorrectionLevel;
    static FOR_BITS: ErrorCorrectionLevel[];
    errorCorrectionLevel: any;
    dataMask: any;
    constructor(formatInfo: any);
    readonly ErrorCorrectionLevel: any;
    readonly DataMask: any;
    GetHashCode(): number;
    Equals: (o: any) => boolean;
    static URShift(number: any, bits: any): any;
    static numBitsDiffering(a: any, b: any): number;
    static decodeFormatInformation(maskedFormatInfo: any): FormatInformation;
    static doDecodeFormatInformation(maskedFormatInfo: any): FormatInformation;
    static forBits(bits: any): ErrorCorrectionLevel;
}
