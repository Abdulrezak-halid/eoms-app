import { UtilDate } from "common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import { IContextCore } from "../interfaces/IContext";
import { ServiceDb } from "../services/ServiceDb";
import { ServiceEnv } from "../services/ServiceEnv";
import { ServiceLog } from "../services/ServiceLog";
import { ServiceStorage } from "../services/ServiceStorage";
import { ServiceWebSocket } from "../services/ServiceWebSocket";

export namespace UtilContext {
  export function overwriteDb<TContext extends IContextCore>(
    context: TContext,
    db: NodePgDatabase,
  ): TContext {
    return {
      ...context,
      db,
    };
  }

  export function createContext(scope: string, logObject?: object) {
    return {
      db: ServiceDb.get(),
      storage: ServiceStorage.getAdaptor(),
      env: ServiceEnv.get(),
      nowDate: UtilDate.getNowUtcIsoDate(),
      nowDatetime: UtilDate.getNowIsoDatetime(),
      logger: ServiceLog.getLogger().child({ scope, ...logObject }),
      ws: ServiceWebSocket.get(),
    };
  }
}
