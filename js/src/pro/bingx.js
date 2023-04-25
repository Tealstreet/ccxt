//  ---------------------------------------------------------------------------
import bingxRest from '../bingx.js';
import { AuthenticationError, ExchangeError, BadRequest } from '../base/errors.js';
import { ArrayCache, ArrayCacheBySymbolById } from '../base/ws/Cache.js';
//  ---------------------------------------------------------------------------
export default class bingx extends bingxRest {
    describe() {
        return this.deepExtend(super.describe(), {
            'has': {
                'ws': true,
                'watchBalance': true,
                'watchMyTrades': true,
                'watchOHLCV': false,
                'watchOrderBook': true,
                'watchOrders': true,
                'watchTicker': false,
                'watchTickers': false,
                'watchTrades': true,
                'watchPosition': undefined,
            },
            'urls': {
                'api': {
                    'ws': 'wss://ws-market-swap.we-api.com/ws',
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
                throw new BadRequest(this.id + ' watchOrderBook() can only use limit 1, 50, 200 and 500.');
            }
        }
        const topics = ['market.depth.' + market['id'] + '.step0.level' + limit.toString()];
        const orderbook = await this.watchTopics(url, messageHash, topics, params);
        return orderbook.limit();
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
        return this.filterBySinceLimit(trades, since, limit, 'timestamp', true);
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
        const trades = this.isArray(data.trades) ? data.trades.reverse() : [];
        const parts = topic.split('.');
        const marketId = this.safeString(parts, 3);
        const market = this.safeMarket(marketId);
        const symbol = market['symbol'];
        let stored = this.safeValue(this.trades, symbol);
        if (stored === undefined) {
            const limit = this.safeInteger(this.options, 'tradesLimit', 1000);
            stored = new ArrayCache(limit);
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
        const amount = this.safeString(trade, 'volume');
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
            'amount': amount,
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
    async watchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name bingx#watchMyTrades
         * @description watches information on multiple trades made by the user
         * @see https://bingx-exchange.github.io/docs/v5/websocket/private/execution
         * @param {string} symbol unified market symbol of the market orders were made in
         * @param {int|undefined} since the earliest time in ms to fetch orders for
         * @param {int|undefined} limit the maximum number of  orde structures to retrieve
         * @param {object} params extra parameters specific to the bingx api endpoint
         * @param {boolean} params.unifiedMargin use unified margin account
         * @returns {[object]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure
         */
        let messageHash = 'myTrades';
        await this.loadMarkets();
        if (symbol !== undefined) {
            symbol = this.symbol(symbol);
            messageHash += ':' + symbol;
        }
        const url = this.urls['api']['ws'];
        await this.authenticate(url);
        const topicByMarket = {
            'spot': 'ticketInfo',
            'unified': 'execution',
            'usdc': 'user.openapi.perp.trade',
        };
        const topic = this.safeValue(topicByMarket, this.getPrivateType(url));
        const trades = await this.watchTopics(url, messageHash, [topic], params);
        if (this.newUpdates) {
            limit = trades.getLimit(symbol, limit);
        }
        return this.filterBySinceLimit(trades, since, limit, 'timestamp', true);
    }
    handleMyTrades(client, message) {
        //
        // spot
        //    {
        //        "type": "snapshot",
        //        "topic": "ticketInfo",
        //        "ts": "1662348310388",
        //        "data": [
        //            {
        //                "e": "ticketInfo",
        //                "E": "1662348310386",
        //                "s": "BTCUSDT",
        //                "q": "0.001007",
        //                "t": "1662348310373",
        //                "p": "19842.02",
        //                "T": "2100000000002220938",
        //                "o": "1238261807653647872",
        //                "c": "spotx008",
        //                "O": "1238225004531834368",
        //                "a": "533287",
        //                "A": "642908",
        //                "m": false,
        //                "S": "BUY"
        //            }
        //        ]
        //    }
        // unified
        //     {
        //         "id": "592324803b2785-26fa-4214-9963-bdd4727f07be",
        //         "topic": "execution",
        //         "creationTime": 1672364174455,
        //         "data": [
        //             {
        //                 "category": "linear",
        //                 "symbol": "XRPUSDT",
        //                 "execFee": "0.005061",
        //                 "execId": "7e2ae69c-4edf-5800-a352-893d52b446aa",
        //                 "execPrice": "0.3374",
        //                 "execQty": "25",
        //                 "execType": "Trade",
        //                 "execValue": "8.435",
        //                 "isMaker": false,
        //                 "feeRate": "0.0006",
        //                 "tradeIv": "",
        //                 "markIv": "",
        //                 "blockTradeId": "",
        //                 "markPrice": "0.3391",
        //                 "indexPrice": "",
        //                 "underlyingPrice": "",
        //                 "leavesQty": "0",
        //                 "orderId": "f6e324ff-99c2-4e89-9739-3086e47f9381",
        //                 "orderLinkId": "",
        //                 "orderPrice": "0.3207",
        //                 "orderQty": "25",
        //                 "orderType": "Market",
        //                 "stopOrderType": "UNKNOWN",
        //                 "side": "Sell",
        //                 "execTime": "1672364174443",
        //                 "isLeverage": "0"
        //             }
        //         ]
        //     }
        //
        const topic = this.safeString(message, 'topic');
        const spot = topic === 'ticketInfo';
        let data = this.safeValue(message, 'data', []);
        if (!Array.isArray(data)) {
            data = this.safeValue(data, 'result', []);
        }
        if (this.myTrades === undefined) {
            const limit = this.safeInteger(this.options, 'tradesLimit', 1000);
            this.myTrades = new ArrayCacheBySymbolById(limit);
        }
        const trades = this.myTrades;
        const symbols = {};
        const method = spot ? 'parseWsTrade' : 'parseTrade';
        for (let i = 0; i < data.length; i++) {
            const rawTrade = data[i];
            const parsed = this[method](rawTrade);
            const symbol = parsed['symbol'];
            symbols[symbol] = true;
            trades.append(parsed);
        }
        const keys = Object.keys(symbols);
        for (let i = 0; i < keys.length; i++) {
            const messageHash = 'myTrades:' + keys[i];
            client.resolve(trades, messageHash);
        }
        // non-symbol specific
        const messageHash = 'myTrades';
        client.resolve(trades, messageHash);
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
        await this.authenticate(url);
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
            this.orders = new ArrayCacheBySymbolById(limit);
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
    async watchBalance(params = {}) {
        /**
         * @method
         * @name bingx#watchBalance
         * @description query for balance and get the amount of funds available for trading or funds locked in orders
         * @see https://bingx-exchange.github.io/docs/v5/websocket/private/wallet
         * @param {object} params extra parameters specific to the bingx api endpoint
         * @returns {object} a [balance structure]{@link https://docs.ccxt.com/en/latest/manual.html?#balance-structure}
         */
        await this.loadMarkets();
        let messageHash = 'balances';
        let type = undefined;
        [type, params] = this.handleMarketTypeAndParams('watchBalance', undefined, params);
        let subType = undefined;
        [subType, params] = this.handleSubTypeAndParams('watchBalance', undefined, params);
        const isUnifiedMargin = false;
        const isUnifiedAccount = false;
        const url = this.urls['api']['ws'];
        await this.authenticate(url);
        const topicByMarket = {
            'spot': 'outboundAccountInfo',
            'unified': 'wallet',
        };
        if (isUnifiedAccount) {
            // unified account
            if (subType === 'inverse') {
                messageHash += ':contract';
            }
            else {
                messageHash += ':unified';
            }
        }
        if (!isUnifiedMargin && !isUnifiedAccount) {
            // normal account using v5
            if (type === 'spot') {
                messageHash += ':spot';
            }
            else {
                messageHash += ':contract';
            }
        }
        if (isUnifiedMargin) {
            // unified margin account using v5
            if (type === 'spot') {
                messageHash += ':spot';
            }
            else {
                if (subType === 'linear') {
                    messageHash += ':unified';
                }
                else {
                    messageHash += ':contract';
                }
            }
        }
        const topics = [this.safeValue(topicByMarket, this.getPrivateType(url))];
        return await this.watchTopics(url, messageHash, topics, params);
    }
    handleBalance(client, message) {
        //
        // spot
        //    {
        //        "type": "snapshot",
        //        "topic": "outboundAccountInfo",
        //        "ts": "1662107217641",
        //        "data": [
        //            {
        //                "e": "outboundAccountInfo",
        //                "E": "1662107217640",
        //                "T": true,
        //                "W": true,
        //                "D": true,
        //                "B": [
        //                    {
        //                        "a": "USDT",
        //                        "f": "176.81254174",
        //                        "l": "201.575"
        //                    }
        //                ]
        //            }
        //        ]
        //    }
        // unified
        //     {
        //         "id": "5923242c464be9-25ca-483d-a743-c60101fc656f",
        //         "topic": "wallet",
        //         "creationTime": 1672364262482,
        //         "data": [
        //             {
        //                 "accountIMRate": "0.016",
        //                 "accountMMRate": "0.003",
        //                 "totalEquity": "12837.78330098",
        //                 "totalWalletBalance": "12840.4045924",
        //                 "totalMarginBalance": "12837.78330188",
        //                 "totalAvailableBalance": "12632.05767702",
        //                 "totalPerpUPL": "-2.62129051",
        //                 "totalInitialMargin": "205.72562486",
        //                 "totalMaintenanceMargin": "39.42876721",
        //                 "coin": [
        //                     {
        //                         "coin": "USDC",
        //                         "equity": "200.62572554",
        //                         "usdValue": "200.62572554",
        //                         "walletBalance": "201.34882644",
        //                         "availableToWithdraw": "0",
        //                         "availableToBorrow": "1500000",
        //                         "borrowAmount": "0",
        //                         "accruedInterest": "0",
        //                         "totalOrderIM": "0",
        //                         "totalPositionIM": "202.99874213",
        //                         "totalPositionMM": "39.14289747",
        //                         "unrealisedPnl": "74.2768991",
        //                         "cumRealisedPnl": "-209.1544627",
        //                         "bonus": "0"
        //                     },
        //                     {
        //                         "coin": "BTC",
        //                         "equity": "0.06488393",
        //                         "usdValue": "1023.08402268",
        //                         "walletBalance": "0.06488393",
        //                         "availableToWithdraw": "0.06488393",
        //                         "availableToBorrow": "2.5",
        //                         "borrowAmount": "0",
        //                         "accruedInterest": "0",
        //                         "totalOrderIM": "0",
        //                         "totalPositionIM": "0",
        //                         "totalPositionMM": "0",
        //                         "unrealisedPnl": "0",
        //                         "cumRealisedPnl": "0",
        //                         "bonus": "0"
        //                     },
        //                     {
        //                         "coin": "ETH",
        //                         "equity": "0",
        //                         "usdValue": "0",
        //                         "walletBalance": "0",
        //                         "availableToWithdraw": "0",
        //                         "availableToBorrow": "26",
        //                         "borrowAmount": "0",
        //                         "accruedInterest": "0",
        //                         "totalOrderIM": "0",
        //                         "totalPositionIM": "0",
        //                         "totalPositionMM": "0",
        //                         "unrealisedPnl": "0",
        //                         "cumRealisedPnl": "0",
        //                         "bonus": "0"
        //                     },
        //                     {
        //                         "coin": "USDT",
        //                         "equity": "11726.64664904",
        //                         "usdValue": "11613.58597018",
        //                         "walletBalance": "11728.54414904",
        //                         "availableToWithdraw": "11723.92075829",
        //                         "availableToBorrow": "2500000",
        //                         "borrowAmount": "0",
        //                         "accruedInterest": "0",
        //                         "totalOrderIM": "0",
        //                         "totalPositionIM": "2.72589075",
        //                         "totalPositionMM": "0.28576575",
        //                         "unrealisedPnl": "-1.8975",
        //                         "cumRealisedPnl": "0.64782276",
        //                         "bonus": "0"
        //                     },
        //                     {
        //                         "coin": "EOS3L",
        //                         "equity": "215.0570412",
        //                         "usdValue": "0",
        //                         "walletBalance": "215.0570412",
        //                         "availableToWithdraw": "215.0570412",
        //                         "availableToBorrow": "0",
        //                         "borrowAmount": "0",
        //                         "accruedInterest": "",
        //                         "totalOrderIM": "0",
        //                         "totalPositionIM": "0",
        //                         "totalPositionMM": "0",
        //                         "unrealisedPnl": "0",
        //                         "cumRealisedPnl": "0",
        //                         "bonus": "0"
        //                     },
        //                     {
        //                         "coin": "BIT",
        //                         "equity": "1.82",
        //                         "usdValue": "0.48758257",
        //                         "walletBalance": "1.82",
        //                         "availableToWithdraw": "1.82",
        //                         "availableToBorrow": "0",
        //                         "borrowAmount": "0",
        //                         "accruedInterest": "",
        //                         "totalOrderIM": "0",
        //                         "totalPositionIM": "0",
        //                         "totalPositionMM": "0",
        //                         "unrealisedPnl": "0",
        //                         "cumRealisedPnl": "0",
        //                         "bonus": "0"
        //                     }
        //                 ],
        //                 "accountType": "UNIFIED"
        //             }
        //         ]
        //     }
        //
        if (this.balance === undefined) {
            this.balance = {};
        }
        let messageHash = 'balance';
        const topic = this.safeValue(message, 'topic');
        let info = undefined;
        let rawBalances = [];
        let account = undefined;
        if (topic === 'outboundAccountInfo') {
            account = 'spot';
            const data = this.safeValue(message, 'data', []);
            for (let i = 0; i < data.length; i++) {
                const B = this.safeValue(data[i], 'B', []);
                rawBalances = this.arrayConcat(rawBalances, B);
            }
            info = rawBalances;
        }
        if (topic === 'wallet') {
            const data = this.safeValue(message, 'data', {});
            for (let i = 0; i < data.length; i++) {
                const result = this.safeValue(data, 0, {});
                account = this.safeStringLower(result, 'accountType');
                rawBalances = this.arrayConcat(rawBalances, this.safeValue(result, 'coin', []));
            }
            info = data;
        }
        for (let i = 0; i < rawBalances.length; i++) {
            this.parseWsBalance(rawBalances[i], account);
        }
        if (account !== undefined) {
            if (this.safeValue(this.balance, account) === undefined) {
                this.balance[account] = {};
            }
            this.balance[account]['info'] = info;
            const timestamp = this.safeInteger(message, 'ts');
            this.balance[account]['timestamp'] = timestamp;
            this.balance[account]['datetime'] = this.iso8601(timestamp);
            this.balance[account] = this.safeBalance(this.balance[account]);
            messageHash = 'balances:' + account;
            client.resolve(this.balance[account], messageHash);
        }
        else {
            this.balance['info'] = info;
            const timestamp = this.safeInteger(message, 'ts');
            this.balance['timestamp'] = timestamp;
            this.balance['datetime'] = this.iso8601(timestamp);
            this.balance = this.safeBalance(this.balance);
            messageHash = 'balances';
            client.resolve(this.balance, messageHash);
        }
    }
    parseWsBalance(balance, accountType = undefined) {
        //
        // spot
        //    {
        //        "a": "USDT",
        //        "f": "176.81254174",
        //        "l": "201.575"
        //    }
        // unified
        //     {
        //         "coin": "BTC",
        //         "equity": "0.06488393",
        //         "usdValue": "1023.08402268",
        //         "walletBalance": "0.06488393",
        //         "availableToWithdraw": "0.06488393",
        //         "availableToBorrow": "2.5",
        //         "borrowAmount": "0",
        //         "accruedInterest": "0",
        //         "totalOrderIM": "0",
        //         "totalPositionIM": "0",
        //         "totalPositionMM": "0",
        //         "unrealisedPnl": "0",
        //         "cumRealisedPnl": "0",
        //         "bonus": "0"
        //     }
        //
        const account = this.account();
        const currencyId = this.safeString2(balance, 'a', 'coin');
        const code = this.safeCurrencyCode(currencyId);
        account['free'] = this.safeStringN(balance, ['availableToWithdraw', 'f', 'free', 'availableToWithdraw']);
        account['used'] = this.safeString2(balance, 'l', 'locked');
        account['total'] = this.safeString(balance, 'walletBalance');
        if (accountType !== undefined) {
            if (this.safeValue(this.balance, accountType) === undefined) {
                this.balance[accountType] = {};
            }
            this.balance[accountType][code] = account;
        }
        else {
            this.balance[code] = account;
        }
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
    authenticate(url, params = {}) {
        this.checkRequiredCredentials();
        const messageHash = 'authenticated';
        const client = this.client(url);
        let future = this.safeValue(client.subscriptions, messageHash);
        if (future === undefined) {
            const expiresInt = this.milliseconds() + 10000;
            const expires = expiresInt.toString();
            const path = 'GET/realtime';
            const auth = path + expires;
            const signature = this.hmac(this.encode(auth), this.encode(this.secret), 'sha256', 'hex');
            const request = {
                'op': 'auth',
                'args': [
                    this.apiKey, expires, signature,
                ],
            };
            const message = this.extend(request, params);
            future = this.watch(url, messageHash, message);
            client.subscriptions[messageHash] = future;
        }
        return future;
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
                throw new ExchangeError(feedback);
            }
            const success = this.safeValue(message, 'success');
            if (success !== undefined && !success) {
                const ret_msg = this.safeString(message, 'ret_msg');
                const request = this.safeValue(message, 'request', {});
                const op = this.safeString(request, 'op');
                if (op === 'auth') {
                    throw new AuthenticationError('Authentication failed: ' + ret_msg);
                }
                else {
                    throw new ExchangeError(this.id + ' ' + ret_msg);
                }
            }
            return false;
        }
        catch (error) {
            if (error instanceof AuthenticationError) {
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
            const error = new AuthenticationError(this.id + ' ' + this.json(message));
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
}
