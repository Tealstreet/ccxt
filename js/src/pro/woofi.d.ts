import woofiRest from '../woofi.js';
export default class woofi extends woofiRest {
    describe(): any;
    requestId(url: any): any;
    watchPublic(messageHash: any, message: any, shouldThrottle?: boolean): Promise<any>;
    watchOrderBook(symbol: any, limit?: any, params?: {}): Promise<any>;
    handleOrderBook(client: any, message: any): void;
    watchTicker(symbol: any, params?: {}): Promise<any>;
    parseWsTicker(ticker: any, market?: any): import("../base/types.js").Ticker;
    handleTicker(client: any, message: any): any;
    watchTickers(symbols?: string[], params?: {}): Promise<any>;
    handleTickers(client: any, message: any): void;
    watchOHLCV(symbol: any, timeframe?: string, since?: any, limit?: any, params?: {}): Promise<any>;
    handleOHLCV(client: any, message: any): void;
    watchTrades(symbol: any, since?: any, limit?: any, params?: {}): Promise<any>;
    handleTrade(client: any, message: any): void;
    parseWsTrade(trade: any, market?: any): import("../base/types.js").Trade;
    checkRequiredUid(): boolean;
    authenticate(params?: {}): any;
    watchPrivate(messageHash: any, message: any, params?: {}): Promise<any>;
    watchOrders(symbol?: string, since?: any, limit?: any, params?: {}): Promise<any>;
    parseWsOrder(order: any, market?: any): any;
    handleOrderUpdate(client: any, message: any): void;
    handleOrder(client: any, message: any): void;
    handleMessage(client: any, message: any): any;
    ping(client: any): {
        event: string;
    };
    handlePing(client: any, message: any): {
        event: string;
    };
    handlePong(client: any, message: any): any;
    handleSubscribe(client: any, message: any): any;
    handleAuth(client: any, message: any): void;
}
