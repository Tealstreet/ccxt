<?php

namespace ccxt\pro;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

use Exception; // a common import
use ccxt\ExchangeError;
use ccxt\BadRequest;
use ccxt\AuthenticationError;
use React\Async;

class bingx extends \ccxt\async\bingx {

    public function describe() {
        return $this->deep_extend(parent::describe(), array(
            'has' => array(
                'ws' => true,
                'watchBalance' => false,
                'watchMyTrades' => false,
                'watchOHLCV' => false,
                'watchOrderBook' => true,
                'watchOrders' => true,
                'watchTicker' => true,
                'watchTickers' => false, // for now
                'watchTrades' => true,
                'watchPosition' => null,
            ),
            'urls' => array(
                'api' => array(
                    'ws' => 'wss://ws-market-swap.we-api.com/ws',
                    'ws2' => 'wss://open-api-swap.bingx.com/swap-market',
                ),
            ),
            'options' => array(
                'wsTimeFrames' => array(
                    '1m' => '1min',
                    '3m' => '3min',
                    '5m' => '5min',
                    '15m' => '15min',
                    '30m' => '30min',
                    '1h' => '1hour',
                    '2h' => '2hour',
                    '4h' => '4hour',
                    '6h' => '6hour',
                    '12h' => '12hour',
                    '1d' => '1day',
                    '1w' => '1week',
                    '1M' => '1month',
                ),
                'spot' => array(
                    'timeframes' => array(
                        '1m' => '1m',
                        '3m' => '3m',
                        '5m' => '5m',
                        '15m' => '15m',
                        '30m' => '30m',
                        '1h' => '1h',
                        '2h' => '2h',
                        '4h' => '4h',
                        '6h' => '6h',
                        '12h' => '12h',
                        '1d' => '1d',
                        '1w' => '1w',
                        '1M' => '1M',
                    ),
                ),
                'contract' => array(
                    'timeframes' => array(
                        '1m' => '1',
                        '3m' => '3',
                        '5m' => '5',
                        '15m' => '15',
                        '30m' => '30',
                        '1h' => '60',
                        '2h' => '120',
                        '4h' => '240',
                        '6h' => '360',
                        '12h' => '720',
                        '1d' => 'D',
                        '1w' => 'W',
                        '1M' => 'M',
                    ),
                ),
            ),
            'streaming' => array(
                'ping' => array($this, 'ping'),
                'keepAlive' => 20000,
            ),
            'exceptions' => array(
                'ws' => array(
                    'exact' => array(
                    ),
                ),
            ),
        ));
    }

    public function request_id() {
        $requestId = $this->sum($this->safe_integer($this->options, 'requestId', 0), 1);
        $this->options['requestId'] = $requestId;
        return $requestId;
    }

    public function clean_params($params) {
        $params = $this->omit($params, array( 'type', 'subType', 'settle', 'defaultSettle', 'unifiedMargin' ));
        return $params;
    }

