// ----------------------------------------------------------------------------

import blofinRest from '../blofin.js';
import { AuthenticationError } from '../base/errors.js';
import { ArrayCacheByTimestamp, ArrayCacheBySymbolById, ArrayCache } from '../base/ws/Cache.js';

// ----------------------------------------------------------------------------

export default class blofin extends blofinRest {
    describe () {
        return this.deepExtend (super.describe (), {
            'has': {
                'ws': true,
                'watchBalance': false,
                'watchMyTrades': false,
                'watchOHLCV': true,
                'watchOrderBook': true,
                'watchOrders': false,
                'watchTicker': true,
                'watchTickers': true,
                'watchTrades': true,
            },
            'urls': {
                'api': {
                    'ws': {
                        'public': 'wss://openapi.blofin.com/ws/public',
                        'private': 'wss://openapi.blofin.com/ws/private',
                    },
                },
                'test': {
                    'ws': {
                        'public': 'wss://openapi.blofin.com/ws/public',
                        'private': 'wss://openapi.blofin.com/ws/private',
                    },
                },
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
                'uid': true,
            },
            'options': {
                'watchOrderBook': {
                    'depth': 'books',
                },
                'tradesLimit': 1000,
                'ordersLimit': 1000,
                'requestId': {},
            },
            'streaming': {
                'ping': this.ping,
                'keepAlive': 10000,
            },
        });
    }

    requestId (url) {
        const options = this.safeValue (this.options, 'requestId', {});
        const previousValue = this.safeInteger (options, url, 0);
        const newValue = this.sum (previousValue, 1);
        this.options['requestId'][url] = newValue;
        return newValue;
    }

    async subscribe (access, channel, symbol, params = {}, shouldThrottle = true) {
        await this.loadMarkets ();
        const url = this.urls['api']['ws'][access];
        let messageHash = channel;
        const firstArgument = {
            'channel': channel,
        };
        if (symbol !== undefined) {
            const market = this.market (symbol);
            messageHash += ':' + market['id'];
            firstArgument['instId'] = market['id'];
        }
        const request = {
            'op': 'subscribe',
            'args': [ firstArgument ],
        };
        return await this.watch (url, messageHash, this.deepExtend (request, params), messageHash, shouldThrottle);
    }

    async watchTrades (symbol, since: any = undefined, limit: any = undefined, params = {}) {
        await this.loadMarkets ();
        symbol = this.symbol (symbol);
        const trades = await this.subscribe ('public', 'trades', symbol, params);
        if (this.newUpdates) {
            limit = trades.getLimit (symbol, limit);
        }
        return this.filterBySinceLimit (trades, since, limit, 'timestamp', true);
    }

    handleTrades (client, message) {
        const arg = this.safeValue (message, 'arg', {});
        const channel = this.safeString (arg, 'channel');
        const data = this.safeValue (message, 'data', []);
        const tradesLimit = this.safeInteger (this.options, 'tradesLimit', 1000);
        for (let i = 0; i < data.length; i++) {
            const trade = this.parseTrade (data[i]);
            const symbol = trade['symbol'];
            const marketId = this.safeString (trade['info'], 'instId');
            const messageHash = channel + ':' + marketId;
            let stored = this.safeValue (this.trades, symbol);
            if (stored === undefined) {
                stored = new ArrayCache (tradesLimit);
                this.trades[symbol] = stored;
            }
            stored.append (trade);
            client.resolve (stored, messageHash);
        }
        return message;
    }

