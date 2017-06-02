export declare class QRCode {
    imagedata: ImageData;
    width: number;
    height: number;
    debug: boolean;
    maxImgSize: number;
    sizeOfDataLengthInfo: number[][];
    result: string;
    myCallback: (qrText: string) => void;
    decode(canvas: HTMLCanvasElement): string;
    process(context: CanvasRenderingContext2D): string;
    grayScaleToBitmap(grayScale: Array<number>): Array<number>;
    grayscale(): Array<number>;
    getPixel(x: number, y: number): number;
    getMiddleBrightnessPerArea(image: Array<number>): Array<Array<number>>;
}
