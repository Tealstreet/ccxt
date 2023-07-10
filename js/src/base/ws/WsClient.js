import Client from "./Client.js";
import { sleep, isNode, milliseconds, safeValue, } from "../../base/functions.js";
import WebSocket from "ws";
const WebSocketPlatform = isNode ? WebSocket : self.WebSocket;
export default class WsClient extends Client {
    createConnection() {
        if (this.verbose) {
            this.log(new Date(), "connecting to", this.url);
        }
        this.connectionStarted = milliseconds();
        this.setConnectionTimeout();
        const url = `${this.url}${this.url.includes("?") ? "&" : "?"}${+new Date()}`;
        const wsClass = safeValue(this.options, "wsClass", WebSocketPlatform);
        if (isNode) {
            this.connection = new wsClass(url, this.protocols, this.options);
        }
        else {
            this.connection = new wsClass(url, this.protocols);
        }
        this.connection.onopen = this.onOpen.bind(this);
        this.connection.onmessage = this.onMessage.bind(this);
        this.connection.onerror = this.onError.bind(this);
        this.connection.onclose = this.onClose.bind(this);
        if (isNode) {
            this.connection
                .on("ping", this.onPing.bind(this))
                .on("pong", this.onPong.bind(this))
                .on("upgrade", this.onUpgrade.bind(this));
        }
        // this.connection.terminate () // debugging
        // this.connection.close () // debugging
    }
    connect(backoffDelay = 0) {
        if (!this.startedConnecting) {
            this.startedConnecting = true;
            // exponential backoff for consequent ws connections if necessary
            if (backoffDelay) {
                sleep(backoffDelay).then(this.createConnection.bind(this));
            }
            else {
                this.createConnection();
            }
        }
        return this.connected;
    }
    isOpen() {
        return this.connection.readyState === WebSocketPlatform.OPEN;
    }
    close() {
        const wsClass = safeValue(this.options, "wsClass", WebSocketPlatform);
        if (this.connection instanceof wsClass) {
            return this.connection.close();
        }
    }
}
