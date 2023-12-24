import { Exchange } from './src/base/Exchange.js';
import { Precise } from './src/base/Precise.js';
import * as functions from './src/base/functions.js';
import * as errors from './src/base/errors.js';
import { Market, Trade, Fee, Ticker, OrderBook, Order, Transaction, Tickers, Currency, Balance, DepositAddress, WithdrawalResponse, DepositAddressResponse, OHLCV, Balances, PartialBalances } from './src/base/types.js';
import { BaseError, ExchangeError, PermissionDenied, AccountNotEnabled, AccountSuspended, ArgumentsRequired, BadRequest, BadSymbol, MarginModeAlreadySet, BadResponse, NullResponse, InsufficientFunds, InvalidAddress, InvalidOrder, OrderNotFound, OrderNotCached, CancelPending, OrderImmediatelyFillable, OrderNotFillable, DuplicateOrderId, NotSupported, NetworkError, DDoSProtection, RateLimitExceeded, ExchangeNotAvailable, OnMaintenance, InvalidNonce, RequestTimeout, AuthenticationError, AddressPending } from './src/base/errors.js';
declare const version = "3.0.22";
import binance from './src/binance.js';
import binancecoinm from './src/binancecoinm.js';
import binanceusdm from './src/binanceusdm.js';
import bingx from './src/bingx.js';
import bitget from './src/bitget.js';
import bitmex from './src/bitmex.js';
import blofin from './src/blofin.js';
import bybit from './src/bybit.js';
import okex from './src/okex.js';
import okex5 from './src/okex5.js';
import okx from './src/okx.js';
import phemex from './src/phemex.js';
import woo from './src/woo.js';
import binancePro from './src/pro/binance.js';
import binancecoinmPro from './src/pro/binancecoinm.js';
import binanceusdmPro from './src/pro/binanceusdm.js';
import bingxPro from './src/pro/bingx.js';
import bitgetPro from './src/pro/bitget.js';
import bitmexPro from './src/pro/bitmex.js';
import blofinPro from './src/pro/blofin.js';
import bybitPro from './src/pro/bybit.js';
import okexPro from './src/pro/okex.js';
import okxPro from './src/pro/okx.js';
import phemexPro from './src/pro/phemex.js';
import wooPro from './src/pro/woo.js';
declare const exchanges: {
    binance: typeof binance;
    binancecoinm: typeof binancecoinm;
    binanceusdm: typeof binanceusdm;
    bingx: typeof bingx;
    bitget: typeof bitget;
    bitmex: typeof bitmex;
    blofin: typeof blofin;
    bybit: typeof bybit;
    okex: typeof okex;
    okex5: typeof okex5;
    okx: typeof okx;
    phemex: typeof phemex;
    woo: typeof woo;
};
declare const pro: {
    binance: typeof binancePro;
    binancecoinm: typeof binancecoinmPro;
    binanceusdm: typeof binanceusdmPro;
    bingx: typeof bingxPro;
    bitget: typeof bitgetPro;
    bitmex: typeof bitmexPro;
    blofin: typeof blofinPro;
    bybit: typeof bybitPro;
    okex: typeof okexPro;
    okx: typeof okxPro;
    phemex: typeof phemexPro;
    woo: typeof wooPro;
};
declare const ccxt: {
    version: string;
    Exchange: typeof Exchange;
    Precise: typeof Precise;
    exchanges: string[];
    pro: {
        binance: typeof binancePro;
        binancecoinm: typeof binancecoinmPro;
        binanceusdm: typeof binanceusdmPro;
        bingx: typeof bingxPro;
        bitget: typeof bitgetPro;
        bitmex: typeof bitmexPro;
        blofin: typeof blofinPro;
        okex: typeof okexPro;
        okx: typeof okxPro;
        phemex: typeof phemexPro;
        woo: typeof wooPro;
    };
} & {
    binance: typeof binance;
    binancecoinm: typeof binancecoinm;
    binanceusdm: typeof binanceusdm;
    bingx: typeof bingx;
    bitget: typeof bitget;
    bitmex: typeof bitmex;
    blofin: typeof blofin;
    bybit: typeof bybit;
    okex: typeof okex;
    okex5: typeof okex5;
    okx: typeof okx;
    phemex: typeof phemex;
    woo: typeof woo;
} & typeof functions & typeof errors;
export { version, Exchange, exchanges, pro, Precise, functions, errors, BaseError, ExchangeError, PermissionDenied, AccountNotEnabled, AccountSuspended, ArgumentsRequired, BadRequest, BadSymbol, MarginModeAlreadySet, BadResponse, NullResponse, InsufficientFunds, InvalidAddress, InvalidOrder, OrderNotFound, OrderNotCached, CancelPending, OrderImmediatelyFillable, OrderNotFillable, DuplicateOrderId, NotSupported, NetworkError, DDoSProtection, RateLimitExceeded, ExchangeNotAvailable, OnMaintenance, InvalidNonce, RequestTimeout, AuthenticationError, AddressPending, Market, Trade, Fee, Ticker, OrderBook, Order, Transaction, Tickers, Currency, Balance, DepositAddress, WithdrawalResponse, DepositAddressResponse, OHLCV, Balances, PartialBalances, binance, binancecoinm, binanceusdm, bingx, bitget, bitmex, blofin, bybit, okex, okex5, okx, phemex, woo };
export default ccxt;
