import { eq } from "drizzle-orm";

import { TbGlobalConfig } from "@m/core/orm/TbGlobalConfig";
import { ServiceJob } from "@m/core/services/ServiceJob";

import { IContextCore } from "../interfaces/IContext";
import { ServiceMessageQueue } from "./ServiceMessageQueue";

export namespace ServiceMaintenance {
  export async function get(c: IContextCore) {
    const [result] = await c.db
      .select({ value: TbGlobalConfig.value })
      .from(TbGlobalConfig)
      .where(eq(TbGlobalConfig.key, "MAINTENANCE"));
    return Boolean(result?.value);
  }

  export async function set(c: IContextCore, value: boolean) {
    const [record] = await c.db
      .select({ key: TbGlobalConfig.key, value: TbGlobalConfig.value })
      .from(TbGlobalConfig)
      .where(eq(TbGlobalConfig.key, "MAINTENANCE"));

    // This optimization breaks test, because between each test db is reset,
    //   and maintenance state becomes broken and cannot be set.
    // const currentValue = !record ? false : record.value;
    // if (value === currentValue) {
    //   c.logger.info(
    //     { value },
    //     "Current maintenance state is already the same as requested.",
    //   );
    //   return;
    // }

    c.logger.info(
      { name: "ServiceMaintenance", value },
      "Maintenance mode is changed.",
    );

    if (value) {
      await ServiceJob.pause();
      await ServiceMessageQueue.shutdown();
    } else {
      await ServiceJob.resume(c);
      await ServiceMessageQueue.init();
    }

    if (!record) {
      await c.db.insert(TbGlobalConfig).values({ value, key: "MAINTENANCE" });
      return;
    }

    await c.db
      .update(TbGlobalConfig)
      .set({ value })
      .where(eq(TbGlobalConfig.key, "MAINTENANCE"));
  }
}
