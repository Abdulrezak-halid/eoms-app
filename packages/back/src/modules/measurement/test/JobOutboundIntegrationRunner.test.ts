import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { IContextUser } from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";

import { JobOutboundIntegrationRunner } from "../jobs/JobOutboundIntegrationRunner";
import { TbMetricResourceValueRaw } from "../orm/TbMetricResourceValueRaw";
import { ServiceMetric } from "../services/ServiceMetric";
import { TestHelperMetric } from "./TestHelperMetric";
import { TestHelperOutboundIntegration } from "./TestHelperOutboundIntegration";

describe("JobOutboundIntegrationRunner", () => {
  let c: IContextUser;

  beforeEach(async () => {
    c = await UtilTest.createTestContextUser();
  });

  const createMetric = async (
    name: string,
    description: string,
  ): Promise<string> => {
    return await ServiceMetric.create(c, {
      name,
      description,
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
  };

  it("group params and call the handler with correct parameters", async () => {
    const metricId1 = await createMetric("test metric 1", "test desc 1");
    const metricId2 = await createMetric("test metric 2", "test desc 2");

    const { contextJobRunner, mockedCb } =
      await TestHelperOutboundIntegration.create(c, {
        period: "HOURLY",
        outputs: [
          { outputKey: "output1", metricId: metricId1, unit: "ENERGY_KWH" },
          { outputKey: "output2", metricId: metricId2, unit: "ENERGY_KWH" },
        ],
        param: { param: "test_param" },
        results: [
          {
            outputKey: "output1",
            data: { value: 10, datetime: "2024-03-01T03:00:00.000Z" },
          },
          {
            outputKey: "output2",
            data: { value: 20, datetime: "2024-03-01T03:00:00.000Z" },
          },
        ],
      });

    await JobOutboundIntegrationRunner.cb(contextJobRunner);

    expect(mockedCb.mock.calls[0].slice(1)).toStrictEqual([
      // c,
      { period: "HOURLY", outputKeys: ["output1", "output2"] },
      // Param order is the same as metric id because table is indexed using metric id
      { param: "test_param" },
    ]);
  });

  it("run the job and save metric values correctly", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const metricId = await TestHelperMetric.create(client, "Test Metric", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });

    const { contextJobRunner } = await TestHelperOutboundIntegration.create(c, {
      period: "HOURLY",
      metricId: metricId.id,
      results: [
        {
          outputKey: "default",
          data: { value: 0, datetime: "2024-03-01T02:00:00.000Z" },
        },
        {
          outputKey: "default",
          data: { value: 10, datetime: "2024-03-01T03:00:00.000Z" },
        },
      ],
    });

    await JobOutboundIntegrationRunner.cb(contextJobRunner);

    const savedValues = await c.db
      .select({
        value: TbMetricResourceValueRaw.value,
        datetime: UtilDb.isoDatetime(TbMetricResourceValueRaw.datetime),
      })
      .from(TbMetricResourceValueRaw)
      .where(eq(TbMetricResourceValueRaw.type, "COUNTER_CUMULATIVE"))
      .orderBy(
        TbMetricResourceValueRaw.orgId,
        TbMetricResourceValueRaw.resourceId,
        TbMetricResourceValueRaw.datetime,
      );

    expect(savedValues).toStrictEqual([
      { value: 0, datetime: "2024-03-01T02:00:00.000Z" },
      { value: 10, datetime: "2024-03-01T03:00:00.000Z" },
    ]);
  });
});
