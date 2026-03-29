import { serve } from "@hono/node-server";

import { errorToObject } from "@m/core/middlewares/ErrorHandler";
import { RouterRoot } from "@m/core/routers/RouterRoot";
import { ServiceDb } from "@m/core/services/ServiceDb";
import { ServiceEnv } from "@m/core/services/ServiceEnv";
import { ServiceJob } from "@m/core/services/ServiceJob";
import { ServiceLog } from "@m/core/services/ServiceLog";
import { ServiceMessageQueue } from "@m/core/services/ServiceMessageQueue";
import { ServiceOpenTelemetry } from "@m/core/services/ServiceOpenTelemetry.js";
import { ServiceRouteManager } from "@m/core/services/ServiceRouteManager";
import { ServiceRuntimePatcher } from "@m/core/services/ServiceRuntimePatcher";
import { ServiceStorage } from "@m/core/services/ServiceStorage";
import { ServiceWebSocket } from "@m/core/services/ServiceWebSocket";
import { UtilContext } from "@m/core/utils/UtilContext";
import { ServiceOpenApiDoc } from "@m/dev/services/ServiceOpenApiDoc";

import { initModules } from "./initModules";

async function init() {
  ServiceEnv.init();
  const env = ServiceEnv.get();

  ServiceLog.init(env);

  const indexLogger = ServiceLog.getLogger().child({ name: "index" });
  indexLogger.info(
    {
      nodeEnv: process.env.NODE_ENV,
      envName: env.ENV_NAME,
      buildTime: env.BUILD_TIME,
    },
    "Server is initializing...",
  );

  // Note: initModules is to ensure that u,g,s paths are extended before adding
  //   to root.
  initModules(env);

  ServiceRouteManager.assignRootRoutes();

  // Do not assign open api doc on prod and also we don't need it on test
  if (!ServiceEnv.isProd() && !ServiceEnv.isTest()) {
    ServiceOpenApiDoc.assignRoutes(RouterRoot);
  }

  // TODO split file
  if (env.MODE_EXPORT_API_SCHEMA) {
    const res = await RouterRoot.fetch(new Request("http://internal/doc"));
    const json = await res.json();
    const fs = await import("fs");
    // TODO constant
    const fileName = "build-api.json";
    fs.writeFileSync(fileName, JSON.stringify(json));
    indexLogger.info({ file: fileName }, "Built api json file");
    return;
  }

  ServiceOpenTelemetry.init(env);

  await ServiceStorage.init(env);

  if (env.DB_RESET_EACH_RUN) {
    // Very similar usage is at /misc/recreate-all-storages.ts
    await ServiceDb.recreate(env);
    await ServiceStorage.recreate(env);
  }

  await ServiceDb.init(env);

  // Websocket should be init before context creation.
  //   Even actually there won't be connected sockets,
  //   because server is not started, contexts will ensure that,
  //   ws inside context is ready.
  //   Some context creations;
  //   - ServiceMessageQueue may create context if there are messages in queue
  //   - Main contexts need ws
  //   - ServiceJob creates contexts
  ServiceWebSocket.init(RouterRoot);

  await ServiceMessageQueue.init();

  const contextInit = UtilContext.createContext("INIT");

  await ServiceJob.init(contextInit);

  const result = await ServiceRuntimePatcher.sync(contextInit);

  const port = parseInt(env.PORT);
  const server = serve({
    fetch: RouterRoot.fetch,
    port,
  });

  ServiceWebSocket.inject(server);

  indexLogger.info(
    {
      sysMigResult: result,
      url: `http://localhost:${port}`,
      swaggerUrl: `http://localhost:${port}/ui`,
    },
    "Server is ready.",
  );

  let terminating = false;

  function handleUncaughtException(e: unknown) {
    ServiceLog.getLogger().error(
      { error: errorToObject(e) },
      "Uncaught exception.",
    );
  }

  process.on("uncaughtException", handleUncaughtException);
  process.on("unhandledRejection", handleUncaughtException);

  async function terminate() {
    if (terminating) {
      return;
    }
    terminating = true;
    indexLogger.info("Terminating...");
    server.close();
    ServiceWebSocket.shutdown();
    await ServiceJob.shutdown();
    await ServiceMessageQueue.shutdown();
    await ServiceDb.shutdown();
    await ServiceStorage.shutdown();
    await ServiceOpenTelemetry.shutdown();
    indexLogger.info("Graceful shutdown is ok.");
  }

  process.on("SIGINT", terminate);
  process.on("SIGTERM", terminate);
}

void init();
