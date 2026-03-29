import { EApiFailCode } from "common";
import { desc, eq } from "drizzle-orm";

import { ApiException } from "../exceptions/ApiException";
import type { IContextCore } from "../interfaces/IContext";
import { TbRuntimePatch } from "../orm/TbRuntimePatch";
import { UtilDb } from "../utils/UtilDb";

interface IRuntimePatch {
  name: string;
  handler: (c: IContextCore) => Promise<void> | void;
}

const handlerDefs: Record<string, IRuntimePatch> = {};

export namespace ServiceRuntimePatcher {
  export function create(
    name: string,
    handler: (c: IContextCore) => Promise<void> | void,
  ): IRuntimePatch {
    return { name, handler };
  }

  export function register(def: IRuntimePatch) {
    if (handlerDefs[def.name]) {
      throw new Error(`Patch handler already exists: ${def.name}`);
    }
    handlerDefs[def.name] = def;
  }

  export async function getStatus(c: IContextCore) {
    const recordsApplied = await c.db
      .select({
        index: TbRuntimePatch.index,
        name: TbRuntimePatch.name,
        appliedAt: UtilDb.isoDatetime(TbRuntimePatch.appliedAt),
      })
      .from(TbRuntimePatch)
      .orderBy(desc(TbRuntimePatch.index));

    const handlers = Object.values(handlerDefs);
    const listNames = handlers.map((d) => d.name);
    const listApplied = recordsApplied.map((d) => d.name);

    return {
      patchesNew: listNames.filter((d) => !listApplied.includes(d)).reverse(),
      patchesApplied: recordsApplied.map((d) => ({
        ...d,
        outdated: !listNames.includes(d.name),
      })),
    };
  }

  export async function run(c: IContextCore, name: string) {
    const handlers = Object.values(handlerDefs);
    const patch = handlers.find((d) => d.name === name);
    if (!patch) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Patch handler not found.",
      );
    }
    if (c.env.ENV_NAME !== "test") {
      c.logger.info(
        { name: "ServiceRuntimePatcher", handlerName: name },
        "Run patch.",
      );
    }
    await patch.handler(c);
  }

  export async function apply(c: IContextCore, name: string) {
    await ServiceRuntimePatcher.run(c, name);
    await c.db.insert(TbRuntimePatch).values({
      name,
      appliedAt: c.nowDatetime,
    });
  }

  export async function sync(c: IContextCore) {
    const recordsApplied = await c.db
      .select({
        index: TbRuntimePatch.index,
        name: TbRuntimePatch.name,
        appliedAt: UtilDb.isoDatetime(TbRuntimePatch.appliedAt),
      })
      .from(TbRuntimePatch)
      .orderBy(desc(TbRuntimePatch.index));

    const handlers = Object.values(handlerDefs);
    const listNames = handlers.map((d) => d.name);
    const listApplied = recordsApplied.map((d) => d.name);
    const patchesNew = listNames.filter((d) => !listApplied.includes(d));

    for (const name of patchesNew) {
      await run(c, name);
      await c.db.insert(TbRuntimePatch).values({
        name,
        appliedAt: c.nowDatetime,
      });
    }

    return patchesNew;
  }

  export async function remove(c: IContextCore, index: number) {
    await c.db.delete(TbRuntimePatch).where(eq(TbRuntimePatch.index, index));
  }
}
