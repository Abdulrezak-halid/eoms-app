import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperAdvancedRegressionAnalysis } from "@m/analysis/test/TestHelperAdvancedRegressionAnalysis";
import { TestHelperMeter } from "@m/measurement/test/TestHelperMeter";
import { TestHelperMetric } from "@m/measurement/test/TestHelperMetric";
import { TestHelperOutboundIntegration } from "@m/measurement/test/TestHelperOutboundIntegration";

describe("E2E - RouterReportSectionData", () => {
  it("Get consumption cost monthly", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "Meter", {
      isMain: true,
      energyResource: "ELECTRIC",
    });

    await TestHelperMetric.addValues(session.orgId, meter.metricId, [
      { value: 0, datetime: "2024-12-01T00:00:00Z" },
      { value: 40, datetime: "2025-01-01T00:00:00Z" },
      { value: 100, datetime: "2025-02-01T00:00:01Z" },
      { value: 180, datetime: "2025-03-02T00:00:00Z" },
      { value: 280, datetime: "2025-04-03T00:00:00Z" },
      { value: 400, datetime: "2025-05-04T00:00:00Z" },
    ]);

    const res = await client.GET(
      "/u/report/section-data/consumption-cost-monthly",
      {
        params: {
          query: {
            datetimeMin: "2025-01-01T00:00:00Z",
            datetimeMax: "2025-05-01T00:00:00Z",
          },
        },
      },
    );

    expect(res).toBeApiOk();

    expect(res.data).toStrictEqual({
      records: [
        {
          datetime: "2025-01-01T00:00:00.000Z",
          energyResources: {
            ELECTRIC: {
              consumption: 40,
              cost: 0,
            },
          },
        },
        {
          datetime: "2025-02-01T00:00:00.000Z",
          energyResources: {
            ELECTRIC: {
              consumption: 60,
              cost: 0,
            },
          },
        },
        {
          datetime: "2025-03-01T00:00:00.000Z",
          energyResources: {
            ELECTRIC: {
              consumption: 80,
              cost: 0,
            },
          },
        },
        {
          datetime: "2025-04-01T00:00:00.000Z",
          energyResources: {
            ELECTRIC: {
              consumption: 100,
              cost: 0,
            },
          },
        },
        {
          datetime: "2025-05-01T00:00:00.000Z",
          energyResources: {
            ELECTRIC: {
              consumption: 120,
              cost: 0,
            },
          },
        },
      ],
    });
  });

  it("Get Primary regressions seus and drivers", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const context = await UtilTest.createTestContextUser();

    const regression =
      await TestHelperAdvancedRegressionAnalysis.createAdvancedRegression(
        client,
        { primary: true },
      );

    await TestHelperOutboundIntegration.create(context, {
      metricId: regression.driver1.id,
      outputs: [
        {
          outputKey: "default",
          metricId: regression.driver1.id,
          unit: "TEMPERATURE_CELSIUS",
        },
      ],
    });

    const res = await client.GET(
      "/u/report/section-data/primary-regression-driver-list",
      {
        params: {
          query: {
            datetimeMin: "2025-01-01T00:00:00Z",
            datetimeMax: "2025-05-01T00:00:00Z",
          },
        },
      },
    );

    expect(res.data).toStrictEqual({
      records: [
        {
          departmentNames: ["Test Department"],
          id: expect.any(String),
          integrationPeriod: "DAILY",
          name: "Driver1",
          unitGroup: "TEMPERATURE",
        },
        {
          departmentNames: ["Test Department"],
          id: expect.any(String),
          integrationPeriod: null,
          name: "Driver2",
          unitGroup: "TEMPERATURE",
        },
      ],
    });
  });

  it("Get grouped meters", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const mainMeters = await TestHelperMeter.createMainMetersWithValues(
      client,
      session.orgId,
    );

    const res = await client.GET("/u/report/section-data/energy-consumption", {
      params: {
        query: {
          datetimeMin: "2025-01-01T00:00:00Z",
          datetimeMax: "2025-05-01T00:00:00Z",
        },
      },
    });

    expect(res.data).toStrictEqual({
      records: {
        ELECTRIC: [
          {
            consumption: 35,
            department: {
              id: mainMeters.electricMain1.departmentId,
              name: "Test Department",
            },
            energyResource: "ELECTRIC",
            id: expect.any(String),
            isMain: true,
            meterId: mainMeters.electricMain1.id,
            metric: {
              id: mainMeters.electricMain1.metricId,
              name: "Metric:Main-Electric-1",
              unitGroup: "ENERGY",
            },
            name: "Metric:Main-Electric-1 - Test Department",
            rate: 1,
          },
          {
            consumption: 20,
            department: {
              id: mainMeters.electricMain2.departmentId,
              name: "Test Department",
            },
            energyResource: "ELECTRIC",
            id: expect.any(String),
            isMain: true,
            meterId: mainMeters.electricMain2.id,
            metric: {
              id: mainMeters.electricMain2.metricId,
              name: "Metric:Main-Electric-2",
              unitGroup: "ENERGY",
            },
            name: "Metric:Main-Electric-2 - Test Department",
            rate: 1,
          },
        ],
        GAS: [
          {
            consumption: 50,
            department: {
              id: mainMeters.gasMain.departmentId,
              name: "Test Department",
            },
            energyResource: "GAS",
            id: expect.any(String),
            isMain: true,
            meterId: mainMeters.gasMain.id,
            metric: {
              id: mainMeters.gasMain.metricId,
              name: "Metric:Main-Gas",
              unitGroup: "ENERGY",
            },
            name: "Metric:Main-Gas - Test Department",
            rate: 1,
          },
        ],
        WATER: [
          {
            consumption: 20,
            department: {
              id: mainMeters.waterMain.departmentId,
              name: "Test Department",
            },
            energyResource: "WATER",
            id: expect.any(String),
            isMain: true,
            meterId: mainMeters.waterMain.id,
            metric: {
              id: mainMeters.waterMain.metricId,
              name: "Metric:Main-Water",
              unitGroup: "ENERGY",
            },
            name: "Metric:Main-Water - Test Department",
            rate: 1,
          },
        ],
      },
    });
  });
});
