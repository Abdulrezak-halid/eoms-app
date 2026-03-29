import { UtilDate } from "common";
import type { Context, Next } from "hono";

import { ServiceLog } from "@m/core/services/ServiceLog";

import type { IHonoContextCore } from "../interfaces/IContext";
import { ServiceDb } from "../services/ServiceDb";
import { ServiceEnv } from "../services/ServiceEnv";
import { ServiceStorage } from "../services/ServiceStorage";
import { ServiceWebSocket } from "../services/ServiceWebSocket";

export function MiddlewareRootVars(c: Context<IHonoContextCore>, next: Next) {
  const env = ServiceEnv.get();

  if (!env.MODE_EXPORT_API_SCHEMA) {
    c.set("db", ServiceDb.get());
    c.set("storage", ServiceStorage.getAdaptor());
    c.set("ws", ServiceWebSocket.get());
  }

  c.set("nowDate", UtilDate.getNowUtcIsoDate());
  c.set("nowDatetime", UtilDate.getNowIsoDatetime());
  c.set("env", env);
  c.set(
    "logger",
    ServiceLog.getLogger().child({
      scope: "REQUEST",
      method: c.req.method,
      path: c.req.path,
    }),
  );

  return next();
}
