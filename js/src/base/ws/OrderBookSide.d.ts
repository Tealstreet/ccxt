declare class OrderBookSide extends Array {
    constructor(deltas?: any[], depth?: any);
    storeArray(delta: any): void;
    store(price: any, size: any): void;
    limit(n?: any): void;
}
declare class CountedOrderBookSide extends OrderBookSide {
    store(price: any, size: any, count: any): void;
    storeArray(delta: any): void;
}
declare class IndexedOrderBookSide extends Array {
    constructor(deltas?: any[], depth?: number);
    store(price: any, size: any, id: any): void;
    storeArray(delta: any): void;
    limit(n?: any): void;
}
declare class Asks extends OrderBookSide {
    get side(): boolean;
}
declare class Bids extends OrderBookSide {
    get side(): boolean;
}
declare class CountedAsks extends CountedOrderBookSide {
    get side(): boolean;
}
declare class CountedBids extends CountedOrderBookSide {
    get side(): boolean;
}
declare class IndexedAsks extends IndexedOrderBookSide {
    get side(): boolean;
}
declare class IndexedBids extends IndexedOrderBookSide {
    get side(): boolean;
}
export { Asks, Bids, OrderBookSide, CountedAsks, CountedBids, CountedOrderBookSide, IndexedAsks, IndexedBids, IndexedOrderBookSide, };
