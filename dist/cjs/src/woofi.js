'use strict';

var Exchange = require('./base/Exchange.js');
var errors = require('./base/errors.js');
var Precise = require('./base/Precise.js');
var number = require('./base/functions/number.js');
var Signer = require('./base/Signer.js');

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
class woofi extends Exchange["default"] {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'woofi',
            'name': 'WOOFI',
            'countries': ['KY'],
            'rateLimit': 100,
            'version': 'v1',
            'certified': false,
            'pro': true,
            'hostname': 'dex.woo.org',
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': true,
                'swap': true,
                'future': false,
                'option': false,
                'addMargin': false,
                'borrowMargin': false,
                'cancelAllOrders': true,
                'cancelOrder': true,
                'cancelWithdraw': false,
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
                'fetchDeposits': true,
                'fetchFundingHistory': true,
                'fetchFundingRate': true,
                'fetchFundingRateHistory': true,
                'fetchFundingRates': true,
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
                'fetchOpenOrders': false,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrders': true,
                'fetchOrderTrades': true,
                'fetchPosition': true,
                'fetchPositionMode': false,
                'fetchPositions': true,
                'fetchPremiumIndexOHLCV': false,
                'fetchStatus': false,
                'fetchTicker': false,
                'fetchTickers': false,
                'fetchTime': false,
                'fetchTrades': true,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'fetchTransactions': true,
                'fetchTransfers': true,
                'fetchWithdrawals': true,
                'reduceMargin': false,
                'repayMargin': true,
                'setLeverage': true,
                'setMargin': false,
                'transfer': true,
                'withdraw': true, // exchange have that endpoint disabled atm, but was once implemented in ccxt per old docs: https://kronosresearch.github.io/wootrade-documents/#token-withdraw
            },
            'timeframes': {
                '1m': '1',
                '3m': '3',
                '5m': '5',
                '15m': '15',
                '30m': '30',
                '1h': '60',
                '2h': '2h',
                '4h': '4h',
                '8h': '8h',
                '12h': '12h',
                '1d': '1D',
                '3d': '3D',
                '1w': '1W',
                '1M': '1M',
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/150730761-1a00e5e0-d28c-480f-9e65-089ce3e6ef3b.jpg',
                'api': {
                    'pub': 'https://api-evm.orderly.org',
                    'public': 'https://api-evm.orderly.org',
                    'private': 'https://api-evm.orderly.org',
                },
                'test': {
                    'pub': 'https://testnet-api-evm.orderly.org',
                    'public': 'https://testnet-api-evm.orderly.org',
                    'private': 'https://testnet-api-evm.orderly.org',
                },
                'www': 'https://woo.org/',
                'doc': [
                    'https://docs.woo.org/',
                ],
                'fees': [
                    'https://support.woo.org/hc/en-001/articles/4404611795353--Trading-Fees',
                ],
                'referral': 'https://referral.woo.org/BAJS6oNmZb3vi3RGA',
            },
            'api': {
                'v1': {
                    'pub': {
                        'get': {
                            'hist/kline': 10,
                            'hist/trades': 1,
                        },
                    },
                    'public': {
                        'get': {
                            'info': 1,
                            'info/{symbol}': 1,
                            'system_info': 1,
                            'kline': 1,
                            'market_trades': 1,
                            'token': 1,
                            'token_network': 1,
                            'funding_rates': 1,
                            'funding_rate/{symbol}': 1,
                            'funding_rate_history': 1,
                            'futures': 1,
                            'futures/{symbol}': 1,
                            'tv/history': 1,
                        },
                    },
                    'private': {
                        'get': {
                            'client/token': 1,
                            'order/{oid}': 1,
                            'client/order/{client_order_id}': 1,
                            'orders': 1,
                            'orderbook/{symbol}': 1,
                            'client/trade/{tid}': 1,
                            'order/{oid}/trades': 1,
                            'client/trades': 1,
                            'client/info': 60,
                            'asset/deposit': 10,
                            'asset/history': 60,
                            'sub_account/all': 60,
                            'sub_account/assets': 60,
                            'token_interest': 60,
                            'token_interest/{token}': 60,
                            'interest/history': 60,
                            'interest/repay': 60,
                            'funding_fee/history': 30,
                            'positions': 3.33,
                            'position/{symbol}': 3.33,
                            'client/holding': 1,
                            'algo/order/{oid}': 1,
                            'algo/orders': 1,
                            'balances': 1,
                            'accountinfo': 60,
                            'buypower': 1,
                        },
                        'post': {
                            'order': 5,
                            'asset/main_sub_transfer': 30,
                            'asset/withdraw': 30,
                            'interest/repay': 60,
                            'client/account_mode': 120,
                            'client/leverage': 120,
                            'algo/order': 5,
                        },
                        'put': {
                            'order': 2,
                            'order/client/{oid}': 2,
                            'algo/order': 2,
                            'algo/order/client/{oid}': 2,
                        },
                        'delete': {
                            'order': 1,
                            'client/order': 1,
                            'orders': 1,
                            'asset/withdraw': 120,
                            'algo/order': 1,
                            'algo/orders/pending': 1,
                            'algo/orders/pending/{symbol}': 1,
                            'orders/pending': 1,
                        },
                    },
                },
            },
            'fees': {
                'trading': {
                    'tierBased': true,
                    'percentage': true,
                    'maker': this.parseNumber('0.0002'),
                    'taker': this.parseNumber('0.0005'),
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
                    '-1000': errors.ExchangeError,
                    '-1001': errors.AuthenticationError,
                    '-1002': errors.AuthenticationError,
                    '-1003': errors.RateLimitExceeded,
                    '-1004': errors.BadRequest,
                    '-1005': errors.BadRequest,
                    '-1006': errors.BadRequest,
                    '-1007': errors.BadRequest,
                    '-1008': errors.InvalidOrder,
                    '-1009': errors.BadRequest,
                    '-1011': errors.ExchangeError,
                    '-1012': errors.BadRequest,
                    '-1101': errors.InvalidOrder,
                    '-1102': errors.InvalidOrder,
                    '-1103': errors.InvalidOrder,
                    '-1104': errors.InvalidOrder,
                    '-1105': errors.InvalidOrder, // { "code": -1105,  "message": "Price is X% too high or X% too low from the mid price." }
                },
                'broad': {
                    'symbol must not be blank': errors.BadRequest,
                    'The token is not supported': errors.BadRequest,
                    'Your order and symbol are not valid or already canceled': errors.BadRequest,
                    'Insufficient WOO. Please enable margin trading for leverage trading': errors.BadRequest, // when selling insufficent token [-1012]
                },
            },
            'precisionMode': number.TICK_SIZE,
        });
    }
    async fetchMarkets(params = {}) {
        /**
         * @method
         * @name woo#fetchMarkets
         * @description retrieves data on all markets for woo
         * @param {object} params extra parameters specific to the exchange api endpoint
         * @returns {[object]} an array of objects representing market data
         */
        const response = await this.v1PublicGetInfo(params);
        //
        // {
        //     rows: [
        //         {
        //             symbol: "SPOT_AAVE_USDT",
        //             quote_min: 0,
        //             quote_max: 100000,
        //             quote_tick: 0.01,
        //             base_min: 0.01,
        //             base_max: 7284,
        //             base_tick: 0.0001,
        //             min_notional: 10,
        //             price_range: 0.1,
        //             created_time: "0",
        //             updated_time: "1639107647.988",
        //             is_stable: 0
        //         },
        //         ...
        //     success: true
        // }
        //
        const result = [];
        const data = this.safeValue(response, 'data', {});
        const rows = this.safeValue(data, 'rows', []);
        for (let i = 0; i < rows.length; i++) {
            const market = rows[i];
            const marketId = this.safeString(market, 'symbol');
            const parts = marketId.split('_');
            let marketType = this.safeStringLower(parts, 0);
            const isSpot = marketType === 'spot';
            const isSwap = marketType === 'perp';
            const baseId = this.safeString(parts, 1);
            const quoteId = this.safeString(parts, 2);
            const base = this.safeCurrencyCode(baseId);
            const quote = this.safeCurrencyCode(quoteId);
            let settleId = undefined;
            let settle = undefined;
            let symbol = base + '/' + quote;
            let contractSize = undefined;
            let linear = undefined;
            if (isSpot) {
                continue;
            }
            if (isSwap) {
                settleId = this.safeString(parts, 2);
                settle = this.safeCurrencyCode(settleId);
                symbol = base + '/' + quote + ':' + settle;
                contractSize = this.parseNumber('1');
                marketType = 'swap';
                linear = true;
            }
            result.push({
                'id': marketId,
                'symbol': symbol,
                'base': base,
                'quote': quote,
                'settle': settle,
                'baseId': baseId,
                'quoteId': quoteId,
                'settleId': settleId,
                'type': marketType,
                'spot': isSpot,
                'margin': true,
                'swap': isSwap,
                'future': false,
                'option': false,
                'active': undefined,
                'contract': isSwap,
                'linear': linear,
                'inverse': undefined,
                'contractSize': contractSize,
                'expiry': undefined,
                'expiryDatetime': undefined,
                'strike': undefined,
                'optionType': undefined,
                'precision': {
                    'amount': this.safeNumber(market, 'base_tick'),
                    'price': this.safeNumber(market, 'quote_tick'),
                },
                'limits': {
                    'leverage': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'amount': {
                        'min': this.safeNumber(market, 'base_min'),
                        'max': this.safeNumber(market, 'base_max'),
                    },
                    'price': {
                        'min': this.safeNumber(market, 'quote_min'),
                        'max': this.safeNumber(market, 'quote_max'),
                    },
                    'cost': {
                        'min': this.safeNumber(market, 'min_notional'),
                        'max': undefined,
                    },
                },
                'info': market,
            });
        }
        return result;
    }
    async fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
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
            throw new errors.ArgumentsRequired(this.id + ' fetchTrades() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.v1PublicGetMarketTrades(this.extend(request, params));
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
        const resultResponse = this.safeValue(response, 'rows', {});
        return this.parseTrades(resultResponse, market, since, limit);
    }
    parseTrade(trade, market = undefined) {
        //
        // public/market_trades
        //
        //     {
        //         symbol: "SPOT_BTC_USDT",
        //         side: "SELL",
        //         executed_price: 46222.35,
        //         executed_quantity: 0.0012,
        //         executed_timestamp: "1641241162.329"
        //     }
        //
        // fetchOrderTrades, fetchOrder
        //
        //     {
        //         id: '99119876',
        //         symbol: 'SPOT_WOO_USDT',
        //         fee: '0.0024',
        //         side: 'BUY',
        //         executed_timestamp: '1641481113.084',
        //         order_id: '87001234',
        //         order_tag: 'default', <-- this param only in "fetchOrderTrades"
        //         executed_price: '1',
        //         executed_quantity: '12',
        //         fee_asset: 'WOO',
        //         is_maker: '1'
        //     }
        //
        const isFromFetchOrder = ('id' in trade);
        const timestamp = this.safeTimestamp(trade, 'executed_timestamp');
        const marketId = this.safeString(trade, 'symbol');
        market = this.safeMarket(marketId, market);
        const symbol = market['symbol'];
        const price = this.safeString(trade, 'executed_price');
        const amount = this.safeString(trade, 'executed_quantity');
        const order_id = this.safeString(trade, 'order_id');
        const fee = this.parseTokenAndFeeTemp(trade, 'fee_asset', 'fee');
        const cost = Precise["default"].stringMul(price, amount);
        const side = this.safeStringLower(trade, 'side');
        const id = this.safeString(trade, 'id');
        let takerOrMaker = undefined;
        if (isFromFetchOrder) {
            const isMaker = this.safeString(trade, 'is_maker') === '1';
            takerOrMaker = isMaker ? 'maker' : 'taker';
        }
        return this.safeTrade({
            'id': id,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'side': side,
            'price': price,
            'amount': amount,
            'cost': cost,
            'order': order_id,
            'takerOrMaker': takerOrMaker,
            'type': undefined,
            'fee': fee,
            'info': trade,
        }, market);
    }
    parseTokenAndFeeTemp(item, feeTokenKey, feeAmountKey) {
        const feeCost = this.safeString(item, feeAmountKey);
        let fee = undefined;
        if (feeCost !== undefined) {
            const feeCurrencyId = this.safeString(item, feeTokenKey);
            const feeCurrencyCode = this.safeCurrencyCode(feeCurrencyId);
            fee = {
                'cost': feeCost,
                'currency': feeCurrencyCode,
            };
        }
        return fee;
    }
    async fetchCurrencies(params = {}) {
        /**
         * @method
         * @name woo#fetchCurrencies
         * @description fetches all available currencies on an exchange
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {object} an associative dictionary of currencies
         */
        const result = {};
        const tokenResponse = await this.v1PublicGetToken(params);
        //
        // {
        //     rows: [
        //         {
        //             token: "ETH_USDT",
        //             fullname: "Tether",
        //             decimals: 6,
        //             balance_token: "USDT",
        //             created_time: "0",
        //             updated_time: "0"
        //         },
        //         {
        //             token: "BSC_USDT",
        //             fullname: "Tether",
        //             decimals: 18,
        //             balance_token: "USDT",
        //             created_time: "0",
        //             updated_time: "0"
        //         },
        //         {
        //             token: "ZEC",
        //             fullname: "ZCash",
        //             decimals: 8,
        //             balance_token: "ZEC",
        //             created_time: "0",
        //             updated_time: "0"
        //         },
        //         ...
        //     ],
        //     success: true
        // }
        //
        // only make one request for currrencies...
        // const tokenNetworkResponse = await this.v1PublicGetTokenNetwork (params);
        //
        // {
        //     rows: [
        //         {
        //             protocol: "ERC20",
        //             token: "USDT",
        //             name: "Ethereum",
        //             minimum_withdrawal: 30,
        //             withdrawal_fee: 25,
        //             allow_deposit: 1,
        //             allow_withdraw: 1
        //         },
        //         {
        //             protocol: "TRC20",
        //             token: "USDT",
        //             name: "Tron",
        //             minimum_withdrawal: 30,
        //             withdrawal_fee: 1,
        //             allow_deposit: 1,
        //             allow_withdraw: 1
        //         },
        //         ...
        //     ],
        //     success: true
        // }
        //
        const tokenRows = this.safeValue(tokenResponse, 'rows', []);
        const networksByCurrencyId = this.groupBy(tokenRows, 'balance_token');
        const currencyIds = Object.keys(networksByCurrencyId);
        for (let i = 0; i < currencyIds.length; i++) {
            const currencyId = currencyIds[i];
            const networks = networksByCurrencyId[currencyId];
            const code = this.safeCurrencyCode(currencyId);
            let name = undefined;
            let minPrecision = undefined;
            const resultingNetworks = {};
            for (let j = 0; j < networks.length; j++) {
                const network = networks[j];
                name = this.safeString(network, 'fullname');
                const networkId = this.safeString(network, 'token');
                const splitted = networkId.split('_');
                const unifiedNetwork = splitted[0];
                const precision = this.parsePrecision(this.safeString(network, 'decimals'));
                if (precision !== undefined) {
                    minPrecision = (minPrecision === undefined) ? precision : Precise["default"].stringMin(precision, minPrecision);
                }
                resultingNetworks[unifiedNetwork] = {
                    'id': networkId,
                    'network': unifiedNetwork,
                    'limits': {
                        'withdraw': {
                            'min': undefined,
                            'max': undefined,
                        },
                        'deposit': {
                            'min': undefined,
                            'max': undefined,
                        },
                    },
                    'active': undefined,
                    'deposit': undefined,
                    'withdraw': undefined,
                    'fee': undefined,
                    'precision': this.parseNumber(precision),
                    'info': network,
                };
            }
            result[code] = {
                'id': currencyId,
                'name': name,
                'code': code,
                'precision': this.parseNumber(minPrecision),
                'active': undefined,
                'fee': undefined,
                'networks': resultingNetworks,
                'deposit': undefined,
                'withdraw': undefined,
                'limits': {
                    'deposit': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'withdraw': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
                'info': networks,
            };
        }
        return result;
    }
    async createOrder(symbol, type, side, amount, price = undefined, params = {}) {
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
        const reduceOnly = this.safeValue2(params, 'reduceOnly', 'close');
        const orderType = type.toUpperCase();
        if (orderType === 'STOP' || orderType === 'STOPLIMIT') {
            await this.loadMarkets();
            const market = this.market(symbol);
            const orderSide = side.toUpperCase();
            let algoOrderType = 'MARKET';
            if (orderType !== 'STOP') {
                algoOrderType = 'LIMIT';
            }
            const triggerPrice = this.safeValue2(params, 'stopPrice', 'triggerPrice');
            const request = {
                'symbol': market['id'],
                'algo_type': 'STOP',
                'type': algoOrderType,
                'side': orderSide,
            };
            if (reduceOnly) {
                request['reduce_only'] = reduceOnly;
            }
            // if (price !== undefined) {
            //     request['price'] = this.priceToPrecision (symbol, price);
            // }
            request['trigger_price'] = triggerPrice;
            request['trigger_price_type'] = 'MARK_PRICE';
            request['quantity'] = this.amountToPrecision(symbol, amount);
            params = this.omit(params, ['clOrdID', 'clientOrderId', 'postOnly', 'timeInForce']);
            // const response = await (this as any).v1PrivatePostAlgoOrder (this.extend (request, params));
            request['order_tag'] = 'TEALSTREET';
            const response = await this.v1PrivatePostAlgoOrder(request);
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
            const data = this.safeValue(response, 'data');
            const rows = this.safeValue(data, 'rows', []);
            // return this.extend (
            //     this.parseOrder (rows[0], market),
            //     { 'type': type }
            // );
            return this.extend(this.parseOrder(rows[0], market), { 'status': 'open' });
        }
        else {
            await this.loadMarkets();
            const market = this.market(symbol);
            const orderSide = side.toUpperCase();
            const request = {
                'symbol': market['id'],
                'order_type': orderType,
                'side': orderSide,
            };
            const isMarket = orderType === 'MARKET';
            const timeInForce = this.safeStringLower(params, 'timeInForce');
            const postOnly = this.isPostOnly(isMarket, undefined, params);
            if (postOnly) {
                request['order_type'] = 'POST_ONLY';
            }
            else if (timeInForce === 'fok') {
                request['order_type'] = 'FOK';
            }
            else if (timeInForce === 'ioc') {
                request['order_type'] = 'IOC';
            }
            if (reduceOnly) {
                request['reduce_only'] = reduceOnly;
            }
            if (price !== undefined) {
                request['order_price'] = this.priceToPrecision(symbol, price);
            }
            request['order_quantity'] = this.amountToPrecision(symbol, amount);
            const clientOrderId = this.safeString2(params, 'clOrdID', 'clientOrderId');
            if (clientOrderId !== undefined) {
                request['client_order_id'] = clientOrderId;
            }
            request['order_tag'] = 'TEALSTREET';
            params = this.omit(params, ['clOrdID', 'clientOrderId', 'postOnly', 'timeInForce']);
            const response = await this.v1PrivatePostOrder(this.extend(request, params));
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
            return this.extend(this.parseOrder(response, market), { 'type': type, 'status': 'open' });
        }
    }
    async cancelOrder(id, symbol = undefined, params = {}) {
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
            throw new errors.ArgumentsRequired(this.id + ' cancelOrder() requires a symbol argument');
        }
        await this.loadMarkets();
        if (params['type'] === 'stop') {
            return this.cancelAlgoOrder(id, symbol, params);
        }
        else {
            return this.cancelRegularOrder(id, symbol, params);
        }
    }
    async cancelAlgoOrder(id, symbol = undefined, params = {}) {
        const request = {};
        request['order_id'] = id;
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
        }
        request['symbol'] = market['id'];
        const response = await this.v1PrivateDeleteAlgoOrder(this.extend(request, params));
        //
        // { success: true, status: 'CANCEL_SENT' }
        //
        const extendParams = { 'symbol': symbol };
        extendParams['id'] = id;
        return this.extend(this.parseOrder(response), extendParams);
    }
    async cancelRegularOrder(id, symbol = undefined, params = {}) {
        const request = {};
        const clientOrderIdUnified = this.safeString2(params, 'clOrdID', 'clientOrderId');
        const clientOrderIdExchangeSpecific = this.safeString2(params, 'client_order_id', clientOrderIdUnified);
        const isByClientOrder = clientOrderIdExchangeSpecific !== undefined;
        if (isByClientOrder) {
            request['client_order_id'] = clientOrderIdExchangeSpecific;
            params = this.omit(params, ['clOrdID', 'clientOrderId', 'client_order_id', 'type']);
        }
        else {
            params = this.omit(params, ['type']);
            request['order_id'] = id;
        }
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
        }
        request['symbol'] = market['id'];
        const response = await this.v1PrivateDeleteOrder(this.extend(request, params));
        //
        // { success: true, status: 'CANCEL_SENT' }
        //
        const extendParams = { 'symbol': symbol };
        // if (isByClientOrder) {
        //     extendParams['client_order_id'] = clientOrderIdExchangeSpecific;
        // } else {
        extendParams['id'] = id;
        // }
        return this.extend(this.parseOrder(response), extendParams);
    }
    async cancelAllOrders(symbol = undefined, params = {}) {
        /**
         * @method
         * @name woo#cancelAllOrders
         * @description cancel all open orders in a market
         * @param {string|undefined} symbol unified market symbol
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {object} an list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' canelOrders() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.v1PrivateDeleteOrders(this.extend(request, params));
        await this.v1PrivateDeleteAlgoOrdersPending(this.extend(request, params));
        //
        //     {
        //         "success":true,
        //         "status":"CANCEL_ALL_SENT"
        //     }
        //
        return response;
    }
    async fetchOrder(id, symbol = undefined, params = {}) {
        /**
         * @method
         * @name woo#fetchOrder
         * @description fetches information on an order made by the user
         * @param {string|undefined} symbol unified symbol of the market the order was made in
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        const market = (symbol !== undefined) ? this.market(symbol) : undefined;
        const request = {};
        const clientOrderId = this.safeString2(params, 'clOrdID', 'clientOrderId');
        let chosenSpotMethod = undefined;
        if (clientOrderId) {
            chosenSpotMethod = 'v1PrivateGetClientOrderClientOrderId';
            request['client_order_id'] = clientOrderId;
        }
        else {
            chosenSpotMethod = 'v1PrivateGetOrderOid';
            request['oid'] = id;
        }
        const response = await this[chosenSpotMethod](this.extend(request, params));
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
        return this.parseOrder(response, market);
    }
    async fetchOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
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
        await this.loadMarkets();
        const request = {};
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['symbol'] = market['id'];
        }
        if (since !== undefined) {
            request['start_t'] = since;
        }
        request['size'] = 500;
        request['status'] = 'INCOMPLETE';
        const ordersResponse = await this.v1PrivateGetOrders(this.extend(request, params));
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
        const ordersData = this.safeValue(ordersResponse, 'data', {});
        const ordersRows = this.safeValue(ordersData, 'rows', []);
        let total = 0;
        let algoOrdersRows = [];
        for (let i = 0; i < 50; i++) {
            request['size'] = 50;
            request['page'] = i + 1;
            request['algo_type'] = 'STOP';
            const algoOrdersResponse = await this.v1PrivateGetAlgoOrders(this.extend(request, params));
            const algoOrdersData = this.safeValue(algoOrdersResponse, 'data');
            const algoOrdersMeta = this.safeValue(algoOrdersData, 'meta');
            const newRows = this.safeValue(algoOrdersData, 'rows');
            total = total + newRows.length;
            algoOrdersRows = this.arrayConcat(algoOrdersRows, newRows);
            const knownTotal = this.safeInteger(algoOrdersMeta, 'total');
            if (total >= knownTotal) {
                break;
            }
        }
        const allOrdersData = this.arrayConcat(ordersRows, algoOrdersRows);
        return this.parseOrders(allOrdersData, market, since, limit, params);
    }
    parseTimeInForce(timeInForce) {
        const timeInForces = {
            'ioc': 'IOC',
            'fok': 'FOK',
            'post_only': 'PO',
        };
        return this.safeString(timeInForces, timeInForce, undefined);
    }
    parseOrderType(type, algoType = undefined) {
        if (algoType !== undefined) {
            if (algoType === 'take_profit') {
                if (type === 'market') {
                    return 'stop';
                }
                else {
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
        return this.safeStringLower(types, type, type);
    }
    parseOrder(order, market = undefined) {
        const isAlgoOrder = 'algo_type' in order;
        if (isAlgoOrder) {
            return this.parseAlgoOrder(order, market);
        }
        else {
            return this.parseRegularOrder(order, market);
        }
    }
    parseRegularOrder(order, market = undefined) {
        //
        // Possible input functions:
        // * createOrder
        // * cancelOrder
        // * fetchOrder
        // * fetchOrders
        // const isFromFetchOrder = ('order_tag' in order); TO_DO
        const timestamp = this.safeTimestamp2(order, 'timestamp', 'created_time');
        const orderId = this.safeString2(order, 'order_id', 'orderId');
        const clientOrderId = this.safeString2(order, 'client_order_id', 'clientOrderId'); // Somehow, this always returns 0 for limit order
        const marketId = this.safeString(order, 'symbol');
        market = this.safeMarket(marketId, market);
        const symbol = market['symbol'];
        const price = this.safeString2(order, 'order_price', 'price');
        const amount = this.safeString2(order, 'order_quantity', 'quantity'); // This is base amount
        const cost = this.safeString2(order, 'order_amount', 'amount'); // This is quote amount
        const orderType = this.parseOrderType(this.safeStringLower2(order, 'order_type', 'type'));
        const status = this.safeValue(order, 'status');
        const side = this.safeStringLower(order, 'side');
        const type = this.safeStringUpper(order, 'type');
        const postOnly = type === 'POST_ONLY';
        const filled = this.safeValue(order, 'executed');
        const average = this.safeString2(order, 'average_executed_price', 'executedPrice');
        const remaining = Precise["default"].stringSub(cost, filled);
        const fee = this.safeValue2(order, 'total_fee', 'totalFee');
        const feeCurrency = this.safeString2(order, 'fee_asset', 'feeAsset');
        const transactions = this.safeValue(order, 'Transactions');
        return this.safeOrder({
            'id': orderId,
            'clientOrderId': clientOrderId,
            'timestamp': timestamp ? timestamp / 1000 : undefined,
            'datetime': timestamp ? this.iso8601(timestamp / 1000) : undefined,
            'lastTradeTimestamp': undefined,
            'status': this.parseOrderStatus(status),
            'symbol': symbol,
            'type': orderType,
            'timeInForce': this.parseTimeInForce(orderType),
            'postOnly': postOnly,
            'reduceOnly': this.safeValue(order, 'reduce_only'),
            'side': side,
            'price': price,
            'stopPrice': undefined,
            'triggerPrice': undefined,
            'average': average,
            'amount': amount,
            'filled': filled,
            'remaining': remaining,
            'cost': cost,
            'trades': transactions,
            'fee': {
                'cost': fee,
                'currency': feeCurrency,
            },
            'info': order,
        }, market);
    }
    parseAlgoOrder(order, market = undefined) {
        //
        // Possible input functions:
        // * createOrder
        // * cancelOrder
        // * fetchOrder
        // * fetchOrders
        // const isFromFetchOrder = ('order_tag' in order); TO_DO
        const timestamp = this.safeTimestamp2(order, 'timestamp', 'created_time');
        const orderId = this.safeStringN(order, ['algo_order_id', 'algoOrderId']);
        const clientOrderId = this.safeStringN(order, ['algo_order_id', 'algoOrderId']); // Somehow, this always returns 0 for limit order
        const marketId = this.safeString(order, 'symbol');
        market = this.safeMarket(marketId, market);
        const symbol = market['symbol'];
        const price = this.safeString2(order, 'price', 'trigger_price');
        const stopPrice = this.safeString2(order, 'trigger_price', 'price');
        const amount = this.safeString2(order, 'order_quantity', 'quantity'); // This is base amount
        const cost = this.safeString2(order, 'order_amount', 'amount'); // This is quote amount
        const orderType = this.parseOrderType(this.safeStringLower2(order, 'order_type', 'type'), this.safeStringLower(order, 'algo_type'));
        let tsOrderType = orderType;
        if (orderType === 'market') {
            tsOrderType = 'stop';
        }
        const status = this.safeValue(order, 'algo_status');
        const side = this.safeStringLower(order, 'side');
        const filled = this.safeValue(order, 'executed');
        const average = this.safeString(order, 'average_executed_price');
        const remaining = Precise["default"].stringSub(cost, filled);
        const fee = this.safeValue(order, 'total_fee');
        const feeCurrency = this.safeString(order, 'fee_asset');
        // const transactions = this.safeValue (order, 'Transactions');
        return this.safeOrder({
            'id': orderId,
            'clientOrderId': clientOrderId,
            'timestamp': timestamp ? timestamp / 1000 : undefined,
            'datetime': timestamp ? this.iso8601(timestamp / 1000) : undefined,
            'lastTradeTimestamp': undefined,
            'status': this.parseOrderStatus(status),
            'symbol': symbol,
            'type': tsOrderType,
            'timeInForce': this.parseTimeInForce(orderType),
            'postOnly': undefined,
            'reduceOnly': this.safeValue(order, 'reduceOnly'),
            'side': side,
            'price': price,
            'stopPrice': stopPrice,
            'triggerPrice': undefined,
            'average': average,
            'amount': amount,
            'filled': filled,
            'remaining': remaining,
            'cost': cost,
            // 'trades': transactions,
            'fee': {
                'cost': fee,
                'currency': feeCurrency,
            },
            'info': order,
            // TEALSTREET
            'reduce': this.safeValue(order, 'reduceOnly'),
            'trigger': 'Mark',
            // we don't know this from api
            // 'close': this.safeValue (order, 'closeOnTrigger'),
            // TEALSTREET
        }, market);
    }
    parseOrderStatus(status) {
        if (status !== undefined) {
            const statuses = {
                'NEW': 'open',
                'FILLED': 'closed',
                'CANCEL_SENT': 'canceled',
                'CANCEL_ALL_SENT': 'canceled',
                'CANCELLED': 'canceled',
                'PARTIAL_FILLED': 'open',
                'REJECTED': 'rejected',
                'INCOMPLETE': 'open',
                'REPLACED': 'open',
                'COMPLETED': 'closed',
            };
            return this.safeString(statuses, status, status);
        }
        return status;
    }
    async fetchOrderBook(symbol, limit = undefined, params = {}) {
        /**
         * @method
         * @name woo#fetchOrderBook
         * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
         * @param {string} symbol unified symbol of the market to fetch the order book for
         * @param {int|undefined} limit the maximum amount of order book entries to return
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        if (limit !== undefined) {
            limit = Math.min(limit, 1000);
            request['max_level'] = limit;
        }
        const response = await this.v1PrivateGetOrderbookSymbol(this.extend(request, params));
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
        const timestamp = this.safeInteger(response, 'timestamp');
        return this.parseOrderBook(response, symbol, timestamp, 'bids', 'asks', 'price', 'quantity');
    }
    async fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
            'resolution': this.timeframes[timeframe],
            'from': since / 1000,
        };
        const parsedTimeFrame = this.parseTimeframe(timeframe);
        const duration = parsedTimeFrame * 1000 * limit;
        const to = this.sum(since, duration);
        request['to'] = to / 1000;
        const response = await this.v1PublicGetTvHistory(this.extend(request, params));
        const res = [];
        if (response.s === 'ok') {
            const length = response.t.length;
            for (let i = 0; i < length; i++) {
                res.push([
                    response.t[i] * 1000,
                    response.o[i],
                    response.h[i],
                    response.l[i],
                    response.c[i],
                    response.v[i],
                ]);
            }
        }
        else {
            throw (response.s);
        }
        return res;
    }
    parseOHLCV(ohlcv, market = undefined) {
        // example response in fetchOHLCV
        return [
            this.safeInteger(ohlcv, 'start_timestamp'),
            this.safeNumber(ohlcv, 'open'),
            this.safeNumber(ohlcv, 'high'),
            this.safeNumber(ohlcv, 'low'),
            this.safeNumber(ohlcv, 'close'),
            this.safeNumber(ohlcv, 'volume'),
        ];
    }
    async fetchOrderTrades(id, symbol = undefined, since = undefined, limit = undefined, params = {}) {
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
        await this.loadMarkets();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
        }
        const request = {
            'oid': id,
        };
        const response = await this.v1PrivateGetOrderOidTrades(this.extend(request, params));
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
        const trades = this.safeValue(response, 'rows', []);
        return this.parseTrades(trades, market, since, limit, params);
    }
    async fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
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
        await this.loadMarkets();
        const request = {};
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['symbol'] = market['id'];
        }
        if (since !== undefined) {
            request['start_t'] = since;
        }
        const response = await this.v1PrivateGetClientTrades(this.extend(request, params));
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
        const trades = this.safeValue(response, 'rows', []);
        return this.parseTrades(trades, market, since, limit, params);
    }
    async fetchAccounts(params = {}) {
        /**
         * @method
         * @name woo#fetchAccounts
         * @description fetch all the accounts associated with a profile
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {object} a dictionary of [account structures]{@link https://docs.ccxt.com/#/?id=account-structure} indexed by the account type
         */
        const response = await this.v1PrivateGetSubAccountAssets(params);
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
        const rows = this.safeValue(response, 'rows', []);
        return this.parseAccounts(rows, params);
    }
    parseAccount(account) {
        //
        //     {
        //         application_id: '336952aa-a401-4e26-aff6-972920aebba3',
        //         account: 'subaccount',
        //         usdt_balance: '1.0',
        //     }
        //
        const accountId = this.safeString(account, 'account');
        return {
            'info': account,
            'id': this.safeString(account, 'application_id'),
            'name': accountId,
            'code': undefined,
            'type': accountId === 'Main' ? 'main' : 'subaccount',
        };
    }
    async fetchBalance(params = {}) {
        /**
         * @method
         * @name woo#fetchBalance
         * @description query for balance and get the amount of funds available for trading or funds locked in orders
         * @see https://docs.woo.org/#get-current-holding-get-balance-new
         * @param {object} params extra parameters specific to the woo api endpoint
         * @returns {object} a [balance structure]{@link https://docs.ccxt.com/en/latest/manual.html?#balance-structure}
         */
        await this.loadMarkets();
        const response = await this.v1PrivateGetClientHolding(params);
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
        const data = this.safeValue(response, 'data');
        return this.parseBalance(data);
    }
    parseBalance(response) {
        const result = {
            'info': response,
        };
        const balances = this.safeValue(response, 'holding', []);
        for (let i = 0; i < balances.length; i++) {
            const balance = balances[i];
            const code = this.safeCurrencyCode(this.safeString(balance, 'token'));
            const account = this.account();
            account['total'] = this.safeString(balance, 'holding');
            account['free'] = this.safeString(balance, 'availableBalance');
            result[code] = account;
        }
        return this.safeBalance(result);
    }
    nonce() {
        return this.milliseconds();
    }
    sign(path, section = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const version = section[0];
        const access = section[1];
        const isUdfPath = path === 'tv/history';
        const pathWithParams = this.implodeParams(path, params);
        let url = this.implodeHostname(this.urls['api'][access]);
        if (isUdfPath) {
            url += '/';
        }
        else {
            url += '/' + version + '/';
        }
        params = this.omit(params, this.extractParams(path));
        params = this.keysort(params);
        if (access === 'public') {
            if (isUdfPath) {
                url += pathWithParams;
            }
            else {
                url += access + '/' + pathWithParams;
            }
            if (Object.keys(params).length) {
                url += '?' + this.urlencode(params);
            }
        }
        else if (access === 'pub') {
            url += pathWithParams;
            if (Object.keys(params).length) {
                url += '?' + this.urlencode(params);
            }
        }
        else {
            this.checkRequiredCredentials();
            let auth = '';
            const ts = this.nonce().toString();
            url += pathWithParams;
            headers = {
                'orderly-key': this.apiKey,
                'orderly-account-id': this.uid,
                'orderly-timestamp': ts,
            };
            if (version === 'v1') {
                auth = ts + method + '/' + version + '/' + pathWithParams;
                if (method === 'POST' || method === 'PUT') {
                    headers['content-type'] = 'application/x-www-form-urlencoded';
                    body = this.json(params);
                    auth += body;
                }
                else {
                    if (Object.keys(params).length) {
                        const query = this.urlencode(params);
                        url += '?' + query;
                        auth += '?' + query;
                    }
                }
                if (method === 'DELETE') {
                    headers['content-type'] = 'application/x-www-form-urlencoded';
                }
                else {
                    headers['content-type'] = 'application/json';
                }
            }
            else {
                auth = this.urlencode(params);
                if (method === 'POST' || method === 'PUT') {
                    body = auth;
                }
                else {
                    url += '?' + auth;
                }
                auth += '|' + ts;
                headers['content-type'] = 'application/x-www-form-urlencoded';
            }
            // headers['orderly-signature'] = this.hmac (this.encode (auth), this.encode (this.secret), 'sha256');
            const signer = new Signer.Signer(this.uid, this.secret);
            headers['orderly-signature'] = signer.sign_request(auth);
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
    handleErrors(httpCode, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (!response) {
            return; // fallback to default error handler
        }
        //
        //     400 Bad Request {"success":false,"code":-1012,"message":"Amount is required for buy market orders when margin disabled."}
        //
        const success = this.safeValue(response, 'success');
        const errorCode = this.safeString(response, 'code');
        if (!success) {
            const feedback = this.id + ' ' + this.json(response);
            this.throwBroadlyMatchedException(this.exceptions['broad'], body, feedback);
            this.throwExactlyMatchedException(this.exceptions['exact'], errorCode, feedback);
        }
    }
    parseIncome(income, market = undefined) {
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
        const marketId = this.safeString(income, 'symbol');
        const symbol = this.safeSymbol(marketId, market);
        const amount = this.safeNumber(income, 'funding_fee');
        const code = this.safeCurrencyCode('USD');
        const id = this.safeString(income, 'id');
        const timestamp = this.safeTimestamp(income, 'updated_time');
        const rate = this.safeNumber(income, 'funding_rate');
        return {
            'info': income,
            'symbol': symbol,
            'code': code,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'id': id,
            'amount': amount,
            'rate': rate,
        };
    }
    async fetchFundingHistory(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        const request = {};
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['symbol'] = market['id'];
        }
        if (since !== undefined) {
            request['start_t'] = since;
        }
        const response = await this.v1PrivateGetFundingFeeHistory(this.extend(request, params));
        //
        //     {
        //         "rows":[
        //             {
        //                 "id":666666,
        //                 "symbol":"PERP_BTC_USDT",
        //                 "funding_rate":0.00001198,
        //                 "mark_price":28941.04000000,
        //                 "funding_fee":0.00069343,
        //                 "payment_type":"Pay",
        //                 "status":"COMPLETED",
        //                 "created_time":"1653616000.666",
        //                 "updated_time":"1653616000.605"
        //             }
        //         ],
        //         "meta":{
        //             "total":235,
        //             "records_per_page":25,
        //             "current_page":1
        //         },
        //         "success":true
        //     }
        //
        const result = this.safeValue(response, 'rows', []);
        return this.parseIncomes(result, market, since, limit);
    }
    parseFundingRate(fundingRate, market = undefined) {
        //
        //         {
        //             "symbol":"PERP_AAVE_USDT",
        //             "est_funding_rate":-0.00003447,
        //             "est_funding_rate_timestamp":1653633959001,
        //             "last_funding_rate":-0.00002094,
        //             "last_funding_rate_timestamp":1653631200000,
        //             "next_funding_time":1653634800000
        //         }
        //
        //
        const symbol = this.safeString(fundingRate, 'symbol');
        market = this.market(symbol);
        const nextFundingTimestamp = this.safeInteger(fundingRate, 'next_funding_time');
        const estFundingRateTimestamp = this.safeInteger(fundingRate, 'est_funding_rate_timestamp');
        const lastFundingRateTimestamp = this.safeInteger(fundingRate, 'last_funding_rate_timestamp');
        return {
            'info': fundingRate,
            'symbol': market['symbol'],
            'markPrice': undefined,
            'indexPrice': undefined,
            'interestRate': this.parseNumber('0'),
            'estimatedSettlePrice': undefined,
            'timestamp': estFundingRateTimestamp,
            'datetime': this.iso8601(estFundingRateTimestamp),
            'fundingRate': this.safeNumber(fundingRate, 'est_funding_rate'),
            'fundingTimestamp': nextFundingTimestamp,
            'fundingDatetime': this.iso8601(nextFundingTimestamp),
            'nextFundingRate': undefined,
            'nextFundingTimestamp': undefined,
            'nextFundingDatetime': undefined,
            'previousFundingRate': this.safeNumber(fundingRate, 'last_funding_rate'),
            'previousFundingTimestamp': lastFundingRateTimestamp,
            'previousFundingDatetime': this.iso8601(lastFundingRateTimestamp),
        };
    }
    async fetchFundingRate(symbol, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.v1PublicGetFundingRateSymbol(this.extend(request, params));
        //
        //     {
        //         "success":true,
        //         "timestamp":1653640572711,
        //         "symbol":"PERP_BTC_USDT",
        //         "est_funding_rate":0.00000738,
        //         "est_funding_rate_timestamp":1653640559003,
        //         "last_funding_rate":0.00000629,
        //         "last_funding_rate_timestamp":1653638400000,
        //         "next_funding_time":1653642000000
        //     }
        //
        return this.parseFundingRate(response, market);
    }
    async fetchFundingRates(symbols = undefined, params = {}) {
        await this.loadMarkets();
        symbols = this.marketSymbols(symbols);
        const response = await this.v1PublicGetFundingRates(params);
        //
        //     {
        //         "success":true,
        //         "rows":[
        //             {
        //                 "symbol":"PERP_AAVE_USDT",
        //                 "est_funding_rate":-0.00003447,
        //                 "est_funding_rate_timestamp":1653633959001,
        //                 "last_funding_rate":-0.00002094,
        //                 "last_funding_rate_timestamp":1653631200000,
        //                 "next_funding_time":1653634800000
        //             }
        //         ],
        //         "timestamp":1653633985646
        //     }
        //
        const rows = this.safeValue(response, 'rows', {});
        const result = this.parseFundingRates(rows);
        return this.filterByArray(result, 'symbol', symbols);
    }
    async fetchFundingRateHistory(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        const request = {};
        if (symbol !== undefined) {
            const market = this.market(symbol);
            symbol = market['symbol'];
            request['symbol'] = market['id'];
        }
        if (since !== undefined) {
            request['start_t'] = this.parseToInt(since / 1000);
        }
        const response = await this.v1PublicGetFundingRateHistory(this.extend(request, params));
        //
        //     {
        //         "success":true,
        //         "meta":{
        //             "total":2464,
        //             "records_per_page":25,
        //             "current_page":1
        //         },
        //         "rows":[
        //             {
        //                 "symbol":"PERP_BTC_USDT",
        //                 "funding_rate":0.00000629,
        //                 "funding_rate_timestamp":1653638400000,
        //                 "next_funding_time":1653642000000
        //             }
        //         ],
        //         "timestamp":1653640814885
        //     }
        //
        const result = this.safeValue(response, 'rows');
        const rates = [];
        for (let i = 0; i < result.length; i++) {
            const entry = result[i];
            const marketId = this.safeString(entry, 'symbol');
            const timestamp = this.safeInteger(entry, 'funding_rate_timestamp');
            rates.push({
                'info': entry,
                'symbol': this.safeSymbol(marketId),
                'fundingRate': this.safeNumber(entry, 'funding_rate'),
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
            });
        }
        const sorted = this.sortBy(rates, 'timestamp');
        return this.filterBySymbolSinceLimit(sorted, symbol, since, limit);
    }
    async fetchLeverage(symbol, params = {}) {
        await this.loadMarkets();
        const response = await this.v1PrivateGetClientInfo(params);
        //
        //     {
        //         "success": true,
        //         "data": {
        //             "applicationId": "dsa",
        //             "account": "dsa",
        //             "alias": "haha",
        //             "accountMode": "MARGIN",
        //             "leverage": 1,
        //             "takerFeeRate": 1,
        //             "makerFeeRate": 1,
        //             "interestRate": 1,
        //             "futuresTakerFeeRate": 1,
        //             "futuresMakerFeeRate": 1,
        //             "otpauth": true,
        //             "marginRatio": 1,
        //             "openMarginRatio": 1,
        //             "initialMarginRatio": 1,
        //             "maintenanceMarginRatio": 1,
        //             "totalCollateral": 1,
        //             "freeCollateral": 1,
        //             "totalAccountValue": 1,
        //             "totalVaultValue": 1,
        //             "totalStakingValue": 1
        //         },
        //         "timestamp": 1673323685109
        //     }
        //
        const result = this.safeValue(response, 'data');
        const leverage = this.safeNumber(result, 'max_leverage');
        return {
            'info': response,
            'leverage': leverage,
        };
    }
    async setLeverage(leverage, symbol = undefined, params = {}) {
        await this.loadMarkets();
        if ((leverage !== 1) && (leverage !== 2) && (leverage !== 3) && (leverage !== 4) && (leverage !== 5) && (leverage !== 10) && (leverage !== 15) && (leverage !== 20) && (leverage !== 50)) {
            throw new errors.BadRequest(this.id + ' leverage should be 1, 2, 3, 4, 5, 10, 15, 20 or 50');
        }
        const request = {
            'leverage': leverage,
        };
        return await this.v1PrivatePostClientLeverage(this.extend(request, params));
    }
    async fetchPosition(symbol = undefined, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.v1PrivateGetPositionSymbol(this.extend(request, params));
        //
        //     {
        //         "symbol":"PERP_ETC_USDT",
        //         "holding":0.0,
        //         "pnl_24_h":0,
        //         "settle_price":0.0,
        //         "average_open_price":0,
        //         "success":true,
        //         "mark_price":22.6955,
        //         "pending_short_qty":0.0,
        //         "pending_long_qty":0.0,
        //         "fee_24_h":0,
        //         "timestamp":"1652231044.920"
        //     }
        //
        return this.parsePosition(response, market);
    }
    async fetchPositions(symbols = undefined, params = {}) {
        await this.loadMarkets();
        const response = await this.v1PrivateGetPositions(params);
        //
        //     {
        //         "success": true,
        //         "data": {
        //             "positions": [
        //                 {
        //                     "symbol": "0_symbol",
        //                     "holding": 1,
        //                     "pendingLongQty": 0,
        //                     "pendingShortQty": 1,
        //                     "settlePrice": 1,
        //                     "averageOpenPrice": 1,
        //                     "pnl24H": 1,
        //                     "fee24H": 1,
        //                     "markPrice": 1,
        //                     "estLiqPrice": 1,
        //                     "timestamp": 12321321
        //                 }
        //             ]
        //         },
        //         "timestamp": 1673323880342
        //     }
        //
        const result = this.safeValue(response, 'data', {});
        const positions = this.safeValue(result, 'rows', []);
        return this.parsePositions(positions, symbols);
    }
    parsePosition(position, market = undefined) {
        //
        //     {
        //         "symbol": "0_symbol",
        //         "holding": 1,
        //         "pendingLongQty": 0,
        //         "pendingShortQty": 1,
        //         "settlePrice": 1,
        //         "averageOpenPrice": 1,
        //         "pnl24H": 1,
        //         "fee24H": 1,
        //         "markPrice": 1,
        //         "estLiqPrice": 1,
        //         "timestamp": 12321321
        //     }
        //
        const contract = this.safeString(position, 'symbol');
        market = this.safeMarket(contract, market);
        const size = this.safeString(position, 'position_qty');
        let side = undefined;
        if (Precise["default"].stringGt(size, '0')) {
            side = 'long';
        }
        else {
            side = 'short';
        }
        const contractSize = this.safeString(market, 'contractSize');
        const markPrice = this.safeString(position, 'mark_price');
        const timestamp = this.safeTimestamp(position, 'timestamp');
        const entryPrice = this.safeString(position, 'average_open_price');
        const priceDifference = Precise["default"].stringSub(markPrice, entryPrice);
        const unrealisedPnl = Precise["default"].stringMul(priceDifference, size);
        return {
            'info': position,
            'id': market['symbol'] + ':' + side,
            'symbol': market['symbol'],
            'notional': undefined,
            'marginMode': 'cross',
            'liquidationPrice': this.safeNumber(position, 'est_liq_price'),
            'entryPrice': this.parseNumber(entryPrice),
            'realizedPnl': this.safeString(position, 'pnl_24_h'),
            'unrealizedPnl': this.parseNumber(unrealisedPnl),
            'percentage': undefined,
            'contracts': this.parseNumber(size),
            'contractSize': this.parseNumber(contractSize),
            'markPrice': this.parseNumber(markPrice),
            'side': side,
            'hedged': false,
            'timestamp': timestamp / 1000,
            'datetime': this.iso8601(timestamp / 1000),
            'maintenanceMargin': undefined,
            'maintenanceMarginPercentage': undefined,
            'collateral': undefined,
            'initialMargin': undefined,
            'initialMarginPercentage': undefined,
            'leverage': undefined,
            'marginRatio': undefined,
        };
    }
    defaultNetworkCodeForCurrency(code) {
        const currencyItem = this.currency(code);
        const networks = currencyItem['networks'];
        const networkKeys = Object.keys(networks);
        for (let i = 0; i < networkKeys.length; i++) {
            const network = networkKeys[i];
            if (network === 'ETH') {
                return network;
            }
        }
        // if it was not returned according to above options, then return the first network of currency
        return this.safeValue(networkKeys, 0);
    }
    async fetchTicker(symbol, params = {}) {
        /**
         * @method
         * @name woo#fetchTicker
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
        const response = await this.v1PublicGetFuturesSymbol(this.extend(request, params));
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
        const ticker = this.safeValue(response, 'info');
        return this.parseTicker(ticker, market);
    }
    parseTicker(ticker, market = undefined) {
        //
        // {
        //   "symbol": "PERP_BTC_USDT",
        //   "index_price": 56727.31344564,
        //   "mark_price": 56727.31344564,
        //   "est_funding_rate": 0.12345689,
        //   "last_funding_rate": 0.12345689,
        //   "next_funding_time": 1567411795000,
        //   "open_interest": 0.12345689,
        //   "24h_open": 0.16112,
        //   "24h_close": 0.32206,
        //   "24h_high": 0.33000,
        //   "24h_low": 0.14251,
        //   "24h_volume": 89040821.98,
        //   "24h_amount": 22493062.21
        // }
        //
        const symbol = this.safeSymbol(undefined, market);
        const timestamp = this.milliseconds();
        const baseVolume = this.safeString(ticker, '24h_volume');
        const openFloat = this.safeFloat(ticker, '24h_open');
        const currentFloat = this.safeFloat(ticker, 'index_price');
        const percentage = currentFloat / openFloat * 100;
        const last = this.safeString(ticker, 'index_price');
        return this.safeTicker({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': this.safeString(ticker, '24h_high'),
            'low': this.safeString(ticker, '24h_low'),
            'bid': this.safeString(ticker, 'index_price'),
            'bidVolume': undefined,
            'ask': this.safeString(ticker, 'index_price'),
            'askVolume': undefined,
            'open': this.safeString(ticker, '24h_open'),
            'close': last,
            'last': last,
            'mark': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': this.numberToString(percentage),
            'average': undefined,
            'baseVolume': baseVolume,
            'info': ticker,
        }, market);
    }
    async fetchAccountConfiguration(symbol, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const leverageInfo = await this.fetchLeverage(market['id']);
        const leverage = this.safeInteger(leverageInfo, 'leverage');
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

module.exports = woofi;
