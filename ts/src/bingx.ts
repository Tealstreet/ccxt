
//  ---------------------------------------------------------------------------

import { Exchange } from './base/Exchange.js';
import Precise from './base/Precise.js';
import { ExchangeError } from './base/errors.js';
import { TICK_SIZE } from './base/functions/number.js';
import { OHLCV } from './base/types.js';

//  ---------------------------------------------------------------------------

export default class bingx extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'bingx',
            'name': 'BingX',
            'countries': [ 'EU' ],
            'rateLimit': 100,
            'version': 'v1',
            'verbose': true,
            'pro': true,
            'has': {
                'CORS': true,
                'spot': true,
                'margin': undefined,
                'swap': false,
                'future': false,
                'option': false,
                'cancelOrder': true,
                'createDepositAddress': false,
                'createOrder': true,
                'fetchBalance': true,
                'fetchDepositAddress': false,
                'fetchDepositAddresses': false,
                'fetchFundingHistory': false,
                'fetchFundingRate': false,
                'fetchFundingRateHistory': false,
                'fetchFundingRates': false,
                'fetchIndexOHLCV': false,
                'fetchMarkOHLCV': false,
                'fetchOHLCV': true,
                'fetchOpenInterestHistory': false,
                'fetchOpenOrders': true,
                'fetchOrderBook': true,
                'fetchPositions': true,
                'fetchPremiumIndexOHLCV': false,
                'fetchTicker': true,
                'fetchTrades': true,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'transfer': false,
            },
            'urls': {
                'logo': '',
                'api': {
                    'swap': 'https://api-swap-rest.bingbon.pro/api',
                    'swap2': 'https://open-api.bingx.com',
                },
                'test': {
                },
                'www': 'https://bingx.com/',
                'doc': [
                    'https://bingx-api.github.io/docs',
                ],
                'fees': [
                    'https://support.bingx.com/hc/en-001/articles/360027240173',
                ],
                'referral': '',
            },
            'api': {
                'swap': {
                    'v1': {
                        'public': {
                            'get': {
                                'market/getAllContracts': 1,
                                'market/getLatestPrice': 1,
                                'market/getMarketDepth': 1,
                                'market/getMarketTrades': 1,
                                'market/getLatestFunding': 1,
                                'market/getHistoryFunding': 1,
                                'market/getLatestKline': 1,
                                'market/getHistoryKlines': 1,
                                'market/getOpenPositions': 1,
                                'market/getTicker': 1,
                            },
                            'post': {
                                'common/server/time': 1,
                            },
                        },
                        'private': {
                            'post': {
                                'user/getBalance': 1,
                                'user/getPositions': 1,
                                'user/trade': 1,
                                'user/oneClickClosePosition': 1,
                                'user/oneClickCloseAllPositions': 1,
                                'user/cancelOrder': 1,
                                'user/batchCancelOrders': 1,
                                'user/cancelAll': 1,
                                'user/pendingOrders': 1,
                                'user/queryOrderStatus': 1,
                                'user/setMarginMode': 1,
                                'user/setLeverage': 1,
                                'user/forceOrders': 1,
                            },
                        },
                    },
                },
                'swap2': {
                    'openApi': {
                        'public': {
                            'get': {
                                'swap/v2/quote/klines': 1,
                            },
                        },
                    },
                },
            },
            'markets': {
                'BTC/EUR': { 'id': 'eur', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR', 'baseId': 'btc', 'quoteId': 'eur', 'type': 'spot', 'spot': true },
            },
            'fees': {
                'trading': {
                    'tierBased': true,
                    'percentage': true,
                    'maker': this.parseNumber ('0.0002'),
                    'taker': this.parseNumber ('0.0004'),
                },
            },
            'precisionMode': TICK_SIZE,
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
            },
            'timeframes': {
                '1m': '1',
                '3m': '3',
                '5m': '5',
                '15m': '15',
                '30m': '30',
                '1h': '60',
                '2h': '120',
                '4h': '240',
                '6h': '360',
                '12h': '720',
                '1d': '1D',
                '1w': '1W',
                '1M': '1M',
            },
        });
    }

    async fetchContractMarkets (params = {}) {
        const response = await (this as any).swapV1PublicGetMarketGetAllContracts (params);
        //
        //     {
        //         "code":0,
        //         "msg":"Success",
        //         "data":{
        //             "contracts":[
        //                 {
        //                     "contractId":"100",
        //                     "symbol":"BTC-USDT",
        //                     "name":"BTC",
        //                     "size":"0.0001",
        //                     "currency":"USDT",
        //                     "asset":"BTC",
        //                     "pricePrecision":2,
        //                     "volumePrecision":4,
        //                     "feeRate":0.0005,
        //                     "tradeMinLimit":1,
        //                     "maxLongLeverage":100,
        //                     "maxShortLeverage":100,
        //                     "status":1
        //                 }
        //             ]
        //         }
        //     }
        //
        const result = [];
        const data = this.safeValue (response, 'data', {});
        const contracts = this.safeValue (data, 'contracts', []);
        for (let i = 0; i < contracts.length; i++) {
            const market = contracts[i];
            // should we use contract id as market id?
            // const contractId = this.safeString (market, 'contractId');
            const marketId = this.safeString (market, 'symbol');
            const parts = marketId.split ('-');
            const baseId = this.safeString (parts, 0);
            const quoteId = this.safeString (parts, 1);
            const settleId = this.safeString (market, 'currency');
            const base = this.safeCurrencyCode (baseId);
            const quote = this.safeCurrencyCode (quoteId);
            const settle = this.safeCurrencyCode (settleId);
            const symbol = base + '/' + quote + ':' + settle;
            const status = this.safeNumber (market, 'status');
            result.push ({
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
                'active': status === 1,
                'contract': true,
                'linear': true,
                'inverse': undefined,
                'contractSize': this.safeNumber (market, 'size'),
                'expiry': undefined,
                'expiryDatetime': undefined,
                'strike': undefined,
                'optionType': undefined,
                'precision': {
                    'amount': this.safeNumber (market, 'volumePrecision'),
                    'price': this.safeNumber (market, 'pricePrecision'),
                },
                'limits': {
                    'leverage': {
                        'min': undefined,
                        'max': this.safeNumber (market, 'maxLongLeverage'),
                    },
                    'amount': {
                        'min': this.safeNumber (market, 'tradeMinLimit'),
                        'max': undefined,
                    },
                    'price': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'cost': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
                'info': market,
            });
        }
        return result;
    }

    async fetchMarkets (params = {}) {
        /**
         * @method
         * @name bingx#fetchMarkets
         * @description retrieves data on all markets for bingx
         * @param {object} params extra parameters specific to the exchange api endpoint
         * @returns {[object]} an array of objects representing market data
         */
        const contract = await this.fetchContractMarkets (params);
        return contract;
    }

    parseBalance (response) {
        const result = { 'info': response };
        const data = this.safeValue (response, 'data', {});
        const dataAccount = this.safeValue (data, 'account', {});
        const currencies = Object.keys (this.currencies);
        for (let i = 0; i < currencies.length; i++) {
            const code = currencies[i];
            const account = this.account ();
            if (this.safeString (dataAccount, 'currency', '') === code) {
                account['free'] = this.safeString (dataAccount, 'availableMArgin');
                account['used'] = this.safeString (dataAccount, 'usedMargin');
                account['total'] = this.safeString (dataAccount, 'balance');
            }
            result[code] = account;
        }
        return this.safeBalance (result);
    }

    async fetchBalance (params = {}) {
        /**
         * @method
         * @name paymium#fetchBalance
         * @description query for balance and get the amount of funds available for trading or funds locked in orders
         * @param {object} params extra parameters specific to the paymium api endpoint
         * @returns {object} a [balance structure]{@link https://docs.ccxt.com/en/latest/manual.html?#balance-structure}
         */
        // await this.loadMarkets ();
        const response = await (this as any).swapV1PrivatePostUserGetBalance (params);
        return this.parseBalance (response);
    }

    async fetchOrderBook (symbol, limit = undefined, params = {}) {
        /**
         * @method
         * @name paymium#fetchOrderBook
         * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
         * @param {string} symbol unified symbol of the market to fetch the order book for
         * @param {int|undefined} limit the maximum amount of order book entries to return
         * @param {object} params extra parameters specific to the paymium api endpoint
         * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'currency': market['id'],
        };
        const response = await (this as any).publicGetDataCurrencyDepth (this.extend (request, params));
        return this.parseOrderBook (response, market['symbol'], undefined, 'bids', 'asks', 'price', 'amount');
    }

    parseTicker (ticker, market = undefined) {
        //
        // {
        //   "symbol": "BTC-USDT",
        //   "priceChange": "10.00",
        //   "priceChangePercent": "10",
        //   "lastPrice": "5738.23",
        //   "lastVolume": "31.21",
        //   "highPrice": "5938.23",
        //   "lowPrice": "5238.23",
        //   "volume": "23211231.13",
        //   "dayVolume": "213124412412.47",
        //   "openPrice": "5828.32"
        // }
        //
        const symbol = this.safeSymbol (undefined, market);
        const timestamp = this.milliseconds ();
        const baseVolume = this.safeString (ticker, 'volume');
        const last = this.safeString (ticker, 'lastPrice');
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeString (ticker, 'highPrice'),
            'low': this.safeString (ticker, 'lowPrice'),
            'bid': this.safeString (ticker, 'lastPrice'),
            'bidVolume': undefined,
            'ask': this.safeString (ticker, 'lastPrice'),
            'askVolume': undefined,
            'open': this.safeString (ticker, 'openPrice'),
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': this.safeString (ticker, 'priceChangePercent'),
            'average': undefined,
            'baseVolume': baseVolume,
            'info': ticker,
        }, market);
    }

    async fetchTicker (symbol, params = {}) {
        /**
         * @method
         * @name paymium#fetchTicker
         * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} params extra parameters specific to the paymium api endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const ticker = await (this as any).swapV1PublicGetMarketGetTicker (this.extend (request, params));
        //
        // {
        //   "symbol": "BTC-USDT",
        //   "priceChange": "10.00",
        //   "priceChangePercent": "10",
        //   "lastPrice": "5738.23",
        //   "lastVolume": "31.21",
        //   "highPrice": "5938.23",
        //   "lowPrice": "5238.23",
        //   "volume": "23211231.13",
        //   "dayVolume": "213124412412.47",
        //   "openPrice": "5828.32"
        // }
        //
        return this.parseTicker (ticker, market);
    }

    parseTrade (trade, market = undefined) {
        const timestamp = this.safeTimestamp (trade, 'created_at_int');
        const id = this.safeString (trade, 'uuid');
        market = this.safeMarket (undefined, market);
        const side = this.safeString (trade, 'side');
        const price = this.safeString (trade, 'price');
        const amountField = 'traded_' + market['base'].toLowerCase ();
        const amount = this.safeString (trade, amountField);
        return this.safeTrade ({
            'info': trade,
            'id': id,
            'order': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': side,
            'takerOrMaker': undefined,
            'price': price,
            'amount': amount,
            'cost': undefined,
            'fee': undefined,
        }, market);
    }

    async fetchTrades (symbol, since: any = undefined, limit: any = undefined, params = {}) {
        return [];
        // /**
        //  * @method
        //  * @name paymium#fetchTrades
        //  * @description get the list of most recent trades for a particular symbol
        //  * @param {string} symbol unified symbol of the market to fetch trades for
        //  * @param {int|undefined} since timestamp in ms of the earliest trade to fetch
        //  * @param {int|undefined} limit the maximum amount of trades to fetch
        //  * @param {object} params extra parameters specific to the paymium api endpoint
        //  * @returns {[object]} a list of [trade structures]{@link https://docs.ccxt.com/en/latest/manual.html?#public-trades}
        //  */
        // await this.loadMarkets ();
        // const market = this.market (symbol);
        // const request = {
        //     'currency': market['id'],
        // };
        // const response = await (this as any).publicGetDataCurrencyTrades (this.extend (request, params));
        // return this.parseTrades (response, market, since, limit);
    }

    async createOrder (symbol, type, side, amount, price = undefined, params = {}) {
        /**
         * @method
         * @name paymium#createOrder
         * @description create a trade order
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market' or 'limit'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much of currency you want to trade in units of base currency
         * @param {float|undefined} price the price at which the order is to be fullfilled, in units of the quote currency, ignored in market orders
         * @param {object} params extra parameters specific to the paymium api endpoint
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'type': this.capitalize (type) + 'Order',
            'currency': market['id'],
            'direction': side,
            'amount': amount,
        };
        if (type !== 'market') {
            request['price'] = price;
        }
        const response = await (this as any).privatePostUserOrders (this.extend (request, params));
        return this.safeOrder ({
            'info': response,
            'id': response['uuid'],
        }, market);
    }

    async cancelOrder (id, symbol: string = undefined, params = {}) {
        /**
         * @method
         * @name paymium#cancelOrder
         * @description cancels an open order
         * @param {string} id order id
         * @param {string|undefined} symbol not used by paymium cancelOrder ()
         * @param {object} params extra parameters specific to the paymium api endpoint
         * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        const request = {
            'uuid': id,
        };
        return await (this as any).privateDeleteUserOrdersUuidCancel (this.extend (request, params));
    }

    async fetchPositions (symbols: string[] = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchPositions
         * @description fetch all open positions
         * @param {[string]|undefined} symbols list of unified market symbols
         * @param {object} params extra parameters specific to the bybit api endpoint
         * @returns {[object]} a list of [position structure]{@link https://docs.ccxt.com/#/?id=position-structure}
         */
        const response = await (this as any).swapV1PrivatePostUserGetPositions ();
        const data = this.safeValue (response, 'data', {});
        const positions = this.safeValue (data, 'positions', []);
        const result = [];
        for (let i = 0; i < positions.length; i++) {
            result.push (this.parsePosition (positions[i]));
        }
        return result;
    }

    parsePosition (position, market = undefined) {
        const contract = this.safeString (position, 'symbol');
        market = this.safeMarket (contract);
        const size = Precise.stringAbs (this.safeString (position, 'volume'));
        let side = this.safeString (position, 'positionSide');
        if (side !== undefined) {
            if (side === 'Long') {
                side = 'long';
            } else if (side === 'Short') {
                side = 'short';
            } else {
                side = undefined;
            }
        }
        const notional = this.safeString (position, 'volume');
        const realizedPnl = this.omitZero (this.safeString (position, 'realisedPNL'));
        const unrealisedPnl = this.omitZero (this.safeString (position, 'unrealisedPNL'));
        let initialMarginString = this.safeString (position, 'margin');
        let maintenanceMarginString = this.safeString (position, 'margin');
        let timestamp = this.parse8601 (this.safeString (position, 'updated_at'));
        if (timestamp === undefined) {
            timestamp = this.safeInteger (position, 'updatedAt');
        }
        // default to cross of USDC margined positions
        const marginMode = this.safeString (position, 'marginMode', 'Isolated') === 'Isolated' ? 'isolated' : 'cross';
        const mode = 'hedged';
        let collateralString = this.safeString (position, 'positionBalance');
        const entryPrice = this.omitZero (this.safeString2 (position, 'avgPrice', ''));
        const liquidationPrice = this.omitZero (this.safeString (position, 'liqPrice'));
        const leverage = this.safeString (position, 'leverage');
        if (liquidationPrice !== undefined) {
            if (market['settle'] === 'USDC') {
                //  (Entry price - Liq price) * Contracts + Maintenance Margin + (unrealised pnl) = Collateral
                const difference = Precise.stringAbs (Precise.stringSub (entryPrice, liquidationPrice));
                collateralString = Precise.stringAdd (Precise.stringAdd (Precise.stringMul (difference, size), maintenanceMarginString), unrealisedPnl);
            } else {
                const bustPrice = this.safeString (position, 'bustPrice');
                if (market['linear']) {
                    // derived from the following formulas
                    //  (Entry price - Bust price) * Contracts = Collateral
                    //  (Entry price - Liq price) * Contracts = Collateral - Maintenance Margin
                    // Maintenance Margin = (Bust price - Liq price) x Contracts
                    const maintenanceMarginPriceDifference = Precise.stringAbs (Precise.stringSub (liquidationPrice, bustPrice));
                    maintenanceMarginString = Precise.stringMul (maintenanceMarginPriceDifference, size);
                    // Initial Margin = Contracts x Entry Price / Leverage
                    if (entryPrice !== undefined) {
                        initialMarginString = Precise.stringDiv (Precise.stringMul (size, entryPrice), leverage);
                    }
                } else {
                    // Contracts * (1 / Entry price - 1 / Bust price) = Collateral
                    // Contracts * (1 / Entry price - 1 / Liq price) = Collateral - Maintenance Margin
                    // Maintenance Margin = Contracts * (1 / Liq price - 1 / Bust price)
                    // Maintenance Margin = Contracts * (Bust price - Liq price) / (Liq price x Bust price)
                    const difference = Precise.stringAbs (Precise.stringSub (bustPrice, liquidationPrice));
                    const multiply = Precise.stringMul (bustPrice, liquidationPrice);
                    maintenanceMarginString = Precise.stringDiv (Precise.stringMul (size, difference), multiply);
                    // Initial Margin = Leverage x Contracts / EntryPrice
                    if (entryPrice !== undefined) {
                        initialMarginString = Precise.stringDiv (size, Precise.stringMul (entryPrice, leverage));
                    }
                }
            }
        }
        const maintenanceMarginPercentage = Precise.stringDiv (maintenanceMarginString, notional);
        const percentage = Precise.stringMul (Precise.stringDiv (unrealisedPnl, initialMarginString), '100');
        const marginRatio = Precise.stringDiv (maintenanceMarginString, collateralString, 4);
        let status = true;
        if (size === '0') {
            status = false;
        }
        let contracts = this.parseNumber (size) / this.safeNumber (market, 'contractSize');
        if (side === 'short') {
            contracts = contracts * -1;
        }
        return {
            'info': position,
            'id': market['symbol'] + ':' + side,
            'mode': mode,
            'symbol': market['symbol'],
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'initialMargin': this.parseNumber (initialMarginString),
            'initialMarginPercentage': this.parseNumber (Precise.stringDiv (initialMarginString, notional)),
            'maintenanceMargin': this.parseNumber (maintenanceMarginString),
            'maintenanceMarginPercentage': this.parseNumber (maintenanceMarginPercentage),
            'entryPrice': this.parseNumber (entryPrice),
            'notional': this.parseNumber (notional),
            'leverage': this.parseNumber (leverage),
            'unrealizedPnl': this.parseNumber (unrealisedPnl),
            'pnl': this.parseNumber (realizedPnl) + this.parseNumber (unrealisedPnl),
            'contracts': contracts,
            'contractSize': this.safeNumber (market, 'contractSize'),
            'marginRatio': this.parseNumber (marginRatio),
            'liquidationPrice': this.parseNumber (liquidationPrice),
            'markPrice': this.safeNumber (position, 'markPrice'),
            'collateral': this.parseNumber (collateralString),
            'marginMode': marginMode,
            'isolated': marginMode === 'isolated',
            'hedged': mode === 'hedged',
            'price': this.parseNumber (entryPrice),
            'status': status,
            'tradeMode': mode,
            'active': status,
            'side': side,
            'percentage': this.parseNumber (percentage),
        };
    }

    async fetchOHLCV (symbol, timeframe = '1m', since: any = undefined, limit: any = undefined, params = {}) {
        /**
         * @method
         * @name bybit#fetchOHLCV
         * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
         * @see https://bybit-exchange.github.io/docs/v5/market/kline
         * @see https://bybit-exchange.github.io/docs/v5/market/mark-kline
         * @see https://bybit-exchange.github.io/docs/v5/market/index-kline
         * @see https://bybit-exchange.github.io/docs/v5/market/preimum-index-kline
         * @param {string} symbol unified symbol of the market to fetch OHLCV data for
         * @param {string} timeframe the length of time each candle represents
         * @param {int|undefined} since timestamp in ms of the earliest candle to fetch
         * @param {int|undefined} limit the maximum amount of candles to fetch
         * @param {object} params extra parameters specific to the bybit api endpoint
         * @returns {[[int]]} A list of candles ordered as timestamp, open, high, low, close, volume
         */
        this.checkRequiredSymbol ('fetchOHLCV', symbol);
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        if (limit === undefined) {
            limit = 200; // default is 200 when requested with `since`
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        const klineType = this.safeString (this.timeframes, timeframe, timeframe);
        request['interval'] = timeframe;
        if (limit !== undefined) {
            // request['limit'] = limit; // max 1000, default 1000
            if (klineType === '1') {
                request['endTime'] = since + limit * 60 * 1000;
            } else if (klineType === '3') {
                request['endTime'] = since + limit * 3 * 60 * 1000;
            } else if (klineType === '5') {
                request['endTime'] = since + limit * 5 * 60 * 1000;
            } else if (klineType === '15') {
                request['endTime'] = since + limit * 15 * 60 * 1000;
            } else if (klineType === '30') {
                request['endTime'] = since + limit * 30 * 60 * 1000;
            } else if (klineType === '60') {
                request['endTime'] = since + limit * 60 * 60 * 1000;
            } else if (klineType === '120') {
                request['endTime'] = since + limit * 120 * 60 * 1000;
            } else if (klineType === '240') {
                request['endTime'] = since + limit * 240 * 60 * 1000;
            } else if (klineType === '360') {
                request['endTime'] = since + limit * 360 * 60 * 1000;
            } else if (klineType === '720') {
                request['endTime'] = since + limit * 720 * 60 * 1000;
            } else if (klineType === '1D') {
                request['endTime'] = since + limit * 24 * 60 * 60 * 1000;
            } else if (klineType === '1W') {
                request['endTime'] = since + limit * 7 * 24 * 60 * 60 * 1000;
            } else if (klineType === '1M') {
                request['endTime'] = since + limit * 30 * 24 * 60 * 60 * 1000;
            } else {
                request['endTime'] = since + limit * 60 * 1000;
            }
        }
        const response = await (this as any).swap2OpenApiPublicGetSwapV2QuoteKlines (this.extend (request, params));
        const ohlcvs = this.safeValue (response, 'data', []);
        return this.parseOHLCVs (ohlcvs, market, timeframe, since, limit);
    }

    parseOHLCVs (ohlcvs: object[], market: string = undefined, timeframe: string = '1m', since: number = undefined, limit: any = undefined): OHLCV[] {
        const results = [];
        for (let i = 0; i < ohlcvs.length; i++) {
            results.push (this.parseOHLCV (ohlcvs[i], market));
        }
        const sorted = this.sortBy (results, 0);
        const tail = (since === undefined);
        return this.filterBySinceLimit (sorted, since, limit, 0, tail) as any;
    }

    parseOHLCV (ohlcv, market = undefined) {
        return [
            this.safeInteger (ohlcv, 'time'), // timestamp
            this.safeNumber (ohlcv, 'open'), // open
            this.safeNumber (ohlcv, 'high'), // high
            this.safeNumber (ohlcv, 'low'), // low
            this.safeNumber (ohlcv, 'close'), // close
            this.safeNumber (ohlcv, 'volume'), // volume
        ];
    }

    async fetchOpenOrders (symbol: string = undefined, since: any = undefined, limit: any = undefined, params = {}) {
        /**
         * @method
         * @name bybit#fetchOpenOrders
         * @description fetch all unfilled currently open orders
         * @param {string|undefined} symbol unified market symbol
         * @param {int|undefined} since the earliest time in ms to fetch open orders for
         * @param {int|undefined} limit the maximum number of  open orders structures to retrieve
         * @param {object} params extra parameters specific to the bybit api endpoint
         * @returns {[object]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets ();
        return [];
    }

    sign (path, section = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const type = section[0];
        const version = section[1];
        const access = section[2];
        const rawPath = path;
        let url = this.implodeHostname (this.urls['api'][type]);
        url += '/' + version + '/' + path;
        path = this.implodeParams (path, params);
        params = this.omit (params, this.extractParams (path));
        params = this.keysort (params);
        if (access === 'private') {
            this.checkRequiredCredentials ();
            const isOpenApi = url.indexOf ('openApi') >= 0;
            if (isOpenApi) {
                params = this.extend (params, {
                    'timestamp': this.milliseconds () - 0,
                });
                params = this.keysort (params);
                const paramString = this.rawencode (params);
                const signature = this.hmac (this.encode (paramString), this.encode (this.secret), 'sha256', 'base64');
                params = this.extend (params, {
                    'signature': signature,
                });
                headers = {
                    'X-BX-APIKEY': this.apiKey,
                };
            } else {
                params = this.extend (params, {
                    'apiKey': this.apiKey,
                    'timestamp': this.milliseconds () - 0,
                });
                params = this.keysort (params);
                // ACTUAL SIGNATURE GENERATION
                const paramString = this.rawencode (params);
                const originString = method + '/api/' + version + '/' + rawPath + paramString;
                const signature = this.hmac (this.encode (originString), this.encode (this.secret), 'sha256', 'base64');
                // ACTUAL SIGNATURE GENERATION
                params = this.extend (params, {
                    'sign': signature,
                });
            }
        }
        if (Object.keys (params).length) {
            url += '?' + this.urlencode (params);
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (httpCode, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (!response) {
            return; // fallback to default error handler
        }
        const errorCode = this.safeInteger (response, 'code');
        if (errorCode > 0) {
            throw new ExchangeError (this.id + ' ' + this.json (response));
        }
    }
}