    async watchTicker (symbol, params = {}) {
        /**
         * @method
         * @name okx#watchTicker
         * @description watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} params extra parameters specific to the okx api endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        return await this.subscribe ('public', 'tickers', symbol, params);
    }

    handleTicker (client, message) {
        const arg = this.safeValue (message, 'arg', {});
        const channel = this.safeString (arg, 'channel');
        const data = this.safeValue (message, 'data', []);
        for (let i = 0; i < data.length; i++) {
            const ticker = this.parseTicker (data[i]);
            const symbol = ticker['symbol'];
            const marketId = this.safeString (ticker['info'], 'instId');
            const messageHash = channel + ':' + marketId;
            this.tickers[symbol] = ticker;
            client.resolve (ticker, messageHash);
        }
        return message;
    }

    async watchOHLCV (symbol, timeframe = '1m', since: any = undefined, limit: any = undefined, params = {}) {
        await this.loadMarkets ();
        symbol = this.symbol (symbol);
        const interval = this.safeString (this.timeframes, timeframe, timeframe);
        const name = 'candle' + interval;
        const ohlcv = await this.subscribe ('public', name, symbol, params);
        if (this.newUpdates) {
            limit = ohlcv.getLimit (symbol, limit);
        }
        return this.filterBySinceLimit (ohlcv, since, limit, 0, true);
    }

    handleOHLCV (client, message) {
        const arg = this.safeValue (message, 'arg', {});
        const channel = this.safeString (arg, 'channel');
        const data = this.safeValue (message, 'data', []);
        const marketId = this.safeString (arg, 'instId');
        const market = this.safeMarket (marketId);
        const symbol = market['id'];
        const interval = channel.replace ('candle', '');
        // use a reverse lookup in a static map instead
        const timeframe = this.findTimeframe (interval);
        for (let i = 0; i < data.length; i++) {
            const parsed = this.parseOHLCV (data[i], market);
            this.ohlcvs[symbol] = this.safeValue (this.ohlcvs, symbol, {});
            let stored = this.safeValue (this.ohlcvs[symbol], timeframe);
            if (stored === undefined) {
                const limit = this.safeInteger (this.options, 'OHLCVLimit', 1000);
                stored = new ArrayCacheByTimestamp (limit);
                this.ohlcvs[symbol][timeframe] = stored;
            }
            stored.append (parsed);
            const messageHash = channel + ':' + marketId;
            client.resolve (stored, messageHash);
        }
    }

    async watchOrderBook (symbol, limit = undefined, params = {}) {
        const options = this.safeValue (this.options, 'watchOrderBook', {});
        // books, 400 depth levels will be pushed in the initial full snapshot. Incremental data will be pushed every 100 ms when there is change in order book.
        // books5, 5 depth levels will be pushed every time. Data will be pushed every 100 ms when there is change in order book.
        // books50-l2-tbt, 50 depth levels will be pushed in the initial full snapshot. Incremental data will be pushed tick by tick, i.e. whenever there is change in order book.
        // books-l2-tbt, 400 depth levels will be pushed in the initial full snapshot. Incremental data will be pushed tick by tick, i.e. whenever there is change in order book.
        const depth = this.safeString (options, 'depth', 'books-l2-tbt');
        const orderbook = await this.subscribe ('public', depth, symbol, params, false);
        return orderbook.limit (limit);
    }

    handleDelta (bookside, delta) {
        const price = this.safeFloat (delta, 0);
        const amount = this.safeFloat (delta, 1);
        bookside.store (price, amount);
    }

    handleDeltas (bookside, deltas) {
        for (let i = 0; i < deltas.length; i++) {
            this.handleDelta (bookside, deltas[i]);
        }
    }

    handleOrderBookMessage (client, message, orderbook, messageHash) {
        const asks = this.safeValue (message, 'asks', []);
        const bids = this.safeValue (message, 'bids', []);
        const storedAsks = orderbook['asks'];
        const storedBids = orderbook['bids'];
        this.handleDeltas (storedAsks, asks);
        this.handleDeltas (storedBids, bids);
        const checksum = this.safeValue (this.options, 'checksum', true);
        if (checksum) {
            const asksLength = storedAsks.length;
            const bidsLength = storedBids.length;
            const payloadArray = [];
            for (let i = 0; i < 25; i++) {
                if (i < bidsLength) {
                    payloadArray.push (this.numberToString (storedBids[i][0]));
                    payloadArray.push (this.numberToString (storedBids[i][1]));
                }
                if (i < asksLength) {
                    payloadArray.push (this.numberToString (storedAsks[i][0]));
                    payloadArray.push (this.numberToString (storedAsks[i][1]));
                }
            }
            // const payload = payloadArray.join (':');
            // const responseChecksum = this.safeInteger (message, 'checksum');
            // const localChecksum = this.crc32 (payload, true);
            // if (responseChecksum !== localChecksum) {
            //     const error = new InvalidNonce (this.id + ' invalid checksum');
            //     client.reject (error, messageHash);
            // }
        }
        const timestamp = this.safeInteger (message, 'ts');
        orderbook['timestamp'] = timestamp;
        orderbook['datetime'] = this.iso8601 (timestamp);
        return orderbook;
    }

    handleOrderBook (client, message) {
        const arg = this.safeValue (message, 'arg', {});
        const channel = this.safeString (arg, 'channel');
        const action = this.safeString (message, 'action');
        const data = this.safeValue (message, 'data', {});
        const marketId = this.safeString (arg, 'instId');
        const market = this.safeMarket (marketId);
        const symbol = market['symbol'];
        const depths = {
            'bbo-tbt': 1,
            'books': 400,
            'books5': 5,
            'books-l2-tbt': 400,
            'books50-l2-tbt': 50,
        };
        const limit = this.safeInteger (depths, channel);
        const messageHash = channel + ':' + marketId;
        if (action === 'snapshot') {
            const update = data;
            const orderbook = this.orderBook ({}, limit);
            this.orderbooks[symbol] = orderbook;
            orderbook['symbol'] = symbol;
            this.handleOrderBookMessage (client, update, orderbook, messageHash);
            client.resolve (orderbook, messageHash);
        } else if (action === 'update') {
            if (symbol in this.orderbooks) {
                const orderbook = this.orderbooks[symbol];
                const update = data;
                this.handleOrderBookMessage (client, update, orderbook, messageHash);
                client.resolve (orderbook, messageHash);
            }
        }
        //  else if ((channel === 'books5') || (channel === 'bbo-tbt')) {
        //     let orderbook = this.safeValue (this.orderbooks, symbol);
        //     if (orderbook === undefined) {
        //         orderbook = this.orderBook ({}, limit);
        //     }
        //     this.orderbooks[symbol] = orderbook;
        //     for (let i = 0; i < data.length; i++) {
        //         const update = data[i];
        //         const timestamp = this.safeInteger (update, 'ts');
        //         const snapshot = this.parseOrderBook (update, symbol, timestamp, 'bids', 'asks', 0, 1);
        //         orderbook.reset (snapshot);
        //         client.resolve (orderbook, messageHash);
        //     }
        // }
        return message;
    }

    checkRequiredUid () {
        // checkRequiredUid (error = true) {
        return true;
        // if (!this.uid) {
        //     if (error) {
        //         throw new AuthenticationError (this.id + ' requires `uid` credential');
        //     } else {
        //         return false;
        //     }
        // }
        // return true;
    }

    authenticate (params = {}) {
        this.checkRequiredCredentials ();
        const url = this.urls['api']['ws']['private'] + '/' + this.uid;
        const client = this.client (url);
        const messageHash = 'authenticated';
        const event = 'auth';
        let future = this.safeValue (client.subscriptions, messageHash);
        if (future === undefined) {
            const ts = this.nonce ().toString ();
            const auth = '|' + ts;
            const signature = this.hmac (this.encode (auth), this.encode (this.secret), 'sha256');
            const request = {
                'event': event,
                'params': {
                    'apikey': this.apiKey,
                    'sign': signature,
                    'timestamp': ts,
                },
            };
            const message = this.extend (request, params);
            future = this.watch (url, messageHash, message);
            client.subscriptions[messageHash] = future;
        }
        return future;
    }

    async watchPrivate (messageHash, message, params = {}) {
        await this.authenticate (params);
        const url = this.urls['api']['ws']['private'] + '/' + this.uid;
        const requestId = this.requestId (url);
        const subscribe = {
            'id': requestId,
        };
        const request = this.extend (subscribe, message);
        return await this.watch (url, messageHash, request, messageHash, subscribe);
    }

    async watchOrders (symbol: string = undefined, since: any = undefined, limit: any = undefined, params = {}) {
        await this.loadMarkets ();
        const topic = 'executionreport';
        let messageHash = topic;
        if (symbol !== undefined) {
            const market = this.market (symbol);
            symbol = market['symbol'];
            messageHash += ':' + symbol;
        }
        const request = {
            'event': 'subscribe',
            'topic': topic,
        };
        const message = this.extend (request, params);
        const orders = await this.watchPrivate (messageHash, message);
        if (this.newUpdates) {
            limit = orders.getLimit (symbol, limit);
        }
        return this.filterBySymbolSinceLimit (orders, symbol, since, limit, true);
    }

    parseWsOrder (order, market = undefined) {
        return this.parseOrder (order, market);
    }

    handleOrderUpdate (client, message) {
        //
        //     {
        //         topic: 'executionreport',
        //         ts: 1657515556799,
        //         data: {
        //             symbol: 'PERP_BTC_USDT',
        //             clientOrderId: 0,
        //             orderId: 52952826,
        //             type: 'LIMIT',
        //             side: 'SELL',
        //             quantity: 0.01,
        //             price: 22000,
        //             tradeId: 0,
        //             executedPrice: 0,
        //             executedQuantity: 0,
        //             fee: 0,
        //             feeAsset: 'USDT',
        //             totalExecutedQuantity: 0,
        //             status: 'NEW',
        //             reason: '',
        //             orderTag: 'default',
        //             totalFee: 0,
        //             visible: 0.01,
        //             timestamp: 1657515556799,
        //             reduceOnly: false,
        //             maker: false
        //         }
        //     }
        //
        const order = this.safeValue (message, 'data');
        this.handleOrder (client, order);
    }

    handleOrder (client, message) {
        const topic = 'executionreport';
        const parsed = this.parseWsOrder (message);
        const symbol = this.safeString (parsed, 'symbol');
        const orderId = this.safeString (parsed, 'id');
        if (symbol !== undefined) {
            if (this.orders === undefined) {
                const limit = this.safeInteger (this.options, 'ordersLimit', 1000);
                this.orders = new ArrayCacheBySymbolById (limit);
            }
            const cachedOrders = this.orders;
            const orders = this.safeValue (cachedOrders.hashmap, symbol, {});
            const order = this.safeValue (orders, orderId);
            if (order !== undefined) {
                const fee = this.safeValue (order, 'fee');
                if (fee !== undefined) {
                    parsed['fee'] = fee;
                }
                const fees = this.safeValue (order, 'fees');
                if (fees !== undefined) {
                    parsed['fees'] = fees;
                }
                parsed['trades'] = this.safeValue (order, 'trades');
                parsed['timestamp'] = this.safeInteger (order, 'timestamp');
                parsed['datetime'] = this.safeString (order, 'datetime');
            }
            cachedOrders.append (parsed);
            client.resolve (this.orders, topic);
            const messageHashSymbol = topic + ':' + symbol;
            client.resolve (this.orders, messageHashSymbol);
        }
    }

    handleMessage (client, message) {
        if (!this.handleErrorMessage (client, message)) {
            return;
        }
        //
        //     { event: 'subscribe', arg: { channel: 'tickers', instId: 'BTC-USDT' } }
        //     { event: 'login', msg: '', code: '0' }
        //
        //     {
        //         arg: { channel: 'tickers', instId: 'BTC-USDT' },
        //         data: [
        //             {
        //                 instType: 'SPOT',
        //                 instId: 'BTC-USDT',
        //                 last: '31500.1',
        //                 lastSz: '0.00001754',
        //                 askPx: '31500.1',
        //                 askSz: '0.00998144',
        //                 bidPx: '31500',
        //                 bidSz: '3.05652439',
        //                 open24h: '31697',
        //                 high24h: '32248',
        //                 low24h: '31165.6',
        //                 sodUtc0: '31385.5',
        //                 sodUtc8: '32134.9',
        //                 volCcy24h: '503403597.38138519',
        //                 vol24h: '15937.10781721',
        //                 ts: '1626526618762'
        //             }
        //         ]
        //     }
        //
        //     { event: 'error', msg: 'Illegal request: {"op":"subscribe","args":["spot/ticker:BTC-USDT"]}', code: '60012' }
        //     { event: 'error', msg: "channel:ticker,instId:BTC-USDT doesn't exist", code: '60018' }
        //     { event: 'error', msg: 'Invalid OK_ACCESS_KEY', code: '60005' }
        //     {
        //         event: 'error',
        //         msg: 'Illegal request: {"op":"login","args":["de89b035-b233-44b2-9a13-0ccdd00bda0e","7KUcc8YzQhnxBE3K","1626691289","H57N99mBt5NvW8U19FITrPdOxycAERFMaapQWRqLaSE="]}',
        //         code: '60012'
        //     }
        //
        //
        //
        if (message === 'pong') {
            return this.handlePong (client, message);
        }
        // const table = this.safeString (message, 'table');
        // if (table === undefined) {
        const arg = this.safeValue (message, 'arg', {});
        const channel = this.safeString (arg, 'channel');
        const methods = {
            'bbo-tbt': this.handleOrderBook, // newly added channel that sends tick-by-tick Level 1 data, all API users can subscribe, public depth channel, verification not required
            'books': this.handleOrderBook, // all API users can subscribe, public depth channel, verification not required
            'books5': this.handleOrderBook, // all API users can subscribe, public depth channel, verification not required, data feeds will be delivered every 100ms (vs. every 200ms now)
            'books50-l2-tbt': this.handleOrderBook, // only users who're VIP4 and above can subscribe, identity verification required before subscription
            'books-l2-tbt': this.handleOrderBook, // only users who're VIP5 and above can subscribe, identity verification required before subscription
            'tickers': this.handleTicker,
            'trades': this.handleTrades,
        };
        const method = this.safeValue (methods, channel);
        if (method === undefined) {
            if (channel?.indexOf ('candle') === 0) {
                this.handleOHLCV (client, message);
            } else {
                return message;
            }
        } else {
            return method.call (this, client, message);
        }
    }

    ping (client) {
        // okex does not support built-in ws protocol-level ping-pong
        // instead it requires custom text-based ping-pong
        return 'ping';
    }

    handlePong (client, message) {
        client.lastPong = this.milliseconds ();
        return message;
    }

    handleErrorMessage (client, message) {
        //
        //     { event: 'error', msg: 'Illegal request: {"op":"subscribe","args":["spot/ticker:BTC-USDT"]}', code: '60012' }
        //     { event: 'error', msg: "channel:ticker,instId:BTC-USDT doesn't exist", code: '60018' }
        //
        const errorCode = this.safeInteger (message, 'code');
        try {
            if (errorCode) {
                const feedback = this.id + ' ' + this.json (message);
                this.throwExactlyMatchedException (this.exceptions['exact'], errorCode, feedback);
                const messageString = this.safeValue2 (message, 'message', 'msg');
                if (messageString !== undefined) {
                    this.throwBroadlyMatchedException (this.exceptions['broad'], messageString, feedback);
                }
            }
        } catch (e) {
            if (e instanceof AuthenticationError) {
                const messageHash = 'authenticated';
                client.reject (e, messageHash);
                if (messageHash in client.subscriptions) {
                    delete client.subscriptions[messageHash];
                }
                return false;
            }
        }
        return message;
    }

    handleSubscribe (client, message) {
        //
        //     {
        //         id: '666888',
        //         event: 'subscribe',
        //         success: true,
        //         ts: 1657117712212
        //     }
        //
        return message;
    }

    handleAuth (client, message) {
        //
        //     {
        //         event: 'auth',
        //         success: true,
        //         ts: 1657463158812
        //     }
        //
        const messageHash = 'authenticated';
        const success = this.safeValue (message, 'success');
        if (success) {
            client.resolve (message, messageHash);
        } else {
            const error = new AuthenticationError (this.json (message));
            client.reject (error, messageHash);
            // allows further authentication attempts
            if (messageHash in client.subscriptions) {
                delete client.subscriptions['authenticated'];
            }
        }
    }
}
