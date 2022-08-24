// eslint no-unused-vars 0
const fs = require ('fs');
const log = require ('ololog').handleNodeErrors ();
require ('dotenv').config ();
// eslint-disable-next-line import/no-dynamic-require, no-path-concat
const ccxt = require (__dirname);
(async () => {
    // const exchange = new ccxtpro.poloniex (); // watch heartbeat works
    const exchange = new ccxt.kucoinfutures ({
        'apiKey': process.env.APIKEY,
        'secret': process.env.API_SECRET,
        'password': process.env.API_PASSPHRASE,
    });
    const res = await exchange.fetchPositions ();
    console.log (res);
}) ();
