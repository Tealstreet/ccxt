<?php

namespace ccxt\pro;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

use Exception; // a common import
use ccxt\AuthenticationError;
use ccxt\NotSupported;
use React\Async;

class aax extends \ccxt\async\aax {

    use ClientTrait;

    public function describe() {
        return $this->deep_extend(parent::describe(), array(
            'has' => array(
                'ws' => true,
                'watchOHLCV' => true,
                'watchOrderBook' => true,
                'watchTicker' => true,
                'watchTrades' => true,
                'watchBalance' => true,
                'watchOrders' => true,
            ),
            'urls' => array(
                'api' => array(
                    'ws' => array(
                        'public' => 'wss://realtime.aax.com/marketdata/v2/',
                        'private' => 'wss://stream.aax.com/notification/v2/',
                    ),
                ),
            ),
            'options' => array(
                'OHLCVLimit' => 1000,
                'tradesLimit' => 1000,
                'ordersLimit' => 1000,
                'myTradesLimit' => 1000,
            ),
        ));
    }

    public function watch_ohlcv($symbol, $timeframe = '1m', $since = null, $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $timeframe, $since, $limit, $params) {
            Async\await($this->load_markets());
            $name = 'candles';
            $market = $this->market($symbol);
            $symbol = $market['symbol'];
            $interval = $this->timeframes[$timeframe];
            $messageHash = $market['id'] . '@' . $interval . '_' . $name;
            $url = $this->urls['api']['ws']['public'];
            $subscribe = array(
                'e' => 'subscribe',
                'stream' => $messageHash,
            );
            $request = $this->deep_extend($subscribe, $params);
            $ohlcv = Async\await($this->watch($url, $messageHash, $request, $messageHash));
            if ($this->newUpdates) {
                $limit = $ohlcv->getLimit ($symbol, $limit);
            }
            return $this->filter_by_since_limit($ohlcv, $since, $limit, 0, true);
        }) ();
    }

    public function handle_ohlcv($client, $message) {
        //
        //     {
        //         c => '53876.69000000',
        //         e => 'BTCUSDT@1m_candles',
        //         h => '53876.69000000',
        //         l => '53832.47000000',
        //         o => '53832.47000000',
        //         s => 1619707320, // start
        //         t => 1619707346, // end
        //         v => '301.70946400'
        //     }
        //
        $messageHash = $this->safe_string($message, 'e');
        $parts = explode('@', $messageHash);
        $marketId = $this->safe_string($parts, 0);
        $timeframeName = $this->safe_string($parts, 1);
        $market = $this->safe_market($marketId);
        $symbol = $market['symbol'];
        $parsed = array(
            $this->safe_timestamp($message, 's'),
            $this->safe_number($message, 'o'),
            $this->safe_number($message, 'h'),
            $this->safe_number($message, 'l'),
            $this->safe_number($message, 'c'),
            $this->safe_number($message, 'v'),
        );
        $subParts = explode('_', $timeframeName);
        $interval = $this->safe_string($subParts, 0);
        $timeframe = $this->find_timeframe($interval);
        // TODO => move to base class
        $this->ohlcvs[$symbol] = $this->safe_value($this->ohlcvs, $symbol, array());
        $stored = $this->safe_value($this->ohlcvs[$symbol], $timeframe);
        if ($stored === null) {
            $limit = $this->safe_integer($this->options, 'OHLCVLimit', 1000);
            $stored = new ArrayCacheByTimestamp ($limit);
            $this->ohlcvs[$symbol][$timeframe] = $stored;
        }
        $stored->append ($parsed);
        $client->resolve ($stored, $messageHash);
    }

    public function watch_ticker($symbol, $params = array ()) {
        return Async\async(function () use ($symbol, $params) {
            /**
             * watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific $market
             * @param {string} $symbol unified $symbol of the $market to fetch the ticker for
             * @param {array} $params extra parameters specific to the aax api endpoint
             * @return {array} a {@link https://docs.ccxt.com/en/latest/manual.html#ticker-structure ticker structure}
             */
            $name = 'tickers';
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $messageHash = $market['id'] . '@' . $name;
            $url = $this->urls['api']['ws']['public'];
            $subscribe = array(
                'e' => 'subscribe',
                'stream' => $name,
            );
            $request = array_merge($subscribe, $params);
            return Async\await($this->watch($url, $messageHash, $request, $name));
        }) ();
    }

    public function handle_tickers($client, $message) {
        //
        //     {
        //         e => 'tickers',
        //         t => 1619663715213,
        //         $tickers => array(
        //             array(
        //                 a => '0.00000000',
        //                 c => '47655.65000000',
        //                 d => '-3.48578544',
        //                 h => '50451.37000000',
        //                 l => '47002.45000000',
        //                 o => '49376.82000000',
        //                 s => 'YFIUSDT',
        //                 v => '18140.31675687'
        //             ),
        //             array(
        //                 a => '0.00000000',
        //                 c => '1.39127000',
        //                 d => '-3.09668252',
        //                 h => '1.43603000',
        //                 l => '1.28451000',
        //                 o => '1.43573000',
        //                 s => 'XRPUSDT',
        //                 v => '451952.36683000'
        //             ),
        //         )
        //     }
        //
        $name = $this->safe_string($message, 'e');
        $timestamp = $this->safe_integer($message, 't');
        $extension = array(
            'timestamp' => $timestamp,
            'datetime' => $this->iso8601($timestamp),
        );
        $tickers = $this->parse_tickers($this->safe_value($message, 'tickers', array()), null, $extension);
        $symbols = is_array($tickers) ? array_keys($tickers) : array();
        for ($i = 0; $i < count($symbols); $i++) {
            $symbol = $symbols[$i];
            if (is_array($this->markets) && array_key_exists($symbol, $this->markets)) {
                $market = $this->market($symbol);
                $ticker = $tickers[$symbol];
                $this->tickers[$symbol] = $ticker;
                $messageHash = $market['id'] . '@' . $name;
                $client->resolve ($ticker, $messageHash);
            }
        }
    }

    public function watch_trades($symbol, $since = null, $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $since, $limit, $params) {
            /**
             * get the list of most recent $trades for a particular $symbol
             * @param {string} $symbol unified $symbol of the $market to fetch $trades for
             * @param {int|null} $since timestamp in ms of the earliest trade to fetch
             * @param {int|null} $limit the maximum amount of $trades to fetch
             * @param {array} $params extra parameters specific to the aax api endpoint
             * @return {[array]} a list of ~@link https://docs.ccxt.com/en/latest/manual.html?#public-$trades trade structures~
             */
            $name = 'trade';
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $symbol = $market['symbol'];
            $messageHash = $market['id'] . '@' . $name;
            $url = $this->urls['api']['ws']['public'];
            $subscribe = array(
                'e' => 'subscribe',
                'stream' => $messageHash,
            );
            $request = array_merge($subscribe, $params);
            $trades = Async\await($this->watch($url, $messageHash, $request, $messageHash));
            if ($this->newUpdates) {
                $limit = $trades->getLimit ($symbol, $limit);
            }
            return $this->filter_by_since_limit($trades, $since, $limit, 'timestamp', true);
        }) ();
    }

    public function handle_trades($client, $message) {
        //
        //     {
        //         e => 'BTCUSDT@trade',
        //         p => '-54408.21000000',
        //         q => '0.007700',
        //         t => 1619644477710
        //     }
        //
        $messageHash = $this->safe_string($message, 'e');
        $parts = explode('@', $messageHash);
        $marketId = $this->safe_string($parts, 0);
        $market = $this->safe_market($marketId);
        $symbol = $market['symbol'];
        // $timestamp = $this->safe_integer($message, 't');
        // $amount = $this->safe_number($message, 'q');
        // $price = $this->safe_number($message, 'p');
        $trade = $this->parse_trade($message, $market);
        $stored = $this->safe_value($this->trades, $symbol);
        if ($stored === null) {
            $limit = $this->safe_integer($this->options, 'tradesLimit', 1000);
            $stored = new ArrayCache ($limit);
            $this->trades[$symbol] = $stored;
        }
        $stored->append ($trade);
        $client->resolve ($stored, $messageHash);
    }

    public function watch_order_book($symbol, $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $limit, $params) {
            /**
             * watches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
             * @param {string} $symbol unified $symbol of the $market to fetch the order book for
             * @param {int|null} $limit the maximum amount of order book entries to return
             * @param {array} $params extra parameters specific to the aax api endpoint
             * @return {array} A dictionary of {@link https://docs.ccxt.com/en/latest/manual.html#order-book-structure order book structures} indexed by $market symbols
             */
            $name = 'book';
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $limit = ($limit === null) ? 20 : $limit;
            if (($limit !== 20) && ($limit !== 50)) {
                throw new NotSupported($this->id . ' watchOrderBook() accepts $limit values of 20 or 50 only');
            }
            $messageHash = $market['id'] . '@' . $name . '_' . (string) $limit;
            $url = $this->urls['api']['ws']['public'];
            $subscribe = array(
                'e' => 'subscribe',
                'stream' => $messageHash,
            );
            $request = array_merge($subscribe, $params);
            $orderbook = Async\await($this->watch($url, $messageHash, $request, $messageHash));
            return $orderbook->limit ($limit);
        }) ();
    }

    public function handle_delta($bookside, $delta) {
        $price = $this->safe_float($delta, 0);
        $amount = $this->safe_float($delta, 1);
        $bookside->store ($price, $amount);
    }

    public function handle_deltas($bookside, $deltas) {
        for ($i = 0; $i < count($deltas); $i++) {
            $this->handle_delta($bookside, $deltas[$i]);
        }
    }

    public function handle_order_book($client, $message) {
        //
        //     {
        //         asks => array(
        //             array( '54397.48000000', '0.002300' ),
        //             array( '54407.86000000', '1.880000' ),
        //             array( '54409.34000000', '0.046900' ),
        //         ),
        //         bids => array(
        //             array( '54383.17000000', '1.380000' ),
        //             array( '54374.43000000', '1.880000' ),
        //             array( '54354.07000000', '0.013400' ),
        //         ),
        //         e => 'BTCUSDT@book_20',
        //         t => 1619626148086
        //     }
        //
        $messageHash = $this->safe_string($message, 'e');
        list($marketId, $nameLimit) = explode('@', $messageHash);
        $parts = explode('_', $nameLimit);
        $market = $this->safe_market($marketId);
        $symbol = $market['symbol'];
        $limitString = $this->safe_string($parts, 1);
        $limit = intval($limitString);
        $timestamp = $this->safe_integer($message, 't');
        $snapshot = $this->parse_order_book($message, $symbol, $timestamp);
        $orderbook = null;
        if (!(is_array($this->orderbooks) && array_key_exists($symbol, $this->orderbooks))) {
            $orderbook = $this->order_book($snapshot, $limit);
            $this->orderbooks[$symbol] = $orderbook;
        } else {
            $orderbook = $this->orderbooks[$symbol];
            $orderbook->reset ($snapshot);
        }
        $client->resolve ($orderbook, $messageHash);
    }

    public function request_id() {
        // their support said that $reqid must be an int32, not documented
        $reqid = $this->sum($this->safe_integer($this->options, 'reqid', 0), 1);
        $this->options['reqid'] = $reqid;
        return $reqid;
    }

    public function handshake($params = array ()) {
        return Async\async(function () use ($params) {
            $url = $this->urls['api']['ws']['private'];
            $client = $this->client($url);
            $event = 'handshake';
            $future = $client->future ($event);
            $authenticated = $this->safe_value($client->subscriptions, $event);
            if ($authenticated === null) {
                $requestId = $this->request_id();
                $query = array(
                    'event' => '#' . $event,
                    'data' => array(),
                    'cid' => $requestId,
                );
                $request = array_merge($query, $params);
                $messageHash = (string) $requestId;
                $response = Async\await($this->watch($url, $messageHash, $request, $event));
                $future->resolve ($response);
            }
            return Async\await($future);
        }) ();
    }

    public function authenticate($params = array ()) {
        return Async\async(function () use ($params) {
            $url = $this->urls['api']['ws']['private'];
            $client = $this->client($url);
            $event = 'login';
            $future = $client->future ($event);
            $authenticated = $this->safe_value($client->subscriptions, $event);
            if ($authenticated === null) {
                $nonce = $this->milliseconds();
                $payload = (string) $nonce . ':' . $this->apiKey;
                $signature = $this->hmac($this->encode($payload), $this->encode($this->secret));
                $requestId = $this->request_id();
                $query = array(
                    'event' => $event,
                    'data' => array(
                        'apiKey' => $this->apiKey,
                        'nonce' => $nonce,
                        'signature' => $signature,
                    ),
                    'cid' => $requestId,
                );
                $request = array_merge($query, $params);
                $messageHash = (string) $requestId;
                $response = Async\await($this->watch($url, $messageHash, $request, $event));
                //
                //     {
                //         $data => array(
                //             $isAuthenticated => true,
                //             uid => '1362494'
                //         ),
                //         rid => 2
                //     }
                //
                //     {
                //         $data => array(
                //             authError => array( name => 'AuthLoginError', message => 'login failed' ),
                //             $isAuthenticated => false
                //         ),
                //         rid => 2
                //     }
                //
                $data = $this->safe_value($response, 'data', array());
                $isAuthenticated = $this->safe_value($data, 'isAuthenticated', false);
                if ($isAuthenticated) {
                    $future->resolve ($response);
                } else {
                    throw new AuthenticationError($this->id . ' ' . $this->json($response));
                }
            }
            return Async\await($future);
        }) ();
    }

    public function watch_balance($params = array ()) {
        return Async\async(function () use ($params) {
            /**
             * $query for balance and get the amount of funds available for trading or funds locked in orders
             * @param {array} $params extra parameters specific to the aax api endpoint
             * @return {array} a ~@link https://docs.ccxt.com/en/latest/manual.html?#balance-structure balance structure~
             */
            Async\await($this->load_markets());
            Async\await($this->handshake($params));
            $authentication = Async\await($this->authenticate($params));
            //
            //     {
            //         $data => array(
            //             isAuthenticated => true,
            //             $uid => '1362494'
            //         ),
            //         rid => 2
            //     }
            //
            $data = $this->safe_value($authentication, 'data', array());
            $uid = $this->safe_string($data, 'uid');
            $url = $this->urls['api']['ws']['private'];
            $defaultUserId = $this->safe_string_2($this->options, 'userId', 'userID', $uid);
            $userId = $this->safe_string_2($params, 'userId', 'userID', $defaultUserId);
            $defaultType = $this->safe_string_2($this->options, 'watchBalance', 'defaultType', 'spot');
            $type = $this->safe_string($params, 'type', $defaultType);
            $query = $this->omit($params, array( 'userId', 'userID', 'type' ));
            $channel = 'user/' . $userId;
            $messageHash = $type . ':balance';
            $requestId = $this->request_id();
            $subscribe = array(
                'event' => '#subscribe',
                'data' => array(
                    'channel' => $channel,
                ),
                'cid' => $requestId,
            );
            $request = $this->deep_extend($subscribe, $query);
            return Async\await($this->watch($url, $messageHash, $request, $channel));
        }) ();
    }

    public function handle_balance($client, $message) {
        //
        //     {
        //         $data => array(
        //             unavailable => '40.00000000',
        //             available => '66.00400000',
        //             location => 'AAXGL',
        //             currency => 'USDT',
        //             $purseType => 'SPTP',
        //             userID => '1362494'
        //         ),
        //         event => 'USER_BALANCE'
        //     }
        //
        $data = $this->safe_value($message, 'data', array());
        $purseType = $this->safe_string($data, 'purseType');
        $accounts = $this->safe_value($this->options, 'accountsById', array());
        $accountType = $this->safe_string($accounts, $purseType);
        $messageHash = $accountType . ':balance';
        $currencyId = $this->safe_string($data, 'currency');
        $code = $this->safe_currency_code($currencyId);
        $account = $this->account();
        $account['free'] = $this->safe_string($data, 'available');
        $account['used'] = $this->safe_string($data, 'unavailable');
        if (!(is_array($this->balance) && array_key_exists($accountType, $this->balance))) {
            $this->balance[$accountType] = array();
        }
        $this->balance[$accountType][$code] = $account;
        $this->balance[$accountType] = $this->safe_balance($this->balance[$accountType]);
        $client->resolve ($this->balance[$accountType], $messageHash);
    }

    public function watch_orders($symbol = null, $since = null, $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $since, $limit, $params) {
            /**
             * watches information on multiple $orders made by the user
             * @param {string|null} $symbol unified market $symbol of the market $orders were made in
             * @param {int|null} $since the earliest time in ms to fetch $orders for
             * @param {int|null} $limit the maximum number of  orde structures to retrieve
             * @param {array} $params extra parameters specific to the aax api endpoint
             * @return {[array]} a list of {@link https://docs.ccxt.com/en/latest/manual.html#order-structure order structures}
             */
            Async\await($this->load_markets());
            Async\await($this->handshake($params));
            $authentication = Async\await($this->authenticate($params));
            //
            //     {
            //         $data => array(
            //             isAuthenticated => true,
            //             $uid => '1362494'
            //         ),
            //         rid => 2
            //     }
            //
            $data = $this->safe_value($authentication, 'data', array());
            $uid = $this->safe_string($data, 'uid');
            $url = $this->urls['api']['ws']['private'];
            $defaultUserId = $this->safe_string_2($this->options, 'userId', 'userID', $uid);
            $userId = $this->safe_string_2($params, 'userId', 'userID', $defaultUserId);
            $query = $this->omit($params, array( 'userId', 'userID' ));
            $channel = 'user/' . $userId;
            $messageHash = 'orders';
            if ($symbol !== null) {
                $symbol = $this->symbol($symbol);
                $messageHash .= ':' . $symbol;
            }
            $requestId = $this->request_id();
            $subscribe = array(
                'event' => '#subscribe',
                'data' => array(
                    'channel' => $channel,
                ),
                'cid' => $requestId,
            );
            $request = $this->deep_extend($subscribe, $query);
            $orders = Async\await($this->watch($url, $messageHash, $request, $messageHash));
            if ($this->newUpdates) {
                $limit = $orders->getLimit ($symbol, $limit);
            }
            return $this->filter_by_symbol_since_limit($orders, $symbol, $since, $limit, true);
        }) ();
    }

    public function handle_order($client, $message) {
        //
        // spot
        //
        //     {
        //         $data => array(
        //             $symbol => 'ETHUSDT',
        //             orderType => 2,
        //             avgPrice => '0',
        //             orderStatus => 5,
        //             userID => '1362494',
        //             quote => 'USDT',
        //             rejectCode => 0,
        //             price => '2000',
        //             orderQty => '0.02',
        //             commission => '0',
        //             id => '309458413831172096',
        //             timeInForce => 1,
        //             isTriggered => false,
        //             side => 1,
        //             orderID => '1qA7O2CnOo',
        //             leavesQty => '0',
        //             cumQty => '0',
        //             updateTime => '2021-05-03T14:37:26.498Z',
        //             lastQty => '0',
        //             stopPrice => '0',
        //             createTime => '2021-05-03T14:37:15.316Z',
        //             transactTime => '2021-05-03T14:37:26.492Z',
        //             base => 'ETH',
        //             lastPrice => '0'
        //         ),
        //         event => 'SPOT'
        //     }
        //
        // futures
        //
        //     {
        //         $data => {
        //             opens => array( $symbol => 'ETHUSDTFP', buy => 1, sell => 0 ),
        //             $order => array(
        //                 liqType => 0,
        //                 $symbol => 'ETHUSDTFP',
        //                 orderType => 2,
        //                 leverage => '10',
        //                 marketPrice => '3283.4550000000',
        //                 code => 'FP',
        //                 avgPrice => '0',
        //                 orderStatus => 1,
        //                 userID => '1362494',
        //                 quote => 'USDT',
        //                 rejectCode => 0,
        //                 price => '2000',
        //                 orderQty => '1.0',
        //                 commission => '0',
        //                 id => '309633415658450944',
        //                 timeInForce => 1,
        //                 isTriggered => false,
        //                 side => 1,
        //                 orderID => '1qDemW8W1W',
        //                 leavesQty => '1.0',
        //                 cumQty => '0',
        //                 updateTime => '2021-05-04T02:12:39.024Z',
        //                 lastQty => '0',
        //                 stopPrice => '0',
        //                 createTime => '2021-05-04T02:12:39.007Z',
        //                 transactTime => '2021-05-04T02:12:39.018Z',
        //                 settleType => 'VANILLA',
        //                 base => 'ETH',
        //                 lastPrice => '0'
        //             }
        //         ),
        //         event => 'FUTURES'
        //     }
        $messageHash = 'orders';
        $data = $this->safe_value($message, 'data');
        $order = $this->safe_value($data, 'order');
        $parsed = ($order === null) ? $this->parse_order($data) : $this->parse_order($order);
        $symbol = $this->safe_string($parsed, 'symbol');
        $orderId = $this->safe_string($parsed, 'id');
        if ($symbol !== null) {
            if ($this->orders === null) {
                $limit = $this->safe_integer($this->options, 'ordersLimit', 1000);
                $this->orders = new ArrayCacheBySymbolById ($limit);
            }
            $cachedOrders = $this->orders;
            $orders = $this->safe_value($cachedOrders->hashmap, $symbol, array());
            $order = $this->safe_value($orders, $orderId);
            if ($order !== null) {
                $fee = $this->safe_value($order, 'fee');
                if ($fee !== null) {
                    $parsed['fee'] = $fee;
                }
                $fees = $this->safe_value($order, 'fees');
                if ($fees !== null) {
                    $parsed['fees'] = $fees;
                }
                $parsed['trades'] = $this->safe_value($order, 'trades');
                $parsed['timestamp'] = $this->safe_integer($order, 'timestamp');
                $parsed['datetime'] = $this->safe_string($order, 'datetime');
            }
            $cachedOrders->append ($parsed);
            $client->resolve ($this->orders, $messageHash);
            $messageHashSymbol = $messageHash . ':' . $symbol;
            $client->resolve ($this->orders, $messageHashSymbol);
        }
    }

    public function handle_system_status($client, $message) {
        // array( e => 'system', status => array( array( all => 'active' ) ) )
        return $message;
    }

    public function handle_subscription_status($client, $message) {
        //
        // public
        //
        //     array( e => 'reply', status => 'ok' )
        //
        // private handshake response
        //
        //     {
        //         data => array(
        //             id => 'SID-fqC6a7VTFG6X',
        //             info => "Invalid sid 'null', assigned a new one",
        //             isAuthenticated => false,
        //             pingTimeout => 68000
        //         ),
        //         $rid => 1
        //     }
        //
        $rid = $this->safe_string($message, 'rid');
        $client->resolve ($message, $rid);
        return $message;
    }

    public function pong($client, $message) {
        return Async\async(function () use ($client, $message) {
            //
            //     "#1"
            //
            $response = '#' . '2';
            Async\await($client->send ($response));
        }) ();
    }

    public function handle_ping($client, $message) {
        $this->spawn(array($this, 'pong'), $client, $message);
    }

    public function handle_notification($client, $message) {
        //
        //     {
        //         "data" => array(
        //             "userID" => "213409",
        //             "purseType" => "coin",
        //             "currency" => "BTC",
        //             "available" => "0.12127194",
        //             "unavailable" => "0.01458122"
        //         ),
        //         "event" => "USER_BALANCE"
        //     }
        //
        $event = $this->safe_value($message, 'event');
        $methods = array(
            'USER_FUNDS' => array($this, 'handle_balance'),
            'USER_BALANCE' => array($this, 'handle_balance'),
            'SPOT' => array($this, 'handle_order'),
            'FUTURES' => array($this, 'handle_order'),
        );
        $method = $this->safe_value($methods, $event);
        if ($method !== null) {
            return $method($client, $message);
        }
    }

    public function handle_message($client, $message) {
        //
        //     {
        //         $e => 'system',
        //         status => array(
        //             array( all => 'active' )
        //         )
        //     }
        //
        //
        //     {
        //         asks => array(
        //             array( '54397.48000000', '0.002300' ),
        //             array( '54407.86000000', '1.880000' ),
        //             array( '54409.34000000', '0.046900' ),
        //         ),
        //         bids => array(
        //             array( '54383.17000000', '1.380000' ),
        //             array( '54374.43000000', '1.880000' ),
        //             array( '54354.07000000', '0.013400' ),
        //         ),
        //         $e => 'BTCUSDT@book_20',
        //         t => 1619626148086
        //     }
        //
        // server may publish empty events if there is nothing to send right after a new connection is established
        //
        //     array("e":"empty")
        //
        // private handshake response
        //
        //     {
        //         $data => array(
        //             id => 'SID-fqC6a7VTFG6X',
        //             info => "Invalid sid 'null', assigned a new one",
        //             isAuthenticated => false,
        //             pingTimeout => 68000
        //         ),
        //         $rid => 1
        //     }
        //
        // private balance update
        //
        //     {
        //         $data => {
        //             channel => 'user/1362494',
        //             $data => array(
        //                 $data => array(
        //                     unavailable => '40.00000000',
        //                     available => '66.00400000',
        //                     location => 'AAXGL',
        //                     currency => 'USDT',
        //                     purseType => 'SPTP',
        //                     userID => '1362494'
        //                 ),
        //                 $event => 'USER_BALANCE'
        //             }
        //         ),
        //         $event => '#publish'
        //     }
        //
        // keepalive
        //
        //     #1
        //     #2
        //
        // private spot order update
        //
        //     {
        //         $data => {
        //             channel => 'user/1362494',
        //             $data => array(
        //                 $data => array(
        //                     symbol => 'ETHUSDT',
        //                     orderType => 2,
        //                     avgPrice => '0',
        //                     orderStatus => 5,
        //                     userID => '1362494',
        //                     quote => 'USDT',
        //                     rejectCode => 0,
        //                     price => '2000',
        //                     orderQty => '0.02',
        //                     commission => '0',
        //                     id => '309458413831172096',
        //                     timeInForce => 1,
        //                     isTriggered => false,
        //                     side => 1,
        //                     orderID => '1qA7O2CnOo',
        //                     leavesQty => '0',
        //                     cumQty => '0',
        //                     updateTime => '2021-05-03T14:37:26.498Z',
        //                     lastQty => '0',
        //                     stopPrice => '0',
        //                     createTime => '2021-05-03T14:37:15.316Z',
        //                     transactTime => '2021-05-03T14:37:26.492Z',
        //                     base => 'ETH',
        //                     lastPrice => '0'
        //                 ),
        //                 $event => 'SPOT'
        //             }
        //         ),
        //         $event => '#publish'
        //     }
        //
        // private futures order update
        //
        //     {
        //         $data => {
        //             channel => 'user/1362494',
        //             $data => {
        //                 $data => array(
        //                     opens => array( symbol => 'ETHUSDTFP', buy => 1, sell => 0 ),
        //                     order => array(
        //                         liqType => 0,
        //                         symbol => 'ETHUSDTFP',
        //                         orderType => 2,
        //                         leverage => '10',
        //                         marketPrice => '3283.4550000000',
        //                         code => 'FP',
        //                         avgPrice => '0',
        //                         orderStatus => 1,
        //                         userID => '1362494',
        //                         quote => 'USDT',
        //                         rejectCode => 0,
        //                         price => '2000',
        //                         orderQty => '1.0',
        //                         commission => '0',
        //                         id => '309633415658450944',
        //                         timeInForce => 1,
        //                         isTriggered => false,
        //                         side => 1,
        //                         orderID => '1qDemW8W1W',
        //                         leavesQty => '1.0',
        //                         cumQty => '0',
        //                         updateTime => '2021-05-04T02:12:39.024Z',
        //                         lastQty => '0',
        //                         stopPrice => '0',
        //                         createTime => '2021-05-04T02:12:39.007Z',
        //                         transactTime => '2021-05-04T02:12:39.018Z',
        //                         settleType => 'VANILLA',
        //                         base => 'ETH',
        //                         lastPrice => '0'
        //                     }
        //                 ),
        //                 $event => 'FUTURES'
        //             }
        //         ),
        //         $event => '#publish'
        //     }
        //
        if (gettype($message) === 'string') {
            if ($message === '#1') {
                $this->handle_ping($client, $message);
            }
        } else {
            $event = $this->safe_string($message, 'event');
            $e = $this->safe_string($message, 'e');
            if ($event === '#publish') {
                // private
                $contents = $this->safe_value($message, 'data', array());
                $data = $this->safe_value($contents, 'data', array());
                $this->handle_notification($client, $data);
            } elseif ($e === null) {
                // private
                $rid = $this->safe_string($message, 'rid');
                if ($rid !== null) {
                    $this->handle_subscription_status($client, $message);
                }
            } else {
                // public
                $parts = explode('@', $e);
                $numParts = count($parts);
                $methods = array(
                    'reply' => array($this, 'handle_subscription_status'),
                    'system' => array($this, 'handle_system_status'),
                    'book' => array($this, 'handle_order_book'),
                    'trade' => array($this, 'handle_trades'),
                    'empty' => null, // server may publish empty events if there is nothing to send right after a new connection is established
                    'tickers' => array($this, 'handle_tickers'),
                    'candles' => array($this, 'handle_ohlcv'),
                    'done' => array($this, 'handle_order'),
                );
                $method = null;
                if ($numParts > 1) {
                    $nameLimit = $this->safe_string($parts, 1);
                    $subParts = explode('_', $nameLimit);
                    $first = $this->safe_string($subParts, 0);
                    $second = $this->safe_string($subParts, 1);
                    $method = $this->safe_value_2($methods, $first, $second);
                } else {
                    $name = $this->safe_string($parts, 0);
                    $method = $this->safe_value($methods, $name);
                }
                if ($method !== null) {
                    return $method($client, $message);
                }
            }
        }
    }
}
