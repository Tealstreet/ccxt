// ----------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code
// EDIT THE CORRESPONDENT .ts FILE INSTEAD

// ----------------------------------------------------------------------------
import assert from 'assert';
import testTransaction from './test.transaction.js';
// ----------------------------------------------------------------------------
export default async (exchange, code) => {
    const method = 'fetchWithdrawals';
    if (exchange.has[method]) {
        const transactions = await exchange[method](code);
        console.log('fetched', transactions.length, 'withdrawals, asserting each...');
        assert(transactions instanceof Array);
        const now = Date.now();
        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];
            testTransaction(exchange, transaction, code, now);
        }
    }
    else {
        console.log(method + '() is not supported');
    }
};
