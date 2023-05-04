'use strict';

var Exchange = require('./base/Exchange.js');
var errors = require('./base/errors.js');
var number = require('./base/functions/number.js');

//  ---------------------------------------------------------------------------
//  ---------------------------------------------------------------------------
class bingx extends Exchange["default"] {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'bingx',
            'name': 'BingX',
            'countries': ['EU'],
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
                'test': {},
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
                                'user/pendingStopOrders': 1,
                                'user/queryOrderStatus': 1,
                                'user/setMarginMode': 1,
                                'user/setLeverage': 1,
                                'user/forceOrders': 1,
                                'user/auth/userDataStream': 1,
                            },
                            'put': {
                                'user/auth/userDataStream': 1,
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
                        'private': {
                            'get': {
                                'swap/v2/trade/openOrders': 1,
                            },
                            'put': {
                                'user/auth/userDataStream': 1,
                            },
                            'post': {
                                'user/auth/userDataStream': 1,
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
                    'maker': this.parseNumber('0.0002'),
                    'taker': this.parseNumber('0.0004'),
                },
            },
            'precisionMode': number.TICK_SIZE,
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
            'options': {
                'listenKeyRefreshRate': 1200000, // 20 mins
            },
        });
    }
    async fetchContractMarkets(params = {}) {
        const response = await this.swapV1PublicGetMarketGetAllContracts(params);
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
        const data = this.safeValue(response, 'data', {});
        const contracts = this.safeValue(data, 'contracts', []);
        for (let i = 0; i < contracts.length; i++) {
            const market = contracts[i];
            // should we use contract id as market id?
            // const contractId = this.safeString (market, 'contractId');
            const marketId = this.safeString(market, 'symbol');
            const parts = marketId.split('-');
            const baseId = this.safeString(parts, 0);
            const quoteId = this.safeString(parts, 1);
            const settleId = this.safeString(market, 'currency');
            const base = this.safeCurrencyCode(baseId);
            const quote = this.safeCurrencyCode(quoteId);
            const settle = this.safeCurrencyCode(settleId);
            const symbol = base + '/' + quote + ':' + settle;
            const status = this.safeNumber(market, 'status');
            result.push({
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
                'contractSize': this.safeNumber(market, 'size'),
                'expiry': undefined,
                'expiryDatetime': undefined,
                'strike': undefined,
                'optionType': undefined,
                'precision': {
                    'amount': this.safeNumber(market, 'volumePrecision'),
                    'price': this.safeNumber(market, 'pricePrecision'),
                },
                'limits': {
                    'leverage': {
                        'min': undefined,
                        'max': this.safeNumber(market, 'maxLongLeverage'),
                    },
                    'amount': {
                        'min': this.safeNumber(market, 'tradeMinLimit'),
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
    async fetchMarkets(params = {}) {
        /**
         * @method
         * @name bingx#fetchMarkets
         * @description retrieves data on all markets for bingx
         * @param {object} params extra parameters specific to the exchange api endpoint
         * @returns {[object]} an array of objects representing market data
         */
        const contract = await this.fetchContractMarkets(params);
        return contract;
    }
    parseBalance(response) {
        const result = { 'info': response };
        const data = this.safeValue(response, 'data', {});
        const dataAccount = this.safeValue(data, 'account', {});
        const currencies = Object.keys(this.currencies);
        for (let i = 0; i < currencies.length; i++) {
            const code = currencies[i];
            const account = this.account();
            if (this.safeString(dataAccount, 'currency', '') === code) {
                account['free'] = this.safeString(dataAccount, 'availableMArgin');
                account['used'] = this.safeString(dataAccount, 'usedMargin');
                account['total'] = this.safeString(dataAccount, 'balance');
            }
            result[code] = account;
        }
        return this.safeBalance(result);
    }
    async fetchBalance(params = {}) {
        /**
         * @method
         * @name bingx#fetchBalance
         * @description query for balance and get the amount of funds available for trading or funds locked in orders
         * @param {object} params extra parameters specific to the bingx api endpoint
         * @returns {object} a [balance structure]{@link https://docs.ccxt.com/en/latest/manual.html?#balance-structure}
         */
        // await this.loadMarkets ();
        const response = await this.swapV1PrivatePostUserGetBalance(params);
        return this.parseBalance(response);
    }
    async fetchOrderBook(symbol, limit = undefined, params = {}) {
        /**
         * @method
         * @name paymium#fetchOrderBook
         * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
         * @param {string} symbol unified symbol of the market to fetch the order book for
         * @param {int|undefined} limit the maximum amount of order book entries to return
         * @param {object} params extra parameters specific to the paymium api endpoint
         * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'currency': market['id'],
        };
        const response = await this.publicGetDataCurrencyDepth(this.extend(request, params));
        return this.parseOrderBook(response, market['symbol'], undefined, 'bids', 'asks', 'price', 'amount');
    }
    parseTicker(ticker, market = undefined) {
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
        const symbol = this.safeSymbol(undefined, market);
        const timestamp = this.milliseconds();
        const baseVolume = this.safeString(ticker, 'volume');
        const last = this.safeString(ticker, 'lastPrice');
        return this.safeTicker({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': this.safeString(ticker, 'highPrice'),
            'low': this.safeString(ticker, 'lowPrice'),
            'bid': this.safeString(ticker, 'lastPrice'),
            'bidVolume': undefined,
            'ask': this.safeString(ticker, 'lastPrice'),
            'askVolume': undefined,
            'open': this.safeString(ticker, 'openPrice'),
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': this.safeString(ticker, 'priceChangePercent'),
            'average': undefined,
            'baseVolume': baseVolume,
            'info': ticker,
        }, market);
    }
    async fetchTicker(symbol, params = {}) {
        /**
         * @method
         * @name paymium#fetchTicker
         * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} params extra parameters specific to the paymium api endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        const ticker = await this.swapV1PublicGetMarketGetTicker(this.extend(request, params));
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
        return this.parseTicker(ticker, market);
    }
    parseTrade(trade, market = undefined) {
        const timestamp = this.safeTimestamp(trade, 'created_at_int');
        const id = this.safeString(trade, 'uuid');
        market = this.safeMarket(undefined, market);
        const side = this.safeString(trade, 'side');
        const price = this.safeString(trade, 'price');
        const amountField = 'traded_' + market['base'].toLowerCase();
        const amount = this.safeString(trade, amountField);
        return this.safeTrade({
            'info': trade,
            'id': id,
            'order': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
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
    async fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
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
    async createOrder(symbol, type, side, amount, price = undefined, params = {}) {
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
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'type': this.capitalize(type) + 'Order',
            'currency': market['id'],
            'direction': side,
            'amount': amount,
        };
        if (type !== 'market') {
            request['price'] = price;
        }
        const response = await this.privatePostUserOrders(this.extend(request, params));
        return this.safeOrder({
            'info': response,
            'id': response['uuid'],
        }, market);
    }
    async cancelOrder(id, symbol = undefined, params = {}) {
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
        return await this.privateDeleteUserOrdersUuidCancel(this.extend(request, params));
    }
    async fetchPositions(symbols = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchPositions
         * @description fetch all open positions
         * @param {[string]|undefined} symbols list of unified market symbols
         * @param {object} params extra parameters specific to the bybit api endpoint
         * @returns {[object]} a list of [position structure]{@link https://docs.ccxt.com/#/?id=position-structure}
         */
        const response = await this.swapV1PrivatePostUserGetPositions();
        const data = this.safeValue(response, 'data', {});
        const positions = this.safeValue(data, 'positions', []);
        const result = [];
        for (let i = 0; i < positions.length; i++) {
            result.push(this.parsePosition(positions[i]));
        }
        return result;
    }
    parsePosition(position, market = undefined) {
        //
        //
        // {
        //     "positionId": "1650546544279240704",
        //     "symbol": "BTC-USDT",
        //     "currency": "",
        //     "volume": 0.001,
        //     "availableVolume": 0.001,
        //     "positionSide": "short",
        //     "marginMode": "cross",
        //     "avgPrice": 27124.5,
        //     "liquidatedPrice": 0.0,
        //     "margin": 2.9386,
        //     "leverage": 5.0,
        //     "pnlRate": -45.83,
        //     "unrealisedPNL": -2.4863,
        //     "realisedPNL": 0.0126
        // }
        //
        const marketId = this.safeString(position, 'symbol');
        market = this.safeMarket(marketId, market);
        const timestamp = this.safeInteger(position, 'cTime');
        const marginMode = this.safeStringLower(position, 'marginMode');
        const hedged = true;
        const side = this.safeStringLower(position, 'positionSide');
        let contracts = this.safeFloat(position, 'volume') / this.safeNumber(market, 'contractSize');
        let liquidation = this.safeNumber(position, 'liquidatedPrice');
        if (side === 'short') {
            contracts = -1 * contracts;
        }
        if (liquidation === 0) {
            liquidation = undefined;
        }
        const initialMargin = this.safeNumber(position, 'margin');
        return {
            'info': position,
            'id': market['symbol'] + ':' + side,
            'symbol': market['symbol'],
            'notional': undefined,
            'marginMode': marginMode,
            'liquidationPrice': liquidation,
            'entryPrice': this.safeNumber(position, 'avgPrice'),
            'unrealizedPnl': this.safeNumber(position, 'unrealizedPL'),
            'percentage': undefined,
            'contracts': contracts,
            'contractSize': this.safeNumber(market, 'contractSize'),
            'side': side,
            'hedged': hedged,
            'timestamp': timestamp,
            'markPrice': this.safeNumber(position, 'markPrice'),
            'datetime': this.iso8601(timestamp),
            'maintenanceMargin': undefined,
            'maintenanceMarginPercentage': undefined,
            'collateral': this.safeNumber(position, 'margin'),
            'initialMargin': initialMargin,
            'initialMarginPercentage': undefined,
            'leverage': this.safeNumber(position, 'leverage'),
            'marginRatio': undefined,
        };
    }
    async fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
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
        this.checkRequiredSymbol('fetchOHLCV', symbol);
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        if (limit === undefined) {
            limit = 200; // default is 200 when requested with `since`
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        const klineType = this.safeString(this.timeframes, timeframe, timeframe);
        request['interval'] = timeframe;
        if (limit !== undefined) {
            // request['limit'] = limit; // max 1000, default 1000
            if (klineType === '1') {
                request['endTime'] = since + limit * 60 * 1000;
            }
            else if (klineType === '3') {
                request['endTime'] = since + limit * 3 * 60 * 1000;
            }
            else if (klineType === '5') {
                request['endTime'] = since + limit * 5 * 60 * 1000;
            }
            else if (klineType === '15') {
                request['endTime'] = since + limit * 15 * 60 * 1000;
            }
            else if (klineType === '30') {
                request['endTime'] = since + limit * 30 * 60 * 1000;
            }
            else if (klineType === '60') {
                request['endTime'] = since + limit * 60 * 60 * 1000;
            }
            else if (klineType === '120') {
                request['endTime'] = since + limit * 120 * 60 * 1000;
            }
            else if (klineType === '240') {
                request['endTime'] = since + limit * 240 * 60 * 1000;
            }
            else if (klineType === '360') {
                request['endTime'] = since + limit * 360 * 60 * 1000;
            }
            else if (klineType === '720') {
                request['endTime'] = since + limit * 720 * 60 * 1000;
            }
            else if (klineType === '1D') {
                request['endTime'] = since + limit * 24 * 60 * 60 * 1000;
            }
            else if (klineType === '1W') {
                request['endTime'] = since + limit * 7 * 24 * 60 * 60 * 1000;
            }
            else if (klineType === '1M') {
                request['endTime'] = since + limit * 30 * 24 * 60 * 60 * 1000;
            }
            else {
                request['endTime'] = since + limit * 60 * 1000;
            }
        }
        const response = await this.swap2OpenApiPublicGetSwapV2QuoteKlines(this.extend(request, params));
        const ohlcvs = this.safeValue(response, 'data', []);
        return this.parseOHLCVs(ohlcvs, market, timeframe, since, limit);
    }
    parseOHLCVs(ohlcvs, market = undefined, timeframe = '1m', since = undefined, limit = undefined) {
        const results = [];
        for (let i = 0; i < ohlcvs.length; i++) {
            results.push(this.parseOHLCV(ohlcvs[i], market));
        }
        const sorted = this.sortBy(results, 0);
        const tail = (since === undefined);
        return this.filterBySinceLimit(sorted, since, limit, 0, tail);
    }
    parseOHLCV(ohlcv, market = undefined) {
        return [
            this.safeInteger(ohlcv, 'time'),
            this.safeNumber(ohlcv, 'open'),
            this.safeNumber(ohlcv, 'high'),
            this.safeNumber(ohlcv, 'low'),
            this.safeNumber(ohlcv, 'close'),
            this.safeNumber(ohlcv, 'volume'), // volume
        ];
    }
    parseOrderStatus(status) {
        const statuses = {
            'pending': 'open',
            'new': 'open',
        };
        return this.safeString(statuses, status, status);
    }
    parseStopTrigger(status) {
        const statuses = {
            'market_price': 'mark',
            'fill_price': 'last',
            'index_price': 'index',
        };
        return this.safeString(statuses, status, status);
    }
    parseOrderType(type) {
        const types = {
            'limit': 'limit',
            'market': 'market',
            'stop_market': 'stop',
            'take_profit_market': 'stop',
            'trigger_limit': 'stopLimit',
            'trigger_market': 'stopLimit',
        };
        return this.safeStringLower(types, type, type);
    }
    parseOrder(order, market = undefined) {
        // {
        //     "code": 0,
        //     "msg": "",
        //     "data": {
        //       "orders": [
        //         {
        //           "symbol": "BTC-USDT",
        //           "orderId": 1651880171474731000,
        //           "side": "SELL",
        //           "positionSide": "LONG",
        //           "type": "TAKE_PROFIT_MARKET",
        //           "origQty": "0.0020",
        //           "price": "0.0",
        //           "executedQty": "0.0000",
        //           "avgPrice": "0.0",
        //           "cumQuote": "0",
        //           "stopPrice": "35000.0",
        //           "profit": "0.0",
        //           "commission": "0.0",
        //           "status": "NEW",
        //           "time": 1682673897986,
        //           "updateTime": 1682673897986
        //         },
        //         {
        //           "symbol": "BTC-USDT",
        //           "orderId": 1651880171445371000,
        //           "side": "SELL",
        //           "positionSide": "LONG",
        //           "type": "STOP_MARKET",
        //           "origQty": "0.0020",
        //           "price": "0.0",
        //           "executedQty": "0.0000",
        //           "avgPrice": "28259.0",
        //           "cumQuote": "0",
        //           "stopPrice": "27000.0",
        //           "profit": "0.0",
        //           "commission": "0.0",
        //           "status": "NEW",
        //           "time": 1682673897979,
        //           "updateTime": 1682673897979
        //         },
        //         {
        //           "symbol": "BTC-USDT",
        //           "orderId": 1651287406772699100,
        //           "side": "BUY",
        //           "positionSide": "LONG",
        //           "type": "LIMIT",
        //           "origQty": "0.0001",
        //           "price": "25000.0",
        //           "executedQty": "0.0000",
        //           "avgPrice": "0.0",
        //           "cumQuote": "0",
        //           "stopPrice": "",
        //           "profit": "0.0",
        //           "commission": "0.0",
        //           "status": "PENDING",
        //           "time": 1682532572000,
        //           "updateTime": 1682532571000
        //         },
        //         {
        //           "symbol": "BTC-USDT",
        //           "orderId": 1651006482122227700,
        //           "side": "BUY",
        //           "positionSide": "LONG",
        //           "type": "LIMIT",
        //           "origQty": "0.0001",
        //           "price": "25000.0",
        //           "executedQty": "0.0000",
        //           "avgPrice": "0.0",
        //           "cumQuote": "0",
        //           "stopPrice": "",
        //           "profit": "0.0",
        //           "commission": "0.0",
        //           "status": "PENDING",
        //           "time": 1682465594000,
        //           "updateTime": 1682465594000
        //         }
        //       ]
        //     }
        //   }
        const marketId = this.safeString(order, 'symbol');
        market = this.safeMarket(marketId);
        const symbol = market['symbol'];
        const id = this.safeString(order, 'orderId');
        const price = this.safeString(order, 'price');
        const amount = this.safeString(order, 'origQty');
        const filled = this.safeString(order, 'executedQty');
        const cost = this.safeString(order, 'executedQty');
        const average = this.safeString(order, 'avgPrice');
        const type = this.parseOrderType(this.safeStringLower(order, 'type'));
        const timestamp = this.safeInteger(order, 'time');
        const rawStopTrigger = this.safeString(order, 'stopPrice');
        const trigger = this.parseStopTrigger(rawStopTrigger);
        const side = this.safeStringLower(order, 'side');
        let reduce = this.safeValue(order, 'reduceOnly', false);
        let close = reduce;
        const planType = this.safeStringLower(order, 'type');
        if (planType === 'stop_market' || planType === 'take_profit_market') {
            reduce = true;
            close = true;
        }
        if (side && side.split('_')[0] === 'close') {
            reduce = true;
            close = true;
        }
        // order type LIMIT, MARKET, STOP_MARKET, TAKE_PROFIT_MARKET, TRIGGER_LIMIT, TRIGGER_MARKET
        // if (rawStopTrigger) {
        //     if (type === 'market') {
        //         type = 'stop';
        //     } else {
        //         type = 'stopLimit';
        //     }
        // } else {
        //     if (type === 'market') {
        //         type = 'market';
        //     } else {
        //         type = 'limit';
        //     }
        // }
        const clientOrderId = this.safeString(order, 'orderId');
        const fee = this.safeString(order, 'comission');
        const rawStatus = this.safeStringLower(order, 'status');
        const status = this.parseOrderStatus(rawStatus);
        const lastTradeTimestamp = this.safeInteger(order, 'updateTime');
        const timeInForce = this.safeString(order, 'timeInForce');
        const postOnly = timeInForce === 'PostOnly';
        const stopPrice = this.safeNumber(order, 'stopPrice');
        return this.safeOrder({
            'info': order,
            'id': id,
            'clientOrderId': clientOrderId,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'lastTradeTimestamp': lastTradeTimestamp,
            'symbol': symbol,
            'type': type,
            'timeInForce': 'GTC',
            'postOnly': postOnly,
            'side': side,
            'price': price,
            'stopPrice': stopPrice,
            'average': average,
            'cost': cost,
            'amount': amount,
            'filled': filled,
            'remaining': undefined,
            'status': status,
            'fee': fee,
            'trades': undefined,
            'reduce': reduce,
            'close': close,
            'trigger': trigger, // TEALSTREET
        }, market);
    }
    async fetchOpenOrdersV2(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#fetchOpenOrders
         * @description fetch all unfilled currently open orders
         * @param {string|undefined} symbol unified market symbol
         * @param {int|undefined} since the earliest time in ms to fetch open orders for
         * @param {int|undefined} limit the maximum number of  open orders structures to retrieve
         * @param {object} params extra parameters specific to the bybit api endpoint
         * @returns {[object]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        const response = await this.swap2OpenApiPrivateGetSwapV2TradeOpenOrders();
        const data = this.safeValue(response, 'data', {});
        const orders = this.safeValue(data, 'orders', []);
        const result = [];
        for (let i = 0; i < orders.length; i++) {
            result.push(this.parseOrder(orders[i]));
        }
        return result;
    }
    async fetchOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        return await this.fetchOpenOrdersV2(symbol, since, limit, params);
    }
    sign(path, section = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const type = section[0];
        const version = section[1];
        const access = section[2];
        const rawPath = path;
        let url = this.implodeHostname(this.urls['api'][type]);
        url += '/' + version + '/' + path;
        path = this.implodeParams(path, params);
        params = this.omit(params, this.extractParams(path));
        params = this.keysort(params);
        if (access === 'private') {
            this.checkRequiredCredentials();
            const isOpenApi = url.indexOf('openOrders') >= 0;
            const isUserDataStreamEp = url.indexOf('userDataStream') >= 0;
            if (isOpenApi || isUserDataStreamEp) {
                params = this.extend(params, {
                    'timestamp': this.milliseconds() - 0,
                });
                params = this.keysort(params);
                const paramString = this.rawencode(params);
                const signature = this.hmac(this.encode(paramString), this.encode(this.secret), 'sha256');
                params = this.extend(params, {
                    'signature': signature,
                });
                headers = {
                    'X-BX-APIKEY': this.apiKey,
                };
                if (method !== 'GET') {
                    body = this.urlencode(params);
                }
            }
            else {
                params = this.extend(params, {
                    'apiKey': this.apiKey,
                    'timestamp': this.milliseconds() - 0,
                });
                params = this.keysort(params);
                // ACTUAL SIGNATURE GENERATION
                const paramString = this.rawencode(params);
                const originString = method + '/api/' + version + '/' + rawPath + paramString;
                const signature = this.hmac(this.encode(originString), this.encode(this.secret), 'sha256', 'base64');
                // ACTUAL SIGNATURE GENERATION
                params = this.extend(params, {
                    'sign': signature,
                });
            }
        }
        if (Object.keys(params).length) {
            url += '?' + this.urlencode(params);
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
    handleErrors(httpCode, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (!response) {
            return; // fallback to default error handler
        }
        const errorCode = this.safeInteger(response, 'code');
        if (errorCode !== undefined && errorCode > 0) {
            throw new errors.ExchangeError(this.id + ' ' + this.json(response));
        }
    }
}

module.exports = bingx;
