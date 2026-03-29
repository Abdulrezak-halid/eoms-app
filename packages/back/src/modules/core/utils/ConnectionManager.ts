/**
 * @file: ConnectionManager.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 26.08.2025
 * Last Modified Date: 03.10.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { Logger } from "pino";

import { MaybePromise } from "@m/core/interfaces/MaybePromise";
import { errorToObject } from "@m/core/middlewares/ErrorHandler";

export class ConnectionManager {
  private reconnectionTimeoutSecsMin;
  private reconnectionTimeoutSecsMax;
  private logger?: Logger;

  private wantsOpen = false;
  private isReconnecting = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectTimeoutSecs = 0;
  private cbCleanup?: () => MaybePromise<void>;

  constructor(
    private cbConnect: () => MaybePromise<void>,
    options?: {
      reconnectionTimeoutSecsMin?: number;
      reconnectionTimeoutSecsMax?: number;
      logger?: Logger;
      cbCleanup?: () => MaybePromise<void>;
    },
  ) {
    this.reconnectionTimeoutSecsMin = options?.reconnectionTimeoutSecsMin || 1;
    this.reconnectionTimeoutSecsMax = options?.reconnectionTimeoutSecsMax || 30;
    this.reconnectTimeoutSecs = this.reconnectionTimeoutSecsMin;
    this.logger = options?.logger;
    this.cbCleanup = options?.cbCleanup;
  }

  // For status check from outside
  public isConnected() {
    return this.wantsOpen && !this.isReconnecting;
  }
  public isConnecting() {
    return this.isReconnecting;
  }

  private async tryConnect() {
    try {
      await this.cbConnect();
      this.cleanupReconnectionSetup();
    } catch (e) {
      this.logger?.error({ error: errorToObject(e) }, "Connection is errored.");
      await this.scheduleNextReconnect();
      return;
    }
  }

  private cleanupReconnectionSetup() {
    if (this.reconnectTimeout !== null) {
      clearInterval(this.reconnectTimeout);
    }
    this.isReconnecting = false;
    this.reconnectTimeout = null;
    this.reconnectTimeoutSecs = this.reconnectionTimeoutSecsMin;
    this.logger?.info("Reconnection loop is canceled.");
  }

  public async open() {
    if (this.wantsOpen) {
      return;
    }
    this.wantsOpen = true;
    this.isReconnecting = true;
    await this.tryConnect();
  }
  public async close() {
    if (!this.wantsOpen) {
      return;
    }
    this.wantsOpen = false;
    this.cleanupReconnectionSetup();
    await this.cbCleanup?.();
  }

  public async reconnect() {
    if (this.isReconnecting || !this.wantsOpen) {
      return;
    }
    this.isReconnecting = true;

    await this.scheduleNextReconnect();
  }

  private async scheduleNextReconnect() {
    this.logger?.warn(
      `Reconnection is scheduled. (${this.reconnectTimeoutSecs} secs)`,
    );
    await this.cbCleanup?.();

    this.reconnectTimeout = setTimeout(
      this.tryConnect.bind(this),
      this.reconnectTimeoutSecs * 1000,
    );
    this.reconnectTimeoutSecs = Math.min(
      this.reconnectTimeoutSecs * 2,
      this.reconnectionTimeoutSecsMax,
    );
  }
}
