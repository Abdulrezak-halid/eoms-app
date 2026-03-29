import { z } from "@hono/zod-openapi";
import { EApiFailCode, EXAMPLE_USER_EMAIL, UtilDate } from "common";
import { eq } from "drizzle-orm";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TbUser } from "@m/base/orm/TbUser";
import { TbJob } from "@m/core/orm/TbJob";
import { ServiceMaintenance } from "@m/core/services/ServiceMaintenance";

import { ApiException } from "../exceptions/ApiException";
import { IContextJob } from "../interfaces/IContext";
import { IJobName } from "../interfaces/IJobHandler";
import { IJobMeta } from "../interfaces/IJobMeta";
import { ServiceDb } from "../services/ServiceDb";
import { ServiceJob } from "../services/ServiceJob";

describe("ServiceJob", () => {
  let context: IContextJob;

  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.clearAllTimers();
  });

  beforeEach(async () => {
    const [user] = await ServiceDb.get()
      .select({ orgId: TbUser.orgId })
      .from(TbUser)
      .where(eq(TbUser.email, EXAMPLE_USER_EMAIL));

    context = UtilTest.createTestContextJob(
      user.orgId,
      "00000000-0000-0000-0000-000000000010",
    );

    await ServiceJob.shutdown();
    ServiceJob.clearHandlers();
    await context.db.delete(TbJob);
    await ServiceMaintenance.set(context, false);
  });

  it("Should run a job successfully", async () => {
    const schema = z.object({ param: z.string() });
    const cb = vi.fn();
    ServiceJob.registerHandler("TEST_JOB" as IJobName, { schema, cb });

    await ServiceJob.run(context, "TEST_JOB" as IJobName, { param: "test" });
    expect(cb).toHaveBeenCalledWith(context, { param: "test" });
  });

  it("Should throw NOT_FOUND when running a non-existent job", async () => {
    await expect(
      ServiceJob.run(context, "NON_EXISTENT_JOB" as IJobName, {}),
    ).rejects.toThrowError(new ApiException(EApiFailCode.NOT_FOUND));
  });

  it("Should throw BAD_REQUEST when running a job with invalid parameters", async () => {
    const schema = z.object({ param: z.string() });
    const cb = vi.fn();
    ServiceJob.registerHandler("TEST_JOB" as IJobName, { schema, cb });

    await expect(
      ServiceJob.run(context, "TEST_JOB" as IJobName, { param: 123 }),
    ).rejects.toThrowError(new ApiException(EApiFailCode.BAD_REQUEST));
  });

  it("Should get all jobs", async () => {
    const schema = z.object({ param: z.string() });
    const cb = () => {};
    ServiceJob.registerHandler("TEST_JOB" as IJobName, { schema, cb });

    const meta1: IJobMeta = {
      name: "TEST_JOB" as IJobName,
      type: "ONE_TIME",
      datetime: UtilDate.objToIsoDatetime(new Date(Date.now() + 10000)),
      param: { param: "test1" },
    };
    const { id: jobId1 } = await ServiceJob.schedule(
      context,
      context.orgId,
      meta1,
    );

    const meta2: IJobMeta = {
      name: "TEST_JOB" as IJobName,
      type: "CRON",
      rule: "*/1 * * * *",
      param: { param: "test2" },
    };
    const { id: jobId2 } = await ServiceJob.schedule(
      context,
      context.orgId,
      meta2,
    );

    const records = await ServiceJob.getAll(context);
    expect(records).toHaveLength(2);
    expect(records).toStrictEqual([
      {
        id: jobId1,
        meta: meta1,
        failInfo: null,
        runCount: 0,
        runFailCount: 0,
      },
      {
        id: jobId2,
        meta: meta2,
        failInfo: null,
        runCount: 0,
        runFailCount: 0,
      },
    ]);
  });

  it("Should not register a job handler with the same name", () => {
    const schema = z.object({ param: z.string() });
    const cb = () => {};

    ServiceJob.registerHandler("TEST_JOB" as IJobName, { schema, cb });

    expect(() =>
      ServiceJob.registerHandler("TEST_JOB" as IJobName, { schema, cb }),
    ).toThrowError(/Job handler already exists: TEST_JOB/);
  });

  it("Should schedule a job immediately", async () => {
    const schema = z.object({ param: z.string() });
    const cb = vi.fn();
    ServiceJob.registerHandler("IMMEDIATE_JOB" as IJobName, { schema, cb });

    const meta: IJobMeta = {
      name: "IMMEDIATE_JOB" as IJobName,
      type: "IMMEDIATE",
      param: { param: "test" },
    };

    await ServiceJob.schedule(context, context.orgId, meta);

    expect(cb).toHaveBeenCalledWith(expect.anything(), { param: "test" });

    const records = await context.db
      .select({ id: TbJob.id, meta: TbJob.meta, createdAt: TbJob.createdAt })
      .from(TbJob);

    expect(records).toHaveLength(0);
  });

  it("Should schedule and run a one-time job", async () => {
    const schema = z.object({ param: z.string() });
    const cb = vi.fn();
    ServiceJob.registerHandler("ONE_TIME_JOB" as IJobName, { schema, cb });

    const meta: IJobMeta = {
      name: "ONE_TIME_JOB" as IJobName,
      type: "ONE_TIME",
      datetime: UtilDate.objToIsoDatetime(new Date(Date.now() + 10000)),
      param: { param: "test" },
    };

    await ServiceJob.schedule(context, context.orgId, meta);

    vi.advanceTimersByTime(20000);

    // Wait for internal schedule system handles the job and deletes the record.
    await vi.runAllTimersAsync();

    expect(cb).toHaveBeenCalledWith(expect.anything(), { param: "test" });
    expect(cb).toHaveBeenCalledOnce();

    const records = await context.db
      .select({ id: TbJob.id, meta: TbJob.meta, createdAt: TbJob.createdAt })
      .from(TbJob);

    expect(records).toHaveLength(0);
  });

  it("Should run an outdated one-time job immediately", async () => {
    const schema = z.object({ param: z.string() });
    const cb = vi.fn();
    ServiceJob.registerHandler("ONE_TIME_JOB" as IJobName, { schema, cb });

    const meta: IJobMeta = {
      name: "ONE_TIME_JOB" as IJobName,
      type: "ONE_TIME",
      datetime: UtilDate.objToIsoDatetime(new Date(Date.now() - 10000)),
      param: { param: "test" },
    };

    await ServiceJob.schedule(context, context.orgId, meta);

    expect(cb).toHaveBeenCalledWith(expect.anything(), { param: "test" });
    expect(cb).toHaveBeenCalledOnce();

    const records = await context.db
      .select({ id: TbJob.id, meta: TbJob.meta, createdAt: TbJob.createdAt })
      .from(TbJob);

    expect(records).toHaveLength(0);
  });

  it("Should schedule a cron job", async () => {
    const schema = z.object({ param: z.string() });
    const cb = vi.fn();
    ServiceJob.registerHandler("CRON_JOB" as IJobName, { schema, cb });

    const meta: IJobMeta = {
      name: "CRON_JOB" as IJobName,
      type: "CRON",
      rule: "*/1 * * * *",
      param: { param: "test" },
    };

    await ServiceJob.schedule(context, context.orgId, meta);
    vi.advanceTimersByTime(120000);
    expect(cb).toHaveBeenCalledWith(expect.anything(), { param: "test" });
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it("Should run cron jobs by priority", async () => {
    const schema = z.object({ param: z.string() });
    const cb = vi.fn();
    ServiceJob.registerHandler("CRON_JOB" as IJobName, { schema, cb });

    const job1 = await ServiceJob.schedule(context, context.orgId, {
      name: "CRON_JOB" as IJobName,
      type: "CRON",
      rule: "* * * * *",
      param: { param: "job 1 - no priority" },
    });
    const job2 = await ServiceJob.schedule(context, context.orgId, {
      name: "CRON_JOB" as IJobName,
      type: "CRON",
      rule: "* * * * *",
      priority: 1,
      param: { param: "job 2 - priority 1" },
    });
    const job3 = await ServiceJob.schedule(context, context.orgId, {
      name: "CRON_JOB" as IJobName,
      type: "CRON",
      rule: "* * * * *",
      priority: 2,
      param: { param: "job 3 - priority 2" },
    });
    const job4 = await ServiceJob.schedule(context, context.orgId, {
      name: "CRON_JOB" as IJobName,
      type: "CRON",
      rule: "* * * * *",
      priority: 1,
      param: { param: "job 4 - priority 1" },
    });

    vi.advanceTimersByTime(60000);

    // runAllTimersAsync inifintely runs cron jobs, that's why jobs are removed here.
    await ServiceJob.remove(context, job1.id);
    await ServiceJob.remove(context, job2.id);
    await ServiceJob.remove(context, job3.id);
    await ServiceJob.remove(context, job4.id);
    await vi.runAllTimersAsync();

    expect(cb.mock.calls.map((d) => d.slice(1))).toStrictEqual([
      [{ param: "job 2 - priority 1" }],
      [{ param: "job 4 - priority 1" }],
      [{ param: "job 3 - priority 2" }],
      [{ param: "job 1 - no priority" }],
    ]);
  });

  it("Should not call the handler when the param type does not match the expected type", async () => {
    const schema = z.object({ param: z.number() });
    const cb = vi.fn();
    ServiceJob.registerHandler("ONE_TIME_JOB" as IJobName, { schema, cb });

    const meta: IJobMeta = {
      name: "ONE_TIME_JOB" as IJobName,
      type: "ONE_TIME",
      datetime: UtilDate.objToIsoDatetime(new Date(Date.now() + 10000)),
      param: { param: "test" },
    };

    await ServiceJob.schedule(context, context.orgId, meta);

    vi.advanceTimersByTime(20000);

    expect(cb).not.toHaveBeenCalled();
  });
  it("Should handle handler not found", async () => {
    const meta: IJobMeta = {
      name: "NON_EXISTENT_JOB" as IJobName,
      type: "IMMEDIATE",
      param: { param: "test" },
    };

    await ServiceJob.schedule(context, context.orgId, meta);

    const records = await context.db
      .select({
        id: TbJob.id,
        meta: TbJob.meta,
        createdAt: TbJob.createdAt,
        failInfo: TbJob.failInfo,
      })
      .from(TbJob);

    expect(records).toHaveLength(1);
    expect(records[0].failInfo).toBeDefined();
  });

  it("Should handle invalid parameter", async () => {
    const schema = z.object({ param: z.number() });
    const cb = vi.fn();
    ServiceJob.registerHandler("INVALID_PARAM_JOB" as IJobName, {
      schema,
      cb,
    });

    const meta: IJobMeta = {
      name: "INVALID_PARAM_JOB" as IJobName,
      type: "IMMEDIATE",
      param: { param: "test" },
    };

    await ServiceJob.schedule(context, context.orgId, meta);

    const records = await context.db
      .select({
        id: TbJob.id,
        meta: TbJob.meta,
        createdAt: TbJob.createdAt,
        failInfo: TbJob.failInfo,
      })
      .from(TbJob);

    expect(records).toHaveLength(1);
    expect(records[0].failInfo).toBeDefined();
  });

  it("Should handle handler error", async () => {
    const schema = z.object({ param: z.string() });
    const cb = vi.fn().mockImplementation(() => {
      throw new Error("Handler error");
    });
    ServiceJob.registerHandler("ERROR_JOB" as IJobName, { schema, cb });

    const meta: IJobMeta = {
      name: "ERROR_JOB" as IJobName,
      type: "IMMEDIATE",
      param: { param: "test" },
    };

    await ServiceJob.schedule(context, context.orgId, meta);

    const records = await context.db
      .select({
        id: TbJob.id,
        meta: TbJob.meta,
        createdAt: TbJob.createdAt,
        failInfo: TbJob.failInfo,
      })
      .from(TbJob);

    expect(records).toHaveLength(1);
    expect(records[0].failInfo).toBeDefined();
  });

  it("Should run non-failed one_time and immediate jobs on init", async () => {
    const schema = z.object({ param: z.string() });
    const cb = vi.fn();
    ServiceJob.registerHandler("UNIQUE_TEST_JOB" as IJobName, { schema, cb });

    const meta1: IJobMeta = {
      name: "UNIQUE_TEST_JOB" as IJobName,
      type: "ONE_TIME",
      datetime: UtilDate.objToIsoDatetime(new Date(Date.now() - 10000)),
      param: { param: "test" },
    };
    await context.db.insert(TbJob).values({
      orgId: context.orgId,
      meta: meta1,
      createdAt: context.nowDatetime,
    });

    const meta2: IJobMeta = {
      name: "UNIQUE_TEST_JOB" as IJobName,
      type: "IMMEDIATE",
      param: { param: "test" },
    };
    await context.db.insert(TbJob).values({
      orgId: context.orgId,
      meta: meta2,
      createdAt: context.nowDatetime,
    });

    await ServiceJob.init(context);

    expect(cb).toHaveBeenCalledTimes(2);
  });

  it("Should not reschedule failed one_time and immediate jobs on init", async () => {
    const schema = z.object({ param: z.string() });
    const cb = vi.fn();
    ServiceJob.registerHandler("UNIQUE_TEST_JOB" as IJobName, { schema, cb });

    const meta1: IJobMeta = {
      name: "UNIQUE_TEST_JOB" as IJobName,
      type: "ONE_TIME",
      datetime: UtilDate.objToIsoDatetime(new Date(Date.now() - 10000)),
      param: { param: "test" },
    };
    await context.db.insert(TbJob).values({
      orgId: context.orgId,
      meta: meta1,
      createdAt: context.nowDatetime,
      failInfo: { msg: "Failed", datetime: context.nowDatetime },
    });

    const meta2: IJobMeta = {
      name: "UNIQUE_TEST_JOB" as IJobName,
      type: "IMMEDIATE",
      param: { param: "test" },
    };
    await context.db.insert(TbJob).values({
      orgId: context.orgId,
      meta: meta2,
      createdAt: context.nowDatetime,
      failInfo: { msg: "Failed", datetime: context.nowDatetime },
    });

    await ServiceJob.init(context);

    // expect(handler).not.toHaveBeenCalled();
    // When test failed, ".not.toHaveBeenCalledTimes" hangs (weird vitest bug)
    expect(cb).toHaveBeenCalledTimes(0);
  });

  it("Should not run job during maintenance and run after maintenance", async () => {
    const schema = z.object({ param: z.string() });
    const cb = vi.fn();
    const jobNames = [
      "FUTURE_JOB",
      "EXAMPLE_JOB",
      "NOW_JOB",
    ] as unknown as IJobName[];

    for (const name of jobNames) {
      ServiceJob.registerHandler(name, { schema, cb });
    }

    const meta: IJobMeta = {
      name: "FUTURE_JOB" as IJobName,
      type: "ONE_TIME",
      datetime: UtilDate.objToIsoDatetime(new Date(Date.now() + 10000)),
      param: { param: "test" },
    };
    const meta2: IJobMeta = {
      name: "NOW_JOB" as IJobName,
      type: "IMMEDIATE",
      param: { param: "test" },
    };
    await ServiceJob.schedule(context, context.orgId, meta);

    await ServiceMaintenance.set(context, true);
    await ServiceJob.schedule(context, context.orgId, meta2);

    vi.advanceTimersByTime(20000);
    await vi.runAllTimersAsync();

    const records = await context.db
      .select({ id: TbJob.id, meta: TbJob.meta, createdAt: TbJob.createdAt })
      .from(TbJob);

    expect(records).toHaveLength(2);
    expect(cb).toHaveBeenCalledTimes(0);

    await ServiceMaintenance.set(context, false);

    await vi.runAllTimersAsync();

    const records2 = await context.db
      .select({ id: TbJob.id, meta: TbJob.meta, createdAt: TbJob.createdAt })
      .from(TbJob);

    expect(records2).toHaveLength(0);
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it("Should remove immediate job and must cancel", async () => {
    const schema = z.object({ param: z.string() });
    const cb = vi.fn();
    ServiceJob.registerHandler("NOW_JOB" as IJobName, { schema, cb });

    const meta: IJobMeta = {
      name: "NOW_JOB" as IJobName,
      type: "IMMEDIATE",
      param: { param: "test" },
    };

    await ServiceMaintenance.set(context, true);
    const job = await ServiceJob.schedule(context, context.orgId, meta);

    await ServiceJob.remove(context, job.id);

    const jobs = await ServiceJob.getAll(context);
    expect(jobs).toStrictEqual([]);
  });

  it("Should remove one_time job and must cancel", async () => {
    const schema = z.object({ param: z.string() });
    const cb = vi.fn();
    ServiceJob.registerHandler("FUTURE_JOB" as IJobName, { schema, cb });

    const meta: IJobMeta = {
      name: "FUTURE_JOB" as IJobName,
      type: "ONE_TIME",
      datetime: UtilDate.objToIsoDatetime(new Date(Date.now() + 10000)),
      param: { param: "test" },
    };

    const job = await ServiceJob.schedule(context, context.orgId, meta);

    await ServiceJob.remove(context, job.id);

    const jobs = await ServiceJob.getAll(context);
    expect(jobs).toStrictEqual([]);
  });

  it("Should return the list of registered job handlers", () => {
    expect(ServiceJob.getRegisteredHandlerNames()).toStrictEqual([]);

    const schema = z.object({ param: z.string() });
    const cb = () => {};
    ServiceJob.registerHandler("TEST_HANDLER" as IJobName, { schema, cb });
    const handlerNames = ServiceJob.getRegisteredHandlerNames();
    expect(handlerNames).toStrictEqual(["TEST_HANDLER"]);
  });

  it("Should increment run count on cron jobs", async () => {
    const schema = z.object({ param: z.string() });
    const cb = vi.fn();
    ServiceJob.registerHandler("COUNT_TEST_JOB" as IJobName, { schema, cb });

    const meta: IJobMeta = {
      name: "COUNT_TEST_JOB" as IJobName,
      type: "CRON",
      rule: "*/1 * * * *",
      param: { param: "test" },
    };

    const { id: jobId } = await ServiceJob.schedule(
      context,
      context.orgId,
      meta,
    );

    vi.advanceTimersByTime(180000);
    await vi.runOnlyPendingTimersAsync();

    expect(cb).toHaveBeenCalledTimes(4);

    const records = await ServiceJob.getAll(context);

    expect(records).toStrictEqual([
      {
        failInfo: null,
        id: jobId,
        meta: {
          name: "COUNT_TEST_JOB",
          param: {
            param: "test",
          },
          rule: "*/1 * * * *",
          type: "CRON",
        },
        runCount: 4,
        runFailCount: 0,
      },
    ]);
  });

  it("Should increment run fail counts on failed cron jobs", async () => {
    const schema = z.object({ param: z.string() });
    const cb = vi.fn().mockImplementation(() => {
      throw new Error("Handler error");
    });
    ServiceJob.registerHandler("FAIL_COUNT_JOB" as IJobName, { schema, cb });

    const meta: IJobMeta = {
      name: "FAIL_COUNT_JOB" as IJobName,
      type: "CRON",
      rule: "*/1 * * * *",
      param: { param: "test" },
    };

    const { id: jobId } = await ServiceJob.schedule(
      context,
      context.orgId,
      meta,
    );

    vi.advanceTimersByTime(180000);
    await vi.runOnlyPendingTimersAsync();

    const records = await ServiceJob.getAll(context);

    expect(records).toStrictEqual([
      {
        failInfo: { datetime: expect.any(String), msg: "Error: Handler error" },
        id: jobId,
        meta: {
          name: "FAIL_COUNT_JOB",
          param: {
            param: "test",
          },
          rule: "*/1 * * * *",
          type: "CRON",
        },
        runCount: 4,
        runFailCount: 4,
      },
    ]);
  });
});
