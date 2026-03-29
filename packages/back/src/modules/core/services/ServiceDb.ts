import { type NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import { Logger } from "pino";

import { ServiceLog } from "@m/core/services/ServiceLog";

import type { IEnv } from "../interfaces/IEnv";
import { errorToObject } from "../middlewares/ErrorHandler";

let db: NodePgDatabase | undefined;
let pool: pg.Pool | undefined;
let logger: Logger | undefined;

export namespace ServiceDb {
  export async function recreate(env: IEnv) {
    const client = new pg.Client({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      ssl: false,
    });
    await client.connect();
    await client.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
    await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    await client.end();

    logger?.info("Database dropped and recreated.");
  }

  export async function init(env: IEnv) {
    logger = ServiceLog.getLogger().child({ name: "ServiceDb" });
    pool = new pg.Pool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      ssl: false,
    });
    db = drizzle(pool);

    try {
      await migrate(db, {
        migrationsFolder: env.DB_MIG_DIR,
      });
    } catch (e) {
      logger?.error(
        {
          error: e instanceof AggregateError ? e.errors : errorToObject(e),
        },
        "Cannot migrate database.",
      );

      process.exit(1);
    }

    logger?.info("Database service is inited.");
  }

  export function get() {
    if (!db) {
      throw new Error("Database is not inited yet.");
    }
    return db;
  }

  export async function shutdown() {
    await pool?.end();
    logger?.info("Database service is shutdown.");
  }
}
