import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Logger } from "pino";

import { ISession } from "@m/base/interfaces/ISession";

import { ServiceWebSocket } from "../services/ServiceWebSocket";
import type { IEnv } from "./IEnv";
import { IStorageAdaptor } from "./IStorageAdaptor";

export interface IContextCore {
  db: NodePgDatabase;
  nowDate: string;
  nowDatetime: string;
  env: IEnv;
  logger: Logger;
  storage: IStorageAdaptor;
  ws: ServiceWebSocket;
}

export interface IContextOrg extends IContextCore {
  orgId: string;
}

export interface IContextUser extends IContextOrg {
  session: ISession;
}

export interface IContextJob extends IContextOrg {
  jobId: string;
}

export interface IHonoContextCore {
  Variables: IContextCore;
}

export interface IHonoContextUser {
  Variables: IContextUser;
}
