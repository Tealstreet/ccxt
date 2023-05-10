import bingxRest from '../bingx.js';
export default class bingx extends bingxRest {
    describe(): any;
    requestId(): any;
    cleanParams(params: any): any;
    watchOrderBook(symbol: any, limit?: any, params?: {}): Promise<any>;
    handleOrderBook(client: any, message: any): void;
    handleDelta(bookside: any, delta: any): void;
    handleDeltas(bookside: any, deltas: any): void;
    watchTrades(symbol: any, since?: any, limit?: any, params?: {}): Promise<any>;
    handleTrades(client: any, message: any): void;
    parseWsTrade(trade: any, market?: any): import("../base/types.js").Trade;
    getPrivateType(url: any): "spot" | "unified" | "usdc";
    watchOrders(symbol?: string, since?: any, limit?: any, params?: {}): Promise<any>;
    handleOrder(client: any, message: any, subscription?: any): void;
    watchTopics(url: any, messageHash: any, topics?: any[], params?: {}): Promise<any>;
    authenticate(params?: {}): Promise<void>;
    keepAliveListenKey(params?: {}): Promise<void>;
    handleErrorMessage(client: any, message: any): boolean;
    handleMessage(client: any, message: any): any;
    ping(client: any): {
        ping: string;
        time: string;
    };
    sendPong(client: any, message: any): void;
    handleAuthenticate(client: any, message: any): any;
    handleSubscriptionStatus(client: any, message: any): any;
    watchTicker(symbol: any, params?: {}): Promise<any>;
    handleTicker(client: any, message: any): void;
    parseTicker(ticker: any, market?: any): import("../base/types.js").Ticker;
}
