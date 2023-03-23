import { pro } from '../../ccxt.js';

const exchange = new pro.phemex({ verbose: false });

while (true) {
  console.log(await exchange.watchOrderBook('BTC/USDT:USDT'));
}
