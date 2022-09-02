// eslint no-unused-vars 0
const fs = require ('fs');
const log = require ('ololog').handleNodeErrors ();
require ('dotenv').config ();
// eslint-disable-next-line import/no-dynamic-require, no-path-concat
const ccxt = require (__dirname);
(async () => {
    const exchange = new ccxt.kucoinfutures ({
        'apiKey': process.env.APIKEY,
        'secret': process.env.API_SECRET,
        'password': process.env.API_PASSPHRASE,
    });

    /*
        create_order - got, works
        cancel_order - got, works
        cancel_all_orders - got, works
        edit_order - not got, need
        switch_isolated - cross only not needed
        set_leverage - position dependent, missing though
        switch_hedge_mode - doesn't exist
    */

    // checking status of exchange
    // const status = await exchange.fetchStatus(); console.log("Status: \n"+ status)

    // checking accounts
    // not integrated
    // const accs = await exchange.fetchMarketLeverageTiers('XBTUSDTM');console.log(accs);


    // testing user positions endpoints
    //const pos = await exchange.fetchPositions (); console.log(pos);
    // testing exchange time endpoint
    //const ex_time = await exchange.fetchTime(); console.log(ex_time);

    // testing ohlcv endpoint
    // const ohlcv_1 = await exchange.fetchOHLCV('XBTUSDTM'); console.log(ohlcv_1);
    // const ohlcv_2 = await exchange.fetchOHLCV('XBTUSDTM', '30m'); console.log(ohlcv_2);
    //const ohlcv_3 = await exchange.fetchOHLCV('XBTUSDTM', '15m', new Date("August 26, 2022 01:00:00:000").getMilliseconds()); console.log(ohlcv_3);
    //const ohlcv_4 = await exchange.fetchOHLCV('XBTUSDTM', '15m', new Date("August 26, 2022 01:00:00:000").getMilliseconds(), 20); console.log(ohlcv_4);

    // fetching balance - up to spec
    // const balance = await exchange.fetchBalance(); console.log(balance);


    // fetching trades for asset good for position history
    // const trades = await exchange.fetchMyTrades('XBTUSDTM'); console.log(trades);
    //

    // const create = await exchange.createOrder("XBTUSDTM",
    //     'limit',
    //     'sell',
    //     1,
    //     22000,
    //     {"leverage": 30,
    //         "timeInForce" : "GTC",
    //     });
    // console.log(create);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // const current_ex_code_test = await exchange.createOrder("ETHUSDTM",
    //     'limit',
    //     'sell',
    //     1,
    //     1500,
    //     {"leverage": 30,
    //         "timeInForce" : "GTC",
    //     });
    // console.log(current_ex_code_test);
    await sleep(10);
    const current_ex_code = await exchange.createOrder("ETHUSDTM",
        'limit',
        'buy',
        1,
        1500,
        {
            "leverage": 30,
            "timeInForce" : "GTC",
            "reduceOnly": true,
            "closeOrder": true,
        });
    console.log(current_ex_code);

    // // returns all orderIds for cancelled orders - spec standard
    // const cancel_all = await exchange.cancelAllOrders();
    // console.log(cancel_all);
    //
    // const create = await exchange.createOrder("XBTUSDTM",
    //     'limit',
    //     'sell',
    //     1,
    //     22000,
    //     {"leverage": 30,
    //         "timeInForce" : "GTC",
    //     });
    //     console.log(create);

    // const orders = await exchange.fetchOrdersByStatus();
    // console.log(orders);

    // const pos = await exchange.fetchPositions();
    // console.log(pos);
}) ();
