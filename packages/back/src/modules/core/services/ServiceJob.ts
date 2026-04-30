import { SpanStatusCode, trace } from "@opentelemetry/api";
import { EApiFailCode, UtilDate } from "common";
import { and, eq, sql } from "drizzle-orm";
import nodeSchedule from "node-schedule";
import { Logger } from "pino";

import { ApiException } from "../exceptions/ApiException";
import { IContextCore, IContextJob } from "../interfaces/IContext";
import {
  IJobHandler,
  IJobHandlerCallback,
  IJobName,
} from "../interfaces/IJobHandler";
import { IJobMeta, IJobType } from "../interfaces/IJobMeta";
import { errorToObject } from "../middlewares/ErrorHandler";
import { TbJob } from "../orm/TbJob";
import { ServiceDb } from "./ServiceDb";
import { ServiceEnv } from "./ServiceEnv";
import { ServiceLog } from "./ServiceLog";
import { ServiceStorage } from "./ServiceStorage";
import { ServiceWebSocket } from "./ServiceWebSocket";

const handlerDefs: Peomsal<Record<IJobName, IJobHandler<unknown>>> = {};

// Record<job id, external job>
let oneTimeMap: Record<string, nodeSchedule.Job> = {};

// Record<cron rule, info>
let cronGroups: Record<
  string,
  {
    job: nodeSchedule.Job;
    records: {
      priority?: number;
      orgId: string;
      id: string;
      name: IJobName;
      param: unknown;
      handler: IJobHandlerCallback;
    }[];
  }
> = {};

let isPaused = false;

export namespace ServiceJob {
  let logger: Logger | undefined;

  export async function getAll(c: IContextCore) {
    return c.db
      .select({
        id: TbJob.id,
        meta: TbJob.meta,
        failInfo: TbJob.failInfo,
        runCount: TbJob.runCount,
        runFailCount: TbJob.runFailCount,
      })
      .from(TbJob)
      .orderBy(TbJob.createdAt);
  }

  export async function remove(c: IContextCore, id: string) {
    // Remove db record
    const [rec] = await c.db
      .delete(TbJob)
      .where(eq(TbJob.id, id))
      .returning({ meta: TbJob.meta });
    if (!rec) {
      throw new Error("Job record is not found to delete.");
    }

    // Cancel one time job instance
    if (rec.meta.type === "ONE_TIME") {
      const job = oneTimeMap[id];
      if (!job) {
        throw new Error("One time job instance is not found to cancel.");
      }
      job.cancel();
      delete oneTimeMap[id];
      return;
    }

    // Remove job from cron group, if no job is left, cancel cron group
    if (rec.meta.type === "CRON") {
      const group = cronGroups[rec.meta.rule];
      if (!group) {
        throw new Error("Cron rule group is not found to cancel job.");
      }

      const index = group.records.findIndex((d) => d.id === id);
      if (index === -1) {
        throw new Error("Job is not found in the cron group.");
      }

      group.records.splice(index, 1);
      if (group.records.length === 0) {
        group.job.cancel();
        delete cronGroups[rec.meta.rule];
      }
      return;
    }
  }

  export function registerHandler<T>(name: IJobName, def: IJobHandler<T>) {
    if (handlerDefs[name]) {
      throw new Error(`Job handler already exists: ${name}`);
    }
    handlerDefs[name] = def as IJobHandler<unknown>;
  }

  export function getRegisteredHandlerNames() {
    return Object.keys(handlerDefs) as IJobName[];
  }

  // For testing purposes
  export function clearHandlers() {
    const names = getRegisteredHandlerNames();
    for (const name of names) {
      delete handlerDefs[name];
    }
  }

