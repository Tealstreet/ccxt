'use strict';

var bingx$1 = require('../bingx.js');
var errors = require('../base/errors.js');
var Cache = require('../base/ws/Cache.js');

//  ---------------------------------------------------------------------------
//  ---------------------------------------------------------------------------
class bingx extends bingx$1 {
    describe() {
        return this.deepExtend(super.describe(), {
            'has': {
                'ws': true,
                'watchBalance': false,
                'watchMyTrades': false,
                'watchOHLCV': false,
                'watchOrderBook': true,
                'watchOrders': true,
                'watchTicker': true,
                'watchTickers': false,
                'watchTrades': true,
                'watchPosition': undefined,
            },
            'urls': {
                'api': {
                    'ws': 'wss://ws-market-swap.we-api.com/ws',
                    'ws2': 'wss://open-api-swap.bingx.com/swap-market',
                },
            },
            'options': {
                'spot': {
                    'timeframes': {
                        '1m': '1m',
                        '3m': '3m',
                        '5m': '5m',
                        '15m': '15m',
                        '30m': '30m',
                        '1h': '1h',
                        '2h': '2h',
                        '4h': '4h',
                        '6h': '6h',
                        '12h': '12h',
                        '1d': '1d',
                        '1w': '1w',
                        '1M': '1M',
                    },
                },
                'contract': {
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
                        '1d': 'D',
                        '1w': 'W',
                        '1M': 'M',
                    },
                },
            },
            'streaming': {
                'ping': this.ping,
                'keepAlive': 20000,
            },
            'exceptions': {
                'ws': {
                    'exact': {},
                },
            },
        });
    }
    requestId() {
        const requestId = this.sum(this.safeInteger(this.options, 'requestId', 0), 1);
        this.options['requestId'] = requestId;
        return requestId;
    }
    cleanParams(params) {
        params = this.omit(params, ['type', 'subType', 'settle', 'defaultSettle', 'unifiedMargin']);
        return params;
    }
    async watchOrderBook(symbol, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#watchOrderBook
         * @description watches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
         * @see https://bingx-exchange.github.io/docs/v5/websocket/public/orderbook
         * @param {string} symbol unified symbol of the market to fetch the order book for
         * @param {int|undefined} limit the maximum amount of order book entries to return.
         * @param {object} params extra parameters specific to the bingx api endpoint
         * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        symbol = market['symbol'];
        const url = this.urls['api']['ws'];
        params = this.cleanParams(params);
        const messageHash = 'orderbook' + ':' + symbol;
        if (limit === undefined) {
            limit = 100;
        }
        else {
            if ((limit !== 5) && (limit !== 10) && (limit !== 20) && (limit !== 50) && (limit !== 100)) {
                throw new errors.BadRequest(this.id + ' watchOrderBook() can only use limit 1, 50, 200 and 500.');
            }
        }
        const topics = ['market.depth.' + market['id'] + '.step0.level' + limit.toString()];
        const orderbook = await this.watchTopics(url, messageHash, topics, params);
        // return orderbook.limit ();
        return orderbook;
    }
    handleOrderBook(client, message) {
        const data = this.safeValue(message, 'data', {});
        const dataType = this.safeValue(message, 'dataType', '');
        const parts = dataType.split('.');
        const marketId = this.safeString(parts, 2);
        const market = this.safeMarket(marketId);
        const symbol = market['symbol'];
        const latestTrade = this.safeValue(data, 'latestTrade', {});
        const timestamp = this.safeInteger(latestTrade, 'rawTs');
        let orderbook = this.safeValue(this.orderbooks, symbol);
        if (orderbook === undefined) {
            orderbook = this.orderBook();
        }
        const asks = this.safeValue(data, 'asks', []);
        const bids = this.safeValue(data, 'bids', []);
        this.handleDeltas(orderbook['asks'], asks);
        this.handleDeltas(orderbook['bids'], bids);
        orderbook['timestamp'] = timestamp;
        orderbook['datetime'] = this.iso8601(timestamp);
        const messageHash = 'orderbook' + ':' + symbol;
        this.orderbooks[symbol] = orderbook;
        client.resolve(orderbook, messageHash);
    }
    handleDelta(bookside, delta) {
        const bidAsk = this.parseBidAsk(delta, 'price', 'volume');
        bookside.storeArray(bidAsk);
    }
    handleDeltas(bookside, deltas) {
        for (let i = 0; i < deltas.length; i++) {
            this.handleDelta(bookside, deltas[i]);
        }
    }
    async watchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#watchTrades
         * @description watches information on multiple trades made in a market
         * @see https://bingx-exchange.github.io/docs/v5/websocket/public/trade
         * @param {string} symbol unified market symbol of the market orders were made in
         * @param {int|undefined} since the earliest time in ms to fetch orders for
         * @param {int|undefined} limit the maximum number of  orde structures to retrieve
         * @param {object} params extra parameters specific to the bingx api endpoint
         * @returns {[object]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        symbol = market['symbol'];
        const url = this.urls['api']['ws'];
        params = this.cleanParams(params);
        const messageHash = 'trade:' + symbol;
        const topic = 'market.trade.detail.' + market['id'];
        const trades = await this.watchTopics(url, messageHash, [topic], params);
        if (this.newUpdates) {
            limit = trades.getLimit(symbol, limit);
        }
        // since BingX always returns duplicate set of klines via ws, and we are not sending since from
        // ts client, emulate it
        let tradesSince = undefined;
        if (this.options['tradesSince'] !== undefined) {
            tradesSince = this.options['tradesSince'];
        }
        const newTrades = this.filterBySinceLimit(trades, tradesSince, limit, 'timestamp', true);
        this.options = this.extend(this.options, { 'tradesSince': this.milliseconds() - 0 });
        return newTrades;
    }
    handleTrades(client, message) {
        //
        //     {
        //         "topic": "publicTrade.BTCUSDT",
        //         "type": "snapshot",
        //         "ts": 1672304486868,
        //         "data": [
        //             {
        //                 "T": 1672304486865,
        //                 "s": "BTCUSDT",
        //                 "S": "Buy",
        //                 "v": "0.001",
        //                 "p": "16578.50",
        //                 "L": "PlusTick",
        //                 "i": "20f43950-d8dd-5b31-9112-a178eb6023af",
        //                 "BT": false
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue(message, 'data', {});
        const topic = this.safeString(message, 'dataType');
        let trades = [];
        if (this.isArray(data.trades)) {
            trades = data.trades.reverse();
        }
        const parts = topic.split('.');
        const marketId = this.safeString(parts, 3);
        const market = this.safeMarket(marketId);
        const symbol = market['symbol'];
        let stored = this.safeValue(this.trades, symbol);
        if (stored === undefined) {
            const limit = this.safeInteger(this.options, 'tradesLimit', 1000);
            stored = new Cache.ArrayCache(limit);
            this.trades[symbol] = stored;
        }
        for (let j = 0; j < trades.length; j++) {
            const parsed = this.parseWsTrade(trades[j], market);
            stored.append(parsed);
        }
        const messageHash = 'trade' + ':' + symbol;
        client.resolve(stored, messageHash);
    }
    parseWsTrade(trade, market = undefined) {
        //
        // public
        //    {
        // makerSide
        // "Ask"
        // price
        // "27563.5"
        // time
        // "03:06:43"
        // volume
        // "0.2312"
        //     }
        //
        const symbol = market['symbol'];
        const timestamp = this.safeInteger(trade, 'rawTs');
        const id = '' + timestamp;
        const m = this.safeValue(trade, 'makerSide');
        const side = m ? 'Bid' : 'Ask';
        const price = this.safeString(trade, 'price');
        const amount = this.safeFloat(trade, 'volume');
        return this.safeTrade({
            'id': id,
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'order': undefined,
            'type': undefined,
            'side': side,
            'takerOrMaker': 'taker',
            'price': price,
            'amount': amount * market['contractSize'],
            'cost': undefined,
            'fee': undefined,
        }, market);
    }
    getPrivateType(url) {
        if (url.indexOf('spot') >= 0) {
            return 'spot';
        }
        else if (url.indexOf('v5/private') >= 0) {
            return 'unified';
        }
        else {
            return 'usdc';
        }
    }
    async watchOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#watchOrders
         * @description watches information on multiple orders made by the user
         * @see https://bingx-exchange.github.io/docs/v5/websocket/private/order
         * @param {string|undefined} symbol unified market symbol of the market orders were made in
         * @param {int|undefined} since the earliest time in ms to fetch orders for
         * @param {int|undefined} limit the maximum number of  orde structures to retrieve
         * @param {object} params extra parameters specific to the bingx api endpoint
         * @returns {[object]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure
         */
        await this.loadMarkets();
        let messageHash = 'orders';
        if (symbol !== undefined) {
            symbol = this.symbol(symbol);
            messageHash += ':' + symbol;
        }
        const url = this.urls['api']['ws'];
        await this.authenticate();
        const topicsByMarket = {
            'spot': ['order', 'stopOrder'],
            'unified': ['order'],
            'usdc': ['user.openapi.perp.order'],
        };
        const topics = this.safeValue(topicsByMarket, this.getPrivateType(url));
        const orders = await this.watchTopics(url, messageHash, topics, params);
        if (this.newUpdates) {
            limit = orders.getLimit(symbol, limit);
        }
        return this.filterBySymbolSinceLimit(orders, symbol, since, limit, true);
    }
    handleOrder(client, message, subscription = undefined) {
        //
        //     spot
        //     {
        //         "type": "snapshot",
        //         "topic": "order",
        //         "ts": "1662348310441",
        //         "data": [
        //             {
        //                 "e": "order",
        //                 "E": "1662348310441",
        //                 "s": "BTCUSDT",
        //                 "c": "spotx008",
        //                 "S": "BUY",
        //                 "o": "MARKET_OF_QUOTE",
        //                 "f": "GTC",
        //                 "q": "20",
        //                 "p": "0",
        //                 "X": "CANCELED",
        //                 "i": "1238261807653647872",
        //                 "M": "1238225004531834368",
        //                 "l": "0.001007",
        //                 "z": "0.001007",
        //                 "L": "19842.02",
        //                 "n": "0",
        //                 "N": "BTC",
        //                 "u": true,
        //                 "w": true,
        //                 "m": false,
        //                 "O": "1662348310368",
        //                 "Z": "19.98091414",
        //                 "A": "0",
        //                 "C": false,
        //                 "v": "0",
        //                 "d": "NO_LIQ",
        //                 "t": "2100000000002220938"
        //             }
        //         ]
        //     }
        // unified
        //     {
        //         "id": "5923240c6880ab-c59f-420b-9adb-3639adc9dd90",
        //         "topic": "order",
        //         "creationTime": 1672364262474,
        //         "data": [
        //             {
        //                 "symbol": "ETH-30DEC22-1400-C",
        //                 "orderId": "5cf98598-39a7-459e-97bf-76ca765ee020",
        //                 "side": "Sell",
        //                 "orderType": "Market",
        //                 "cancelType": "UNKNOWN",
        //                 "price": "72.5",
        //                 "qty": "1",
        //                 "orderIv": "",
        //                 "timeInForce": "IOC",
        //                 "orderStatus": "Filled",
        //                 "orderLinkId": "",
        //                 "lastPriceOnCreated": "",
        //                 "reduceOnly": false,
        //                 "leavesQty": "",
        //                 "leavesValue": "",
        //                 "cumExecQty": "1",
        //                 "cumExecValue": "75",
        //                 "avgPrice": "75",
        //                 "blockTradeId": "",
        //                 "positionIdx": 0,
        //                 "cumExecFee": "0.358635",
        //                 "createdTime": "1672364262444",
        //                 "updatedTime": "1672364262457",
        //                 "rejectReason": "EC_NoError",
        //                 "stopOrderType": "",
        //                 "triggerPrice": "",
        //                 "takeProfit": "",
        //                 "stopLoss": "",
        //                 "tpTriggerBy": "",
        //                 "slTriggerBy": "",
        //                 "triggerDirection": 0,
        //                 "triggerBy": "",
        //                 "closeOnTrigger": false,
        //                 "category": "option"
        //             }
        //         ]
        //     }
        //
        if (this.orders === undefined) {
            const limit = this.safeInteger(this.options, 'ordersLimit', 1000);
            this.orders = new Cache.ArrayCacheBySymbolById(limit);
        }
        const orders = this.orders;
        let rawOrders = [];
        let parser = undefined;
        parser = 'parseContractOrder';
        rawOrders = this.safeValue(message, 'data', []);
        rawOrders = this.safeValue(rawOrders, 'result', rawOrders);
        const symbols = {};
        for (let i = 0; i < rawOrders.length; i++) {
            const parsed = this[parser](rawOrders[i]);
            const symbol = parsed['symbol'];
            symbols[symbol] = true;
            orders.append(parsed);
        }
        const symbolsArray = Object.keys(symbols);
        for (let i = 0; i < symbolsArray.length; i++) {
            const messageHash = 'orders:' + symbolsArray[i];
            client.resolve(orders, messageHash);
        }
        const messageHash = 'orders';
        client.resolve(orders, messageHash);
    }
    async watchTopics(url, messageHash, topics = [], params = {}) {
        const request = {
            'id': '' + this.requestId(),
            'reqType': 'sub',
            'dataType': topics[0],
        };
        const message = this.extend(request, params);
        return await this.watch(url, messageHash, message, messageHash);
    }
    async authenticate(params = {}) {
        // this.checkRequiredCredentials ();
        // const messageHash = 'authenticated';
        // const url = this.urls['api']['ws'];
        // const client = this.client (url);
        // let future = this.safeValue (client.subscriptions, messageHash);
        // if (future === undefined) {
        //     const request = {
        //         'reqType': 'req',
        //         'id': this.uuid (),
        //         'dataType': 'account.user.auth',
        //         'data': {
        //             'token': this.apiKey + '.' + this.secret,
        //             'platformId': '30',
        //         },
        //     };
        //     const message = this.extend (request, params);
        //     future = this.watch (url, messageHash, message);
        //     client.subscriptions[messageHash] = future;
        // }
        // return future;
        const time = this.milliseconds();
        const lastAuthenticatedTime = this.safeInteger(this.options, 'lastAuthenticatedTime', 0);
        const listenKeyRefreshRate = this.safeInteger(this.options, 'listenKeyRefreshRate', 1200000);
        const delay = this.sum(listenKeyRefreshRate, 10000);
        if (time - lastAuthenticatedTime > delay) {
            const method = 'swap2OpenApiPrivatePostUserAuthUserDataStream';
            const response = await this[method](params);
            this.options = this.extend(this.options, {
                'listenKey': this.safeString(response, 'listenKey'),
                'lastAuthenticatedTime': time,
            });
            this.delay(listenKeyRefreshRate, this.keepAliveListenKey, params);
        }
    }
    async keepAliveListenKey(params = {}) {
        const listenKey = this.safeString(this.options, 'listenKey');
        if (listenKey === undefined) {
            // A network error happened: we can't renew a listen key that does not exist.
            return;
        }
        const method = 'swap2OpenApiPrivatePutUserAuthUserDataStream';
        const request = {
            'listenKey': listenKey,
        };
        const time = this.milliseconds();
        const sendParams = this.omit(params, 'type');
        try {
            await this[method](this.extend(request, sendParams));
        }
        catch (error) {
            const url = this.urls['api']['ws2'] + '?' + this.options['listenKey'];
            const client = this.client(url);
            const messageHashes = Object.keys(client.futures);
            for (let i = 0; i < messageHashes.length; i++) {
                const messageHash = messageHashes[i];
                client.reject(error, messageHash);
            }
            this.options = this.extend(this.options, {
                'listenKey': undefined,
                'lastAuthenticatedTime': 0,
            });
            return;
        }
        this.options = this.extend(this.options, {
            'listenKey': listenKey,
            'lastAuthenticatedTime': time,
        });
        // whether or not to schedule another listenKey keepAlive request
        const listenKeyRefreshRate = this.safeInteger(this.options, 'listenKeyRefreshRate', 1200000);
        return this.delay(listenKeyRefreshRate, this.keepAliveListenKey, params);
    }
    handleErrorMessage(client, message) {
        //
        //   {
        //       success: false,
        //       ret_msg: 'error:invalid op',
        //       conn_id: '5e079fdd-9c7f-404d-9dbf-969d650838b5',
        //       request: { op: '', args: null }
        //   }
        //
        // auth error
        //
        //   {
        //       success: false,
        //       ret_msg: 'error:USVC1111',
        //       conn_id: 'e73770fb-a0dc-45bd-8028-140e20958090',
        //       request: {
        //         op: 'auth',
        //         args: [
        //           '9rFT6uR4uz9Imkw4Wx',
        //           '1653405853543',
        //           '542e71bd85597b4db0290f0ce2d13ed1fd4bb5df3188716c1e9cc69a879f7889'
        //         ]
        //   }
        //
        //   { code: '-10009', desc: 'Invalid period!' }
        //
        const code = this.safeInteger(message, 'code');
        try {
            if (code !== 0) {
                const feedback = this.id + ' ' + this.json(message);
                throw new errors.ExchangeError(feedback);
            }
            const success = this.safeValue(message, 'success');
            if (success !== undefined && !success) {
                const ret_msg = this.safeString(message, 'ret_msg');
                const request = this.safeValue(message, 'request', {});
                const op = this.safeString(request, 'op');
                if (op === 'auth') {
                    throw new errors.AuthenticationError('Authentication failed: ' + ret_msg);
                }
                else {
                    throw new errors.ExchangeError(this.id + ' ' + ret_msg);
                }
            }
            return false;
        }
        catch (error) {
            if (error instanceof errors.AuthenticationError) {
                const messageHash = 'authenticated';
                client.reject(error, messageHash);
                if (messageHash in client.subscriptions) {
                    delete client.subscriptions[messageHash];
                }
            }
            else {
                client.reject(error);
            }
            return true;
        }
    }
    handleMessage(client, message) {
        // pong
        if (message === 'Ping' || this.safeString(message, 'ping', '') !== '') {
            return this.sendPong(client, message);
        }
        if (message === 'Pong' || this.safeString(message, 'pong', '') !== '') {
            return this.handlePong(client, message);
        }
        if (this.handleErrorMessage(client, message)) {
            return;
        }
        // const event = this.safeString (message, 'event');
        // if (event === 'sub') {
        //     this.handleSubscriptionStatus (client, message);
        //     return;
        // }
        const topic = this.safeString(message, 'dataType', '');
        const methods = {
            // 'market.depth.': this.handleOrderBook,
            // 'order': this.handleOrder,
            // 'stopOrder': this.handleOrder,
            // 'trade': this.handleTrades,
            // 'publicTrade': this.handleTrades,
            'market.depth.': this.handleOrderBook,
            'market.trade.detail.': this.handleTrades,
            'market.contracts': this.handleTicker,
            // 'wallet': this.handleBalance,
            // 'outboundAccountInfo': this.handleBalance,
            // 'execution': this.handleMyTrades,
            // 'ticketInfo': this.handleMyTrades,
            // 'user.openapi.perp.trade': this.handleMyTrades,
        };
        const keys = Object.keys(methods);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (topic.indexOf(keys[i]) >= 0) {
                const method = methods[key];
                method.call(this, client, message);
                return;
            }
        }
        // unified auth acknowledgement
        // const type = this.safeString (message, 'type');
        // if ((op === 'auth') || (type === 'AUTH_RESP')) {
        //     this.handleAuthenticate (client, message);
        // }
    }
    ping(client) {
        this.client(this.urls['api']['ws']).send('Ping');
        return {
            'ping': this.uuid(),
            'time': this.iso8601(this.milliseconds()),
        }; // XD
    }
    sendPong(client, message) {
        this.client(this.urls['api']['ws']).send('Pong');
        this.client(this.urls['api']['ws']).send(this.json({
            'ping': this.uuid(),
            'time': this.iso8601(this.milliseconds()),
        }));
    }
    handleAuthenticate(client, message) {
        //
        //    {
        //        success: true,
        //        ret_msg: '',
        //        op: 'auth',
        //        conn_id: 'ce3dpomvha7dha97tvp0-2xh'
        //    }
        //
        const success = this.safeValue(message, 'success');
        const messageHash = 'authenticated';
        if (success) {
            client.resolve(message, messageHash);
        }
        else {
            const error = new errors.AuthenticationError(this.id + ' ' + this.json(message));
            client.reject(error, messageHash);
            if (messageHash in client.subscriptions) {
                delete client.subscriptions[messageHash];
            }
        }
        return message;
    }
    handleSubscriptionStatus(client, message) {
        //
        //    {
        //        topic: 'kline',
        //        event: 'sub',
        //        params: {
        //          symbol: 'LTCUSDT',
        //          binary: 'false',
        //          klineType: '1m',
        //          symbolName: 'LTCUSDT'
        //        },
        //        code: '0',
        //        msg: 'Success'
        //    }
        //
        return message;
    }
    async watchTicker(symbol, params = {}) {
        /**
         * @method
         * @name bybit#watchTicker
         * @description watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @see https://bybit-exchange.github.io/docs/v5/websocket/public/ticker
         * @see https://bybit-exchange.github.io/docs/v5/websocket/public/etp-ticker
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} params extra parameters specific to the bybit api endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const messageHash = 'ticker:' + market['symbol'];
        const url = this.urls['api']['ws'];
        params = this.cleanParams(params);
        const topics = ['market.contracts'];
        return await this.watchTopics(url, messageHash, topics, params);
    }
    handleTicker(client, message) {
        const data = this.safeValue(message, 'data', {});
        const contracts = this.safeValue(data, 'contracts', []);
        for (let i = 0; i < contracts.length; i++) {
            let symbol = undefined;
            let parsed = undefined;
            parsed = this.parseTicker(contracts[i]);
            symbol = parsed['symbol'];
            const timestamp = this.milliseconds() - 0;
            parsed['timestamp'] = timestamp;
            parsed['datetime'] = this.iso8601(timestamp);
            this.tickers[symbol] = parsed;
            const messageHash = 'ticker:' + symbol;
            client.resolve(this.tickers[symbol], messageHash);
        }
    }
    parseTicker(ticker, market = undefined) {
        const timestamp = this.milliseconds() - 0;
        const marketId = this.safeString(ticker, 'symbol');
        market = this.safeMarket(marketId);
        const symbol = this.safeSymbol(marketId);
        const last = this.safeString(ticker, 'indexPrice');
        const open = this.safeString(ticker, 'open');
        const percentage = this.safeString(ticker, 'changePercentage');
        // const quoteVolume = this.safeString (ticker, 'volume2');
        // const baseVolume = this.safeString (ticker, 'volume');
        const bid = this.safeString(ticker, 'indexPrice');
        const ask = this.safeString(ticker, 'indexPrice');
        const high = this.safeString(ticker, 'high');
        const low = this.safeString(ticker, 'low');
        return this.safeTicker({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': high,
            'low': low,
            'bid': bid,
            'bidVolume': this.safeString2(ticker, 'bidSize', 'bid1Size'),
            'ask': ask,
            'askVolume': this.safeString2(ticker, 'askSize', 'ask1Size'),
            'vwap': undefined,
            'open': open,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': percentage,
            'average': undefined,
            'baseVolume': '0',
            'quoteVolume': '0',
            'info': ticker,
        }, market);
    }
}

module.exports = bingx;
