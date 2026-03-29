/**
 * @file: ServiceWebSocket.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 19.12.2025
 * Last Modified Date: 19.12.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { ServerType } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  WS_CLOSE_CODE_GOINGAWAY,
  WS_CLOSE_CODE_REJECT,
  WS_MESSAGE_PING,
  WS_MESSAGE_PONG,
} from "common";
import { Context } from "hono";
import { WSContext, WSMessageReceive } from "hono/ws";
import { Logger } from "pino";

import { ServiceSession } from "@m/base/services/ServiceSession";

import { ISession } from "../../base/interfaces/ISession";
import { ApiException } from "../exceptions/ApiException";
import { IHonoContextCore } from "../interfaces/IContext";
import { IWsServerMessage } from "../interfaces/IWsServerMessage";
import { errorToObject } from "../middlewares/ErrorHandler";
import { ServiceLog } from "./ServiceLog";

type IWebSocket = WSContext<WebSocket>;
type IContextWebSocket = {
  ws: IWebSocket;
  session: ISession;
  logger: Logger;
};

let singletonInstance: ServiceWebSocket | undefined;

export class ServiceWebSocket {
  static init(app: OpenAPIHono<IHonoContextCore>) {
    singletonInstance = new ServiceWebSocket(app);
  }
  static get() {
    if (!singletonInstance) {
      throw new Error("ServiceWebSocket is not initialized yet.");
    }
    return singletonInstance;
  }
  static inject(server: ServerType) {
    this.get().injectWebSocket(server);
  }
  static shutdown() {
    this.get().shutdown();
  }

  private globalLogger: Logger;
  private contexts: IContextWebSocket[] = [];
  private injectWebSocket;

  constructor(app: OpenAPIHono<IHonoContextCore>) {
    this.globalLogger = ServiceLog.getLogger().child({
      name: "ServiceWebSocket",
    });

    const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({
      app,
    });
    this.injectWebSocket = injectWebSocket;

    app.get(
      "/ws",
      upgradeWebSocket((c) => ({
        onOpen: this.handleOpen.bind(this, c),
        onMessage: this.handleMessage.bind(this),
        onClose: this.handleClose.bind(this),
        onError: this.handleError.bind(this),
      })),
    );
  }

  public shutdown() {
    for (const context of this.contexts) {
      this.closeConnection(
        context,
        WS_CLOSE_CODE_GOINGAWAY,
        "Server is shutting down.",
      );
    }
  }

  private findContext(ws: IWebSocket) {
    return this.contexts.find((d) => d.ws === ws);
  }

  private sendMessage(c: IContextWebSocket, data: IWsServerMessage) {
    c.logger.info({ data }, "Message from server.");
    c.ws.send(JSON.stringify(data));
  }

  public sendMessageToUser(userId: string, data: IWsServerMessage) {
    const contexts = this.contexts.filter((d) => d.session.userId === userId);
    for (const context of contexts) {
      this.sendMessage(context, data);
    }
  }
  public sendMessageToOrganization(orgId: string, data: IWsServerMessage) {
    const contexts = this.contexts.filter((d) => d.session.orgId === orgId);
    for (const context of contexts) {
      this.sendMessage(context, data);
    }
  }

  public closeConnection(c: { ws: IWebSocket }, code: number, reason: string) {
    // No need log, `handleClose` handles logging.
    c.ws.close(code, reason);
  }

  private async handleOpen(
    c: Context<IHonoContextCore>,
    _evt: Event,
    ws: IWebSocket,
  ) {
    this.globalLogger.info("New connection.");

    try {
      const session = await ServiceSession.validateAndGetSession(c);

      const context = { ws, session, logger: this.globalLogger };

      this.contexts.push(context);
    } catch (e) {
      this.globalLogger.error(
        { error: errorToObject(e) },
        "Connection rejected.",
      );
      this.closeConnection(
        { ws },
        WS_CLOSE_CODE_REJECT,
        e instanceof ApiException ? e.message : "Unknown",
      );
    }
  }

  private handleMessage(evt: MessageEvent<WSMessageReceive>, ws: IWebSocket) {
    const c = this.findContext(ws);
    if (!c) {
      this.globalLogger.error(
        { data: evt.data },
        "Message from client that does not have a context.",
      );
      return;
    }

    if (evt.data === WS_MESSAGE_PING) {
      c.ws.send(WS_MESSAGE_PONG);
      c.logger.info("Ping from client.");
      return;
    }

    c.logger.info({ data: evt.data }, "Message from client.");

    // try {
    //   c.logger.info({ data: evt.data }, "Message from client.");
    // } catch (e) {
    //   c.logger.error(
    //     { data: evt.data, error: errorToObject(e) },
    //     "Processing client message failed.",
    //   );
    // }
  }

  private handleClose(evt: CloseEvent, ws: IWebSocket) {
    const iContext = this.contexts.findIndex((d) => d.ws === ws);
    if (iContext === -1) {
      this.globalLogger.info(
        { code: evt.code, reason: evt.reason },
        "Connection closed without context.",
      );
      return;
    }

    this.contexts[iContext].logger.info(
      { code: evt.code, reason: evt.reason },
      "Connection closed.",
    );
    this.contexts.splice(iContext, 1);
  }

  private handleError(_evt: Event, ws: IWebSocket) {
    const c = this.findContext(ws);
    if (!c) {
      this.globalLogger.error("Websocket error without context.");
      return;
    }

    c.logger.error("Websocket error.");
  }
}
