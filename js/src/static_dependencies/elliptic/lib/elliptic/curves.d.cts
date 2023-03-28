export const PresetCurve: typeof PresetCurve;
declare function PresetCurve(options: any): void;
declare class PresetCurve {
    constructor(options: any);
    curve: import("./curve/short.cjs") | import("./curve/mont.cjs") | import("./curve/edwards.cjs");
    g: any;
    n: any;
    hash: any;
}
export {};
