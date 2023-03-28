export = HmacDRBG;
declare function HmacDRBG(options: any): HmacDRBG;
declare class HmacDRBG {
    constructor(options: any);
    hash: any;
    predResist: boolean;
    outLen: any;
    minEntropy: any;
    _reseed: number;
    reseedInterval: number;
    K: any;
    V: any;
    byteArrayToWordArray: typeof byteArrayToWordArray;
    _init(entropy: any, nonce: any, pers: any): Promise<void>;
    _hmac(): any;
    _update(seed: any): void;
    reseed(entropy: any, entropyEnc: any, add: any, addEnc: any): void;
    generate(len: any, enc: any, add: any, addEnc: any): any[];
}
declare function byteArrayToWordArray(ba: any): any;
