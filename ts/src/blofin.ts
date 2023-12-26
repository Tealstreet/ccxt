
// ---------------------------------------------------------------------------

import { Exchange } from './base/Exchange.js';
import { ArgumentsRequired, AuthenticationError, RateLimitExceeded, BadRequest, ExchangeError, InvalidOrder } from './base/errors.js';
import { Precise } from './base/Precise.js';
import { TICK_SIZE } from './base/functions/number.js';

// ---------------------------------------------------------------------------

export default class blofin extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'blofin',
            'name': 'Blofin',
            'countries': [ 'KY' ], // Cayman Islands
            'rateLimit': 100,
            'version': 'v1',
            'certified': false,
            'pro': true,
            'hostname': 'blofin.com',
            'has': {
                'CORS': undefined,
                'spot': false,
                'margin': false,
                'swap': true,
                'future': false,
                'option': false,
                'addMargin': false,
                'borrowMargin': false,
                'cancelAllOrders': true,
                'cancelOrder': true,
                'cancelWithdraw': false, // exchange have that endpoint disabled atm, but was once implemented in ccxt per old docs: https://kronosresearch.github.io/wootrade-documents/#cancel-withdraw-request
                'createDepositAddress': false,
                'createMarketOrder': false,
                'createOrder': true,
                'createReduceOnlyOrder': true,
                'createStopLimitOrder': false,
                'createStopMarketOrder': false,
                'createStopOrder': false,
                'fetchAccounts': true,
                'fetchBalance': true,
                'fetchCanceledOrders': false,
                'fetchClosedOrder': false,
                'fetchClosedOrders': false,
                'fetchCurrencies': true,
                'fetchDepositAddress': false,
                'fetchDeposits': false,
                'fetchFundingHistory': false,
                'fetchFundingRate': false,
                'fetchFundingRateHistory': false,
                'fetchFundingRates': false,
                'fetchIndexOHLCV': false,
                'fetchLedger': true,
                'fetchLeverage': true,
                'fetchMarginMode': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenInterestHistory': false,
                'fetchOpenOrder': false,
                'fetchOpenOrders': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrders': true,
                'fetchOrderTrades': true,
                'fetchPosition': false,
                'fetchPositionMode': false,
                'fetchPositions': true,
                'fetchPremiumIndexOHLCV': false,
                'fetchStatus': false,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': false,
                'fetchTrades': true,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'fetchTransactions': false,
                'fetchTransfers': false,
                'fetchWithdrawals': false,
                'reduceMargin': false,
                'repayMargin': false,
                'setLeverage': true,
                'setMargin': false,
                'transfer': false,
                'withdraw': false,
            },
            'timeframes': {
                '1m': '1m',
                '3m': '3m',
                '5m': '5m',
                '15m': '15m',
                '30m': '30m',
                '1h': '1H',
                '2h': '2H',
                '4h': '4H',
                '6h': '6H',
                '12h': '12H',
                '1d': '1D',
                '1w': '1W',
                '1M': '1M',
                '3M': '3M',
                '6M': '6M',
                '1y': '1Y',
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/150730761-1a00e5e0-d28c-480f-9e65-089ce3e6ef3b.jpg',
                'api': {
                    'rest': 'https://openapi.blofin.com',
                },
                'www': 'https://blofin.com/',
                'doc': [
                    'https://docs.blofin.com/',
                ],
            },
            'api': {
                'v1': {
                    'public': {
                        'get': {
                            'market/instruments': 1,
                            'market/tickers': 1,
                            'market/candles': 1,
                        },
                    },
                    'private': {
                        'get': {
                            'account/leverage-info': 1,
                            'asset/balances': 1,
                            'account/positions': 1,
                            'trade/orders-pending': 1,
                            // 'client/token': 1,
                            // 'order/{oid}': 1,
                            // 'client/order/{client_order_id}': 1,
                            // 'orders': 1,
                            // 'orderbook/{symbol}': 1,
                            // 'client/trade/{tid}': 1,
                            // 'order/{oid}/trades': 1,
                            // 'client/trades': 1,
                            // 'client/info': 60,
                            // 'asset/deposit': 10,
                            // 'asset/history': 60,
                            // 'sub_account/all': 60,
                            // 'sub_account/assets': 60,
                            // 'token_interest': 60,
                            // 'token_interest/{token}': 60,
                            // 'interest/history': 60,
                            // 'interest/repay': 60,
                            // 'funding_fee/history': 30,
                            // 'positions': 3.33, // 30 requests per 10 seconds
                            // 'position/{symbol}': 3.33,
                        },
                        'post': {
                            'order': 5, // 2 requests per 1 second per symbol
                            'asset/main_sub_transfer': 30, // 20 requests per 60 seconds
                            'asset/withdraw': 30,  // implemented in ccxt, disabled on the exchange side https://kronosresearch.github.io/wootrade-documents/#token-withdraw
                            'interest/repay': 60,
                            'client/account_mode': 120,
                            'client/leverage': 120,
                        },
                        'delete': {
                            'order': 1,
                            'client/order': 1,
                            'orders': 1,
                            'asset/withdraw': 120,  // implemented in ccxt, disabled on the exchange side https://kronosresearch.github.io/wootrade-documents/#cancel-withdraw-request
                        },
                    },
                },
            },
            'fees': {
                'trading': {
                    'tierBased': true,
                    'percentage': true,
                    'maker': this.parseNumber ('0.0002'),
                    'taker': this.parseNumber ('0.0005'),
                },
            },
            'options': {
                'createMarketBuyOrderRequiresPrice': true,
                // these network aliases require manual mapping here
                'network-aliases-for-tokens': {
                    'HT': 'ERC20',
                    'OMG': 'ERC20',
                    'UATOM': 'ATOM',
                    'ZRX': 'ZRX',
                },
                'networks': {
                    'TRX': 'TRON',
                    'TRC20': 'TRON',
                    'ERC20': 'ETH',
                    'BEP20': 'BSC',
                },
                // override defaultNetworkCodePriorities for a specific currency
                'defaultNetworkCodeForCurrencies': {
                    // 'USDT': 'TRC20',
                    // 'BTC': 'BTC',
                },
                'transfer': {
                    'fillResponseFromRequest': true,
                },
                'brokerId': 'ab82cb09-cfec-4473-80a3-b740779d0644',
            },
            'commonCurrencies': {},
            'exceptions': {
                'exact': {
                    '-1000': ExchangeError, // { "code": -1000,  "message": "An unknown error occurred while processing the request" }
                    '-1001': AuthenticationError, // { "code": -1001,  "message": "The api key or secret is in wrong format" }
                    '-1002': AuthenticationError, // { "code": -1002,  "message": "API key or secret is invalid, it may because key have insufficient permission or the key is expired/revoked." }
                    '-1003': RateLimitExceeded, // { "code": -1003,  "message": "Rate limit exceed." }
                    '-1004': BadRequest, // { "code": -1004,  "message": "An unknown parameter was sent." }
                    '-1005': BadRequest, // { "code": -1005,  "message": "Some parameters are in wrong format for api." }
                    '-1006': BadRequest, // { "code": -1006,  "message": "The data is not found in server." }
                    '-1007': BadRequest, // { "code": -1007,  "message": "The data is already exists or your request is duplicated." }
                    '-1008': InvalidOrder, // { "code": -1008,  "message": "The quantity of settlement is too high than you can request." }
                    '-1009': BadRequest, // { "code": -1009,  "message": "Can not request withdrawal settlement, you need to deposit other arrears first." }
                    '-1011': ExchangeError, // { "code": -1011,  "message": "Can not place/cancel orders, it may because internal network error. Please try again in a few seconds." }
                    '-1012': BadRequest, // { "code": -1012,  "message": "Amount is required for buy market orders when margin disabled."}  The place/cancel order request is rejected by internal module, it may because the account is in liquidation or other internal errors. Please try again in a few seconds." }
                    '-1101': InvalidOrder, // { "code": -1101,  "message": "The risk exposure for client is too high, it may cause by sending too big order or the leverage is too low. please refer to client info to check the current exposure." }
                    '-1102': InvalidOrder, // { "code": -1102,  "message": "The order value (price * size) is too small." }
                    '-1103': InvalidOrder, // { "code": -1103,  "message": "The order price is not following the tick size rule for the symbol." }
                    '-1104': InvalidOrder, // { "code": -1104,  "message": "The order quantity is not following the step size rule for the symbol." }
                    '-1105': InvalidOrder, // { "code": -1105,  "message": "Price is X% too high or X% too low from the mid price." }
                },
                'broad': {
                    'symbol must not be blank': BadRequest, // when sending 'cancelOrder' without symbol [-1005]
                    'The token is not supported': BadRequest, // when getting incorrect token's deposit address [-1005]
                    'Your order and symbol are not valid or already canceled': BadRequest, // actual response whensending 'cancelOrder' for already canceled id [-1006]
                    'Insufficient WOO. Please enable margin trading for leverage trading': BadRequest, // when selling insufficent token [-1012]
                },
            },
            'precisionMode': TICK_SIZE,
        });
    }

    async fetchMarkets (params = {}) {
        const response = await (this as any).v1PublicGetMarketInstruments (params);
        const data = this.safeValue (response, 'data', []);
        return this.parseMarkets (data);
    }

    parseMarkets (markets) {
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            result.push (this.parseMarket (markets[i]));
        }
        return result;
    }

    parseMarket (market) {
        const marketId = this.safeString (market, 'instId');
        const parts = marketId.split ('-');
        const baseId = this.safeString (parts, 0);
        const quoteId = this.safeString (parts, 1);
        const settleId = 'USDT';
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        const settle = this.safeCurrencyCode (settleId);
        const symbol = base + '/' + quote + ':' + settle;
        // const status = this.safeNumber (market, 'status');
        // const contractSize = this.safeNumber (market, 'size', 1);
        // const contractSize = 1;
        const tickSize = this.safeString (market, 'tickSize');
        const minAmountString = this.safeString (market, 'minSize');
        const minAmount = this.parseNumber (minAmountString);
        const precisionPrice = this.parseNumber (tickSize);
        let maxLeverage = this.safeString (market, 'maxLeverage', '1');
        maxLeverage = Precise.stringMax (maxLeverage, '1');
        return {
            'id': marketId,
            'symbol': symbol,
            'base': base,
            'quote': quote,
            'settle': settle,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': settleId,
            'type': 'swap',
            'spot': false,
            'margin': true,
            'swap': true,
            'future': false,
            'option': false,
            'active': true,
            'contract': true,
            'linear': true,
            'inverse': undefined,
            'contractSize': this.safeNumber (market, 'contractValue'),
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': this.safeNumber (market, 'lotSize'),
                'price': this.parseNumber (this.safeString (market, 'tickSize')),
            },
            'limits': {
                'leverage': {
                    'min': undefined,
                    'max': this.parseNumber (maxLeverage),
                },
                'amount': {
                    'min': minAmount,
                    'max': undefined,
                },
                'price': {
                    'min': precisionPrice,
                    'max': undefined,
                },
                'cost': {
                    'min': undefined,
                    'max': undefined,
                },
            },
            'info': market,
        };
        // const id = this.safeString (market, 'instId');
        // const type = 'future';
        // const contract = true;
        // const baseId = this.safeString (market, 'baseCurrency');
        // const quoteId = this.safeString (market, 'quoteCurrency');
        // const contactType = this.safeString (market, 'contractType');
        // const settleId = this.safeString2 (market, 'settleCcy', 'quoteCurrency'); // safe to assume that on blofin quote == settle for linear markets -- rayana
        // const settle = this.safeCurrencyCode (settleId);
        // const base = this.safeCurrencyCode (baseId);
        // const quote = this.safeCurrencyCode (quoteId);
        // let symbol = base + '/' + quote;
        // let expiry = undefined;
        // if (contract) {
        //     symbol = symbol + ':' + settle;
        //     expiry = this.safeInteger (market, 'expireTime');
        // }
        // const tickSize = this.safeString (market, 'tickSize');
        // const minAmountString = this.safeString (market, 'minSize');
        // const minAmount = this.parseNumber (minAmountString);
        // const fees = this.safeValue2 (this.fees, type, 'trading', {});
        // const precisionPrice = this.parseNumber (tickSize);
        // let maxLeverage = this.safeString (market, 'maxLeverage', '1');
        // maxLeverage = Precise.stringMax (maxLeverage, '1');
        // return this.extend (fees, {
        //     'id': id,
        //     'symbol': symbol,
        //     'base': base,
        //     'quote': quote,
        //     'settle': settle,
        //     'baseId': baseId,
        //     'quoteId': quoteId,
        //     'settleId': settleId,
        //     'type': type,
        //     'spot': false,
        //     'margin': false,
        //     'swap': false,
        //     'future': true,
        //     'option': false,
        //     'active': true,
        //     'contract': contract,
        //     'linear': contactType === 'linear',
        //     'inverse': contactType === 'inverse',
        //     'contractSize': contract ? this.safeNumber (market, 'contractValue') : undefined,
        //     'expiry': expiry,
        //     'expiryDatetime': this.iso8601 (expiry),
        //     'strike': undefined,
        //     'optionType': undefined,
        //     'precision': {
        //         'amount': this.safeNumber (market, 'lotSize'),
        //         'price': precisionPrice,
        //     },
        //     'limits': {
        //         'leverage': {
        //             'min': this.parseNumber ('1'),
        //             'max': this.parseNumber (maxLeverage),
        //         },
        //         'amount': {
        //             'min': minAmount,
        //             'max': undefined,
        //         },
        //         'price': {
        //             'min': precisionPrice,
        //             'max': undefined,
        //         },
        //         'cost': {
        //             'min': undefined,
        //             'max': undefined,
        //         },
        //     },
        //     'info': market,
        // });
    }

    parseTicker (ticker, market = undefined) {
        //
        //     {
        //         "instType": "SPOT",
        //         "instId": "ETH-BTC",
        //         "last": "0.07319",
        //         "lastSz": "0.044378",
        //         "askPx": "0.07322",
        //         "askSz": "4.2",
        //         "bidPx": "0.0732",
        //         "bidSz": "6.050058",
        //         "open24h": "0.07801",
        //         "high24h": "0.07975",
        //         "low24h": "0.06019",
        //         "volCcy24h": "11788.887619",
        //         "vol24h": "167493.829229",
        //         "ts": "1621440583784",
        //         "sodUtc0": "0.07872",
        //         "sodUtc8": "0.07345"
        //     }
        //
        const timestamp = this.safeInteger (ticker, 'ts');
        const marketId = this.safeString (ticker, 'instId');
        market = this.safeMarket (marketId, market, '-');
        const symbol = market['symbol'];
        const last = this.safeString (ticker, 'last');
        const open = this.safeString (ticker, 'open24h');
        const spot = this.safeValue (market, 'spot', false);
        const quoteVolume = spot ? this.safeString (ticker, 'volCurrency24h') : undefined;
        const baseVolume = this.safeString (ticker, 'vol24h');
        const high = this.safeString (ticker, 'high24h');
        const low = this.safeString (ticker, 'low24h');
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': high,
            'low': low,
            'bid': this.safeString (ticker, 'bidPrice'),
            'bidVolume': this.safeString (ticker, 'bidSize'),
            'ask': this.safeString (ticker, 'askPrice'),
            'askVolume': this.safeString (ticker, 'askSize'),
            'vwap': undefined,
            'open': open,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'info': ticker,
        }, market);
    }

    async fetchTicker (symbol, params = {}) {
        /**
         * @method
         * @name okx#fetchTicker
         * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} params extra parameters specific to the okx api endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const response = await (this as any).v1PublicGetMarketTickers ();
        const data = this.safeValue (response, 'data', []);
        for (let i = 0; i < data.length; i++) {
            if (data[i]['instId'] === market['id']) {
                return this.parseTicker (data[i], market);
            }
        }
    }

    async fetchTickersByType (type, symbols: string[] = undefined, params = {}) {
        await this.loadMarkets ();
        const response = await (this as any).v1PublicGetMarketTickers ();
        const tickers = this.safeValue (response, 'data', []);
        return this.parseTickers (tickers, symbols);
    }

    async fetchTickers (symbols: string[] = undefined, params = {}) {
        /**
         * @method
         * @name okx#fetchTickers
         * @description fetches price tickers for multiple markets, statistical calculations with the information calculated over the past 24 hours each market
         * @param {[string]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
         * @param {object} params extra parameters specific to the okx api endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols);
        const first = this.safeString (symbols, 0);
        let market = undefined;
        if (first !== undefined) {
            market = this.market (first);
        }
        const [ type, query ] = this.handleMarketTypeAndParams ('fetchTickers', market, params);
        return await this.fetchTickersByType (type, symbols, query);
    }

    async fetchTrades (symbol, since: any = undefined, limit: any = undefined, params = {}) {
        /**
         * @method
         * @name woo#fetchTrades
         * @description get the list of most recent trades for a particular symbol
         * @param {string} symbol unified symbol of the market to fetch trades for
         * @param {int|undefined} since timestamp in ms of the earliest trade to fetch
         * @param {int|undefined} limit the maximum amount of trades to fetch
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {[object]} a list of [trade structures]{@link https://docs.ccxt.com/en/latest/manual.html?#public-trades}
         */
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchTrades() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await (this as any).v1PublicGetMarketTrades (this.extend (request, params));
        //
        // {
        //     success: true,
        //     rows: [
        //         {
        //             symbol: "SPOT_BTC_USDT",
        //             side: "SELL",
        //             executed_price: 46222.35,
        //             executed_quantity: 0.0012,
        //             executed_timestamp: "1641241162.329"
        //         },
        //         {
        //             symbol: "SPOT_BTC_USDT",
        //             side: "SELL",
        //             executed_price: 46222.35,
        //             executed_quantity: 0.0012,
        //             executed_timestamp: "1641241162.329"
        //         },
        //         {
        //             symbol: "SPOT_BTC_USDT",
        //             side: "BUY",
        //             executed_price: 46224.32,
        //             executed_quantity: 0.00039,
        //             executed_timestamp: "1641241162.287"
        //         },
        //         ...
        //      ]
        // }
        //
        const resultResponse = this.safeValue (response, 'rows', {});
        return this.parseTrades (resultResponse, market, since, limit);
    }

    parseTrade (trade, market = undefined) {
        //
        // public fetchTrades
        //
        //     {
        //         "instId": "ETH-BTC",
        //         "side": "sell",
        //         "sz": "0.119501",
        //         "px": "0.07065",
        //         "tradeId": "15826757",
        //         "ts": "1621446178316"
        //     }
        //
        // private fetchMyTrades
        //
        //     {
        //         "side": "buy",
        //         "fillSz": "0.007533",
        //         "fillPx": "2654.98",
        //         "fee": "-0.000007533",
        //         "ordId": "317321390244397056",
        //         "instType": "SPOT",
        //         "instId": "ETH-USDT",
        //         "clOrdId": "",
        //         "posSide": "net",
        //         "billId": "317321390265368576",
        //         "tag": "0",
        //         "execType": "T",
        //         "tradeId": "107601752",
        //         "feeCcy": "ETH",
        //         "ts": "1621927314985"
        //     }
        //
        const id = this.safeString (trade, 'tradeId');
        const marketId = this.safeString (trade, 'instId');
        market = this.safeMarket (marketId, market, '-');
        const symbol = market['symbol'];
        const timestamp = this.safeInteger (trade, 'ts');
        const price = this.safeString2 (trade, 'fillPx', 'price');
        const amount = this.safeString2 (trade, 'fillSz', 'size');
        const side = this.safeString (trade, 'side');
        const orderId = this.safeString (trade, 'ordId');
        const feeCostString = this.safeString (trade, 'fee');
        let fee = undefined;
        if (feeCostString !== undefined) {
            const feeCostSigned = Precise.stringNeg (feeCostString);
            const feeCurrencyId = this.safeString (trade, 'feeCurrency');
            let feeCurrencyCode = this.safeCurrencyCode (feeCurrencyId);
            if (feeCurrencyCode === undefined) {
                feeCurrencyCode = 'USDT';
            }
            fee = {
                'cost': feeCostSigned,
                'currency': feeCurrencyCode,
            };
        }
        let takerOrMaker = this.safeString (trade, 'execType');
        if (takerOrMaker === 'T') {
            takerOrMaker = 'taker';
        } else if (takerOrMaker === 'M') {
            takerOrMaker = 'maker';
        }
        return this.safeTrade ({
            'info': this.deepExtend (trade, { 'symbol': marketId }),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'id': id,
            'order': orderId,
            'type': undefined,
            'takerOrMaker': takerOrMaker,
            'side': side,
            'price': price,
            'amount': amount,
            'cost': undefined,
            'fee': fee,
        }, market);
    }

    parseTokenAndFeeTemp (item, feeTokenKey, feeAmountKey) {
        const feeCost = this.safeString (item, feeAmountKey);
        let fee = undefined;
        if (feeCost !== undefined) {
            const feeCurrencyId = this.safeString (item, feeTokenKey);
            const feeCurrencyCode = this.safeCurrencyCode (feeCurrencyId);
            fee = {
                'cost': feeCost,
                'currency': feeCurrencyCode,
            };
        }
        return fee;
    }

    async createOrder (symbol, type, side, amount, price = undefined, params = {}) {
        /**
         * @method
         * @name woo#createOrder
         * @description create a trade order
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market' or 'limit'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much of currency you want to trade in units of base currency
         * @param {float|undefined} price the price at which the order is to be fullfilled, in units of the quote currency, ignored in market orders
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        // quick order:
        //
        // BTC/USDT:USDT
        // limit
        // buy
        // 4.0
        // 29116.0
        // {'positionMode': 'unknown', 'timeInForce': 'PO', 'reduceOnly': False}
        //
        // limit order:
        //
        // BTC/USDT:USDT
        // limit
        // buy
        // 4.0
        // 28520.0
        // {'positionMode': 'unknown', 'timeInForce': 'PO', 'reduceOnly': False}
        //
        // no post = 'timeInForce': 'GTC',
        //
        // SL
        //
        // BTC/USDT:USDT
        // stop
        // sell
        // 20.0
        // None
        // {'positionMode': 'unknown', 'stopPrice': 27663.0, 'timeInForce': 'GTC', 'trigger': 'Last', 'close': True, 'basePrice': 29024.0}
        //
        // TP
        //
        // BTC/USDT:USDT
        // stop
        // sell
        // 20.0
        // None
        // {'positionMode': 'unknown', 'stopPrice': 30150.0, 'timeInForce': 'GTC', 'trigger': 'Last', 'close': True, 'basePrice': 29024.0}
        //
        // LIMIT TP
        //
        // BTC/USDT:USDT
        // stopLimit
        // sell
        // 4.0
        // 33000.0
        // {'positionMode': 'unknown', 'stopPrice': 32000.0, 'timeInForce': 'GTC', 'trigger': 'Last', 'close': True, 'basePrice': 29024.0}
        const reduceOnly = this.safeValue2 (params, 'reduceOnly', 'close');
        const orderType = type.toUpperCase ();
        if (orderType === 'STOP' || orderType === 'STOPLIMIT') {
            await this.loadMarkets ();
            const market = this.market (symbol);
            const orderSide = side.toUpperCase ();
            let algoOrderType = 'MARKET';
            if (orderType !== 'STOP') {
                algoOrderType = 'LIMIT';
            }
            const triggerPrice = this.safeValue2 (params, 'stopPrice', 'triggerPrice');
            const request = {
                'symbol': market['id'],
                'algoType': 'STOP',
                'type': algoOrderType,
                'side': orderSide,
            };
            if (reduceOnly) {
                request['reduceOnly'] = reduceOnly;
            }
            if (price !== undefined) {
                request['price'] = this.priceToPrecision (symbol, price);
            }
            request['triggerPrice'] = triggerPrice;
            request['quantity'] = this.amountToPrecision (symbol, amount);
            params = this.omit (params, [ 'clOrdID', 'clientOrderId', 'postOnly', 'timeInForce' ]);
            // const response = await (this as any).v3PrivatePostAlgoOrder (this.extend (request, params));
            const brokerId = this.safeString (this.options, 'brokerId');
            if (brokerId !== undefined) {
                request['brokerId'] = brokerId;
            }
            const response = await (this as any).v3PrivatePostAlgoOrder (request);
            // {
            //     success: true,
            //     timestamp: '1641383206.489',
            //     order_id: '86980774',
            //     order_type: 'LIMIT',
            //     order_price: '1', // null for 'MARKET' order
            //     order_quantity: '12', // null for 'MARKET' order
            //     order_amount: null, // NOT-null for 'MARKET' order
            //     client_order_id: '0'
            // }
            // response -> data -> rows -> [0]
            const data = this.safeValue (response, 'data');
            const rows = this.safeValue (data, 'rows', []);
            // return this.extend (
            //     this.parseOrder (rows[0], market),
            //     { 'type': type }
            // );
            return this.extend (
                this.parseOrder (rows[0], market),
                { 'status': 'open' }
            );
        } else {
            await this.loadMarkets ();
            const market = this.market (symbol);
            const orderSide = side.toUpperCase ();
            const request = {
                'symbol': market['id'],
                'order_type': orderType, // LIMIT/MARKET/IOC/FOK/POST_ONLY/ASK/BID
                'side': orderSide,
            };
            const isMarket = orderType === 'MARKET';
            const timeInForce = this.safeStringLower (params, 'timeInForce');
            const postOnly = this.isPostOnly (isMarket, undefined, params);
            if (postOnly) {
                request['order_type'] = 'POST_ONLY';
            } else if (timeInForce === 'fok') {
                request['order_type'] = 'FOK';
            } else if (timeInForce === 'ioc') {
                request['order_type'] = 'IOC';
            }
            if (reduceOnly) {
                request['reduce_only'] = reduceOnly;
            }
            if (price !== undefined) {
                request['order_price'] = this.priceToPrecision (symbol, price);
            }
            request['order_quantity'] = this.amountToPrecision (symbol, amount);
            const clientOrderId = this.safeString2 (params, 'clOrdID', 'clientOrderId');
            if (clientOrderId !== undefined) {
                request['client_order_id'] = clientOrderId;
            }
            const brokerId = this.safeString (this.options, 'brokerId');
            if (brokerId !== undefined) {
                request['broker_id'] = brokerId;
            }
            params = this.omit (params, [ 'clOrdID', 'clientOrderId', 'postOnly', 'timeInForce' ]);
            const response = await (this as any).v1PrivatePostOrder (this.extend (request, params));
            // {
            //     success: true,
            //     timestamp: '1641383206.489',
            //     order_id: '86980774',
            //     order_type: 'LIMIT',
            //     order_price: '1', // null for 'MARKET' order
            //     order_quantity: '12', // null for 'MARKET' order
            //     order_amount: null, // NOT-null for 'MARKET' order
            //     client_order_id: '0'
            // }
            return this.extend (
                this.parseOrder (response, market),
                { 'type': type, 'status': 'open' }
            );
        }
    }

    async editOrder (id, symbol, type, side, amount, price = undefined, params = {}) {
        /**
         * @method
         * @name woo#editOrder
         * @description edit a trade order
         * @param {string} id order id
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market' or 'limit'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much of currency you want to trade in units of base currency
         * @param {float|undefined} price the price at which the order is to be fullfilled, in units of the quote currency, ignored in market orders
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'oid': id,
            // 'quantity': this.amountToPrecision (symbol, amount),
            // 'price': this.priceToPrecision (symbol, price),
        };
        if (price !== undefined && type !== 'stop') {
            request['price'] = this.priceToPrecision (symbol, price);
        }
        const triggerPrice = this.safeValue2 (params, 'stopPrice', 'triggerPrice');
        if (triggerPrice !== undefined) {
            request['triggerPrice'] = triggerPrice;
        }
        if (amount !== undefined) {
            request['quantity'] = this.amountToPrecision (symbol, amount);
        }
        let method = 'v3PrivatePutOrderOid';
        if (this.maybeAlgoOrderId (id)) {
            method = 'v3PrivatePutAlgoOrderOid';
        }
        const response = await (this as any)[method] (this.extend (request, params));
        //
        //     {
        //         "code": 0,
        //         "data": {
        //             "status": "string",
        //             "success": true
        //         },
        //         "message": "string",
        //         "success": true,
        //         "timestamp": 0
        //     }
        //
        const data = this.safeValue (response, 'data', {});
        return this.parseOrder (data, market);
    }

    maybeAlgoOrderId (id) {
        const stringId = this.numberToString (id);
        if (stringId.length < 9) {
            return true;
        }
        return false;
    }

    async cancelOrder (id, symbol: string = undefined, params = {}) {
        /**
         * @method
         * @name woo#cancelOrder
         * @description cancels an open order
         * @param {string} id order id
         * @param {string} symbol unified symbol of the market the order was made in
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' cancelOrder() requires a symbol argument');
        }
        await this.loadMarkets ();
        if (this.maybeAlgoOrderId (id)) {
            return this.cancelAlgoOrder (id, symbol, params);
        } else {
            return this.cancelRegularOrder (id, symbol, params);
        }
    }

    async cancelAlgoOrder (id, symbol: string = undefined, params = {}) {
        const request = {};
        request['oid'] = id;
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        request['symbol'] = market['id'];
        const response = await (this as any).v3PrivateDeleteAlgoOrderOid (this.extend (request, params));
        //
        // { success: true, status: 'CANCEL_SENT' }
        //
        const extendParams = { 'symbol': symbol };
        extendParams['id'] = id;
        return this.extend (this.parseOrder (response), extendParams);
    }

    async cancelRegularOrder (id, symbol: string = undefined, params = {}) {
        const request = {};
        const clientOrderIdUnified = this.safeString2 (params, 'clOrdID', 'clientOrderId');
        const clientOrderIdExchangeSpecific = this.safeString2 (params, 'client_order_id', clientOrderIdUnified);
        const isByClientOrder = clientOrderIdExchangeSpecific !== undefined;
        if (isByClientOrder) {
            request['client_order_id'] = clientOrderIdExchangeSpecific;
            params = this.omit (params, [ 'clOrdID', 'clientOrderId', 'client_order_id' ]);
        } else {
            request['order_id'] = id;
        }
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        request['symbol'] = market['id'];
        const response = await (this as any).v1PrivateDeleteOrder (this.extend (request, params));
        //
        // { success: true, status: 'CANCEL_SENT' }
        //
        const extendParams = { 'symbol': symbol };
        if (isByClientOrder) {
            extendParams['client_order_id'] = clientOrderIdExchangeSpecific;
        } else {
            extendParams['id'] = id;
        }
        return this.extend (this.parseOrder (response), extendParams);
    }

    async cancelAllOrders (symbol: string = undefined, params = {}) {
        /**
         * @method
         * @name woo#cancelAllOrders
         * @description cancel all open orders in a market
         * @param {string|undefined} symbol unified market symbol
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {object} an list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' canelOrders() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await (this as any).v1PrivateDeleteOrders (this.extend (request, params));
        await (this as any).v3PrivateDeleteAlgoOrdersPending (this.extend (request, params));
        //
        //     {
        //         "success":true,
        //         "status":"CANCEL_ALL_SENT"
        //     }
        //
        return response;
    }

    async fetchOrder (id, symbol: string = undefined, params = {}) {
        /**
         * @method
         * @name woo#fetchOrder
         * @description fetches information on an order made by the user
         * @param {string|undefined} symbol unified symbol of the market the order was made in
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets ();
        const market = (symbol !== undefined) ? this.market (symbol) : undefined;
        const request = {};
        const clientOrderId = this.safeString2 (params, 'clOrdID', 'clientOrderId');
        let chosenSpotMethod = undefined;
        if (this.maybeAlgoOrderId (id)) {
            chosenSpotMethod = 'v3PrivateDeleteAlgoOrderOid';
        } else if (clientOrderId) {
            chosenSpotMethod = 'v1PrivateGetClientOrderClientOrderId';
            request['client_order_id'] = clientOrderId;
        } else {
            chosenSpotMethod = 'v1PrivateGetOrderOid';
            request['oid'] = id;
        }
        const response = await this[chosenSpotMethod] (this.extend (request, params));
        //
        // {
        //     success: true,
        //     symbol: 'SPOT_WOO_USDT',
        //     status: 'FILLED', // FILLED, NEW
        //     side: 'BUY',
        //     created_time: '1641480933.000',
        //     order_id: '87541111',
        //     order_tag: 'default',
        //     price: '1',
        //     type: 'LIMIT',
        //     quantity: '12',
        //     amount: null,
        //     visible: '12',
        //     executed: '12', // or any partial amount
        //     total_fee: '0.0024',
        //     fee_asset: 'WOO',
        //     client_order_id: null,
        //     average_executed_price: '1',
        //     Transactions: [
        //       {
        //         id: '99111647',
        //         symbol: 'SPOT_WOO_USDT',
        //         fee: '0.0024',
        //         side: 'BUY',
        //         executed_timestamp: '1641482113.084',
        //         order_id: '87541111',
        //         executed_price: '1',
        //         executed_quantity: '12',
        //         fee_asset: 'WOO',
        //         is_maker: '1'
        //       }
        //     ]
        // }
        //
        return this.parseOrder (response, market);
    }

    async fetchOrders (symbol: string = undefined, since: any = undefined, limit: any = undefined, params = {}) {
        /**
         * @method
         * @name woo#fetchOrders
         * @description fetches information on multiple orders made by the user
         * @param {string|undefined} symbol unified market symbol of the market orders were made in
         * @param {int|undefined} since the earliest time in ms to fetch orders for
         * @param {int|undefined} limit the maximum number of  orde structures to retrieve
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {[object]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets ();
        const request = {};
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        if (since !== undefined) {
            request['start_t'] = since;
        }
        request['size'] = 500;
        request['status'] = 'INCOMPLETE';
        const ordersResponse = await (this as any).v1PrivateGetOrders (this.extend (request, params));
        //
        //     {
        //         "success":true,
        //         "meta":{
        //             "total":1,
        //             "records_per_page":100,
        //             "current_page":1
        //         },
        //         "rows":[
        //             {
        //                 "symbol":"PERP_BTC_USDT",
        //                 "status":"FILLED",
        //                 "side":"SELL",
        //                 "created_time":"1611617776.000",
        //                 "updated_time":"1611617776.000",
        //                 "order_id":52121167,
        //                 "order_tag":"default",
        //                 "price":null,
        //                 "type":"MARKET",
        //                 "quantity":0.002,
        //                 "amount":null,
        //                 "visible":0,
        //                 "executed":0.002,
        //                 "total_fee":0.01732885,
        //                 "fee_asset":"USDT",
        //                 "client_order_id":null,
        //                 "average_executed_price":28881.41
        //             }
        //         ]
        //     }
        //
        const ordersData = this.safeValue (ordersResponse, 'rows');
        let total = 0;
        let algoOrdersRows = [];
        for (let i = 0; i < 50; i++) {
            request['size'] = 50;
            request['page'] = i + 1;
            const algoOrdersResponse = await (this as any).v3PrivateGetAlgoOrders (this.extend (request, params));
            const algoOrdersData = this.safeValue (algoOrdersResponse, 'data');
            const algoOrdersMeta = this.safeValue (algoOrdersData, 'meta');
            const newRows = this.safeValue (algoOrdersData, 'rows');
            total = total + newRows.length;
            algoOrdersRows = this.arrayConcat (algoOrdersRows, newRows);
            const knownTotal = this.safeInteger (algoOrdersMeta, 'total');
            if (total >= knownTotal) {
                break;
            }
        }
        const allOrdersData = this.arrayConcat (ordersData, algoOrdersRows);
        return this.parseOrders (allOrdersData, market, since, limit, params);
    }

    parseTimeInForce (timeInForce) {
        const timeInForces = {
            'ioc': 'IOC',
            'fok': 'FOK',
            'post_only': 'PO',
        };
        return this.safeString (timeInForces, timeInForce, undefined);
    }

    parseOrderType (type, algoType = undefined) {
        if (algoType !== undefined) {
            if (algoType === 'take_profit') {
                if (type === 'market') {
                    return 'stop';
                } else {
                    return 'stopLimit';
                }
            }
        }
        // LIMIT/MARKET/IOC/FOK/POST_ONLY/LIQUIDATE
        const types = {
            'limit': 'limit',
            'market': 'market',
            'post_only': 'limit',
            'ioc': 'limit',
            'fok': 'limit',
            'liquidate': 'limit',
            // 'stop_market': 'stop',
            // 'take_profit_market': 'stop',
            // 'take_profit_limit': 'stopLimit',
            // 'trigger_limit': 'stopLimit',
            // 'trigger_market': 'stop',
        };
        return this.safeStringLower (types, type, type);
    }

    parseOrder (order, market = undefined) {
        //
        // createOrder
        //
        //     {
        //         "clOrdId": "oktswap6",
        //         "ordId": "312269865356374016",
        //         "tag": "",
        //         "sCode": "0",
        //         "sMsg": ""
        //     }
        //
        // Spot and Swap fetchOrder, fetchOpenOrders
        //
        //     {
        //         "accFillSz": "0",
        //         "avgPx": "",
        //         "cTime": "1621910749815",
        //         "category": "normal",
        //         "ccy": "",
        //         "clOrdId": "",
        //         "fee": "0",
        //         "feeCcy": "ETH",
        //         "fillPx": "",
        //         "fillSz": "0",
        //         "fillTime": "",
        //         "instId": "ETH-USDT",
        //         "instType": "SPOT",
        //         "lever": "",
        //         "ordId": "317251910906576896",
        //         "ordType": "limit",
        //         "pnl": "0",
        //         "posSide": "net",
        //         "px": "2000",
        //         "rebate": "0",
        //         "rebateCcy": "USDT",
        //         "side": "buy",
        //         "slOrdPx": "",
        //         "slTriggerPx": "",
        //         "state": "live",
        //         "sz": "0.001",
        //         "tag": "",
        //         "tdMode": "cash",
        //         "tpOrdPx": "",
        //         "tpTriggerPx": "",
        //         "tradeId": "",
        //         "uTime": "1621910749815"
        //     }
        //
        // Algo Order fetchOpenOrders, fetchCanceledOrders, fetchClosedOrders
        //
        //     {
        //         "activePx": "",
        //         "activePxType": "",
        //         "actualPx": "",
        //         "actualSide": "buy",
        //         "actualSz": "0",
        //         "algoId": "431375349042380800",
        //         "cTime": "1649119897778",
        //         "callbackRatio": "",
        //         "callbackSpread": "",
        //         "ccy": "",
        //         "ctVal": "0.01",
        //         "instId": "BTC-USDT-SWAP",
        //         "instType": "SWAP",
        //         "last": "46538.9",
        //         "lever": "125",
        //         "moveTriggerPx": "",
        //         "notionalUsd": "467.059",
        //         "ordId": "",
        //         "ordPx": "50000",
        //         "ordType": "trigger",
        //         "posSide": "long",
        //         "pxLimit": "",
        //         "pxSpread": "",
        //         "pxVar": "",
        //         "side": "buy",
        //         "slOrdPx": "",
        //         "slTriggerPx": "",
        //         "slTriggerPxType": "",
        //         "state": "live",
        //         "sz": "1",
        //         "szLimit": "",
        //         "tag": "",
        //         "tdMode": "isolated",
        //         "tgtCcy": "",
        //         "timeInterval": "",
        //         "tpOrdPx": "",
        //         "tpTriggerPx": "",
        //         "tpTriggerPxType": "",
        //         "triggerPx": "50000",
        //         "triggerPxType": "last",
        //         "triggerTime": "",
        //         "uly": "BTC-USDT"
        //     }
        //
        const id = this.safeString2 (order, 'algoId', 'orderId');
        const timestamp = this.safeInteger (order, 'createTime');
        const lastTradeTimestamp = this.safeInteger (order, 'updateTime');
        const side = this.safeString (order, 'side');
        let type = this.safeString (order, 'orderType');
        const postOnly = undefined;
        const timeInForce = undefined;
        // if (type === 'post_only') {
        //     postOnly = true;
        //     type = 'limit';
        // } else if (type === 'fok') {
        //     timeInForce = 'FOK';
        //     type = 'limit';
        // } else if (type === 'ioc') {
        //     timeInForce = 'IOC';
        //     type = 'limit';
        // }
        type = 'limit';
        const marketId = this.safeString (order, 'instId');
        market = this.safeMarket (marketId, market);
        const symbol = market['symbol'];
        const filled = this.safeString (order, 'filledSize');
        const price = this.safeString2 (order, 'px', 'price');
        const average = this.safeString (order, 'averagePrice');
        const status = this.parseOrderStatus (this.safeString (order, 'state'));
        const feeCostString = this.safeString (order, 'fee');
        let amount = undefined;
        // let cost = undefined;
        // spot market buy: "sz" can refer either to base currency units or to quote currency units
        // see documentation: https://www.okx.com/docs-v5/en/#rest-api-trade-place-order
        // const defaultTgtCcy = this.safeString (this.options, 'tgtCcy', 'base_ccy');
        // const tgtCcy = this.safeString (order, 'tgtCcy', defaultTgtCcy);
        // const instType = this.safeString (order, 'instType');
        // "sz" refers to the trade currency amount
        amount = this.safeString (order, 'size');
        let fee = undefined;
        if (feeCostString !== undefined) {
            const feeCostSigned = Precise.stringNeg (feeCostString);
            const feeCurrencyId = 'USDT';
            const feeCurrencyCode = this.safeCurrencyCode (feeCurrencyId);
            fee = {
                'cost': this.parseNumber (feeCostSigned),
                'currency': feeCurrencyCode,
            };
        }
        let clientOrderId = this.safeString (order, 'clientOrderId');
        if ((clientOrderId !== undefined) && (clientOrderId.length < 1)) {
            clientOrderId = undefined; // fix empty clientOrderId string
        }
        const stopLossPrice = this.safeNumber2 (order, 'slTriggerPrice', 'slOrderPrice');
        const takeProfitPrice = this.safeNumber2 (order, 'tpTriggerPrice', 'tpOrderPrice');
        const stopPrice = this.safeNumberN (order, [ 'price' ]);
        const reduceOnlyRaw = this.safeString (order, 'reduceOnly');
        let reduceOnly = false;
        if (reduceOnly !== undefined) {
            reduceOnly = (reduceOnlyRaw === 'true');
        }
        return this.safeOrder ({
            'info': order,
            'id': id,
            'clientOrderId': clientOrderId,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': lastTradeTimestamp,
            'symbol': symbol,
            'type': type,
            'timeInForce': timeInForce,
            'postOnly': postOnly,
            'side': side,
            'price': price,
            'stopLossPrice': stopLossPrice,
            'takeProfitPrice': takeProfitPrice,
            'stopPrice': stopPrice,
            'triggerPrice': stopPrice,
            'average': average,
            'cost': undefined,
            'amount': amount,
            'filled': filled,
            'remaining': undefined,
            'status': status,
            'fee': fee,
            'trades': undefined,
            'reduceOnly': reduceOnly,
        }, market);
    }

    parseOrderStatus (status) {
        const statuses = {
            'canceled': 'canceled',
            'live': 'open',
            'partially_filled': 'open',
            'filled': 'closed',
            'effective': 'closed',
        };
        return this.safeString (statuses, status, status);
    }

    async fetchOpenOrders (symbol: string = undefined, since: any = undefined, limit: any = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {
            // 'instType': 'SPOT', // SPOT, MARGIN, SWAP, FUTURES, OPTION
            // 'uly': currency['id'],
            // 'instId': market['id'],
            // 'ordType': 'limit', // market, limit, post_only, fok, ioc, comma-separated, stop orders: conditional, oco, trigger, move_order_stop, iceberg, or twap
            // 'state': 'live', // live, partially_filled
            // 'after': orderId,
            // 'before': orderId,
            // 'limit': limit, // default 100, max 100
            'limit': 100,
        };
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['instId'] = market['id'];
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default 100, max 100
        }
        const query = this.omit (params, [ 'method', 'stop' ]);
        const response = await (this as any).v1PrivateGetTradeOrdersPending (this.extend (request, query));
        const data = this.safeValue (response, 'data', []);
        return this.parseOrders (data, market, since, limit);
    }

    async fetchOrderBook (symbol, limit = undefined, params = {}) {
        /**
         * @method
         * @name woo#fetchOrderBook
         * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
         * @param {string} symbol unified symbol of the market to fetch the order book for
         * @param {int|undefined} limit the maximum amount of order book entries to return
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        if (limit !== undefined) {
            limit = Math.min (limit, 1000);
            request['max_level'] = limit;
        }
        const response = await (this as any).v1PrivateGetOrderbookSymbol (this.extend (request, params));
        //
        // {
        //   success: true,
        //   timestamp: '1641562961192',
        //   asks: [
        //     { price: '0.921', quantity: '76.01' },
        //     { price: '0.933', quantity: '477.10' },
        //     ...
        //   ],
        //   bids: [
        //     { price: '0.940', quantity: '13502.47' },
        //     { price: '0.932', quantity: '43.91' },
        //     ...
        //   ]
        // }
        //
        const timestamp = this.safeInteger (response, 'timestamp');
        return this.parseOrderBook (response, symbol, timestamp, 'bids', 'asks', 'price', 'quantity');
    }

    parseOHLCV (ohlcv, market = undefined) {
        //
        //     [
        //         "1678928760000", // timestamp
        //         "24341.4", // open
        //         "24344", // high
        //         "24313.2", // low
        //         "24323", // close
        //         "628", // contract volume
        //         "2.5819", // base volume
        //         "62800", // quote volume
        //         "0" // candlestick state
        //     ]
        //
        return [
            this.safeInteger (ohlcv, 0),
            this.safeNumber (ohlcv, 1),
            this.safeNumber (ohlcv, 2),
            this.safeNumber (ohlcv, 3),
            this.safeNumber (ohlcv, 4),
            this.safeNumber (ohlcv, 7),
        ];
    }

    async fetchOHLCV (symbol, timeframe = '1m', since: any = undefined, limit: any = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        params = this.omit (params, 'price');
        const options = this.safeValue (this.options, 'fetchOHLCV', {});
        const timezone = this.safeString (options, 'timezone', 'UTC');
        if (limit === undefined) {
            limit = 100;
        }
        const duration = this.parseTimeframe (timeframe);
        let bar = this.safeString (this.timeframes, timeframe, timeframe);
        if ((timezone === 'UTC') && (duration >= 21600)) { // if utc and timeframe >= 6h
            bar += timezone.toLowerCase ();
        }
        const request = {
            'instId': market['id'],
            'bar': bar,
            'limit': limit,
        };
        if (since !== undefined) {
            const durationInMilliseconds = duration * 1000;
            const startTime = Math.max (since - 1, 0);
            request['before'] = startTime;
            request['after'] = this.sum (startTime, durationInMilliseconds * limit);
        }
        const until = this.safeInteger (params, 'until');
        if (until !== undefined) {
            request['after'] = until;
            params = this.omit (params, 'until');
        }
        params = this.omit (params, 'type');
        const response = await (this as any).v1PublicGetMarketCandles (this.extend (request, params));
        //
        //     {
        //         "code": "0",
        //         "msg": "",
        //         "data": [
        //             ["1678928760000","24341.4","24344","24313.2","24323","628","2.5819","62800","0"],
        //             ["1678928700000","24324.1","24347.6","24321.7","24341.4","2565","10.5401","256500","1"],
        //             ["1678928640000","24300.2","24324.1","24288","24324.1","3304","13.5937","330400","1"],
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        return this.parseOHLCVs (data, market, timeframe, since, limit);
    }

    async fetchOrderTrades (id, symbol: string = undefined, since: any = undefined, limit: any = undefined, params = {}) {
        /**
         * @method
         * @name woo#fetchOrderTrades
         * @description fetch all the trades made from a single order
         * @param {string} id order id
         * @param {string|undefined} symbol unified market symbol
         * @param {int|undefined} since the earliest time in ms to fetch trades for
         * @param {int|undefined} limit the maximum number of trades to retrieve
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {[object]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
         */
        await this.loadMarkets ();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        const request = {
            'oid': id,
        };
        const response = await (this as any).v1PrivateGetOrderOidTrades (this.extend (request, params));
        // {
        //     success: true,
        //     rows: [
        //       {
        //         id: '99111647',
        //         symbol: 'SPOT_WOO_USDT',
        //         fee: '0.0024',
        //         side: 'BUY',
        //         executed_timestamp: '1641482113.084',
        //         order_id: '87541111',
        //         order_tag: 'default',
        //         executed_price: '1',
        //         executed_quantity: '12',
        //         fee_asset: 'WOO',
        //         is_maker: '1'
        //       }
        //     ]
        // }
        const trades = this.safeValue (response, 'rows', []);
        return this.parseTrades (trades, market, since, limit, params);
    }

    async fetchMyTrades (symbol: string = undefined, since: any = undefined, limit: any = undefined, params = {}) {
        /**
         * @method
         * @name woo#fetchMyTrades
         * @description fetch all trades made by the user
         * @param {string|undefined} symbol unified market symbol
         * @param {int|undefined} since the earliest time in ms to fetch trades for
         * @param {int|undefined} limit the maximum number of trades structures to retrieve
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {[object]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
         */
        await this.loadMarkets ();
        const request = {};
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        if (since !== undefined) {
            request['start_t'] = since;
        }
        const response = await (this as any).v1PrivateGetClientTrades (this.extend (request, params));
        // {
        //     "success": true,
        //     "meta": {
        //         "records_per_page": 25,
        //         "current_page": 1
        //     },
        //     "rows": [
        //         {
        //             "id": 5,
        //             "symbol": "SPOT_BTC_USDT",
        //             "order_id": 211,
        //             "order_tag": "default",
        //             "executed_price": 10892.84,
        //             "executed_quantity": 0.002,
        //             "is_maker": 0,
        //             "side": "SELL",
        //             "fee": 0,
        //             "fee_asset": "USDT",
        //             "executed_timestamp": "1566264290.250"
        //         },
        //         ...
        //     ]
        // }
        const trades = this.safeValue (response, 'rows', []);
        return this.parseTrades (trades, market, since, limit, params);
    }

    async fetchAccounts (params = {}) {
        /**
         * @method
         * @name woo#fetchAccounts
         * @description fetch all the accounts associated with a profile
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {object} a dictionary of [account structures]{@link https://docs.ccxt.com/#/?id=account-structure} indexed by the account type
         */
        const response = await (this as any).v1PrivateGetSubAccountAssets (params);
        //
        //     {
        //         rows: [{
        //                 application_id: '13e4fc34-e2ff-4cb7-b1e4-4c22fee7d365',
        //                 account: 'Main',
        //                 usdt_balance: '4.0'
        //             },
        //             {
        //                 application_id: '432952aa-a401-4e26-aff6-972920aebba3',
        //                 account: 'subaccount',
        //                 usdt_balance: '1.0'
        //             }
        //         ],
        //         success: true
        //     }
        //
        const rows = this.safeValue (response, 'rows', []);
        return this.parseAccounts (rows, params);
    }

    parseAccount (account) {
        //
        //     {
        //         application_id: '336952aa-a401-4e26-aff6-972920aebba3',
        //         account: 'subaccount',
        //         usdt_balance: '1.0',
        //     }
        //
        const accountId = this.safeString (account, 'account');
        return {
            'info': account,
            'id': this.safeString (account, 'application_id'),
            'name': accountId,
            'code': undefined,
            'type': accountId === 'Main' ? 'main' : 'subaccount',
        };
    }

    async fetchBalance (params = {}) {
        /**
         * @method
         * @name woo#fetchBalance
         * @description query for balance and get the amount of funds available for trading or funds locked in orders
         * @see https://docs.woo.org/#get-current-holding-get-balance-new
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {object} a [balance structure]{@link https://docs.ccxt.com/en/latest/manual.html?#balance-structure}
         */
        await this.loadMarkets ();
        const response = await (this as any).v1PrivateGetAssetBalances ({
            'accountType': 'futures',
        });
        //
        //     {
        //         "success": true,
        //         "data": {
        //             "holding": [
        //                 {
        //                     "token": "0_token",
        //                     "holding": 1,
        //                     "frozen": 0,
        //                     "staked": 0,
        //                     "unbonding": 0,
        //                     "vault": 0,
        //                     "interest": 0,
        //                     "pendingShortQty": 0,
        //                     "pendingLongQty": 0,
        //                     "availableBalance": 0,
        //                     "updatedTime": 312321.121
        //                 }
        //             ]
        //         },
        //         "timestamp": 1673323746259
        //     }
        //
        return this.parseBalance (response);
    }

    parseBalance (response) {
        const result = {
            'info': response,
        };
        const balances = this.safeValue (response, 'data', []);
        for (let i = 0; i < balances.length; i++) {
            const balance = balances[i];
            const code = this.safeCurrencyCode (this.safeString (balance, 'currency'));
            const account = this.account ();
            account['total'] = this.safeString (balance, 'balance');
            account['free'] = Precise.stringAdd (this.safeString (balance, 'available'), this.safeString (balance, 'bonus'));
            result[code] = account;
        }
        return this.safeBalance (result);
    }

    getCurrencyFromChaincode (networkizedCode, currency) {
        if (currency !== undefined) {
            return currency;
        } else {
            const parts = networkizedCode.split ('_');
            const partsLength = parts.length;
            const firstPart = this.safeString (parts, 0);
            let currencyId = this.safeString (parts, 1, firstPart);
            if (partsLength > 2) {
                currencyId += '_' + this.safeString (parts, 2);
            }
            currency = this.safeCurrency (currencyId);
        }
        return currency;
    }

    nonce () {
        return this.milliseconds ();
    }

    sign (path, api: any = 'public', method = 'GET', params = {}, headers: any = undefined, body: any = undefined) {
        const isArray = Array.isArray (params);
        const request = '/api/' + this.version + '/' + this.implodeParams (path, params);
        const query = this.omit (params, this.extractParams (path));
        let url = this.implodeHostname (this.urls['api']['rest']) + request;
        // const type = this.getPathAuthenticationType (path);
        if (api[1] === 'public') {
            if (Object.keys (query).length) {
                url += '?' + this.urlencode (query);
            }
        } else if (api[1] === 'private') {
            this.checkRequiredCredentials ();
            const timestamp = this.numberToString (this.milliseconds ());
            const nonce = this.uuid ();
            headers = {
                'ACCESS-KEY': this.apiKey,
                'ACCESS-PASSPHRASE': this.password,
                'ACCESS-TIMESTAMP': timestamp,
                'ACCESS-NONCE': nonce,
                // 'OK-FROM': '',
                // 'OK-TO': '',
                // 'OK-LIMIT': '',
            };
            let auth = request + method + timestamp + nonce;
            if (method === 'GET') {
                if (Object.keys (query).length) {
                    const urlencodedQuery = '?' + this.urlencode (query);
                    url += urlencodedQuery;
                    auth = request + urlencodedQuery + method + timestamp + nonce;
                }
            } else {
                if (isArray || Object.keys (query).length) {
                    body = this.json (query);
                    auth += body;
                }
                headers['Content-Type'] = 'application/json';
            }
            const signature = this.binaryToBase64 (this.encode (this.hmac (this.encode (auth), this.encode (this.secret), 'sha256', 'hex')));
            headers['ACCESS-SIGN'] = signature;
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (httpCode, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (!response) {
            return; // fallback to default error handler
        }
        //
        //     400 Bad Request {"success":false,"code":-1012,"message":"Amount is required for buy market orders when margin disabled."}
        //
        const success = this.safeValue (response, 'success');
        const errorCode = this.safeString (response, 'code');
        if (!success) {
            const feedback = this.id + ' ' + this.json (response);
            this.throwBroadlyMatchedException (this.exceptions['broad'], body, feedback);
            this.throwExactlyMatchedException (this.exceptions['exact'], errorCode, feedback);
        }
    }

    parseIncome (income, market = undefined) {
        //
        //     {
        //         "id":666666,
        //         "symbol":"PERP_BTC_USDT",
        //         "funding_rate":0.00001198,
        //         "mark_price":28941.04000000,
        //         "funding_fee":0.00069343,
        //         "payment_type":"Pay",
        //         "status":"COMPLETED",
        //         "created_time":"1653616000.666",
        //         "updated_time":"1653616000.605"
        //     }
        //
        const marketId = this.safeString (income, 'symbol');
        const symbol = this.safeSymbol (marketId, market);
        const amount = this.safeNumber (income, 'funding_fee');
        const code = this.safeCurrencyCode ('USD');
        const id = this.safeString (income, 'id');
        const timestamp = this.safeTimestamp (income, 'updated_time');
        const rate = this.safeNumber (income, 'funding_rate');
        return {
            'info': income,
            'symbol': symbol,
            'code': code,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'id': id,
            'amount': amount,
            'rate': rate,
        };
    }

    async fetchLeverage (symbol, params = {}) {
        await this.loadMarkets ();
        const response = await (this as any).v1PrivateGetAccountLeverageInfo (params);
        const result = this.safeValue (response, 'data');
        const leverage = this.safeNumber (result, 'leverage');
        const marginMode = this.safeString (result, 'marginMode');
        return {
            'info': response,
            'leverage': leverage,
            'marginMode': marginMode,
        };
    }

    async setLeverage (leverage, symbol: string = undefined, params = {}) {
        await this.loadMarkets ();
        if ((leverage !== 1) && (leverage !== 2) && (leverage !== 3) && (leverage !== 4) && (leverage !== 5) && (leverage !== 10) && (leverage !== 15) && (leverage !== 20) && (leverage !== 50)) {
            throw new BadRequest (this.id + ' leverage should be 1, 2, 3, 4, 5, 10, 15, 20 or 50');
        }
        const request = {
            'leverage': leverage,
        };
        return await (this as any).v1PrivatePostClientLeverage (this.extend (request, params));
    }

    async fetchPositions (symbols: string[] = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {
            // 'instType': 'MARGIN', // optional string, MARGIN, SWAP, FUTURES, OPTION
            // 'instId': market['id'], // optional string, e.g. 'BTC-USD-190927-5000-C'
            // 'posId': '307173036051017730', // optional string, Single or multiple position IDs (no more than 20) separated with commas
        };
        if (symbols !== undefined) {
            const marketIds = [];
            for (let i = 0; i < symbols.length; i++) {
                const entry = symbols[i];
                const market = this.market (entry);
                marketIds.push (market['id']);
            }
            const marketIdsLength = marketIds.length;
            if (marketIdsLength > 0) {
                request['instId'] = marketIds.join (',');
            }
        }
        const response = await (this as any).v1PrivateGetAccountPositions (this.extend (request, params));
        const positions = this.safeValue (response, 'data', []);
        const result = [];
        for (let i = 0; i < positions.length; i++) {
            result.push (this.parsePosition (positions[i]));
        }
        return this.filterByArray (result, 'symbol', symbols, false);
    }

    parsePosition (position, market = undefined) {
        //
        //     {
        //       "adl": "3",
        //       "availPos": "1",
        //       "avgPx": "34131.1",
        //       "cTime": "1627227626502",
        //       "ccy": "USDT",
        //       "deltaBS": "",
        //       "deltaPA": "",
        //       "gammaBS": "",
        //       "gammaPA": "",
        //       "imr": "170.66093041794787",
        //       "instId": "BTC-USDT-SWAP",
        //       "instType": "SWAP",
        //       "interest": "0",
        //       "last": "34134.4",
        //       "lever": "2",
        //       "liab": "",
        //       "liabCcy": "",
        //       "liqPx": "12608.959083877446",
        //       "margin": "",
        //       "mgnMode": "cross",
        //       "mgnRatio": "140.49930117599155",
        //       "mmr": "1.3652874433435829",
        //       "notionalUsd": "341.5130010779638",
        //       "optVal": "",
        //       "pos": "1",
        //       "posCcy": "",
        //       "posId": "339552508062380036",
        //       "posSide": "long",
        //       "thetaBS": "",
        //       "thetaPA": "",
        //       "tradeId": "98617799",
        //       "uTime": "1627227626502",
        //       "upl": "0.0108608358957281",
        //       "uplRatio": "0.0000636418743944",
        //       "vegaBS": "",
        //       "vegaPA": ""
        //     }
        //
        const marketId = this.safeString (position, 'instId');
        market = this.safeMarket (marketId, market);
        const symbol = market['symbol'];
        const contractsString = this.safeString (position, 'positions');
        let contracts = undefined;
        if (contractsString !== undefined) {
            contracts = parseInt (contractsString);
        }
        const notionalString = this.safeString (position, 'notionalUsd');
        const notional = this.parseNumber (notionalString);
        const marginType = this.safeString (position, 'marginMode');
        let initialMarginString = undefined;
        const entryPriceString = this.safeString (position, 'averagePrice');
        const unrealizedPnlString = this.safeString (position, 'unrealizedPnl');
        if (marginType === 'cross') {
            initialMarginString = this.safeString (position, 'initialMargin');
        }
        //  else {
        //     // initialMarginString = this.safeString (position, 'margin');
        // }
        const maintenanceMarginString = this.safeString (position, 'maintenanceMargin');
        const maintenanceMargin = this.parseNumber (maintenanceMarginString);
        let initialMarginPercentage = undefined;
        let maintenanceMarginPercentage = undefined;
        if (market['inverse']) {
            const notionalValue = Precise.stringDiv (
                Precise.stringMul (contractsString, market['contractSize']),
                entryPriceString
            );
            maintenanceMarginPercentage = Precise.stringDiv (maintenanceMarginString, notionalValue);
            initialMarginPercentage = this.parseNumber (
                Precise.stringDiv (initialMarginString, notionalValue, 4)
            );
        } else {
            maintenanceMarginPercentage = Precise.stringDiv (maintenanceMarginString, notionalString);
            initialMarginPercentage = this.parseNumber (
                Precise.stringDiv (initialMarginString, notionalString, 4)
            );
        }
        const rounder = '0.00005'; // round to closest 0.01%
        maintenanceMarginPercentage = this.parseNumber (
            Precise.stringDiv (Precise.stringAdd (maintenanceMarginPercentage, rounder), '1', 4)
        );
        const collateralString = Precise.stringAdd (initialMarginString, unrealizedPnlString);
        const liquidationPrice = this.safeNumber (position, 'liquidationPrice');
        const percentageString = this.safeString (position, 'unrealizedPnlRatio');
        const percentage = this.parseNumber (Precise.stringMul (percentageString, '100'));
        const side = this.safeString (position, 'positionSide');
        const timestamp = this.safeInteger (position, 'updateTime');
        const leverage = this.safeInteger (position, 'leverage');
        const marginRatio = this.parseNumber (
            Precise.stringDiv (maintenanceMarginString, collateralString, 4)
        );
        const id = symbol + ':' + side + ':' + marginType;
        const status = contracts !== 0 ? 'open' : 'closed';
        return {
            'id': id,
            'info': this.deepExtend (position, { 'symbol': symbol }),
            'symbol': symbol,
            'notional': notional,
            'marginType': marginType,
            'liquidationPrice': liquidationPrice,
            'entryPrice': this.parseNumber (entryPriceString),
            'unrealizedPnl': this.parseNumber (unrealizedPnlString),
            'percentage': percentage,
            'contracts': contracts,
            'contractSize': this.parseNumber (market['contractSize']),
            'side': side,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'maintenanceMargin': maintenanceMargin,
            'maintenanceMarginPercentage': maintenanceMarginPercentage,
            'collateral': this.parseNumber (collateralString),
            'initialMargin': this.parseNumber (initialMarginString),
            'initialMarginPercentage': this.parseNumber (initialMarginPercentage),
            'leverage': leverage,
            'marginRatio': marginRatio,
            'isolated': marginType !== 'cross',
            'status': status,
            'tradeMode': 'oneway',
            // 'info': info,
            // 'id': id,
            // 'symbol': symbol,
            // 'timestamp': timestamp,
            // 'datetime': datetime,
            // 'isolated': isolated,
            // 'hedged': hedged,
            // 'side': side,
            // 'contracts': contracts,
            // 'price': price,
            // 'markPrice': markPrice,
            // 'notional': notional,
            // 'leverage': leverage,
            // 'initialMargin': initialMargin,
            // 'maintenanceMargin': maintenanceMargin,
            // 'initialMarginPercentage': initialMarginPercentage,
            // 'maintenanceMarginPercentage': maintenanceMarginPercentage,
            // 'unrealizedPnl': unrealizedPnl,
            // 'pnl': pnl,
            // 'liquidationPrice': liquidationPrice,
            // 'status': status,
            // 'entryPrice': entryPrice,
            // 'marginRatio': marginRatio,
            // 'collateral': collateral,
            // 'marginType': marginType,
            // 'percentage': percentage,
            // 'maxLeverage': maxLeverage,
            // 'tradeMode': tradeMode,
        };
    }

    async fetchAccountConfiguration (symbol, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const leverageInfo = await this.fetchLeverage (market['id']);
        const leverage = this.safeInteger (leverageInfo, 'leverage');
        const accountConfig = {
            'marginMode': 'cross',
            'positionMode': 'oneway',
            'markets': {},
            'leverage': leverage,
        };
        const leverageConfigs = accountConfig['markets'];
        leverageConfigs[market['symbol']] = {
            'leverage': leverage,
            'buyLeverage': leverage,
            'sellLeverage': leverage,
        };
        return accountConfig;
    }
}
