'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('./_virtual/_commonjsHelpers.js');
require('./_virtual/bn.cjs.js');
require('./_virtual/crypto-js.cjs.js');
require('./_virtual/elliptic.cjs.js');
require('./_virtual/base.cjs.js');
require('./_virtual/edwards.cjs.js');
require('./_virtual/index.cjs.js');
require('./_virtual/mont.cjs.js');
require('./_virtual/short.cjs.js');
require('./_virtual/curves.cjs.js');
require('./_virtual/index.cjs2.js');
require('./_virtual/key.cjs.js');
require('./_virtual/signature.cjs.js');
require('./_virtual/index.cjs3.js');
require('./_virtual/key.cjs2.js');
require('./_virtual/signature.cjs2.js');
require('./_virtual/secp256k1.cjs.js');
require('./_virtual/utils.cjs.js');
require('./_virtual/hmac-drbg.cjs.js');
require('./_virtual/errors.cjs.js');
require('./_virtual/index.cjs4.js');
require('./_virtual/reader.cjs.js');
require('./_virtual/types.cjs.js');
require('./_virtual/index.cjs5.js');
require('./_virtual/components.cjs.js');
require('./_virtual/formats.cjs.js');
require('./_virtual/pkcs1.cjs.js');
require('./_virtual/pkcs8.cjs.js');
require('./_virtual/jsbn.cjs.js');
require('./_virtual/rsa.cjs.js');
require('./_virtual/NodeRSA.cjs.js');
require('./_virtual/pkcs1.cjs2.js');
require('./_virtual/schemes.cjs.js');
require('./_virtual/utils.cjs2.js');
require('./_virtual/formats.cjs2.js');
require('./_virtual/index.cjs6.js');
require('./_virtual/parse.cjs.js');
require('./_virtual/stringify.cjs.js');
require('./_virtual/utils.cjs3.js');
var Exchange = require('./src/base/Exchange.js');
var Precise = require('./src/base/Precise.js');
var functions = require('./src/base/functions.js');
var errors = require('./src/base/errors.js');
var binance = require('./src/binance.js');
var binancecoinm = require('./src/binancecoinm.js');
var binanceusdm = require('./src/binanceusdm.js');
var bingx = require('./src/bingx.js');
var bitget = require('./src/bitget.js');
var bitmex = require('./src/bitmex.js');
var blofin = require('./src/blofin.js');
var bybit = require('./src/bybit.js');
var okex = require('./src/okex.js');
var okex5 = require('./src/okex5.js');
var okx = require('./src/okx.js');
var phemex = require('./src/phemex.js');
var woo = require('./src/woo.js');
var woofi = require('./src/woofi.js');
var binance$1 = require('./src/pro/binance.js');
var binancecoinm$1 = require('./src/pro/binancecoinm.js');
var binanceusdm$1 = require('./src/pro/binanceusdm.js');
var bingx$1 = require('./src/pro/bingx.js');
var bitget$1 = require('./src/pro/bitget.js');
var bitmex$1 = require('./src/pro/bitmex.js');
var blofin$1 = require('./src/pro/blofin.js');
var bybit$1 = require('./src/pro/bybit.js');
var okex$1 = require('./src/pro/okex.js');
var okx$1 = require('./src/pro/okx.js');
var phemex$1 = require('./src/pro/phemex.js');
var woo$1 = require('./src/pro/woo.js');
var woofi$1 = require('./src/pro/woofi.js');

//-----------------------------------------------------------------------------
// this is updated by vss.js when building
const version = '3.0.22';
Exchange["default"].ccxtVersion = version;
const exchanges = {
    'binance': binance,
    'binancecoinm': binancecoinm,
    'binanceusdm': binanceusdm,
    'bingx': bingx,
    'bitget': bitget,
    'bitmex': bitmex,
    'blofin': blofin,
    'bybit': bybit,
    'okex': okex,
    'okex5': okex5,
    'okx': okx,
    'phemex': phemex,
    'woo': woo,
    'woofi': woofi,
};
const pro = {
    'binance': binance$1,
    'binancecoinm': binancecoinm$1,
    'binanceusdm': binanceusdm$1,
    'bingx': bingx$1,
    'bitget': bitget$1,
    'bitmex': bitmex$1,
    'blofin': blofin$1,
    'bybit': bybit$1,
    'okex': okex$1,
    'okx': okx$1,
    'phemex': phemex$1,
    'woo': woo$1,
    'woofi': woofi$1,
};
pro.exchanges = Object.keys(pro);
pro['Exchange'] = Exchange["default"]; // now the same for rest and ts
//-----------------------------------------------------------------------------
const ccxt = Object.assign({ version, Exchange: Exchange["default"], Precise: Precise["default"], 'exchanges': Object.keys(exchanges), 'pro': pro }, exchanges, functions, errors);
//-----------------------------------------------------------------------------

exports.Exchange = Exchange["default"];
exports.Precise = Precise["default"];
exports.functions = functions;
exports.AccountNotEnabled = errors.AccountNotEnabled;
exports.AccountSuspended = errors.AccountSuspended;
exports.AddressPending = errors.AddressPending;
exports.ArgumentsRequired = errors.ArgumentsRequired;
exports.AuthenticationError = errors.AuthenticationError;
exports.BadRequest = errors.BadRequest;
exports.BadResponse = errors.BadResponse;
exports.BadSymbol = errors.BadSymbol;
exports.BaseError = errors.BaseError;
exports.CancelPending = errors.CancelPending;
exports.DDoSProtection = errors.DDoSProtection;
exports.DuplicateOrderId = errors.DuplicateOrderId;
exports.ExchangeError = errors.ExchangeError;
exports.ExchangeNotAvailable = errors.ExchangeNotAvailable;
exports.InsufficientFunds = errors.InsufficientFunds;
exports.InvalidAddress = errors.InvalidAddress;
exports.InvalidNonce = errors.InvalidNonce;
exports.InvalidOrder = errors.InvalidOrder;
exports.MarginModeAlreadySet = errors.MarginModeAlreadySet;
exports.NetworkError = errors.NetworkError;
exports.NotSupported = errors.NotSupported;
exports.NullResponse = errors.NullResponse;
exports.OnMaintenance = errors.OnMaintenance;
exports.OrderImmediatelyFillable = errors.OrderImmediatelyFillable;
exports.OrderNotCached = errors.OrderNotCached;
exports.OrderNotFillable = errors.OrderNotFillable;
exports.OrderNotFound = errors.OrderNotFound;
exports.PermissionDenied = errors.PermissionDenied;
exports.RateLimitExceeded = errors.RateLimitExceeded;
exports.RequestTimeout = errors.RequestTimeout;
exports.errors = errors;
exports.binance = binance;
exports.binancecoinm = binancecoinm;
exports.binanceusdm = binanceusdm;
exports.bingx = bingx;
exports.bitget = bitget;
exports.bitmex = bitmex;
exports.blofin = blofin;
exports.bybit = bybit;
exports.okex = okex;
exports.okex5 = okex5;
exports.okx = okx;
exports.phemex = phemex;
exports.woo = woo;
exports.woofi = woofi;
exports["default"] = ccxt;
exports.exchanges = exchanges;
exports.pro = pro;
exports.version = version;
