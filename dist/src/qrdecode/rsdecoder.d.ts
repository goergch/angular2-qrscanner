export declare class ReedSolomonDecoder {
    field: any;
    constructor(field: any);
    decode(received: any, twoS: any): void;
    runEuclideanAlgorithm(a: any, b: any, R: any): any;
    findErrorLocations(errorLocator: any): any;
    findErrorMagnitudes(errorEvaluator: any, errorLocations: any, dataMatrix: any): any;
}
