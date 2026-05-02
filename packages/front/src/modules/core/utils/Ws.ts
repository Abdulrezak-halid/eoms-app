/* eslint-disable no-console */
import {
  WS_CLOSE_CODE_REJECT,
  WS_CLOSE_CODE_TRYAGAINLATER,
  WS_MESSAGE_PING,
  WS_MESSAGE_PONG,
} from "common";

export const enum EWsState {
  IDLE = "IDLE",
  OPEN = "OPEN",
  PENDING_RECONNECTION = "PENDING_RECONNECTION",
  CONNECTING = "CONNECTING",
  REJECTED = "REJECTED",
  REJECTED_TRY_AGAIN_LATER = "REJECTED_TRY_AGAIN_LATER",
}

const pingPongIntervalMs = import.meta.env.DEV ? 10000 : 30000;
const pingPongTimeoutMs = 1500;
const softopenTimeoutMs = 50;

const WS_PING_MS_UNKNOWN = -1;

type WsMessageListener<TInterface> = (msg: TInterface) => void;

export class Ws<TInterface> {
  private socket: WebSocket | undefined;

  private state = EWsState.IDLE;

  private pingMs = WS_PING_MS_UNKNOWN;
  private pingTime = 0;
  private pongAnswered = false;
  private pongTimeoutId: number | undefined;
  private pingIntervalId: number | undefined;
  private reconnectionTimeoutId: number | undefined;
  private reconnectionCount = 0;
  private softOpenDelayTimeoutId: number | undefined;

  private listenersState: ((state: EWsState) => void)[] = [];
  private listenersPingMs: ((value: number) => void)[] = [];
  private listenersMessage: WsMessageListener<TInterface>[] = [];

  private url?: string;

  public setUrl(value: string) {
    this.url = value;
  }

  public subscribeState(cb: (state: EWsState) => void) {
    this.listenersState.push(cb);
    cb(this.state);
  }
  public subscribePingMs(cb: (value: number) => void) {
    this.listenersPingMs.push(cb);
    cb(this.pingMs);
  }
  public subscribeMessage(cb: WsMessageListener<TInterface>) {
    this.listenersMessage.push(cb);
  }

  public close() {
    this.cleanup();
    this.setState(EWsState.IDLE);
  }

  public destroy() {
    this.listenersState = [];
    this.listenersPingMs = [];
    this.listenersMessage = [];
    this.close();
    if (import.meta.env.VITE_DEV_PAGES) {
      console.log("Ws destroyed.");
    }
  }

  public getState() {
    return this.state;
  }

  private cleanup() {
    this.setPingMs(WS_PING_MS_UNKNOWN);
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onclose = null;
      // Won't trigger handleClose
      // https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close
      this.socket.close(3000, "client-cleanup");
      this.socket = undefined;
    }
    window.clearInterval(this.pingIntervalId);
    window.clearTimeout(this.pongTimeoutId);
    window.clearTimeout(this.reconnectionTimeoutId);
    window.clearTimeout(this.softOpenDelayTimeoutId);
    this.pingIntervalId = undefined;
    this.pongTimeoutId = undefined;
    this.reconnectionTimeoutId = undefined;
  }

  private setState(value: EWsState) {
    this.state = value;
    for (const cb of this.listenersState) {
      cb(value);
    }
  }

  private setPingMs(value: number) {
    this.pingMs = value;
    for (const cb of this.listenersPingMs) {
      cb(value);
    }
  }

  private handlePongTimeout() {
    if (!this.pongAnswered) {
      if (import.meta.env.VITE_DEV_PAGES) {
        console.log("Ws pong timeout.");
      }
      this.connect();
    }
  }
  private sendPing() {
    // if (import.meta.env.VITE_DEV_PAGES) {
    //   console.log("Ws ping.");
    // }

    if (!this.socket) {
      return;
    }
    this.socket.send(WS_MESSAGE_PING);
    this.pingTime = Date.now();
    // if (import.meta.env.VITE_DEV_PAGES) {
    //   console.log("--------------------------");
    //   console.log(new Date().getMilliseconds());
    // }
    this.pongAnswered = false;
    this.pongTimeoutId = window.setTimeout(
      this.handlePongTimeout.bind(this),
      pingPongTimeoutMs,
    );
  }

  // This soft delay is to prevent emiting OPEN event
  //   when connection is going to be rejected.
  private handleOpenSoft() {
    if (import.meta.env.VITE_DEV_PAGES) {
      console.log("Ws opened. (soft)");
    }
    this.softOpenDelayTimeoutId = window.setTimeout(
      this.handleOpen.bind(this),
      softopenTimeoutMs,
    );
  }

  private handleOpen() {
    if (import.meta.env.VITE_DEV_PAGES) {
      console.log("Ws opened.");
    }
    this.setState(EWsState.OPEN);
    this.reconnectionCount = 0;
    this.pingIntervalId = window.setInterval(
      this.sendPing.bind(this),
      pingPongIntervalMs,
    );
    this.sendPing();
  }

  private handleClose(e: CloseEvent) {
    if (import.meta.env.VITE_DEV_PAGES) {
      console.log("Ws closed.", "Code:", e.code, "Reason:", e.reason);
    }
    this.cleanup();

    if (e.code === WS_CLOSE_CODE_REJECT) {
      if (import.meta.env.VITE_DEV_PAGES) {
        console.log("Ws rejected.");
      }
      this.setState(EWsState.REJECTED);
    } else if (e.code === WS_CLOSE_CODE_TRYAGAINLATER) {
      if (import.meta.env.VITE_DEV_PAGES) {
        console.log("Ws rejected. (try again later)");
      }
      this.setState(EWsState.REJECTED_TRY_AGAIN_LATER);
      // } else if (e.code === WS_CLOSE_CODE_GOINGAWAY) {
      //   if (import.meta.env.VITE_DEV_PAGES) {
      //     console.log("Ws going away.");
      //   }
      //   this.setState(EWsState.IDLE);
    } else {
      if (import.meta.env.VITE_DEV_PAGES) {
        console.log("Ws pending reconnection.");
      }
      this.setState(EWsState.PENDING_RECONNECTION);
      this.reconnectionTimeoutId = window.setTimeout(
        this.connect.bind(this),
        this.reconnectionCount * 1000,
      );
      ++this.reconnectionCount;
    }
  }

  private handleMessage(e: MessageEvent<string>) {
    // if (import.meta.env.VITE_DEV_PAGES) {
    //   console.log("Ws message.", e.data);
    // }
    if (e.data === WS_MESSAGE_PONG) {
      // if (import.meta.env.VITE_DEV_PAGES) {
      //   console.log(new Date().getMilliseconds());
      // }
      this.setPingMs(Date.now() - this.pingTime);
      this.pongAnswered = true;
      return;
    }
    // if (import.meta.env.VITE_DEV_PAGES) {
    //   console.log("Ws message.", e.data);
    // }
    const data = JSON.parse(e.data);
    for (const cb of this.listenersMessage) {
      cb(data as TInterface);
    }
  }

  public connect() {
    if (!this.url) {
      if (import.meta.env.VITE_DEV_PAGES) {
        console.log("Ws cannot connect. Url is not set.");
      }
      return;
    }
    if (import.meta.env.VITE_DEV_PAGES) {
      console.log("Ws connecting...");
    }
    this.cleanup();
    this.setState(EWsState.CONNECTING);
    this.socket = new WebSocket(this.url);
    this.socket.onopen = this.handleOpenSoft.bind(this);
    this.socket.onclose = this.handleClose.bind(this);
    this.socket.onmessage = this.handleMessage.bind(this);
    // TODO connect timeout
  }
}
