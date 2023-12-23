/*

MIT License

Copyright (c) 2017 Igor Kroitor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

//-----------------------------------------------------------------------------


/* eslint-disable */

import { Exchange }  from './src/base/Exchange.js'
import { Precise }   from './src/base/Precise.js'
import * as functions from './src/base/functions.js'
import * as errors   from './src/base/errors.js'
import { Market, Trade , Fee, Ticker, OrderBook, Order, Transaction, Tickers, Currency, Balance, DepositAddress, WithdrawalResponse, DepositAddressResponse, OHLCV, Balances, PartialBalances } from './src/base/types.js'
import { BaseError, ExchangeError, PermissionDenied, AccountNotEnabled, AccountSuspended, ArgumentsRequired, BadRequest, BadSymbol, MarginModeAlreadySet, BadResponse, NullResponse, InsufficientFunds, InvalidAddress, InvalidOrder, OrderNotFound, OrderNotCached, CancelPending, OrderImmediatelyFillable, OrderNotFillable, DuplicateOrderId, NotSupported, NetworkError, DDoSProtection, RateLimitExceeded, ExchangeNotAvailable, OnMaintenance, InvalidNonce, RequestTimeout, AuthenticationError, AddressPending }  from './src/base/errors.js'


//-----------------------------------------------------------------------------
// this is updated by vss.js when building

const version = '3.0.22';

(Exchange as any).ccxtVersion = version

//-----------------------------------------------------------------------------

import binance from  './src/binance.js'
import binancecoinm from  './src/binancecoinm.js'
import binanceusdm from  './src/binanceusdm.js'
import bingx from  './src/bingx.js'
import bitget from  './src/bitget.js'
import bitmex from  './src/bitmex.js'
import bybit from  './src/bybit.js'
import okcoin from  './src/okcoin.js'
import okex from  './src/okex.js'
import okex5 from  './src/okex5.js'
import okx from  './src/okx.js'
import phemex from  './src/phemex.js'
import woo from  './src/woo.js'


// pro exchanges
import binancePro from  './src/pro/binance.js'
import binancecoinmPro from  './src/pro/binancecoinm.js'
import binanceusdmPro from  './src/pro/binanceusdm.js'
import bingxPro from  './src/pro/bingx.js'
import bitgetPro from  './src/pro/bitget.js'
import bitmexPro from  './src/pro/bitmex.js'
import bybitPro from  './src/pro/bybit.js'
import okcoinPro from  './src/pro/okcoin.js'
import okexPro from  './src/pro/okex.js'
import okxPro from  './src/pro/okx.js'
import phemexPro from  './src/pro/phemex.js'
import wooPro from  './src/pro/woo.js'

const exchanges = {
    'binance':                binance,
    'binancecoinm':           binancecoinm,
    'binanceusdm':            binanceusdm,
    'bingx':                  bingx,
    'bybit':                  bybit,
    'okcoin':                 okcoin,
    'okex':                   okex,
    'okex5':                  okex5,
    'okx':                    okx,
    'phemex':                 phemex,
    'woo':                    woo,
}

const pro = {
    'binance':                binancePro,
    'binancecoinm':           binancecoinmPro,
    'binanceusdm':            binanceusdmPro,
    'bingx':                  bingxPro,
    'bitget':                 bitgetPro,
    'bitmex':                 bitmexPro,
    'bybit':                  bybitPro,
    'okcoin':                 okcoinPro,
    'okex':                   okexPro,
    'okx':                    okxPro,
    'phemex':                 phemexPro,
    'woo':                    wooPro,
}

for (const exchange in pro) {
    // const ccxtExchange = exchanges[exchange]
    // const baseExchange = Object.getPrototypeOf (ccxtExchange)
    // if (baseExchange.name === 'Exchange') {
    //     Object.setPrototypeOf (ccxtExchange, wsExchange)
    //     Object.setPrototypeOf (ccxtExchange.prototype, wsExchange.prototype)
    // }
}

(pro as any).exchanges = Object.keys (pro)
pro['Exchange'] = Exchange // now the same for rest and ts
//-----------------------------------------------------------------------------

const ccxt = Object.assign ({ version, Exchange, Precise, 'exchanges': Object.keys (exchanges), 'pro': pro}, exchanges, functions, errors)

export {
    version,
    Exchange,
    exchanges,
    pro,
    Precise,
    functions,
    errors,
    BaseError,
    ExchangeError,
    PermissionDenied,
    AccountNotEnabled,
    AccountSuspended,
    ArgumentsRequired,
    BadRequest,
    BadSymbol,
    MarginModeAlreadySet,
    BadResponse,
    NullResponse,
    InsufficientFunds,
    InvalidAddress,
    InvalidOrder,
    OrderNotFound,
    OrderNotCached,
    CancelPending,
    OrderImmediatelyFillable,
    OrderNotFillable,
    DuplicateOrderId,
    NotSupported,
    NetworkError,
    DDoSProtection,
    RateLimitExceeded,
    ExchangeNotAvailable,
    OnMaintenance,
    InvalidNonce,
    RequestTimeout,
    AuthenticationError,
    AddressPending,
    Market,
    Trade,
    Fee,
    Ticker,
    OrderBook,
    Order,
    Transaction,
    Tickers,
    Currency,
    Balance,
    DepositAddress,
    WithdrawalResponse,
    DepositAddressResponse,
    OHLCV,
    Balances,
    PartialBalances,
    binance,
    binancecoinm,
    binanceusdm,
    bingx,
    bitget,
    bitmex,
    bybit,
    okcoin,
    okex,
    okex5,
    okx,
    phemex,
    woo, 
}

export default ccxt;

//-----------------------------------------------------------------------------