  export async function run(c: IContextJob, name: IJobName, param: unknown) {
    const handlerDef = handlerDefs[name];

    if (!handlerDef) {
      throw new ApiException(EApiFailCode.NOT_FOUND, "Job handler not found.");
    }
    const parsedParam = handlerDef.schema.safeParse(param);
    if (!parsedParam.success) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Invalid job parameters.",
      );
    }

    await handlerDef.cb(c, parsedParam.data);
  }

  // executeHandler does not accept context param, and build it by itself.
  // Since executeHandler is called async later, context may be outdated.
  // The biggest example is that, c.db may be an transaction client.
  async function executeHandler(
    orgId: string,
    id: string,
    name: IJobName,
    type: IJobType,
    param: unknown,
    handler: IJobHandlerCallback,
  ) {
    const tracer = trace.getTracer("ServiceJob");

    await tracer.startActiveSpan(`Job: ${name}`, async (span) => {
      span.setAttribute("job.id", id);
      span.setAttribute("job.name", name);
      span.setAttribute("job.type", type);
      span.setAttribute("job.orgId", orgId);

      logger = ServiceLog.getLogger().child({ name: "ServiceJob" });
      const loggerHandler = ServiceLog.getLogger().child({
        name: "ServiceJob",
        job: { id, type, param },
      });
      const db = ServiceDb.get();
      const nowDatetime = UtilDate.getNowIsoDatetime();

      try {
        await handler(
          {
            db,
            env: ServiceEnv.get(),
            storage: ServiceStorage.getAdaptor(),
            logger: loggerHandler,
            orgId,
            jobId: id,
            nowDate: UtilDate.getNowUtcIsoDate(),
            nowDatetime,
            ws: ServiceWebSocket.get(),
          },
          param,
        );
        if (type !== "CRON") {
          await db.delete(TbJob).where(eq(TbJob.id, id));
        } else {
          await db
            .update(TbJob)
            .set({ runCount: sql`${TbJob.runCount} + 1` })
            .where(eq(TbJob.id, id));
        }
        loggerHandler.info("Job is executed successfully.");

        span.setStatus({ code: SpanStatusCode.OK });
      } catch (e) {
        loggerHandler.error(
          { error: errorToObject(e) },
          "Job execution is failed.",
        );
        await db
          .update(TbJob)
          .set({
            failInfo: { msg: String(e), datetime: nowDatetime },
            runCount: sql`${TbJob.runCount} + 1`,
            runFailCount: sql`${TbJob.runFailCount} + 1`,
          })
          .where(eq(TbJob.id, id));

        span.recordException(e instanceof Error ? e : new Error(String(e)));
        span.setStatus({ code: SpanStatusCode.ERROR, message: String(e) });
      } finally {
        if (type === "ONE_TIME") {
          delete oneTimeMap[id];
        }
        span.end();
      }
    });
  }

  // Returns true if errored
  async function scheduleInternal(
    c: IContextCore,
    orgId: string,
    id: string,
    meta: IJobMeta,
  ): Promise<boolean> {
    const handlerDef = handlerDefs[meta.name];
    const loggerJob = c.logger.child({ name: "ServiceJob", job: { id, meta } });

    if (!handlerDef) {
      loggerJob.error("Job definition is not found.");
      return true;
    }

    if (process.env.NODE_ENV !== "test") {
      loggerJob.info("Job is scheduled.");
    }

    const parsedParam = handlerDef.schema
      ? handlerDef.schema.safeParse(meta.param)
      : { success: true, error: undefined, data: undefined };
    if (!parsedParam.success) {
      loggerJob.error(
        { paramSchemaError: parsedParam.error },
        "Invalid job schedule param.",
      );
      return true;
    }

    const now = new Date();

    switch (meta.type) {
      case "CRON": {
        const rule = meta.rule;
        const record = {
          orgId,
          id,
          name: meta.name,
          param: parsedParam.data,
          handler: handlerDef.cb,
          priority: meta.priority,
        };

        const group = cronGroups[rule];
        if (group) {
          group.records.push(record);
          // Sort by priority
          group.records.sort((a, b) =>
            a.priority === undefined
              ? 1
              : b.priority === undefined
                ? -1
                : a.priority - b.priority,
          );
          return false;
        }

        cronGroups[rule] = {
          records: [record],
          job: nodeSchedule.scheduleJob(rule, async () => {
            const lGroup = cronGroups[rule];
            if (!lGroup) {
              throw new Error(
                "Cron group is not found in job instance handler.",
              );
            }
            const recordsSnapshot = [...lGroup.records];
            for (const d of recordsSnapshot) {
              await executeHandler(
                d.orgId,
                d.id,
                d.name,
                "CRON",
                d.param,
                d.handler,
              );
            }
          }),
        };
        return false;
      }

      case "ONE_TIME": {
        const date = new Date(meta.datetime);
        if (date <= now) {
          await executeHandler(
            orgId,
            id,
            meta.name,
            meta.type,
            parsedParam.data,
            handlerDef.cb,
          );
          return false;
        }

        oneTimeMap[id] = nodeSchedule.scheduleJob(date, async () => {
          await executeHandler(
            orgId,
            id,
            meta.name,
            meta.type,
            parsedParam.data,
            handlerDef.cb,
          );
        });
        return false;
      }

      case "IMMEDIATE": {
        await executeHandler(
          orgId,
          id,
          meta.name,
          meta.type,
          parsedParam.data,
          handlerDef.cb,
        );
        return false;
      }
    }
  }

  export async function init(c: IContextCore) {
    const records = await c.db
      .select({
        id: TbJob.id,
        orgId: TbJob.orgId,
        meta: TbJob.meta,
        failInfo: TbJob.failInfo,
      })
      .from(TbJob);
    for (const record of records) {
      if (
        record.failInfo &&
        (record.meta.type === "ONE_TIME" || record.meta.type === "IMMEDIATE")
      ) {
        continue;
      }
      const failed = await scheduleInternal(
        c,
        record.orgId,
        record.id,
        record.meta,
      );
      // TODO move inside scheduleInternal
      if (failed) {
        await c.db
          .update(TbJob)
          .set({
            failInfo: { msg: "Internal error.", datetime: c.nowDatetime },
            runCount: sql`${TbJob.runCount} + 1`,
            runFailCount: sql`${TbJob.runFailCount} + 1`,
          })
          .where(eq(TbJob.id, record.id));
      }
    }

    logger?.info("Job service is inited.");
  }

  export async function schedule(
    c: IContextCore,
    orgId: string,
    meta: IJobMeta,
  ): Promise<{
    id: string;
    paused?: true;
    failed?: boolean;
  }> {
    const [record] = await c.db
      .insert(TbJob)
      .values({
        orgId,
        meta,
        createdAt: c.nowDatetime,
      })
      .returning({ id: TbJob.id });

    if (isPaused) {
      return { id: record.id, paused: true };
    }

    const failed = await scheduleInternal(c, orgId, record.id, meta);
    // TODO move inside scheduleInternal?
    if (failed) {
      await c.db
        .update(TbJob)
        .set({
          failInfo: { msg: "Internal error.", datetime: c.nowDatetime },
          runCount: sql`${TbJob.runCount} + 1`,
          runFailCount: sql`${TbJob.runFailCount} + 1`,
        })
        .where(and(eq(TbJob.orgId, orgId), eq(TbJob.id, record.id)));
    }
    return { id: record.id, failed };
  }

  export async function shutdown() {
    await nodeSchedule.gracefulShutdown();
    oneTimeMap = {};
    cronGroups = {};
    logger?.info("Job service is shutdown.");
  }

  export async function pause() {
    if (isPaused) {
      logger?.info("Job service is already paused.");
      return;
    }
    isPaused = true;
    await shutdown();
    logger?.info("Job service is paused.");
  }

  export async function resume(c: IContextCore) {
    if (!isPaused) {
      logger?.info("Job service is already resumed.");
      return;
    }
    isPaused = false;
    await init(c);
    logger?.info("Job service is resumed.");
  }
}
