
//  ---------------------------------------------------------------------------

import { Exchange } from './base/Exchange.js';
import { ExchangeError } from './base/errors.js';
import { TICK_SIZE } from './base/functions/number.js';

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
                'createDepositAddress': true,
                'createOrder': true,
                'fetchBalance': true,
                'fetchDepositAddress': true,
                'fetchDepositAddresses': true,
                'fetchFundingHistory': false,
                'fetchFundingRate': false,
                'fetchFundingRateHistory': false,
                'fetchFundingRates': false,
                'fetchIndexOHLCV': false,
                'fetchMarkOHLCV': false,
                'fetchOpenInterestHistory': false,
                'fetchOrderBook': true,
                'fetchPremiumIndexOHLCV': false,
                'fetchTicker': true,
                'fetchTrades': true,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'transfer': true,
            },
            'urls': {
                'logo': '',
                'api': {
                    'spot': 'https://open-api.bingx.com/openApi/spot',
                    'swap': 'https://api-swap-rest.bingbon.pro/api',
                    'contract': 'https://api.bingbon.com/api/coingecko',
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
                'contract': {
                    'v1': {
                        'public': {
                            'get': {
                                'derivatives/contracts': 1,
                                'derivatives/orderbook/{ticker_id}': 1,
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
        const currencies = Object.keys (this.currencies);
        for (let i = 0; i < currencies.length; i++) {
            const code = currencies[i];
            const currency = this.currency (code);
            const currencyId = currency['id'];
            const free = 'balance_' + currencyId;
            if (free in response) {
                const account = this.account ();
                const used = 'locked_' + currencyId;
                account['free'] = this.safeString (response, free);
                account['used'] = this.safeString (response, used);
                result[code] = account;
            }
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
        /**
         * @method
         * @name paymium#fetchTrades
         * @description get the list of most recent trades for a particular symbol
         * @param {string} symbol unified symbol of the market to fetch trades for
         * @param {int|undefined} since timestamp in ms of the earliest trade to fetch
         * @param {int|undefined} limit the maximum amount of trades to fetch
         * @param {object} params extra parameters specific to the paymium api endpoint
         * @returns {[object]} a list of [trade structures]{@link https://docs.ccxt.com/en/latest/manual.html?#public-trades}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'currency': market['id'],
        };
        const response = await (this as any).publicGetDataCurrencyTrades (this.extend (request, params));
        return this.parseTrades (response, market, since, limit);
    }

    async createDepositAddress (code, params = {}) {
        /**
         * @method
         * @name paymium#createDepositAddress
         * @description create a currency deposit address
         * @param {string} code unified currency code of the currency for the deposit address
         * @param {object} params extra parameters specific to the paymium api endpoint
         * @returns {object} an [address structure]{@link https://docs.ccxt.com/#/?id=address-structure}
         */
        await this.loadMarkets ();
        const response = await (this as any).privatePostUserAddresses (params);
        //
        //     {
        //         "address": "1HdjGr6WCTcnmW1tNNsHX7fh4Jr5C2PeKe",
        //         "valid_until": 1620041926,
        //         "currency": "BTC",
        //         "label": "Savings"
        //     }
        //
        return this.parseDepositAddress (response);
    }

    async fetchDepositAddress (code, params = {}) {
        /**
         * @method
         * @name paymium#fetchDepositAddress
         * @description fetch the deposit address for a currency associated with this account
         * @param {string} code unified currency code
         * @param {object} params extra parameters specific to the paymium api endpoint
         * @returns {object} an [address structure]{@link https://docs.ccxt.com/#/?id=address-structure}
         */
        await this.loadMarkets ();
        const request = {
            'address': code,
        };
        const response = await (this as any).privateGetUserAddressesAddress (this.extend (request, params));
        //
        //     {
        //         "address": "1HdjGr6WCTcnmW1tNNsHX7fh4Jr5C2PeKe",
        //         "valid_until": 1620041926,
        //         "currency": "BTC",
        //         "label": "Savings"
        //     }
        //
        return this.parseDepositAddress (response);
    }

    async fetchDepositAddresses (codes: string[] = undefined, params = {}) {
        /**
         * @method
         * @name paymium#fetchDepositAddresses
         * @description fetch deposit addresses for multiple currencies and chain types
         * @param {[string]|undefined} codes list of unified currency codes, default is undefined
         * @param {object} params extra parameters specific to the paymium api endpoint
         * @returns {object} a list of [address structures]{@link https://docs.ccxt.com/#/?id=address-structure}
         */
        await this.loadMarkets ();
        const response = await (this as any).privateGetUserAddresses (params);
        //
        //     [
        //         {
        //             "address": "1HdjGr6WCTcnmW1tNNsHX7fh4Jr5C2PeKe",
        //             "valid_until": 1620041926,
        //             "currency": "BTC",
        //             "label": "Savings"
        //         }
        //     ]
        //
        return this.parseDepositAddresses (response, codes);
    }

    parseDepositAddress (depositAddress, currency = undefined) {
        //
        //     {
        //         "address": "1HdjGr6WCTcnmW1tNNsHX7fh4Jr5C2PeKe",
        //         "valid_until": 1620041926,
        //         "currency": "BTC",
        //         "label": "Savings"
        //     }
        //
        const address = this.safeString (depositAddress, 'address');
        const currencyId = this.safeString (depositAddress, 'currency');
        return {
            'info': depositAddress,
            'currency': this.safeCurrencyCode (currencyId, currency),
            'address': address,
            'tag': undefined,
            'network': undefined,
        };
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

    async transfer (code, amount, fromAccount, toAccount, params = {}) {
        /**
         * @method
         * @name paymium#transfer
         * @description transfer currency internally between wallets on the same account
         * @param {string} code unified currency code
         * @param {float} amount amount to transfer
         * @param {string} fromAccount account to transfer from
         * @param {string} toAccount account to transfer to
         * @param {object} params extra parameters specific to the paymium api endpoint
         * @returns {object} a [transfer structure]{@link https://docs.ccxt.com/#/?id=transfer-structure}
         */
        await this.loadMarkets ();
        const currency = this.currency (code);
        if (toAccount.indexOf ('@') < 0) {
            throw new ExchangeError (this.id + ' transfer() only allows transfers to an email address');
        }
        if (code !== 'BTC' && code !== 'EUR') {
            throw new ExchangeError (this.id + ' transfer() only allows BTC or EUR');
        }
        const request = {
            'currency': currency['id'],
            'amount': this.currencyToPrecision (code, amount),
            'email': toAccount,
            // 'comment': 'a small note explaining the transfer'
        };
        const response = await (this as any).privatePostUserEmailTransfers (this.extend (request, params));
        //
        //     {
        //         "uuid": "968f4580-e26c-4ad8-8bcd-874d23d55296",
        //         "type": "Transfer",
        //         "currency": "BTC",
        //         "currency_amount": "string",
        //         "created_at": "2013-10-24T10:34:37.000Z",
        //         "updated_at": "2013-10-24T10:34:37.000Z",
        //         "amount": "1.0",
        //         "state": "executed",
        //         "currency_fee": "0.0",
        //         "btc_fee": "0.0",
        //         "comment": "string",
        //         "traded_btc": "string",
        //         "traded_currency": "string",
        //         "direction": "buy",
        //         "price": "string",
        //         "account_operations": [
        //             {
        //                 "uuid": "968f4580-e26c-4ad8-8bcd-874d23d55296",
        //                 "amount": "1.0",
        //                 "currency": "BTC",
        //                 "created_at": "2013-10-24T10:34:37.000Z",
        //                 "created_at_int": 1389094259,
        //                 "name": "account_operation",
        //                 "address": "1FPDBXNqSkZMsw1kSkkajcj8berxDQkUoc",
        //                 "tx_hash": "string",
        //                 "is_trading_account": true
        //             }
        //         ]
        //     }
        //
        return this.parseTransfer (response, currency);
    }

    parseTransfer (transfer, currency = undefined) {
        //
        //     {
        //         "uuid": "968f4580-e26c-4ad8-8bcd-874d23d55296",
        //         "type": "Transfer",
        //         "currency": "BTC",
        //         "currency_amount": "string",
        //         "created_at": "2013-10-24T10:34:37.000Z",
        //         "updated_at": "2013-10-24T10:34:37.000Z",
        //         "amount": "1.0",
        //         "state": "executed",
        //         "currency_fee": "0.0",
        //         "btc_fee": "0.0",
        //         "comment": "string",
        //         "traded_btc": "string",
        //         "traded_currency": "string",
        //         "direction": "buy",
        //         "price": "string",
        //         "account_operations": [
        //             {
        //                 "uuid": "968f4580-e26c-4ad8-8bcd-874d23d55296",
        //                 "amount": "1.0",
        //                 "currency": "BTC",
        //                 "created_at": "2013-10-24T10:34:37.000Z",
        //                 "created_at_int": 1389094259,
        //                 "name": "account_operation",
        //                 "address": "1FPDBXNqSkZMsw1kSkkajcj8berxDQkUoc",
        //                 "tx_hash": "string",
        //                 "is_trading_account": true
        //             }
        //         ]
        //     }
        //
        const currencyId = this.safeString (transfer, 'currency');
        const updatedAt = this.safeString (transfer, 'updated_at');
        const timetstamp = this.parseDate (updatedAt);
        const accountOperations = this.safeValue (transfer, 'account_operations');
        const firstOperation = this.safeValue (accountOperations, 0, {});
        const status = this.safeString (transfer, 'state');
        return {
            'info': transfer,
            'id': this.safeString (transfer, 'uuid'),
            'timestamp': timetstamp,
            'datetime': this.iso8601 (timetstamp),
            'currency': this.safeCurrencyCode (currencyId, currency),
            'amount': this.safeNumber (transfer, 'amount'),
            'fromAccount': undefined,
            'toAccount': this.safeString (firstOperation, 'address'),
            'status': this.parseTransferStatus (status),
        };
    }

    parseTransferStatus (status) {
        const statuses = {
            'executed': 'ok',
            // what are the other statuses?
        };
        return this.safeString (statuses, status, status);
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
        if (access === 'public') {
            if (Object.keys (params).length) {
                url += '?' + this.urlencode (params);
            }
        } else if (access === 'private') {
            this.checkRequiredCredentials ();
            params = this.extend (params, {
                'apiKey': this.apiKey,
                'timestamp': this.milliseconds () - 0,
            });
            // ACTUAL SIGNATURE GENERATION
            const paramString = this.rawencode (params);
            const originString = method + '/api/' + version + '/' + rawPath + paramString;
            const signature = this.hmac (this.encode (originString), this.encode (this.secret), 'sha256', 'base64');
            // ACTUAL SIGNATURE GENERATION
            params = this.extend (params, {
                'sign': signature,
            });
            if (Object.keys (params).length) {
                url += '?' + this.urlencode (params);
            }
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
