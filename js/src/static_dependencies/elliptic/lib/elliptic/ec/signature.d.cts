export = Signature;
declare function Signature(options: any, enc: any): Signature;
declare class Signature {
    constructor(options: any, enc: any);
    r: BN;
    s: BN;
    recoveryParam: any;
}
import BN = require("../../../../BN/bn.cjs");
