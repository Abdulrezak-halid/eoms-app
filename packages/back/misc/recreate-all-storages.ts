import "dotenv/config";

import { ServiceDb } from "../src/modules/core/services/ServiceDb";
import { ServiceEnv } from "../src/modules/core/services/ServiceEnv";
import { ServiceStorage } from "../src/modules/core/services/ServiceStorage";

async function run() {
  ServiceEnv.init();
  const env = ServiceEnv.get();

  // Very similar usage is at index.ts for DB_RESET_EACH_RUN
  await ServiceDb.recreate(env);
  await ServiceStorage.recreate(env);
}

void run();
