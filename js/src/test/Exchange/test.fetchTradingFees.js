// ----------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code
// EDIT THE CORRESPONDENT .ts FILE INSTEAD

import testTradingFee from './test.tradingFee.js';
export default async (exchange) => {
    const method = 'fetchTradingFees';
    const skippedExchanges = [];
    if (skippedExchanges.includes(exchange.id)) {
        console.log(exchange.id, 'found in ignored exchanges, skipping ' + method + '...');
        return;
    }
    if (exchange.has[method]) {
        const fees = await exchange[method]();
        const symbols = Object.keys(fees);
        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            testTradingFee(symbol, fees[symbol]);
        }
        return fees;
    }
    else {
        console.log(method + '() is not supported');
    }
};
