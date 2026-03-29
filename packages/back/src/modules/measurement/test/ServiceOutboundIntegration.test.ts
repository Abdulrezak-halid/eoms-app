import { UtilDate } from "common";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { IContextUser } from "@m/core/interfaces/IContext";
import { ServiceJob } from "@m/core/services/ServiceJob";
import { ServiceNotification } from "@m/core/services/ServiceNotification";

import { IOutboundIntegrationConfig } from "../interfaces/IOutboundIntegrationConfig";
import { ServiceMetric } from "../services/ServiceMetric";
import { ServiceOutboundIntegration } from "../services/ServiceOutboundIntegration";
import { TestHelperMetric } from "./TestHelperMetric";
import { TestHelperOutboundIntegration } from "./TestHelperOutboundIntegration";

describe("ServiceOutboundIntegration", () => {
  let context: IContextUser;

  beforeEach(async () => {
    context = await UtilTest.createTestContextUser();
  });

  it("Should save metric integration and getAll", async () => {
    const id = await ServiceOutboundIntegration.create(
      context,
      "Outbound Integration",
      {
        period: "HOURLY",
        type: "MOCK_SOURCE",
        param: { waves: [] },
      },
      [],
    );

    const records = await ServiceOutboundIntegration.getAll(context);

    expect(records).toStrictEqual([
      {
        id,
        name: "Outbound Integration",
        config: {
          param: { waves: [] },
          period: "HOURLY",
          type: "MOCK_SOURCE",
        },
        outputs: [],
        enabled: true,
        lastRunAt: null,
      },
    ]);
  });

  it("Should save metric integration and get config", async () => {
    const id = await ServiceOutboundIntegration.create(
      context,
      "Outbound Integration",
      {
        period: "HOURLY",
        type: "MOCK_SOURCE",
        param: { waves: [] },
      },
      [],
    );

    const config = await ServiceOutboundIntegration.getConfig(context, id);

    expect({ id, name: "Outbound Integration", ...config }).toStrictEqual({
      id,
      name: "Outbound Integration",
      period: "HOURLY",
      type: "MOCK_SOURCE",
      param: { waves: [] },
    });
  });

  it("Should save metric integration outputs", async () => {
    const metricId1 = await ServiceMetric.create(context, {
      name: "metric 1",
      description: "metric description",
      unitGroup: "ENERGY",
      type: "GAUGE",
    });
    const metricId2 = await ServiceMetric.create(context, {
      name: "metric 2",
      description: "metric description",
      unitGroup: "ENERGY",
      type: "GAUGE",
    });

    const id = await ServiceOutboundIntegration.create(
      context,
      "Outbound Integration",
      {
        period: "HOURLY",
        type: "MOCK_SOURCE",
        param: { waves: [] },
      },
      [
        { outputKey: "output1", metricId: metricId1, unit: "ENERGY_KWH" },
        { outputKey: "output2", metricId: metricId2, unit: "ENERGY_KWH" },
      ],
    );

    // Outputs API
    const outputs = await ServiceOutboundIntegration.getOutputsWithMetricName(
      context,
      id,
    );
    expect(outputs).toStrictEqual([
      {
        outputKey: "output1",
        isHealthy: null,
        metricId: metricId1,
        metricName: "metric 1",
        unit: "ENERGY_KWH",
      },
      {
        outputKey: "output2",
        isHealthy: null,
        metricId: metricId2,
        metricName: "metric 2",
        unit: "ENERGY_KWH",
      },
    ]);

    // Get All API
    const records = await ServiceOutboundIntegration.getAll(context);
    expect(records).toStrictEqual([
      {
        id,
        name: "Outbound Integration",
        config: {
          param: { waves: [] },
          period: "HOURLY",
          type: "MOCK_SOURCE",
        },
        outputs: [
          {
            outputKey: "output1",
            metricId: metricId1,
            isHealthy: null,
            metricName: "metric 1",
            unit: "ENERGY_KWH",
          },
          {
            outputKey: "output2",
            metricId: metricId2,
            isHealthy: null,
            metricName: "metric 2",
            unit: "ENERGY_KWH",
          },
        ],
        enabled: true,
        lastRunAt: null,
      },
    ]);
  });

  it("Should remove metric integration", async () => {
    const metricId = await ServiceMetric.create(context, {
      name: "metric name",
      unitGroup: "ENERGY",
      type: "GAUGE",
      description: null,
    });

    const id = await ServiceOutboundIntegration.create(
      context,
      "Outbound Integration",
      {
        period: "HOURLY",
        type: "MOCK_SOURCE",
        param: { waves: [] },
      },
      [{ outputKey: "default", metricId, unit: "ENERGY_KWH" }],
    );

    await ServiceOutboundIntegration.remove(context, id);

    const integrations = await ServiceOutboundIntegration.getAll(context);
    expect(integrations).toStrictEqual([]);
  });

  it("Should update metric integration via second save", async () => {
    const metricId1 = await ServiceMetric.create(context, {
      name: "metric name 1",
      unitGroup: "ENERGY",
      type: "GAUGE",
      description: null,
    });

    const metricId2 = await ServiceMetric.create(context, {
      name: "metric name 2",
      unitGroup: "ENERGY",
      type: "GAUGE",
      description: null,
    });

    const id = await ServiceOutboundIntegration.create(
      context,
      "Outbound Integration",
      {
        period: "MINUTELY",
        type: "MOCK_SOURCE",
        param: { waves: [] },
      },
      [{ outputKey: "output-1", metricId: metricId1, unit: "ENERGY_WH" }],
    );

    await ServiceOutboundIntegration.update(
      context,
      id,
      "Outbound Integration",
      {
        period: "HOURLY",
        type: "MOCK_SOURCE",
        param: { waves: [{ vMul: 1, hMul: 1 }] },
      },
      [{ outputKey: "output-2", metricId: metricId2, unit: "ENERGY_WH" }],
    );

    const updatedIntegration = await ServiceOutboundIntegration.get(
      context,
      id,
    );

    expect(updatedIntegration).toStrictEqual({
      id,
      name: "Outbound Integration",
      config: {
        period: "HOURLY",
        type: "MOCK_SOURCE",
        param: { waves: [{ vMul: 1, hMul: 1 }] },
      },
      outputs: [
        {
          outputKey: "output-2",
          isHealthy: null,
          metricId: metricId2,
          metricName: "metric name 2",
          unit: "ENERGY_WH",
        },
      ],
      enabled: true,
      lastRunAt: null,
    });
  });

  it("Should run a job successfully", async () => {
    const nowDate = UtilDate.getNowIsoDatetime();

    const metricId = await ServiceMetric.create(context, {
      name: "metric name",
      description: "metric description",
      unitGroup: "ENERGY",
      type: "GAUGE",
    });

    const { mockedCb } = await TestHelperOutboundIntegration.create(context, {
      metricId,
      period: "DAILY",
      results: [
        { outputKey: "default", data: { value: 10, datetime: nowDate } },
      ],
    });

    const results = await ServiceOutboundIntegration.run(context, {
      type: "DUMMY",
      period: "DAILY",
      param: { field: "test_integration" },
    } as unknown as IOutboundIntegrationConfig);

    expect(mockedCb).toHaveBeenCalledTimes(1);
    expect(mockedCb.mock.calls[0].slice(1)).toStrictEqual([
      { period: "DAILY", outputKeys: undefined },
      { field: "test_integration" },
    ]);
    expect(results).toStrictEqual([
      { outputKey: "default", data: { value: 10, datetime: nowDate } },
    ]);
  });

  it("Enable outbound integration", async () => {
    await ServiceOutboundIntegration.create(
      context,
      "Outbound Integration",
      {
        period: "DAILY",
        type: "MOCK_SOURCE",
        param: { waves: [] },
      },
      [],
    );

    const jobs = await ServiceJob.getAll(context);

    expect(
      jobs.sort((a, b) => a.meta.name.localeCompare(b.meta.name)),
    ).toStrictEqual([
      {
        failInfo: null,
        id: expect.any(String),
        meta: {
          name: "METRIC_OUTBOUND_INTEGRATION_RUNNER",
          rule: "0 0 * * *",
          type: "CRON",
        },
        runCount: 0,
        runFailCount: 0,
      },
    ]);
  });

  it("Disable outbound integration", async () => {
    const id = await ServiceOutboundIntegration.create(
      context,
      "Outbound Integration",
      {
        period: "DAILY",
        type: "MOCK_SOURCE",
        param: { waves: [] },
      },
      [],
    );

    await ServiceOutboundIntegration.enable(context, id, false);

    const jobs = await ServiceJob.getAll(context);

    expect(jobs).toStrictEqual([]);
  });

  it("Should save metric values", async () => {
    const nowDate = UtilDate.getNowIsoDatetime();

    const metricId = await ServiceMetric.create(context, {
      name: "metric name",
      description: "metric description",
      unitGroup: "ENERGY",
      type: "GAUGE",
    });

    const { integrationId } = await TestHelperOutboundIntegration.create(
      context,
      {
        metricId,
        period: "HOURLY",
        results: [
          { outputKey: "default", data: { value: 10, datetime: nowDate } },
        ],
      },
    );

    const outputs = await ServiceOutboundIntegration.getOutputs(
      context,
      context.session.orgId,
      integrationId,
    );

    const config = {
      type: "DUMMY",
      period: "HOURLY",
      param: { field: "test_integration" },
    } as unknown as IOutboundIntegrationConfig;

    const results = await ServiceOutboundIntegration.run(context, config);

    const [resourceIdPair] = await ServiceOutboundIntegration.saveValues(
      context,
      context.session.orgId,
      integrationId,
      outputs,
      results,
      config.type,
    );

    const values = await ServiceMetric.getValues(
      context,
      "RESOURCE",
      resourceIdPair.resourceId,
      {
        ...TestHelperMetric.getFullDatetimeRangeQuery(),
        count: 1,
        page: 1,
        period: "RAW",
      },
    );

    expect(values).toStrictEqual({
      recordCount: 1,
      records: [{ value: 10, datetime: nowDate, sampleCount: 1 }],
    });
  });

  it("Should update lastRunAt on successful run", async () => {
    const nowDate = UtilDate.getNowIsoDatetime();

    const metricId = await ServiceMetric.create(context, {
      name: "metric for run test",
      unitGroup: "ENERGY",
      type: "GAUGE",
      description: null,
    });

    const { integrationId } = await TestHelperOutboundIntegration.create(
      context,
      {
        metricId,
        period: "HOURLY",
        results: [
          { outputKey: "default", data: { value: 100, datetime: nowDate } },
        ],
      },
    );

    const beforeRun = await ServiceOutboundIntegration.get(
      context,
      integrationId,
    );
    expect(beforeRun.lastRunAt).toBeNull();

    await ServiceOutboundIntegration.runAndSaveValues(
      context,
      context.session.orgId,
      integrationId,
    );

    const afterRun = await ServiceOutboundIntegration.get(
      context,
      integrationId,
    );

    expect(typeof afterRun.lastRunAt).toBeTypeOf("string");
  });

  it("Should mark integration as unhealthy and notify only once if metric save fails", async () => {
    const nowDate = UtilDate.getNowIsoDatetime();

    const metricId = await ServiceMetric.create(context, {
      name: "Test Broken Metric",
      description: "metric description",
      unitGroup: "ENERGY",
      type: "GAUGE",
    });

    const { integrationId } = await TestHelperOutboundIntegration.create(
      context,
      {
        metricId,
        period: "HOURLY",
        results: [
          { outputKey: "default", data: { value: 10, datetime: nowDate } },
        ],
      },
    );

    const outputs = await ServiceOutboundIntegration.getOutputs(
      context,
      context.session.orgId,
      integrationId,
    );

    const results = [
      { outputKey: "default", data: { value: 10, datetime: nowDate } },
    ];

    const spyAddValues = vi
      .spyOn(ServiceMetric, "addValues")
      .mockRejectedValue(new Error("Simulated Database Error"));

    const spyNotify = vi.spyOn(ServiceNotification, "notifyOrganization");

    await ServiceOutboundIntegration.saveValues(
      context,
      context.session.orgId,
      integrationId,
      outputs,
      results,
      "MOCK_SOURCE",
    );

    expect(spyNotify).toHaveBeenCalledTimes(1);
    expect(spyNotify).toHaveBeenCalledWith(context, context.session.orgId, {
      type: "OUTBOUND_INTEGRATION_BROKEN",
      integrationType: "MOCK_SOURCE",
      metricName: "Test Broken Metric",
    });

    await ServiceOutboundIntegration.saveValues(
      context,
      context.session.orgId,
      integrationId,
      outputs,
      results,
      "MOCK_SOURCE",
    );

    expect(spyNotify).toHaveBeenCalledTimes(1);

    spyAddValues.mockRestore();
    spyNotify.mockRestore();
  });
});
