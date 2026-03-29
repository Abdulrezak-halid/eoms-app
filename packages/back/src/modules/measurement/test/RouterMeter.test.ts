import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperDepartment } from "../../base/test/TestHelperDepartment";
import { TestHelperMetric } from "./TestHelperMetric";

describe("E2E - RouterMeter", () => {
  it("should be create", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const metric = await TestHelperMetric.create(client, "Metric", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const res = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Test Meter",
        energyResource: "ELECTRIC",
        metricId: metric.id,
        departmentId,
        energyConversionRate: 1,
        isMain: false,
      },
    });

    expect(res).toBeApiOk();

    const createdId = res.data!.id;

    const getRes = await client.GET("/u/measurement/meter/item/{id}", {
      params: {
        path: { id: createdId },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });
    expect(getRes).toBeApiOk();

    expect(getRes.data).toStrictEqual({
      id: createdId,
      name: "Test Meter",
      energyResource: "ELECTRIC",
      energyConversionRate: 1,
      consumption: null,
      consumptionPercentage: null,
      metric: {
        id: metric.id,
        name: "Metric",
        unitGroup: "ENERGY",
      },
      slices: [
        {
          id: getRes.data?.slices[0].id,
          rate: 1,
          department: {
            id: departmentId,
            name: "Test Department",
          },
          isMain: false,
        },
      ],
    });
  });

  it("should throw error when creating meter with avg metric", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const resMetric = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "Test Metric",
        description: "Metric Description",
        unitGroup: "TIME",
        type: "GAUGE",
      },
    });
    expect(resMetric).toBeApiOk();

    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const payload = {
      name: "Test Meter",
      energyResource: "ELECTRIC",
      departmentId,
      metricId: resMetric.data!.id,
      energyConversionRate: 1,
      isMain: false,
    } as const;

    const res = await client.POST("/u/measurement/meter/item", {
      body: payload,
    });

    expect(res).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("Have total value", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const metric = await TestHelperMetric.create(client, "Metric", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
    const departmentId1 = await TestHelperDepartment.create(
      client,
      "department1",
    );
    const departmentId2 = await TestHelperDepartment.create(
      client,
      "department2",
    );

    await TestHelperMetric.addValues(session.orgId, metric.id, [
      { value: 0, datetime: "2025-01-01T00:00:00Z" },
      { value: 100, datetime: "2025-02-01T00:00:00Z" },
    ]);

    const res = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Test Meter",
        energyResource: "ELECTRIC",
        metricId: metric.id,
        departmentId: departmentId1,
        energyConversionRate: 1,
        isMain: false,
      },
    });
    expect(res).toBeApiOk();
    const meterId = res.data!.id;

    const createSlicePayload = [
      {
        rate: 0.6,
        departmentId: departmentId1,
        isMain: false,
      },
      {
        rate: 0.4,
        departmentId: departmentId2,
        isMain: false,
      },
    ];

    const createSliceRes = await client.POST(
      "/u/measurement/meter/slice/{meterId}",
      {
        params: { path: { meterId } },
        body: createSlicePayload,
      },
    );
    expect(createSliceRes).toBeApiOk();

    const meter = await client.GET("/u/measurement/meter/item/{id}", {
      params: {
        path: { id: meterId },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });

    expect(meter).toBeApiOk();

    const firstSlice = meter.data!.slices.find(
      (s) => s.department.id === departmentId1,
    )!;
    const secondSlice = meter.data!.slices.find(
      (s) => s.department.id === departmentId2,
    )!;

    const getRes = await client.GET("/u/measurement/meter/item/{id}", {
      params: {
        path: { id: meterId },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });
    expect(getRes).toBeApiOk();

    // Test meter API
    expect(getRes.data).toStrictEqual({
      id: meterId,
      name: "Test Meter",
      energyResource: "ELECTRIC",
      energyConversionRate: 1,
      consumption: 100,
      consumptionPercentage: 99.99999701976785,
      metric: {
        id: metric.id,
        name: "Metric",
        unitGroup: "ENERGY",
      },
      slices: [
        {
          id: firstSlice.id,
          rate: 0.6,
          department: {
            id: departmentId1,
            name: "department1",
          },
          isMain: false,
        },
        {
          id: secondSlice.id,
          rate: 0.4,
          department: {
            id: departmentId2,
            name: "department2",
          },
          isMain: false,
        },
      ],
    });

    // Test slices API
    const getSlicesRes = await client.GET("/u/measurement/meter/slice", {
      params: { query: TestHelperMetric.getFullDatetimeRangeQuery() },
    });
    expect(getSlicesRes).toBeApiOk();
    expect(getSlicesRes.data).toStrictEqual({
      records: [
        {
          id: firstSlice.id,
          rate: 0.6,
          energyResource: "ELECTRIC",
          department: {
            id: departmentId1,
            name: "department1",
          },
          meterId,
          name: "Metric - department1",
          metric: {
            id: metric.id,
            name: "Metric",
            unitGroup: "ENERGY",
          },
          consumption: 60.00000238418579,
          consumptionPercentage: 60.00000059604643,
          isMain: false,
        },
        {
          id: secondSlice.id,
          rate: 0.4,
          meterId,
          energyResource: "ELECTRIC",
          metric: {
            id: metric.id,
            name: "Metric",
            unitGroup: "ENERGY",
          },
          name: "Metric - department2",
          department: {
            id: departmentId2,
            name: "department2",
          },
          consumption: 40.00000059604645,
          consumptionPercentage: 39.99999940395357,
          isMain: false,
        },
      ],
    });
  });

  it("Percentage should be calculated correctly if there is no main meter", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const metric1 = await TestHelperMetric.create(client, "Metric 1", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
    const metric2 = await TestHelperMetric.create(client, "Metric 2", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
    const metricGas = await TestHelperMetric.create(client, "Metric Gas", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
    const departmentId1 = await TestHelperDepartment.create(
      client,
      "department1",
    );

    await TestHelperMetric.addValues(session.orgId, metric1.id, [
      { value: 0, datetime: "2025-01-01T00:00:00Z" },
      { value: 100, datetime: "2025-02-01T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, metric2.id, [
      { value: 0, datetime: "2025-01-01T00:00:00Z" },
      { value: 300, datetime: "2025-02-01T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, metricGas.id, [
      { value: 0, datetime: "2025-01-01T00:00:00Z" },
      { value: 200, datetime: "2025-02-01T00:00:00Z" },
    ]);

    const resMeter1 = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Test Meter 1",
        energyResource: "ELECTRIC",
        metricId: metric1.id,
        departmentId: departmentId1,
        energyConversionRate: 1,
        isMain: false,
      },
    });
    expect(resMeter1).toBeApiOk();
    const meter1 = resMeter1.data!;

    const resMeter2 = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Test Meter 2",
        energyResource: "ELECTRIC",
        metricId: metric2.id,
        departmentId: departmentId1,
        energyConversionRate: 1,
        isMain: false,
      },
    });
    expect(resMeter2).toBeApiOk();
    const meter2 = resMeter2.data!;

    const resMeterGas = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Test Meter Gas",
        energyResource: "GAS",
        metricId: metricGas.id,
        departmentId: departmentId1,
        energyConversionRate: 1,
        isMain: false,
      },
    });
    expect(resMeterGas).toBeApiOk();
    const meterGas = resMeterGas.data!;

    const getRes = await client.GET("/u/measurement/meter/item/{id}", {
      params: {
        path: { id: meter1.id },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });
    expect(getRes).toBeApiOk();

    // Test meter API
    expect(getRes.data).toStrictEqual({
      id: meter1.id,
      name: "Test Meter 1",
      energyResource: "ELECTRIC",
      energyConversionRate: 1,
      consumption: 100,
      consumptionPercentage: 25, // 100 / (100 + 300)
      metric: {
        id: metric1.id,
        name: "Metric 1",
        unitGroup: "ENERGY",
      },
      slices: [
        {
          id: meter1.sliceId,
          rate: 1,
          department: {
            id: departmentId1,
            name: "department1",
          },
          isMain: false,
        },
      ],
    });

    // Test slices API
    const getSlicesRes = await client.GET("/u/measurement/meter/slice", {
      params: { query: TestHelperMetric.getFullDatetimeRangeQuery() },
    });
    expect(getSlicesRes).toBeApiOk();
    expect(getSlicesRes.data).toStrictEqual({
      records: [
        {
          id: meter1.sliceId,
          rate: 1,
          energyResource: "ELECTRIC",
          department: {
            id: departmentId1,
            name: "department1",
          },
          meterId: meter1.id,
          name: "Metric 1 - department1",
          metric: {
            id: metric1.id,
            name: "Metric 1",
            unitGroup: "ENERGY",
          },
          consumption: 100,
          consumptionPercentage: 25, // 100 / (100 + 300)
          isMain: false,
        },
        {
          id: meter2.sliceId,
          rate: 1,
          energyResource: "ELECTRIC",
          department: {
            id: departmentId1,
            name: "department1",
          },
          meterId: meter2.id,
          name: "Metric 2 - department1",
          metric: {
            id: metric2.id,
            name: "Metric 2",
            unitGroup: "ENERGY",
          },
          consumption: 300,
          consumptionPercentage: 75, // 300 / (100 + 300)
          isMain: false,
        },
        {
          id: meterGas.sliceId,
          rate: 1,
          energyResource: "GAS",
          department: {
            id: departmentId1,
            name: "department1",
          },
          meterId: meterGas.id,
          name: "Metric Gas - department1",
          metric: {
            id: metricGas.id,
            name: "Metric Gas",
            unitGroup: "ENERGY",
          },
          consumption: 200,
          consumptionPercentage: 100,
          isMain: false,
        },
      ],
    });
  });

  it("Have value multiplied with conversion rate ", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const metric = await TestHelperMetric.create(client, "Metric", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
    const departmentId1 = await TestHelperDepartment.create(
      client,
      "department1",
    );
    const departmentId2 = await TestHelperDepartment.create(
      client,
      "department2",
    );

    await TestHelperMetric.addValues(session.orgId, metric.id, [
      { value: 0, datetime: "2025-01-01T00:00:00Z" },
      { value: 100, datetime: "2025-02-01T00:00:00Z" },
    ]);

    const res = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Test Meter",
        energyResource: "ELECTRIC",
        metricId: metric.id,
        departmentId: departmentId1,
        energyConversionRate: 3.25,
        isMain: false,
      },
    });
    expect(res).toBeApiOk();
    const meterId = res.data!.id;

    const createSlicePayload = [
      {
        rate: 0.6,
        departmentId: departmentId1,
        isMain: false,
      },
      {
        rate: 0.4,
        departmentId: departmentId2,
        isMain: false,
      },
    ];

    const createSliceRes = await client.POST(
      "/u/measurement/meter/slice/{meterId}",
      {
        params: { path: { meterId } },
        body: createSlicePayload,
      },
    );
    expect(createSliceRes).toBeApiOk();

    const meter = await client.GET("/u/measurement/meter/item/{id}", {
      params: {
        path: { id: meterId },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });

    expect(meter).toBeApiOk();

    const [sliceId1, sliceId2] = createSliceRes.data!.createdIds;

    const getRes = await client.GET("/u/measurement/meter/item/{id}", {
      params: {
        path: { id: meterId },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });
    expect(getRes).toBeApiOk();

    // Test meter API
    expect(getRes.data).toStrictEqual({
      id: meterId,
      name: "Test Meter",
      energyResource: "ELECTRIC",
      energyConversionRate: 3.25,
      consumption: 325,
      consumptionPercentage: 99.99999701976785,
      metric: {
        id: metric.id,
        name: "Metric",
        unitGroup: "ENERGY",
      },
      slices: [
        {
          id: sliceId1,
          rate: 0.6,
          department: {
            id: departmentId1,
            name: "department1",
          },
          isMain: false,
        },
        {
          id: sliceId2,
          rate: 0.4,
          department: {
            id: departmentId2,
            name: "department2",
          },
          isMain: false,
        },
      ],
    });

    // Test slices API
    const getSlicesRes = await client.GET("/u/measurement/meter/slice", {
      params: { query: TestHelperMetric.getFullDatetimeRangeQuery() },
    });
    expect(getSlicesRes).toBeApiOk();
    expect(getSlicesRes.data).toStrictEqual({
      records: [
        {
          id: sliceId1,
          rate: 0.6,
          department: {
            id: departmentId1,
            name: "department1",
          },
          meterId,
          energyResource: "ELECTRIC",
          name: "Metric - department1",
          metric: {
            id: metric.id,
            name: "Metric",
            unitGroup: "ENERGY",
          },
          consumption: 195.00000774860382,
          consumptionPercentage: 60.00000059604643,
          isMain: false,
        },
        {
          id: sliceId2,
          rate: 0.4,
          meterId,
          energyResource: "ELECTRIC",
          name: "Metric - department2",
          metric: {
            id: metric.id,
            name: "Metric",
            unitGroup: "ENERGY",
          },
          department: {
            id: departmentId2,
            name: "department2",
          },
          consumption: 130.00000193715096,
          consumptionPercentage: 39.99999940395357,
          isMain: false,
        },
      ],
    });
  });

  it("should be list", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const metric = await TestHelperMetric.create(client, "Metric", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const createResponse = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Test Meter",
        energyResource: "ELECTRIC",
        departmentId,
        metricId: metric.id,
        energyConversionRate: 1,
        isMain: false,
      },
    });
    expect(createResponse).toBeApiOk();

    const createdId = createResponse.data!.id;

    const res = await client.GET("/u/measurement/meter/item", {
      params: { query: TestHelperMetric.getFullDatetimeRangeQuery() },
    });
    expect(res).toBeApiOk();

    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          name: "Test Meter",
          consumption: null,
          consumptionPercentage: null,
          energyResource: "ELECTRIC",
          energyConversionRate: 1,
          metric: {
            id: metric.id,
            name: "Metric",
            unitGroup: "ENERGY",
          },
          slices: [
            {
              department: {
                id: departmentId,
                name: "Test Department",
              },
              id: res.data?.records[0].slices[0].id,
              rate: 1,
              isMain: false,
            },
          ],
        },
      ],
    });
  });

  it("should be list by energy resource", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const metric = await TestHelperMetric.create(client, "Metric", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });

    await TestHelperMetric.create(client, "Metric 2", {
      unitGroup: "TEMPERATURE",
      type: "GAUGE",
    });

    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const createResponse = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Test Meter",
        energyResource: "ELECTRIC",
        departmentId,
        metricId: metric.id,
        energyConversionRate: 1,
        isMain: false,
      },
    });
    expect(createResponse).toBeApiOk();

    const createOtherResponse = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Test Meter 2",
        energyResource: "WATER",
        departmentId,
        metricId: metric.id,
        energyConversionRate: 1,
        isMain: false,
      },
    });
    expect(createOtherResponse).toBeApiOk();

    const createdId = createResponse.data!.id;
    const { datetimeMin, datetimeMax } =
      TestHelperMetric.getFullDatetimeRangeQuery();
    const res = await client.GET("/u/measurement/meter/item", {
      params: {
        query: {
          datetimeMin,
          datetimeMax,
          energyResource: "ELECTRIC",
        },
      },
    });
    expect(res).toBeApiOk();

    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          name: "Test Meter",
          consumption: null,
          consumptionPercentage: null,
          energyResource: "ELECTRIC",
          energyConversionRate: 1,
          metric: {
            id: metric.id,
            name: "Metric",
            unitGroup: "ENERGY",
          },
          slices: [
            {
              department: {
                id: departmentId,
                name: "Test Department",
              },
              id: res.data?.records[0].slices[0].id,
              rate: 1,
              isMain: false,
            },
          ],
        },
      ],
    });
  });

  it("should update", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const metric = await TestHelperMetric.create(client, "Metric", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const createRes = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Test Meter",
        energyResource: "ELECTRIC",
        departmentId,
        metricId: metric.id,
        energyConversionRate: 1,
        isMain: false,
      },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const updateRes = await client.PUT("/u/measurement/meter/item/{id}", {
      params: { path: { id: createdId } },
      body: {
        name: "Test Meter",
        energyResource: "GAS",
        energyConversionRate: 1.25,
        metricId: metric.id,
      },
    });
    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/measurement/meter/item/{id}", {
      params: {
        path: { id: createdId },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });
    expect(getRes).toBeApiOk();

    expect(getRes.data).toStrictEqual({
      id: createdId,
      name: "Test Meter",
      energyResource: "GAS",
      energyConversionRate: 1.25,
      consumption: null,
      consumptionPercentage: null,
      metric: {
        id: metric.id,
        name: "Metric",
        unitGroup: "ENERGY",
      },
      slices: [
        {
          department: {
            id: departmentId,
            name: "Test Department",
          },
          id: getRes.data?.slices[0].id,
          rate: 1,
          isMain: false,
        },
      ],
    });
  });

  it("should delete", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const metric = await TestHelperMetric.create(client, "Metric", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const res = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Test Meter",
        energyResource: "ELECTRIC",
        metricId: metric.id,
        departmentId,
        energyConversionRate: 1,
        isMain: false,
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE("/u/measurement/meter/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET("/u/measurement/meter/item/{id}", {
      params: {
        path: { id: createdId },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });
    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("should return the correct meter details", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const metric = await TestHelperMetric.create(client, "Metric", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const createRes = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Test Meter",
        energyResource: "ELECTRIC",
        metricId: metric.id,
        departmentId,
        energyConversionRate: 1,
        isMain: false,
      },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET("/u/measurement/meter/item/{id}", {
      params: {
        path: { id: createdId },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });
    expect(getRes).toBeApiOk();
    expect(getRes.data).toStrictEqual({
      id: createdId,
      name: "Test Meter",
      energyResource: "ELECTRIC",
      energyConversionRate: 1,
      consumption: null,
      consumptionPercentage: null,
      metric: {
        id: metric.id,
        name: "Metric",
        unitGroup: "ENERGY",
      },
      slices: [
        {
          department: {
            id: departmentId,
            name: "Test Department",
          },
          id: getRes.data?.slices[0].id,
          rate: 1,
          isMain: false,
        },
      ],
    });
  });

  it("Should check metric energy resource compability correctly for ELECTRICITY energy resource", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const metricVolume = await TestHelperMetric.create(
      client,
      "Metric Volume",
      { unitGroup: "VOLUME", type: "COUNTER" },
    );
    const metricEnergy = await TestHelperMetric.create(
      client,
      "Metric Energy",
      { unitGroup: "ENERGY", type: "COUNTER" },
    );

    const res1 = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Meter Volume",
        energyResource: "ELECTRIC",
        energyConversionRate: 1,
        metricId: metricVolume.id,
        departmentId,
        isMain: false,
      },
    });
    expect(res1).toBeApiError(EApiFailCode.BAD_REQUEST);

    const res2 = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Meter Energy",
        energyResource: "ELECTRIC",
        energyConversionRate: 1,
        metricId: metricEnergy.id,
        departmentId,
        isMain: false,
      },
    });
    expect(res2).toBeApiOk();
  });

  it("Should check metric energy resource compability correctly for non ELECTIRCITY energy resource", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const metricVolume = await TestHelperMetric.create(
      client,
      "Metric Volume",
      { unitGroup: "VOLUME", type: "COUNTER" },
    );
    const metricEnergy = await TestHelperMetric.create(
      client,
      "Metric Energy",
      { unitGroup: "ENERGY", type: "COUNTER" },
    );
    const metricPiece = await TestHelperMetric.create(client, "Metric Piece", {
      unitGroup: "PIECE",
    });

    const res1 = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Meter Piece",
        energyResource: "GAS",
        energyConversionRate: 1,
        metricId: metricPiece.id,
        departmentId,
        isMain: false,
      },
    });
    expect(res1).toBeApiError(EApiFailCode.BAD_REQUEST);

    const res2 = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Meter Volume",
        energyResource: "GAS",
        energyConversionRate: 1,
        metricId: metricVolume.id,
        departmentId,
        isMain: false,
      },
    });
    expect(res2).toBeApiOk();

    const res3 = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Meter Energy",
        energyResource: "GAS",
        energyConversionRate: 1,
        metricId: metricEnergy.id,
        departmentId,
        isMain: false,
      },
    });
    expect(res3).toBeApiOk();
  });

  it("should calculate consumptionPercentage for meter.", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const metricMain = await TestHelperMetric.create(client, "metric", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
    const metricSub1 = await TestHelperMetric.create(client, "metric2", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
    const metricSub2 = await TestHelperMetric.create(client, "metric3", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });

    const departmentMain = await TestHelperDepartment.create(client, "dep");
    const departmentSub1 = await TestHelperDepartment.create(client, "dept2");
    const departmentSub2 = await TestHelperDepartment.create(client, "dept3");

    await TestHelperMetric.addValues(session.orgId, metricMain.id, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 120, datetime: "2025-02-01T00:00:00.000Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, metricSub1.id, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 30, datetime: "2025-02-01T00:00:00.000Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, metricSub2.id, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 60, datetime: "2025-02-01T00:00:00.000Z" },
    ]);

    const mainMeterRes = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Meter Main",
        energyResource: "ELECTRIC",
        metricId: metricMain.id,
        departmentId: departmentMain,
        energyConversionRate: 1,
        isMain: true,
      },
    });
    expect(mainMeterRes).toBeApiOk();

    const subMeterRes1 = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Meter Sub 1",
        energyResource: "ELECTRIC",
        metricId: metricSub1.id,
        departmentId: departmentSub1,
        energyConversionRate: 1,
        isMain: false,
      },
    });
    expect(subMeterRes1).toBeApiOk();

    const subMeterRes2 = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Meter Sub 2",
        energyResource: "ELECTRIC",
        metricId: metricSub2.id,
        departmentId: departmentSub2,
        energyConversionRate: 1,
        isMain: false,
      },
    });
    expect(subMeterRes2).toBeApiOk();

    const res = await client.GET("/u/measurement/meter/item", {
      params: { query: TestHelperMetric.getFullDatetimeRangeQuery() },
    });

    expect(res).toBeApiOk();

    expect(res.data?.records.map((r) => r.consumptionPercentage)).toStrictEqual(
      [null, 25, 50],
    );
  });

  it("should be correct metric name", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const metric = await TestHelperMetric.create(client, "Metric", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const createRes = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Test Meter",
        energyResource: "ELECTRIC",
        metricId: metric.id,
        departmentId,
        energyConversionRate: 1,
        isMain: false,
      },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const res = await client.GET("/u/measurement/meter/names");

    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          name: "Test Meter",
          energyResource: "ELECTRIC",
        },
      ],
    });
  });
});
