import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperMeter } from "./TestHelperMeter";
import { TestHelperMetric } from "./TestHelperMetric";
import { TestHelperSeu } from "./TestHelperSeu";

describe("E2E - RouterDataView", () => {
  it("metric view values should be ok for drivers", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const metric1 = await TestHelperMetric.create(client, "driver1");
    const metric2 = await TestHelperMetric.create(client, "driver2");

    await TestHelperMetric.addValues(session.orgId, metric1.id, [
      { value: 10, datetime: "2025-02-01T00:00:00.000Z" },
      { value: 21, datetime: "2025-02-02T00:00:00.000Z" },
      { value: 12, datetime: "2025-02-03T00:00:00.000Z" },
      { value: 50, datetime: "2025-02-04T00:00:00.000Z" },
      { value: 1, datetime: "2025-02-05T00:00:00.000Z" },
      { value: 3, datetime: "2025-02-06T00:00:00.000Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, metric2.id, [
      { value: 20, datetime: "2025-02-01T00:00:00.000Z" },
      { value: 11, datetime: "2025-02-02T00:00:00.000Z" },
      { value: 22, datetime: "2025-02-03T00:00:00.000Z" },
      { value: 40, datetime: "2025-02-04T00:00:00.000Z" },
      { value: 2, datetime: "2025-02-05T00:00:00.000Z" },
      { value: 4, datetime: "2025-02-06T00:00:00.000Z" },
    ]);

    const createRes = await client.POST("/u/measurement/data-view/profile", {
      body: {
        name: "test",
        description: "test",
        options: {
          type: "METRIC",
          metricIds: [metric1.id, metric2.id],
        },
      },
    });
    const profileId = createRes.data!.id;

    expect(createRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/measurement/data-view/values/{profileId}",
      {
        params: {
          path: { profileId: profileId },
          query: {
            datetimeMin: "2025-01-01T00:00:00.0000Z",
            datetimeMax: "2025-03-01T00:00:00.0000Z",
          },
        },
      },
    );

    expect(getRes).toBeApiOk();

    const dataOrdered = {
      ...getRes.data,
    };

    expect(dataOrdered).toStrictEqual({
      period: "DAILY",
      series: [
        {
          id: metric1.id,
          name: "driver1",
          unit: "TEMPERATURE",
          values: [
            { datetime: "2025-02-01T00:00:00.000Z", value: 10 },
            { datetime: "2025-02-02T00:00:00.000Z", value: 21 },
            { datetime: "2025-02-03T00:00:00.000Z", value: 12 },
            { datetime: "2025-02-04T00:00:00.000Z", value: 50 },
            { datetime: "2025-02-05T00:00:00.000Z", value: 1 },
            { datetime: "2025-02-06T00:00:00.000Z", value: 3 },
          ],
        },
        {
          id: metric2.id,
          name: "driver2",
          unit: "TEMPERATURE",
          values: [
            { datetime: "2025-02-01T00:00:00.000Z", value: 20 },
            { datetime: "2025-02-02T00:00:00.000Z", value: 11 },
            { datetime: "2025-02-03T00:00:00.000Z", value: 22 },
            { datetime: "2025-02-04T00:00:00.000Z", value: 40 },
            { datetime: "2025-02-05T00:00:00.000Z", value: 2 },
            { datetime: "2025-02-06T00:00:00.000Z", value: 4 },
          ],
        },
      ],
    });
  });

  it("metric view values should be ok for meter slices", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "Meter 1");
    const meter2 = await TestHelperMeter.create(client, "Meter 2");

    const meterSlice1 = meter.sliceId;
    const meterSlice2 = meter2.sliceId;

    const createRes = await client.POST("/u/measurement/data-view/profile", {
      body: {
        name: "test",
        description: "test",
        options: {
          type: "METER_SLICE",
          meterSliceIds: [meterSlice1, meterSlice2],
          energyResource: "ELECTRIC",
        },
      },
    });
    const profileId = createRes.data!.id;

    expect(createRes).toBeApiOk();

    await TestHelperMetric.addValues(session.orgId, meter.metricId, [
      { value: 10, datetime: "2025-02-01T00:00:00.000Z" },
      { value: 21, datetime: "2025-02-02T00:00:00.000Z" },
      { value: 12, datetime: "2025-02-03T00:00:00.000Z" },
      { value: 50, datetime: "2025-02-04T00:00:00.000Z" },
      { value: 1, datetime: "2025-02-05T00:00:00.000Z" },
      { value: 3, datetime: "2025-02-06T00:00:00.000Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, meter2.metricId, [
      { value: 20, datetime: "2025-02-01T00:00:00.000Z" },
      { value: 11, datetime: "2025-02-02T00:00:00.000Z" },
      { value: 22, datetime: "2025-02-03T00:00:00.000Z" },
      { value: 40, datetime: "2025-02-04T00:00:00.000Z" },
      { value: 2, datetime: "2025-02-05T00:00:00.000Z" },
      { value: 4, datetime: "2025-02-06T00:00:00.000Z" },
    ]);

    const getRes = await client.GET(
      "/u/measurement/data-view/values/{profileId}",
      {
        params: {
          path: { profileId: profileId },
          query: {
            datetimeMin: "2025-01-01T00:00:00.0000Z",
            datetimeMax: "2025-03-01T00:00:00.0000Z",
          },
        },
      },
    );

    expect(getRes).toBeApiOk();
    // TODO Records > Values > Item order is not stable, that's why it is sorted
    //   at both sides (expected and actual)
    expect(getRes.data).toStrictEqual({
      period: "DAILY",
      series: [
        {
          id: meterSlice1,
          name: "Metric:Meter 1 - Department:Meter 1",
          unit: "ENERGY",
          values: [
            { datetime: "2025-02-02T00:00:00.000Z", value: 11 },
            { datetime: "2025-02-03T00:00:00.000Z", value: 0 },
            { datetime: "2025-02-04T00:00:00.000Z", value: 38 },
            { datetime: "2025-02-05T00:00:00.000Z", value: 0 },
            { datetime: "2025-02-06T00:00:00.000Z", value: 2 },
          ],
        },
        {
          id: meterSlice2,
          name: "Metric:Meter 2 - Department:Meter 2",
          unit: "ENERGY",
          values: [
            { datetime: "2025-02-02T00:00:00.000Z", value: 0 },
            { datetime: "2025-02-03T00:00:00.000Z", value: 11 },
            { datetime: "2025-02-04T00:00:00.000Z", value: 18 },
            { datetime: "2025-02-05T00:00:00.000Z", value: 0 },
            { datetime: "2025-02-06T00:00:00.000Z", value: 2 },
          ],
        },
      ],
    });
  });

  it("metric view values should be ok for seus", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const seu2 = await TestHelperSeu.createTestSeu(client, "seu2");
    const meter1 = await TestHelperMeter.create(client, "Meter 1");

    const updateBodyPart = {
      name: "seu1",
      energyResource: "ELECTRIC",
    } as const;

    const updateRes = await client.PUT("/u/measurement/seu/item/{id}", {
      params: { path: { id: seu1.id } },
      body: {
        ...updateBodyPart,
        meterSliceIds: [meter1.sliceId, seu1.meterSlices[0].id],
        departmentIds: [],
      },
    });

    expect(updateRes).toBeApiOk();

    const createRes = await client.POST("/u/measurement/data-view/profile", {
      body: {
        name: "test",
        description: "test",
        options: {
          type: "SEU",
          energyResource: "ELECTRIC",
          seuIds: [seu1.id, seu2.id],
        },
      },
    });
    const profileId = createRes.data!.id;

    expect(createRes).toBeApiOk();

    await TestHelperMetric.addValues(session.orgId, seu1.metricId, [
      { value: 10, datetime: "2025-02-01T00:00:00.000Z" },
      { value: 21, datetime: "2025-02-02T00:00:00.000Z" },
      { value: 12, datetime: "2025-02-03T00:00:00.000Z" },
      { value: 50, datetime: "2025-02-04T00:00:00.000Z" },
      { value: 1, datetime: "2025-02-05T00:00:00.000Z" },
      { value: 3, datetime: "2025-02-06T00:00:00.000Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, seu2.metricId, [
      { value: 20, datetime: "2025-02-01T00:00:00.000Z" },
      { value: 11, datetime: "2025-02-02T00:00:00.000Z" },
      { value: 22, datetime: "2025-02-03T00:00:00.000Z" },
      { value: 40, datetime: "2025-02-04T00:00:00.000Z" },
      { value: 2, datetime: "2025-02-05T00:00:00.000Z" },
      { value: 4, datetime: "2025-02-06T00:00:00.000Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, meter1.metricId, [
      { value: 10, datetime: "2025-02-01T00:00:00.000Z" },
      { value: 21, datetime: "2025-02-02T00:00:00.000Z" },
      { value: 12, datetime: "2025-02-03T00:00:00.000Z" },
      { value: 50, datetime: "2025-02-04T00:00:00.000Z" },
      { value: 1, datetime: "2025-02-05T00:00:00.000Z" },
      { value: 3, datetime: "2025-02-06T00:00:00.000Z" },
    ]);

    const getRes = await client.GET(
      "/u/measurement/data-view/values/{profileId}",
      {
        params: {
          path: { profileId: profileId },
          query: {
            datetimeMin: "2025-01-01T00:00:00.0000Z",
            datetimeMax: "2025-03-01T00:00:00.0000Z",
          },
        },
      },
    );

    expect(getRes).toBeApiOk();

    expect(getRes.data).toStrictEqual({
      period: "DAILY",
      series: [
        {
          id: seu1.id,
          name: "seu1",
          unit: "ENERGY",
          values: [
            { datetime: "2025-02-02T00:00:00.000Z", value: 22 },
            { datetime: "2025-02-03T00:00:00.000Z", value: 0 },
            { datetime: "2025-02-04T00:00:00.000Z", value: 76 },
            { datetime: "2025-02-05T00:00:00.000Z", value: 0 },
            { datetime: "2025-02-06T00:00:00.000Z", value: 4 },
          ],
        },
        {
          id: seu2.id,
          name: "seu2",
          unit: "ENERGY",
          values: [
            { datetime: "2025-02-02T00:00:00.000Z", value: 0 },
            { datetime: "2025-02-03T00:00:00.000Z", value: 11 },
            { datetime: "2025-02-04T00:00:00.000Z", value: 18 },
            { datetime: "2025-02-05T00:00:00.000Z", value: 0 },
            { datetime: "2025-02-06T00:00:00.000Z", value: 2 },
          ],
        },
      ],
    });
  });

  it("metric view names should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const metric1 = await TestHelperMetric.create(client, "metric1");
    const metric2 = await TestHelperMetric.create(client, "metric2");

    const createRes = await client.POST("/u/measurement/data-view/profile", {
      body: {
        name: "test",
        description: "test",
        options: {
          type: "METRIC",
          metricIds: [metric1.id, metric2.id],
        },
      },
    });

    expect(createRes).toBeApiOk();

    const getRes = await client.GET("/u/measurement/data-view/names");

    expect(getRes).toBeApiOk();
    expect(getRes.data).toStrictEqual([
      {
        id: createRes.data!.id,
        name: "test",
      },
    ]);
  });
});
