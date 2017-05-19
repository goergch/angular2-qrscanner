export declare class QRCodeDataBlockReader {
    blockPointer: number;
    bitPointer: number;
    dataLength: number;
    blocks: any;
    numErrorCorrectionCode: any;
    dataLengthMode: number;
    static sizeOfDataLengthInfo: number[][];
    constructor(blocks: any, version: any, numErrorCorrectionCode: any);
    getNextBits(numBits: any): any;
    NextMode(): any;
    getDataLength(modeIndicator: any): any;
    getRomanAndFigureString(dataLength: any): any;
    getFigureString(dataLength: any): any;
    get8bitByteArray(dataLength: any): any;
    getKanjiString(dataLength: any): any;
    readonly DataByte: any;
}