    public function watch_order_book($symbol, $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $limit, $params) {
            /**
             * watches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
             * @see https://bingx-exchange.github.io/docs/v5/websocket/public/orderbook
             * @param {string} $symbol unified $symbol of the $market to fetch the order book for
             * @param {int|null} $limit the maximum amount of order book entries to return.
             * @param {array} $params extra parameters specific to the bingx api endpoint
             * @return {array} A dictionary of ~@link https://docs.ccxt.com/#/?id=order-book-structure order book structures~ indexed by $market symbols
             */
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $symbol = $market['symbol'];
            $url = $this->urls['api']['ws'];
            $params = $this->clean_params($params);
            $messageHash = 'orderbook' . ':' . $symbol;
            if ($limit === null) {
                $limit = 100;
            } else {
                if (($limit !== 5) && ($limit !== 10) && ($limit !== 20) && ($limit !== 50) && ($limit !== 100)) {
                    throw new BadRequest($this->id . ' watchOrderBook() can only use $limit 1, 50, 200 and 500.');
                }
            }
            $topics = [ 'market.depth.' . $market['id'] . '.step0.level' . (string) $limit ];
            $orderbook = Async\await($this->watch_topics($url, $messageHash, $topics, $params, false));
            // return $orderbook->limit ();
            return $orderbook;
        }) ();
    }

    public function handle_order_book($client, $message) {
        $data = $this->safe_value($message, 'data', array());
        $dataType = $this->safe_value($message, 'dataType', '');
        $parts = explode('.', $dataType);
        $marketId = $this->safe_string($parts, 2);
        $market = $this->safe_market($marketId);
        $symbol = $market['symbol'];
        $latestTrade = $this->safe_value($data, 'latestTrade', array());
        $timestamp = $this->safe_integer($latestTrade, 'rawTs');
        // $orderbook = $this->safe_value($this->orderbooks, $symbol);
        // if ($orderbook === null) {
        //     $orderbook = $this->order_book(array(), 100);
        // }
        $orderbook = $this->order_book();
        $asks = $this->safe_value($data, 'asks', array());
        $bids = $this->safe_value($data, 'bids', array());
        $this->handle_deltas($orderbook['asks'], $asks);
        $this->handle_deltas($orderbook['bids'], $bids);
        $orderbook['timestamp'] = $timestamp;
        $orderbook['datetime'] = $this->iso8601($timestamp);
        $messageHash = 'orderbook' . ':' . $symbol;
        $this->orderbooks[$symbol] = $orderbook;
        $client->resolve ($orderbook, $messageHash);
    }

    public function handle_delta($bookside, $delta) {
        $bidAsk = $this->parse_bid_ask($delta, 'price', 'volume');
        $bookside->storeArray ($bidAsk);
    }

    public function handle_deltas($bookside, $deltas) {
        for ($i = 0; $i < count($deltas); $i++) {
            $this->handle_delta($bookside, $deltas[$i]);
        }
    }

    public function handle_ohlcv($client, $message) {
        // {
        //     "code" => 0,
        //     "dataType" => "market.kline.1INCH-USDT.1hour.trade.utc+8",
        //     "data" => {
        //     "klineInfosVo" => array(
        //         {
        //             "time" => 1683982800000,
        //             "statDate" => "2023-05-13T21:00:00.000+0800",
        //             "open" => 0.4107,
        //             "close" => 0.4089,
        //             "high" => 0.4119,
        //             "low" => 0.4077,
        //             "volume" => 936484,
        //             "fairPrice" => 0
        //         }
        //     )
        // }
        // }
        $data = $this->safe_value($message, 'data', array());
        $topic = $this->safe_string($message, 'dataType');
        $parts = explode('.', $topic);
        $marketId = $this->safe_string($parts, 2);
        $market = $this->safe_market($marketId);
        $symbol = $market['symbol'];
        $candles = $this->safe_value($data, 'klineInfosVo', array());
        $wsTimeFrame = $this->safe_string($parts, 3);
        $wsTimeFrames = $this->safe_value($this->options, 'wsTimeFrames', array());
        $timeframe = $this->find_timeframe($wsTimeFrame, $wsTimeFrames);
        if ($timeframe !== null) {
            $messageHash = 'ohlcv' . ':' . $wsTimeFrame . ':' . $symbol;
            $ohlcvs = $this->parse_ohlcvs($candles, $market);
            $this->ohlcvs[$symbol] = $this->safe_value($this->ohlcvs, $symbol, array());
            $stored = $this->safe_value($this->ohlcvs[$symbol], $timeframe);
            if ($stored === null) {
                $limit = $this->safe_integer($this->options, 'OHLCVLimit', 1000);
                $stored = new ArrayCacheByTimestamp ($limit);
                $this->ohlcvs[$symbol][$timeframe] = $stored;
            }
            for ($i = 0; $i < count($ohlcvs); $i++) {
                $candle = $ohlcvs[$i];
                $stored->append ($candle);
            }
            $client->resolve ($stored, $messageHash);
        }
    }

    public function watch_ohlcv($symbol, $timeframe = '1m', $since = null, $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $timeframe, $since, $limit, $params) {
            /**
             * watches information on multiple trades made in a $market
             * @see https://bingx-exchange.github.io/docs/v5/websocket/public/trade
             * @param {string} $symbol unified $market $symbol of the $market orders were made in
             * @param {int|null} $since the earliest time in ms to fetch orders for
             * @param {int|null} $limit the maximum number of  orde structures to retrieve
             * @param {array} $params extra parameters specific to the bingx api endpoint
             * @return {[array]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure
             */
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $symbol = $market['symbol'];
            $url = $this->urls['api']['ws'];
            $params = $this->clean_params($params);
            $wsTimeframe = $this->safe_value($this->options['wsTimeFrames'], $timeframe, '1hour');
            $messageHash = 'ohlcv' . ':' . $wsTimeframe . ':' . $symbol;
            $topic = 'market.kline.' . $market['id'] . '.' . $wsTimeframe . '.trade.utc+8';
            $ohlcv = Async\await($this->watch_topics($url, $messageHash, array( $topic ), $params));
            if ($this->newUpdates) {
                $limit = $ohlcv->getLimit ($symbol, $limit);
            }
            return $this->filter_by_since_limit($ohlcv, $since, $limit, 0, true);
        }) ();
    }

    public function watch_trades($symbol, $since = null, $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $since, $limit, $params) {
            /**
             * watches information on multiple $trades made in a $market
             * @see https://bingx-exchange.github.io/docs/v5/websocket/public/trade
             * @param {string} $symbol unified $market $symbol of the $market orders were made in
             * @param {int|null} $since the earliest time in ms to fetch orders for
             * @param {int|null} $limit the maximum number of  orde structures to retrieve
             * @param {array} $params extra parameters specific to the bingx api endpoint
             * @return {[array]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure
             */
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $symbol = $market['symbol'];
            $url = $this->urls['api']['ws'];
            $params = $this->clean_params($params);
            $messageHash = 'trade:' . $symbol;
            $topic = 'market.trade.detail.' . $market['id'];
            $trades = Async\await($this->watch_topics($url, $messageHash, array( $topic ), $params, false));
            if ($this->newUpdates) {
                $limit = $trades->getLimit ($symbol, $limit);
            }
            // $since BingX always returns duplicate set of klines via ws, and we are not sending $since from
            // ts client, emulate it
            $tradesSince = null;
            if ($this->options['tradesSince'] !== null) {
                $tradesSince = $this->options['tradesSince'];
            }
            $newTrades = $this->filter_by_since_limit($trades, $tradesSince, $limit, 'timestamp', true);
            $this->options = array_merge($this->options, array( 'tradesSince' => $this->milliseconds() - 0 ));
            return $newTrades;
        }) ();
    }

    public function handle_trades($client, $message) {
        //
        //     {
        //         "topic" => "publicTrade.BTCUSDT",
        //         "type" => "snapshot",
        //         "ts" => 1672304486868,
        //         "data" => array(
        //             {
        //                 "T" => 1672304486865,
        //                 "s" => "BTCUSDT",
        //                 "S" => "Buy",
        //                 "v" => "0.001",
        //                 "p" => "16578.50",
        //                 "L" => "PlusTick",
        //                 "i" => "20f43950-d8dd-5b31-9112-a178eb6023af",
        //                 "BT" => false
        //             }
        //         )
        //     }
        //
        $data = $this->safe_value($message, 'data', array());
        $topic = $this->safe_string($message, 'dataType');
        $trades = array();
        if ($this->is_array($data->trades)) {
            $trades = $data->trades.reverse ();
        }
        $parts = explode('.', $topic);
        $marketId = $this->safe_string($parts, 3);
        $market = $this->safe_market($marketId);
        $symbol = $market['symbol'];
        $stored = $this->safe_value($this->trades, $symbol);
        if ($stored === null) {
            $limit = $this->safe_integer($this->options, 'tradesLimit', 1000);
            $stored = new ArrayCache ($limit);
            $this->trades[$symbol] = $stored;
        }
        for ($j = 0; $j < count($trades); $j++) {
            $parsed = $this->parse_ws_trade($trades[$j], $market);
            $stored->append ($parsed);
        }
        $messageHash = 'trade' . ':' . $symbol;
        $client->resolve ($stored, $messageHash);
    }

    public function parse_ws_trade($trade, $market = null) {
        //
        // public
        //    {
        // makerSide
        // "Ask"
        // $price
        // "27563.5"
        // time
        // "03:06:43"
        // volume
        // "0.2312"
        //     }
        //
        $symbol = $market['symbol'];
        $timestamp = $this->safe_integer($trade, 'rawTs');
        $id = '' . $timestamp;
        $m = $this->safe_value($trade, 'makerSide');
        $side = $m ? 'Bid' : 'Ask';
        $price = $this->safe_string($trade, 'price');
        $amount = $this->safe_float($trade, 'volume');
        return $this->safe_trade(array(
            'id' => $id,
            'info' => $trade,
            'timestamp' => $timestamp,
            'datetime' => $this->iso8601($timestamp),
            'symbol' => $symbol,
            'order' => null,
            'type' => null,
            'side' => $side,
            'takerOrMaker' => 'taker',
            'price' => $price,
            'amount' => $amount * $market['contractSize'],
            'cost' => null,
            'fee' => null,
        ), $market);
    }

    public function get_private_type($url) {
        if (mb_strpos($url, 'spot') !== false) {
            return 'spot';
        } elseif (mb_strpos($url, 'v5/private') !== false) {
            return 'unified';
        } else {
            return 'usdc';
        }
    }

    public function watch_orders($symbol = null, $since = null, $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $since, $limit, $params) {
            /**
             * watches information on multiple $orders made by the user
             * @see https://bingx-exchange.github.io/docs/v5/websocket/private/order
             * @param {string|null} $symbol unified market $symbol of the market $orders were made in
             * @param {int|null} $since the earliest time in ms to fetch $orders for
             * @param {int|null} $limit the maximum number of  orde structures to retrieve
             * @param {array} $params extra parameters specific to the bingx api endpoint
             * @return {[array]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure
             */
            Async\await($this->load_markets());
            $messageHash = 'orders';
            if ($symbol !== null) {
                $symbol = $this->symbol($symbol);
                $messageHash .= ':' . $symbol;
            }
            $url = $this->urls['api']['ws'];
            Async\await($this->authenticate());
            $topicsByMarket = array(
                'spot' => array( 'order', 'stopOrder' ),
                'unified' => array( 'order' ),
                'usdc' => array( 'user.openapi.perp.order' ),
            );
            $topics = $this->safe_value($topicsByMarket, $this->get_private_type($url));
            $orders = Async\await($this->watch_topics($url, $messageHash, $topics, $params));
            if ($this->newUpdates) {
                $limit = $orders->getLimit ($symbol, $limit);
            }
            return $this->filter_by_symbol_since_limit($orders, $symbol, $since, $limit, true);
        }) ();
    }

    public function handle_order($client, $message, $subscription = null) {
        //
        //     spot
        //     {
        //         "type" => "snapshot",
        //         "topic" => "order",
        //         "ts" => "1662348310441",
        //         "data" => array(
        //             {
        //                 "e" => "order",
        //                 "E" => "1662348310441",
        //                 "s" => "BTCUSDT",
        //                 "c" => "spotx008",
        //                 "S" => "BUY",
        //                 "o" => "MARKET_OF_QUOTE",
        //                 "f" => "GTC",
        //                 "q" => "20",
        //                 "p" => "0",
        //                 "X" => "CANCELED",
        //                 "i" => "1238261807653647872",
        //                 "M" => "1238225004531834368",
        //                 "l" => "0.001007",
        //                 "z" => "0.001007",
        //                 "L" => "19842.02",
        //                 "n" => "0",
        //                 "N" => "BTC",
        //                 "u" => true,
        //                 "w" => true,
        //                 "m" => false,
        //                 "O" => "1662348310368",
        //                 "Z" => "19.98091414",
        //                 "A" => "0",
        //                 "C" => false,
        //                 "v" => "0",
        //                 "d" => "NO_LIQ",
        //                 "t" => "2100000000002220938"
        //             }
        //         )
        //     }
        // unified
        //     {
        //         "id" => "5923240c6880ab-c59f-420b-9adb-3639adc9dd90",
        //         "topic" => "order",
        //         "creationTime" => 1672364262474,
        //         "data" => array(
        //             {
        //                 "symbol" => "ETH-30DEC22-1400-C",
        //                 "orderId" => "5cf98598-39a7-459e-97bf-76ca765ee020",
        //                 "side" => "Sell",
        //                 "orderType" => "Market",
        //                 "cancelType" => "UNKNOWN",
        //                 "price" => "72.5",
        //                 "qty" => "1",
        //                 "orderIv" => "",
        //                 "timeInForce" => "IOC",
        //                 "orderStatus" => "Filled",
        //                 "orderLinkId" => "",
        //                 "lastPriceOnCreated" => "",
        //                 "reduceOnly" => false,
        //                 "leavesQty" => "",
        //                 "leavesValue" => "",
        //                 "cumExecQty" => "1",
        //                 "cumExecValue" => "75",
        //                 "avgPrice" => "75",
        //                 "blockTradeId" => "",
        //                 "positionIdx" => 0,
        //                 "cumExecFee" => "0.358635",
        //                 "createdTime" => "1672364262444",
        //                 "updatedTime" => "1672364262457",
        //                 "rejectReason" => "EC_NoError",
        //                 "stopOrderType" => "",
        //                 "triggerPrice" => "",
        //                 "takeProfit" => "",
        //                 "stopLoss" => "",
        //                 "tpTriggerBy" => "",
        //                 "slTriggerBy" => "",
        //                 "triggerDirection" => 0,
        //                 "triggerBy" => "",
        //                 "closeOnTrigger" => false,
        //                 "category" => "option"
        //             }
        //         )
        //     }
        //
        if ($this->orders === null) {
            $limit = $this->safe_integer($this->options, 'ordersLimit', 1000);
            $this->orders = new ArrayCacheBySymbolById ($limit);
        }
        $orders = $this->orders;
        $rawOrders = array();
        $parser = null;
        $parser = 'parseContractOrder';
        $rawOrders = $this->safe_value($message, 'data', array());
        $rawOrders = $this->safe_value($rawOrders, 'result', $rawOrders);
        $symbols = array();
        for ($i = 0; $i < count($rawOrders); $i++) {
            $parsed = $this->$parser ($rawOrders[$i]);
            $symbol = $parsed['symbol'];
            $symbols[$symbol] = true;
            $orders->append ($parsed);
        }
        $symbolsArray = is_array($symbols) ? array_keys($symbols) : array();
        for ($i = 0; $i < count($symbolsArray); $i++) {
            $messageHash = 'orders:' . $symbolsArray[$i];
            $client->resolve ($orders, $messageHash);
        }
        $messageHash = 'orders';
        $client->resolve ($orders, $messageHash);
    }

    public function watch_topics($url, $messageHash, $topics = [], $params = array (), $shouldThrottle = true) {
        return Async\async(function () use ($url, $messageHash, $topics, $params, $shouldThrottle) {
            $request = array(
                'id' => '' . $this->request_id(),
                'reqType' => 'sub',
                'dataType' => $topics[0],
            );
            $message = array_merge($request, $params);
            return Async\await($this->watch($url, $messageHash, $message, $messageHash, $shouldThrottle));
        }) ();
    }

    public function authenticate($params = array ()) {
        return Async\async(function () use ($params) {
            // $this->check_required_credentials();
            // $messageHash = 'authenticated';
            // $url = $this->urls['api']['ws'];
            // $client = $this->client($url);
            // $future = $this->safe_value($client->subscriptions, $messageHash);
            // if ($future === null) {
            //     $request = array(
            //         'reqType' => 'req',
            //         'id' => $this->uuid(),
            //         'dataType' => 'account.user.auth',
            //         'data' => array(
            //             'token' => $this->apiKey . '.' . $this->secret,
            //             'platformId' => '30',
            //         ),
            //     );
            //     $message = array_merge($request, $params);
            //     $future = $this->watch($url, $messageHash, $message);
            //     $client->subscriptions[$messageHash] = $future;
            // }
            // return $future;
            $time = $this->milliseconds();
            $lastAuthenticatedTime = $this->safe_integer($this->options, 'lastAuthenticatedTime', 0);
            $listenKeyRefreshRate = $this->safe_integer($this->options, 'listenKeyRefreshRate', 1200000);
            $delay = $this->sum($listenKeyRefreshRate, 10000);
            if ($time - $lastAuthenticatedTime > $delay) {
                $method = 'swap2OpenApiPrivatePostUserAuthUserDataStream';
                $response = Async\await($this->$method ($params));
                $this->options = array_merge($this->options, array(
                    'listenKey' => $this->safe_string($response, 'listenKey'),
                    'lastAuthenticatedTime' => $time,
                ));
                $this->delay($listenKeyRefreshRate, array($this, 'keep_alive_listen_key'), $params);
            }
        }) ();
    }

    public function keep_alive_listen_key($params = array ()) {
        return Async\async(function () use ($params) {
            $listenKey = $this->safe_string($this->options, 'listenKey');
            if ($listenKey === null) {
                // A network $error happened => we can't renew a listen key that does not exist.
                return;
            }
            $method = 'swap2OpenApiPrivatePutUserAuthUserDataStream';
            $request = array(
                'listenKey' => $listenKey,
            );
            $time = $this->milliseconds();
            $sendParams = $this->omit($params, 'type');
            try {
                Async\await($this->$method (array_merge($request, $sendParams)));
            } catch (Exception $error) {
                $url = $this->urls['api']['ws2'] . '?' . $this->options['listenKey'];
                $client = $this->client($url);
                $messageHashes = is_array($client->futures) ? array_keys($client->futures) : array();
                for ($i = 0; $i < count($messageHashes); $i++) {
                    $messageHash = $messageHashes[$i];
                    $client->reject ($error, $messageHash);
                }
                $this->options = array_merge($this->options, array(
                    'listenKey' => null,
                    'lastAuthenticatedTime' => 0,
                ));
                return;
            }
            $this->options = array_merge($this->options, array(
                'listenKey' => $listenKey,
                'lastAuthenticatedTime' => $time,
            ));
            // whether or not to schedule another $listenKey keepAlive $request
            $listenKeyRefreshRate = $this->safe_integer($this->options, 'listenKeyRefreshRate', 1200000);
            return $this->delay($listenKeyRefreshRate, array($this, 'keep_alive_listen_key'), $params);
        }) ();
    }

    public function handle_error_message($client, $message) {
        //
        //   {
        //       $success => false,
        //       $ret_msg => 'error:invalid op',
        //       conn_id => '5e079fdd-9c7f-404d-9dbf-969d650838b5',
        //       $request => array( $op => '', args => null )
        //   }
        //
        // auth $error
        //
        //   {
        //       $success => false,
        //       $ret_msg => 'error:USVC1111',
        //       conn_id => 'e73770fb-a0dc-45bd-8028-140e20958090',
        //       $request => {
        //         $op => 'auth',
        //         args => array(
        //           '9rFT6uR4uz9Imkw4Wx',
        //           '1653405853543',
        //           '542e71bd85597b4db0290f0ce2d13ed1fd4bb5df3188716c1e9cc69a879f7889'
        //         )
        //   }
        //
        //   array( $code => '-10009', desc => 'Invalid period!' )
        //
        $code = $this->safe_integer($message, 'code');
        try {
            if ($code !== 0) {
                $feedback = $this->id . ' ' . $this->json($message);
                throw new ExchangeError($feedback);
            }
            $success = $this->safe_value($message, 'success');
            if ($success !== null && !$success) {
                $ret_msg = $this->safe_string($message, 'ret_msg');
                $request = $this->safe_value($message, 'request', array());
                $op = $this->safe_string($request, 'op');
                if ($op === 'auth') {
                    throw new AuthenticationError('Authentication failed => ' . $ret_msg);
                } else {
                    throw new ExchangeError($this->id . ' ' . $ret_msg);
                }
            }
            return false;
        } catch (Exception $error) {
            if ($error instanceof AuthenticationError) {
                $messageHash = 'authenticated';
                $client->reject ($error, $messageHash);
                if (is_array($client->subscriptions) && array_key_exists($messageHash, $client->subscriptions)) {
                    unset($client->subscriptions[$messageHash]);
                }
            } else {
                $client->reject ($error);
            }
            return true;
        }
    }

    public function handle_message($client, $message) {
        // pong
        if ($message === 'Ping' || $this->safe_string($message, 'ping', '') !== '') {
            return $this->send_pong($client, $message);
        }
        if ($message === 'Pong' || $this->safe_string($message, 'pong', '') !== '') {
            return $this->handle_pong($client, $message);
        }
        if ($this->handle_error_message($client, $message)) {
            return;
        }
        // $event = $this->safe_string($message, 'event');
        // if ($event === 'sub') {
        //     $this->handle_subscription_status($client, $message);
        //     return;
        // }
        $topic = $this->safe_string($message, 'dataType', '');
        $methods = array(
            // 'market.depth.' => array($this, 'handle_order_book'),
            // 'order' => array($this, 'handle_order'),
            // 'stopOrder' => array($this, 'handle_order'),
            // 'trade' => array($this, 'handle_trades'),
            // 'publicTrade' => array($this, 'handle_trades'),
            'market.depth.' => array($this, 'handle_order_book'),
            'market.trade.detail.' => array($this, 'handle_trades'),
            'market.contracts' => array($this, 'handle_ticker'),
            'market.kline' => array($this, 'handle_ohlcv'),
            // 'wallet' => $this->handleBalance,
            // 'outboundAccountInfo' => $this->handleBalance,
            // 'execution' => $this->handleMyTrades,
            // 'ticketInfo' => $this->handleMyTrades,
            // 'user.openapi.perp.trade' => $this->handleMyTrades,
        );
        $keys = is_array($methods) ? array_keys($methods) : array();
        for ($i = 0; $i < count($keys); $i++) {
            $key = $keys[$i];
            if (mb_strpos($topic, $keys[$i]) !== false) {
                $method = $methods[$key];
                $method($client, $message);
                return;
            }
        }
        // unified auth acknowledgement
        // $type = $this->safe_string($message, 'type');
        // if ((op === 'auth') || ($type === 'AUTH_RESP')) {
        //     $this->handle_authenticate($client, $message);
        // }
    }

    public function ping($client) {
        $this->client($this->urls['api']['ws']).send ('Ping');
        return array(
            'ping' => $this->uuid(),
            'time' => $this->iso8601($this->milliseconds()),
        ); // XD
    }

    public function send_pong($client, $message) {
        $this->client($this->urls['api']['ws']).send ('Pong');
        $this->client($this->urls['api']['ws']).send ($this->json(array(
            'ping' => $this->uuid(),
            'time' => $this->iso8601($this->milliseconds()),
        )));
    }

    public function handle_authenticate($client, $message) {
        //
        //    {
        //        $success => true,
        //        ret_msg => '',
        //        op => 'auth',
        //        conn_id => 'ce3dpomvha7dha97tvp0-2xh'
        //    }
        //
        $success = $this->safe_value($message, 'success');
        $messageHash = 'authenticated';
        if ($success) {
            $client->resolve ($message, $messageHash);
        } else {
            $error = new AuthenticationError ($this->id . ' ' . $this->json($message));
            $client->reject ($error, $messageHash);
            if (is_array($client->subscriptions) && array_key_exists($messageHash, $client->subscriptions)) {
                unset($client->subscriptions[$messageHash]);
            }
        }
        return $message;
    }

    public function handle_subscription_status($client, $message) {
        //
        //    {
        //        topic => 'kline',
        //        event => 'sub',
        //        params => array(
        //          symbol => 'LTCUSDT',
        //          binary => 'false',
        //          klineType => '1m',
        //          symbolName => 'LTCUSDT'
        //        ),
        //        code => '0',
        //        msg => 'Success'
        //    }
        //
        return $message;
    }

    public function watch_ticker($symbol, $params = array ()) {
        return Async\async(function () use ($symbol, $params) {
            /**
             * watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific $market
             * @see https://bybit-exchange.github.io/docs/v5/websocket/public/ticker
             * @see https://bybit-exchange.github.io/docs/v5/websocket/public/etp-ticker
             * @param {string} $symbol unified $symbol of the $market to fetch the ticker for
             * @param {array} $params extra parameters specific to the bybit api endpoint
             * @return {array} a ~@link https://docs.ccxt.com/#/?id=ticker-structure ticker structure~
             */
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $messageHash = 'ticker:' . $market['symbol'];
            $url = $this->urls['api']['ws'];
            $params = $this->clean_params($params);
            $topics = array( 'market.contracts' );
            return Async\await($this->watch_topics($url, $messageHash, $topics, $params));
        }) ();
    }

    public function handle_ticker($client, $message) {
        $data = $this->safe_value($message, 'data', array());
        $contracts = $this->safe_value($data, 'contracts', array());
        for ($i = 0; $i < count($contracts); $i++) {
            $symbol = null;
            $parsed = null;
            $parsed = $this->parse_ticker($contracts[$i]);
            $symbol = $parsed['symbol'];
            $timestamp = $this->milliseconds() - 0;
            $parsed['timestamp'] = $timestamp;
            $parsed['datetime'] = $this->iso8601($timestamp);
            $this->tickers[$symbol] = $parsed;
            $messageHash = 'ticker:' . $symbol;
            $client->resolve ($this->tickers[$symbol], $messageHash);
        }
    }

    public function parse_ticker($ticker, $market = null) {
        $timestamp = $this->milliseconds() - 0;
        $marketId = $this->safe_string($ticker, 'symbol');
        $market = $this->safe_market($marketId);
        $symbol = $this->safe_symbol($marketId);
        $last = $this->safe_string($ticker, 'tradePrice');
        $mark = $this->safe_string($ticker, 'fairPrice');
        $open = $this->safe_string($ticker, 'open');
        $percentage = $this->safe_string($ticker, 'changePercentage');
        // $quoteVolume = $this->safe_string($ticker, 'volume2');
        // $baseVolume = $this->safe_string($ticker, 'volume');
        $bid = $this->safe_string($ticker, 'tradePrice');
        $ask = $this->safe_string($ticker, 'tradePrice');
        $high = $this->safe_string($ticker, 'high');
        $low = $this->safe_string($ticker, 'low');
        return $this->safe_ticker(array(
            'symbol' => $symbol,
            'timestamp' => $timestamp,
            'datetime' => $this->iso8601($timestamp),
            'high' => $high,
            'low' => $low,
            'bid' => $bid,
            'bidVolume' => $this->safe_string_2($ticker, 'bidSize', 'bid1Size'),
            'ask' => $ask,
            'askVolume' => $this->safe_string_2($ticker, 'askSize', 'ask1Size'),
            'vwap' => null,
            'open' => $open,
            'close' => $last,
            'last' => $last,
            'mark' => $mark,
            'previousClose' => null,
            'change' => null,
            'percentage' => $percentage,
            'average' => null,
            'baseVolume' => '0',
            'quoteVolume' => '0',
            'info' => $ticker,
        ), $market);
    }
}
