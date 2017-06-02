import { ReedSolomonDecoder } from "./rsdecoder";
import { QRCodeDataBlockReader } from "./databr";
export declare class Decoder {
    rsDecoder: ReedSolomonDecoder;
    correctErrors(codewordBytes: any, numDataCodewords: any): void;
    decode: (bits: any) => QRCodeDataBlockReader;
}
