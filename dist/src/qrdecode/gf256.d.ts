export declare class GF256Poly {
    field: any;
    coefficients: any;
    constructor(field: any, coefficients: any);
    readonly Zero: any;
    readonly Degree: any;
    readonly Coefficients: any;
    getCoefficient(degree: any): any;
    evaluateAt(a: any): any;
    addOrSubtract(other: any): any;
    multiply1(other: any): any;
    multiply2(scalar: any): any;
    multiplyByMonomial(degree: any, coefficient: any): any;
    divide: (other: any) => any;
}
export declare class GF256 {
    expTable: any[];
    logTable: any[];
    zero: any;
    one: any;
    constructor(primitive: any);
    readonly Zero: any;
    readonly One: any;
    buildMonomial(degree: any, coefficient: any): any;
    exp(a: any): any;
    log(a: any): any;
    inverse(a: any): any;
    multiply(a: any, b: any): any;
    static addOrSubtract(a: any, b: any): any;
    static QR_CODE_FIELD: GF256;
    static DATA_MATRIX_FIELD: GF256;
}
