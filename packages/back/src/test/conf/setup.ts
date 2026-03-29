/**
 * @file: setup.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 15.01.2025
 * Last Modified Date: 15.01.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { PGlite } from "@electric-sql/pglite";
import { UtilDate } from "common";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PgliteDatabase, drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import crypto from "node:crypto";
import { afterAll, afterEach, beforeAll, beforeEach, expect, vi } from "vitest";

import { initModules } from "@/initModules";

import type { IEnv } from "@m/core/interfaces/IEnv";
import { ServiceDb } from "@m/core/services/ServiceDb";
import { ServiceEnv } from "@m/core/services/ServiceEnv";
import { ServiceLog } from "@m/core/services/ServiceLog";
import { ServiceRouteManager } from "@m/core/services/ServiceRouteManager";
import { ServiceRuntimePatcher } from "@m/core/services/ServiceRuntimePatcher";
import { ServiceStorage } from "@m/core/services/ServiceStorage";
import { ServiceWebSocket } from "@m/core/services/ServiceWebSocket";
import { StorageAdaptorMemory } from "@m/core/storage-adaptors/StorageAdaptorMemory";
import { UtilLanguage } from "@m/core/utils/UtilLanguage";

import { UtilTest } from "../utils/UtilTest";

if (!globalThis.crypto) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).crypto = crypto;
}

expect.extend({
  toBeApiOk(received) {
    const { isNot } = this;
    return {
      pass: received.error === undefined,
      message: () => (isNot ? "Response is ok" : "Response is not ok."),
      actual: received.error,
      expected: "OK",
    };
  },

  toBeApiError(received, expected) {
    const { isNot } = this;
    return {
      pass: received.error !== undefined && received.error === expected,
      message: () =>
        received.error === undefined
          ? isNot
            ? "Response is failed"
            : "Response is not failed."
          : isNot
            ? "Fail code matches."
            : "Fail code mismatch.",
      actual: received.error === undefined ? "OK" : received.error,
      expected,
    };
  },
});

// TODO
const env: IEnv = {
  PORT: "3000",
  ENV_NAME: "test",
  DB_MIG_DIR: process.env.DB_MIG_DIR || "migrations.dev",
  DB_HOST: "TEST_DB_HOST",
  DB_PORT: 5432,
  DB_USER: "TEST_DB_USER",
  DB_PASSWORD: "TEST_DB_PASS",
  DB_NAME: "TEST_DB",
  SECURE_COOKIE: false,
  COOKIE_SECRET: "TEST",
  WEATHER_API_TOKEN: "TEST",
  LOG_LEVEL: process.env.LOG_LEVEL,
  WORKSPACE_ROOT_DOMAINS: ["localhost"],
  QUEUE_REPORT_RENDER: "TEST_QUEUE_REPORT_RENDER",
  QUEUE_REPORT_PDF: "TEST_QUEUE_REPORT_PDF",
  QUEUE_ANALYZER_FEATURE_ELIMINATION: "TEST_QUEUE_ANALYZER_FEATURE_ELIMINATION",
};
let client: PGlite;
let db: PgliteDatabase;

// Init system before each test
beforeAll(() => {
  ServiceLog.init(env);

  vi.spyOn(ServiceEnv, "get").mockImplementation(() => env);

  initModules(env);
  ServiceRouteManager.assignRootRoutes();

  // Db init
  client = new PGlite();
  db = drizzle(client);

  const storageAdaptorMemory = new StorageAdaptorMemory();
  storageAdaptorMemory.init();
  vi.spyOn(ServiceStorage, "getAdaptor").mockImplementation(
    () => storageAdaptorMemory,
  );
  vi.spyOn(ServiceDb, "get").mockImplementation(
    () => db as unknown as NodePgDatabase,
  );
  vi.spyOn(ServiceWebSocket, "get").mockImplementation(
    () =>
      ({
        sendMessageToUser: () => {},
        sendMessageToOrganization: () => {},
      }) as unknown as ServiceWebSocket,
  );
  vi.spyOn(UtilDate, "getNowUtcIsoDate").mockImplementation(() => {
    // Use a fixed max random date for tests
    const date = new Date(
      Math.floor(new Date("2025-08-01").getTime() * Math.random()),
    );
    return UtilDate.objToUtcIsoDate(date);
  });
  vi.spyOn(UtilDate, "getNowIsoDatetime").mockImplementation(() => {
    // Use a fixed max random date for tests
    const date = new Date(
      Math.floor(new Date("2025-08-01").getTime() * Math.random()),
    );
    return UtilDate.objToIsoDatetime(date);
  });
  vi.spyOn(UtilLanguage, "create").mockImplementation(async (_c, languages) =>
    Promise.resolve({
      t: (key, params) => {
        let result = `{${key}`;
        // Show params on rendered reports
        if (params) {
          for (const k in params) {
            result += `#${k}=${params[k]}`;
          }
        }

        return `${result}}`;
      },
      getLanguage: () => languages || "en",
    }),
  );
  // await ServiceDb.init(env);
});

beforeEach(async () => {
  await migrate(db, {
    migrationsFolder: env.DB_MIG_DIR,
  });

  await ServiceRuntimePatcher.sync(UtilTest.createTestContext());
});

// Clean up the database after each test
afterEach(async () => {
  await db.execute(sql`drop schema if exists drizzle cascade`);
  await db.execute(sql`drop schema if exists public cascade`);
  await db.execute(sql`create schema public`);
});

// Free up resources after all tests are done
afterAll(async () => {
  vi.clearAllMocks();
  await client.close();
});
