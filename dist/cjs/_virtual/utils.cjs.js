'use strict';

var _commonjsHelpers = require('./_commonjsHelpers.js');

const commonjsRegister = _commonjsHelpers.commonjsRegister;
commonjsRegister("/$$rollup_base$$/js/src/static_dependencies/elliptic/lib/elliptic/utils.cjs", function (module, exports) {
var utils = exports;
var BN = _commonjsHelpers.commonjsRequire("../../../BN/bn.cjs", "/$$rollup_base$$/js/src/static_dependencies/elliptic/lib/elliptic");
utils.assert = function (condition, errorMessage) {
    if (!condition) {
        throw new Error(errorMessage);
    }
};
// Represent num in a w-NAF form
function getNAF(num, w) {
    var naf = [];
    var ws = 1 << (w + 1);
    var k = num.clone();
    while (k.cmpn(1) >= 0) {
        var z;
        if (k.isOdd()) {
            var mod = k.andln(ws - 1);
            if (mod > (ws >> 1) - 1)
                z = (ws >> 1) - mod;
            else
                z = mod;
            k.isubn(z);
        }
        else {
            z = 0;
        }
        naf.push(z);
        // Optimization, shift by word if possible
        var shift = (k.cmpn(0) !== 0 && k.andln(ws - 1) === 0) ? (w + 1) : 1;
        for (var i = 1; i < shift; i++)
            naf.push(0);
        k.iushrn(shift);
    }
    return naf;
}
utils.getNAF = getNAF;
// Represent k1, k2 in a Joint Sparse Form
function getJSF(k1, k2) {
    var jsf = [
        [],
        []
    ];
    k1 = k1.clone();
    k2 = k2.clone();
    var d1 = 0;
    var d2 = 0;
    while (k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0) {
        // First phase
        var m14 = (k1.andln(3) + d1) & 3;
        var m24 = (k2.andln(3) + d2) & 3;
        if (m14 === 3)
            m14 = -1;
        if (m24 === 3)
            m24 = -1;
        var u1;
        if ((m14 & 1) === 0) {
            u1 = 0;
        }
        else {
            var m8 = (k1.andln(7) + d1) & 7;
            if ((m8 === 3 || m8 === 5) && m24 === 2)
                u1 = -m14;
            else
                u1 = m14;
        }
        jsf[0].push(u1);
        var u2;
        if ((m24 & 1) === 0) {
            u2 = 0;
        }
        else {
            var m8 = (k2.andln(7) + d2) & 7;
            if ((m8 === 3 || m8 === 5) && m14 === 2)
                u2 = -m24;
            else
                u2 = m24;
        }
        jsf[1].push(u2);
        // Second phase
        if (2 * d1 === u1 + 1)
            d1 = 1 - d1;
        if (2 * d2 === u2 + 1)
            d2 = 1 - d2;
        k1.iushrn(1);
        k2.iushrn(1);
    }
    return jsf;
}
utils.getJSF = getJSF;
function cachedProperty(obj, name, computer) {
    var key = '_' + name;
    obj.prototype[name] = function cachedProperty() {
        return this[key] !== undefined ? this[key] :
            this[key] = computer.call(this);
    };
}
utils.cachedProperty = cachedProperty;
function parseBytes(bytes) {
    return typeof bytes === 'string' ? utils.toArray(bytes, 'hex') :
        bytes;
}
utils.parseBytes = parseBytes;
function intFromLE(bytes) {
    return new BN(bytes, 'hex', 'le');
}
utils.intFromLE = intFromLE;
// used to convert `CryptoJS` wordArrays into `crypto` hex buffers
function wordToByteArray(word, length) {
    var ba = [], xFF = 0xFF;
    if (length > 0)
        ba.push(word >>> 24);
    if (length > 1)
        ba.push((word >>> 16) & xFF);
    if (length > 2)
        ba.push((word >>> 8) & xFF);
    if (length > 3)
        ba.push(word & xFF);
    return ba;
}
function wordArrayToBuffer(wordArray) {
    let length = undefined;
    if (wordArray.hasOwnProperty("sigBytes") && wordArray.hasOwnProperty("words")) {
        length = wordArray.sigBytes;
        wordArray = wordArray.words;
    }
    else {
        throw Error('Argument not a wordArray');
    }
    const result = [];
    let bytes = [];
    let i = 0;
    while (length > 0) {
        bytes = wordToByteArray(wordArray[i], Math.min(4, length));
        length -= bytes.length;
        result.push(bytes);
        i++;
    }
    return [].concat.apply([], result);
}
utils.wordArrayToBuffer = wordArrayToBuffer;
// https://github.com/indutny/minimalistic-crypto-utils/blob/master/lib/utils.js
// moved here to remove the dep
function toArray(msg, enc) {
    if (Array.isArray(msg))
        return msg.slice();
    if (!msg)
        return [];
    var res = [];
    if (typeof msg !== 'string') {
        for (var i = 0; i < msg.length; i++)
            res[i] = msg[i] | 0;
        return res;
    }
    if (enc === 'hex') {
        msg = msg.replace(/[^a-z0-9]+/ig, '');
        if (msg.length % 2 !== 0)
            msg = '0' + msg;
        for (var i = 0; i < msg.length; i += 2)
            res.push(parseInt(msg[i] + msg[i + 1], 16));
    }
    else {
        for (var i = 0; i < msg.length; i++) {
            var c = msg.charCodeAt(i);
            var hi = c >> 8;
            var lo = c & 0xff;
            if (hi)
                res.push(hi, lo);
            else
                res.push(lo);
        }
    }
    return res;
}
utils.toArray = toArray;
function zero2(word) {
    if (word.length === 1)
        return '0' + word;
    else
        return word;
}
utils.zero2 = zero2;
function toHex(msg) {
    var res = '';
    for (var i = 0; i < msg.length; i++)
        res += zero2(msg[i].toString(16));
    return res;
}
utils.toHex = toHex;
utils.encode = function encode(arr, enc) {
    if (enc === 'hex')
        return toHex(arr);
    else
        return arr;
};

});
