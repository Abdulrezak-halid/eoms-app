import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperDepartment } from "@m/base/test/TestHelperDepartment";

import { TestHelperMeter } from "./TestHelperMeter";
import { TestHelperMetric } from "./TestHelperMetric";

describe("E2E - RouterMeterSlice", () => {
  it("should return all slices", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "meter", {
      energyResource: "ELECTRIC",
    });
    const departmentId1 = await TestHelperDepartment.create(
      client,
      "department1",
    );
    const departmentId2 = await TestHelperDepartment.create(
      client,
      "department2",
    );

    const createSlicePayload = [
      {
        name: "Slice1",
        rate: 0.6,
        departmentId: departmentId1,
        energyResource: "DIESEL",
        isMain: false,
      },
      {
        name: "Slice2",
        rate: 0.4,
        departmentId: departmentId2,
        energyResource: "DIESEL",
        isMain: false,
      },
    ];

    await client.POST("/u/measurement/meter/slice/{meterId}", {
      params: { path: { meterId: meter.id } },
      body: createSlicePayload,
    });

    const res = await client.GET("/u/measurement/meter/slice", {
      params: { query: TestHelperMetric.getFullDatetimeRangeQuery() },
    });

    expect(res.data!.records).toStrictEqual([
      {
        id: expect.any(String),
        rate: 0.6,
        name: "Metric:meter - department1",
        energyResource: "ELECTRIC",
        meterId: meter.id,
        metric: {
          id: meter.metricId,
          name: "Metric:meter",
          unitGroup: "ENERGY",
        },
        department: {
          id: departmentId1,
          name: "department1",
        },
        consumption: null,
        consumptionPercentage: null,
        isMain: false,
      },
      {
        id: expect.any(String),
        name: "Metric:meter - department2",
        energyResource: "ELECTRIC",
        rate: 0.4,
        meterId: meter.id,
        metric: {
          id: meter.metricId,
          name: "Metric:meter",
          unitGroup: "ENERGY",
        },
        department: {
          id: departmentId2,
          name: "department2",
        },
        consumption: null,
        consumptionPercentage: null,
        isMain: false,
      },
    ]);
  });

  it("should return filtered slice when send energy resource filter request", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meterElectric = await TestHelperMeter.create(
      client,
      "meter - electric",
      { energyResource: "ELECTRIC" },
    );
    const meterWater = await TestHelperMeter.create(client, "meter - water", {
      energyResource: "WATER",
    });

    // Only electric slices
    const resElectric = await client.GET("/u/measurement/meter/slice", {
      params: {
        query: {
          energyResource: "ELECTRIC",
          ...TestHelperMetric.getFullDatetimeRangeQuery(),
        },
      },
    });
    expect(resElectric).toBeApiOk();

    expect(resElectric.data!.records).toStrictEqual([
      {
        id: expect.any(String),
        name: "Metric:meter - electric - Department:meter - electric",
        rate: 1,
        energyResource: "ELECTRIC",
        meterId: meterElectric.id,
        metric: {
          id: meterElectric.metricId,
          name: "Metric:meter - electric",
          unitGroup: "ENERGY",
        },
        consumption: null,
        consumptionPercentage: null,
        department: {
          id: meterElectric.departmentId,
          name: "Department:meter - electric",
        },
        isMain: false,
      },
    ]);

    // Only water slices
    const resWater = await client.GET("/u/measurement/meter/slice", {
      params: {
        query: {
          energyResource: "WATER",
          ...TestHelperMetric.getFullDatetimeRangeQuery(),
        },
      },
    });
    expect(resWater.data!.records).toStrictEqual([
      {
        id: expect.any(String),
        name: "Metric:meter - water - Department:meter - water",
        rate: 1,
        energyResource: "WATER",
        metric: {
          id: meterWater.metricId,
          name: "Metric:meter - water",
          unitGroup: "ENERGY",
        },
        meterId: meterWater.id,
        consumption: null,
        consumptionPercentage: null,
        department: {
          id: meterWater.departmentId,
          name: "Department:meter - water",
        },
        isMain: false,
      },
    ]);

    // All slices
    const resAll = await client.GET("/u/measurement/meter/slice", {
      params: { query: TestHelperMetric.getFullDatetimeRangeQuery() },
    });

    expect(resAll.data!.records).toStrictEqual([
      {
        id: expect.any(String),
        name: "Metric:meter - electric - Department:meter - electric",
        rate: 1,
        energyResource: "ELECTRIC",
        metric: {
          id: meterElectric.metricId,
          name: "Metric:meter - electric",
          unitGroup: "ENERGY",
        },
        meterId: meterElectric.id,
        consumption: null,
        consumptionPercentage: null,
        department: {
          id: meterElectric.departmentId,
          name: "Department:meter - electric",
        },
        isMain: false,
      },
      {
        id: expect.any(String),
        name: "Metric:meter - water - Department:meter - water",
        rate: 1,
        energyResource: "WATER",
        metric: {
          id: meterWater.metricId,
          name: "Metric:meter - water",
          unitGroup: "ENERGY",
        },
        meterId: meterWater.id,
        consumption: null,
        consumptionPercentage: null,
        department: {
          id: meterWater.departmentId,
          name: "Department:meter - water",
        },
        isMain: false,
      },
    ]);
  });

  it("should return consumption when startDate and endDate are provided", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const meter1 = await TestHelperMeter.create(client, "Meter1");
    const meter2 = await TestHelperMeter.create(client, "Meter2");
    const driver1 = await TestHelperMetric.create(client, "Driver1");
    const driver2 = await TestHelperMetric.create(client, "Driver2");

    await TestHelperMetric.addValues(session.orgId, meter1.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00Z" },
      { value: 10, datetime: "2025-02-01T01:00:00Z" },
      { value: 100, datetime: "2025-04-01T02:00:00Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, meter2.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00Z" },
      { value: 20, datetime: "2025-02-01T01:00:00Z" },
      { value: 100, datetime: "2025-04-01T02:00:00Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, driver1.id, [
      { value: 0, datetime: "2025-01-01T00:00:00Z" },
      { value: 1, datetime: "2025-02-01T01:00:00Z" },
      { value: 100, datetime: "2025-04-01T02:00:00Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, driver2.id, [
      { value: 0, datetime: "2025-01-01T00:00:00Z" },
      { value: 2, datetime: "2025-02-01T01:00:00Z" },
      { value: 100, datetime: "2025-04-01T02:00:00Z" },
    ]);

    await client.POST("/u/measurement/meter/slice/{meterId}", {
      params: { path: { meterId: meter1.id } },
      body: [
        {
          name: "SliceDaily",
          rate: 1,
          departmentId: meter1.departmentId,
          isMain: false,
        },
      ],
    });

    const res = await client.GET("/u/measurement/meter/slice", {
      params: {
        query: {
          datetimeMin: "2025-01-01T00:00:00Z",
          datetimeMax: "2025-03-01T00:00:00Z",
        },
      },
    });

    expect(res).toBeApiOk();
    expect(res.data!.records).toStrictEqual([
      {
        id: expect.any(String),
        name: "Metric:Meter1 - Department:Meter1",
        energyResource: "ELECTRIC",
        meterId: meter1.id,
        metric: {
          id: meter1.metricId,
          name: "Metric:Meter1",
          unitGroup: "ENERGY",
        },
        department: {
          id: meter1.departmentId,
          name: "Department:Meter1",
        },
        consumption: 10,
        consumptionPercentage: 33.33333333333333,
        rate: 1,
        isMain: false,
      },
      {
        id: expect.any(String),
        name: "Metric:Meter2 - Department:Meter2",
        energyResource: "ELECTRIC",
        meterId: meter2.id,
        metric: {
          id: meter2.metricId,
          name: "Metric:Meter2",
          unitGroup: "ENERGY",
        },
        department: {
          id: meter2.departmentId,
          name: "Department:Meter2",
        },
        consumption: 20,
        consumptionPercentage: 66.66666666666666,
        rate: 1,
        isMain: false,
      },
    ]);
  });

  it("should create, update and delete slices correctly", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const metric = await TestHelperMetric.create(client, "Metric", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });

    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const departmentId1 = await TestHelperDepartment.create(
      client,
      "department1",
    );
    const departmentId2 = await TestHelperDepartment.create(
      client,
      "department2",
    );
    const departmentId3 = await TestHelperDepartment.create(
      client,
      "department3",
    );

    const meterRes = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Test Meter",
        energyResource: "ELECTRIC",
        metricId: metric.id,
        departmentId,
        energyConversionRate: 1,
        isMain: false,
      },
    });

    expect(meterRes).toBeApiOk();
    const meterId = meterRes.data!.id;

    const createSlicePayload = [
      {
        name: "Slice1",
        rate: 0.6,
        departmentId: departmentId1,
        isMain: false,
      },
      {
        name: "Slice2",
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

    expect(firstSlice).toBeDefined();
    expect(secondSlice).toBeDefined();

    expect(createSliceRes.data).toStrictEqual({
      createdIds: [firstSlice.id, secondSlice.id],
      updatedIds: [],
      deletedIds: [meterRes.data?.sliceId],
    });

    expect(meter.data).toStrictEqual({
      id: meterId,
      name: "Test Meter",
      energyResource: "ELECTRIC",
      energyConversionRate: 1,
      metric: {
        id: metric.id,
        name: "Metric",
        unitGroup: "ENERGY",
      },
      slices: [
        {
          id: firstSlice.id,
          rate: 0.6,
          department: { id: departmentId1, name: "department1" },
          isMain: false,
        },
        {
          id: secondSlice.id,
          rate: 0.4,
          department: { id: departmentId2, name: "department2" },
          isMain: false,
        },
      ],
      consumption: null,
      consumptionPercentage: null,
    });

    const updateSlicePayload = [
      {
        id: firstSlice.id,
        rate: 0.7,
        departmentId: departmentId1,
        isMain: false,
      },
      {
        rate: 0.3,
        departmentId: departmentId3,
        isMain: false,
      },
    ];

    const updateSliceRes = await client.POST(
      "/u/measurement/meter/slice/{meterId}",
      {
        params: { path: { meterId } },
        body: updateSlicePayload,
      },
    );
    expect(updateSliceRes).toBeApiOk();

    const updateMeterRes = await client.GET("/u/measurement/meter/item/{id}", {
      params: {
        path: { id: meterId },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });
    expect(updateMeterRes).toBeApiOk();

    const thirdSlice = updateMeterRes.data!.slices.find(
      (s) => s.department.id === departmentId3,
    )!;

    expect(thirdSlice).toBeDefined();

    expect(updateSliceRes.data).toStrictEqual({
      createdIds: [thirdSlice.id],
      updatedIds: [firstSlice.id],
      deletedIds: [secondSlice.id],
    });

    expect(updateMeterRes.data).toStrictEqual({
      id: meterId,
      name: "Test Meter",
      energyResource: "ELECTRIC",
      energyConversionRate: 1,
      metric: {
        id: metric.id,
        name: "Metric",
        unitGroup: "ENERGY",
      },
      slices: [
        {
          id: firstSlice.id,
          rate: 0.7,
          department: { id: departmentId1, name: "department1" },
          isMain: false,
        },
        {
          id: thirdSlice.id,
          rate: 0.3,
          department: { id: departmentId3, name: "department3" },
          isMain: false,
        },
      ],
      consumption: null,
      consumptionPercentage: null,
    });
  });

  it("should return consumption percentage for non-main meters based on main meter total", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const meter1 = await TestHelperMeter.create(client, "Meter1");
    const meter2 = await TestHelperMeter.create(client, "Meter2");
    const meter3 = await TestHelperMeter.create(client, "Meter3");

    const driver1 = await TestHelperMetric.create(client, "Driver1");
    const driver2 = await TestHelperMetric.create(client, "Driver2");

    await TestHelperMetric.addValues(session.orgId, meter1.metricId, [
      { value: 40, datetime: "2025-01-01T00:00:00Z" },
      { value: 200, datetime: "2025-02-01T00:00:00Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, meter2.metricId, [
      { value: 20, datetime: "2025-01-01T00:00:00Z" },
      { value: 60, datetime: "2025-02-01T00:00:00Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, meter3.metricId, [
      { value: 15, datetime: "2025-01-01T00:00:00Z" },
      { value: 45, datetime: "2025-02-01T00:00:00Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, driver1.id, [
      { value: 0, datetime: "2025-01-01T00:00:00Z" },
      { value: 1, datetime: "2025-01-01T01:00:00Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, driver2.id, [
      { value: 0, datetime: "2025-01-01T00:00:00Z" },
      { value: 2, datetime: "2025-01-01T01:00:00Z" },
    ]);

    await client.POST("/u/measurement/meter/slice/{meterId}", {
      params: { path: { meterId: meter1.id } },
      body: [
        {
          id: meter1.sliceId,
          name: "MainSlice",
          rate: 1,
          departmentId: meter1.departmentId,
          isMain: true,
        },
      ],
    });

    const res = await client.GET("/u/measurement/meter/slice", {
      params: { query: TestHelperMetric.getFullDatetimeRangeQuery() },
    });

    expect(res).toBeApiOk();

    expect(res.data!.records).toStrictEqual([
      {
        id: meter1.sliceId,
        name: "Metric:Meter1 - Department:Meter1",
        energyResource: "ELECTRIC",
        meterId: meter1.id,
        metric: {
          id: meter1.metricId,
          name: "Metric:Meter1",
          unitGroup: "ENERGY",
        },
        department: {
          id: meter1.departmentId,
          name: "Department:Meter1",
        },
        consumption: 160,
        consumptionPercentage: null,
        rate: 1,
        isMain: true,
      },
      {
        id: meter2.sliceId,
        name: "Metric:Meter2 - Department:Meter2",
        energyResource: "ELECTRIC",
        meterId: meter2.id,
        metric: {
          id: meter2.metricId,
          name: "Metric:Meter2",
          unitGroup: "ENERGY",
        },
        department: {
          id: meter2.departmentId,
          name: "Department:Meter2",
        },
        consumption: 40,
        consumptionPercentage: 25, // 40 / 160
        rate: 1,
        isMain: false,
      },
      {
        id: meter3.sliceId,
        name: "Metric:Meter3 - Department:Meter3",
        energyResource: "ELECTRIC",
        meterId: meter3.id,
        metric: {
          id: meter3.metricId,
          name: "Metric:Meter3",
          unitGroup: "ENERGY",
        },
        department: {
          id: meter3.departmentId,
          name: "Department:Meter3",
        },
        consumption: 30,
        consumptionPercentage: 18.75, // 30 / 160
        rate: 1,
        isMain: false,
      },
    ]);
  });

  it("should return BAD_REQUEST when total slice rates exceed 1", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const meter = await TestHelperMeter.create(client, "METER", {
      energyResource: "ELECTRIC",
    });
    const departmentId1 = await TestHelperDepartment.create(
      client,
      "department1",
    );
    const departmentId2 = await TestHelperDepartment.create(
      client,
      "department2",
    );

    const createSlicePayload = [
      {
        name: "Slice1",
        rate: 0.6,
        departmentId: departmentId1,
        isMain: false,
      },
      {
        name: "Slice2",
        rate: 0.5,
        departmentId: departmentId2,
        isMain: false,
      },
    ];

    const createSliceRes = await client.POST(
      "/u/measurement/meter/slice/{meterId}",
      {
        params: { path: { meterId: meter.id } },
        body: createSlicePayload,
      },
    );
    expect(createSliceRes).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("should return non main meter slices with get.", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter1 = await TestHelperMeter.create(client, "meter1");
    await TestHelperMeter.create(client, "meter2", {
      isMain: true,
    });

    const res = await client.GET("/u/measurement/meter/slice", {
      params: {
        query: {
          nonMainOnly: "true",
          ...TestHelperMetric.getFullDatetimeRangeQuery(),
        },
      },
    });

    expect(res).toBeApiOk();
    expect(res.data!.records).toStrictEqual([
      {
        id: meter1.sliceId,
        name: "Metric:meter1 - Department:meter1",
        rate: 1,
        energyResource: "ELECTRIC",
        metric: {
          id: meter1.metricId,
          name: "Metric:meter1",
          unitGroup: "ENERGY",
        },
        meterId: meter1.id,
        consumption: null,
        consumptionPercentage: null,
        department: {
          id: meter1.departmentId,
          name: "Department:meter1",
        },
        isMain: false,
      },
    ]);
  });

  it("should return only main meter slices with get.", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    await TestHelperMeter.create(client, "meter");
    const meter = await TestHelperMeter.create(client, "meter2", {
      isMain: true,
    });

    const res = await client.GET("/u/measurement/meter/slice", {
      params: {
        query: {
          mainOnly: "true",
          ...TestHelperMetric.getFullDatetimeRangeQuery(),
        },
      },
    });

    expect(res).toBeApiOk();
    expect(res.data!.records).toStrictEqual([
      {
        id: meter.sliceId,
        name: "Metric:meter2 - Department:meter2",
        rate: 1,
        energyResource: "ELECTRIC",
        metric: {
          id: meter.metricId,
          name: "Metric:meter2",
          unitGroup: "ENERGY",
        },
        meterId: meter.id,
        consumption: null,
        consumptionPercentage: null,
        department: {
          id: meter.departmentId,
          name: "Department:meter2",
        },
        isMain: true,
      },
    ]);
  });

  it("Get main consumption list", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "meter", {
      energyResource: "ELECTRIC",
    });

    const departmentId1 = await TestHelperDepartment.create(
      client,
      "department1",
    );
    const departmentId2 = await TestHelperDepartment.create(
      client,
      "department2",
    );

    await TestHelperMetric.addValues(session.orgId, meter.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00Z" },
      { value: 100, datetime: "2025-02-01T00:00:00Z" },
    ]);

    const createSlicePayload = [
      {
        name: "Slice1",
        rate: 0.6,
        departmentId: departmentId1,
        isMain: true,
      },
      {
        name: "Slice2",
        rate: 0.4,
        departmentId: departmentId2,
        isMain: false,
      },
    ];

    await client.POST("/u/measurement/meter/slice/{meterId}", {
      params: { path: { meterId: meter.id } },
      body: createSlicePayload,
    });

    const res = await client.GET(
      "/u/measurement/meter/slice/main-consumptions",
      {
        params: {
          query: {
            datetimeMin: "2025-01-01T00:00:00Z",
            datetimeMax: "2025-03-01T00:00:00Z",
          },
        },
      },
    );

    expect(res).toBeApiOk();

    expect(res.data!.records).toStrictEqual([
      {
        energyResource: "ELECTRIC",
        consumption: 60.00000238418579,
      },
    ]);
  });

  it("should return BAD_REQUEST when total slice rates do not equal 1", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "METER", {
      energyResource: "ELECTRIC",
    });
    const departmentId1 = await TestHelperDepartment.create(
      client,
      "department1",
    );

    const createSlicePayload = [
      {
        name: "Slice1",
        rate: 0.6,
        departmentId: departmentId1,
        isMain: false,
      },
    ];

    const createSliceRes = await client.POST(
      "/u/measurement/meter/slice/{meterId}",
      {
        params: { path: { meterId: meter.id } },
        body: createSlicePayload,
      },
    );
    expect(createSliceRes).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("should update slices correctly with an empty array", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "METER", {
      energyResource: "ELECTRIC",
    });

    const createSliceRes = await client.POST(
      "/u/measurement/meter/slice/{meterId}",
      {
        params: { path: { meterId: meter.id } },
        body: [],
      },
    );

    expect(createSliceRes).toBeApiOk();
    const getMeterRes = await client.GET("/u/measurement/meter/item/{id}", {
      params: {
        path: { id: meter.id },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });

    expect(getMeterRes).toBeApiOk();
    expect(getMeterRes.data!.slices).toStrictEqual([]);
  });

  it("should return ok if same meter but different slice is used by seu.", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "meter", {
      energyResource: "ELECTRIC",
    });
    const departmentId1 = await TestHelperDepartment.create(
      client,
      "department1",
    );
    const departmentId2 = await TestHelperDepartment.create(
      client,
      "department2",
    );

    const slices = await client.POST("/u/measurement/meter/slice/{meterId}", {
      params: { path: { meterId: meter.id } },
      body: [
        {
          name: "Slice1",
          rate: 0.6,
          departmentId: departmentId1,
          energyResource: "DIESEL",
          isMain: false,
        },
        {
          name: "Slice2",
          rate: 0.4,
          departmentId: departmentId2,
          energyResource: "DIESEL",
          isMain: false,
        },
      ],
    });

    await client.POST("/u/measurement/seu/item", {
      body: {
        departmentIds: [departmentId1],
        energyResource: "DIESEL",
        meterSliceIds: [slices.data!.createdIds[0]],
        name: "Seu",
      },
    });

    const createSliceRes = await client.POST(
      "/u/measurement/meter/slice/{meterId}",
      {
        params: { path: { meterId: meter.id } },
        body: [
          {
            departmentId: departmentId2,
            rate: 1,
            isMain: true,
            id: slices.data!.createdIds[1],
          },
        ],
      },
    );

    expect(createSliceRes).toBeApiOk();
  });

  it("should throw BAD_REQUEST when trying to set a meter slice as main if it is directly assigned to an SEU", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "meter", {
      energyResource: "ELECTRIC",
    });
    const dep1 = await TestHelperDepartment.create(client, "Dep1");
    const dep2 = await TestHelperDepartment.create(client, "Dep2");

    const slicesRes = await client.POST(
      "/u/measurement/meter/slice/{meterId}",
      {
        params: { path: { meterId: meter.id } },
        body: [
          {
            name: "Slice1",
            rate: 0.6,
            departmentId: dep1,
            isMain: false,
          },
          {
            name: "Slice2",
            rate: 0.4,
            departmentId: dep2,
            isMain: false,
          },
        ],
      },
    );
    expect(slicesRes).toBeApiOk();

    const slice1Id = slicesRes.data!.createdIds[0];
    const slice2Id = slicesRes.data!.createdIds[1];

    const seuRes = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "SEU using Slice1",
        departmentIds: [],
        energyResource: "ELECTRIC",
        meterSliceIds: [slice1Id],
      },
    });
    expect(seuRes).toBeApiOk();

    const updateRes = await client.POST(
      "/u/measurement/meter/slice/{meterId}",
      {
        params: { path: { meterId: meter.id } },
        body: [
          {
            id: slice1Id,
            rate: 0.6,
            departmentId: dep1,
            isMain: true,
          },
          {
            id: slice2Id,
            rate: 0.4,
            departmentId: dep2,
            isMain: false,
          },
        ],
      },
    );

    expect(updateRes).toBeApiError(EApiFailCode.BAD_REQUEST);
  });
});
