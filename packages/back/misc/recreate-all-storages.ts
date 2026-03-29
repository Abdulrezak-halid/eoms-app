/**
 * @file: recreate-all-storages.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 03.05.2025
 * Last Modified Date: 23.06.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
