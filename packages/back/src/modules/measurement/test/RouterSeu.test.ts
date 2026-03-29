import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperAdvancedRegressionAnalysis } from "@m/analysis/test/TestHelperAdvancedRegressionAnalysis";
import { TestHelperDepartment } from "@m/base/test/TestHelperDepartment";

import { TestHelperMeter } from "./TestHelperMeter";
import { TestHelperMetric } from "./TestHelperMetric";

describe("E2E - RouterSeu", () => {
  it("should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");
    const dept2Id = await TestHelperDepartment.create(client, "Department2");
    const meter = await TestHelperMeter.create(client, "Meter1");

    const createSlicePayload = [
      {
        name: "Slice1",
        rate: 0.6,
        departmentId: dept1Id,
        isMain: false,
      },
      {
        name: "Slice2",
        rate: 0.4,
        departmentId: dept2Id,
        isMain: false,
      },
    ];

    await client.POST("/u/measurement/meter/slice/{meterId}", {
      params: { path: { meterId: meter.id } },
      body: createSlicePayload,
    });

    const res = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Seu",
        departmentIds: [dept1Id, dept2Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });
    expect(res).toBeApiOk();
  });

  it("select same seu but different energy resources", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");
    const dept2Id = await TestHelperDepartment.create(client, "Department2");
    const meter = await TestHelperMeter.create(client, "Meter1");

    const createSlicePayload = [
      {
        name: "Slice1",
        rate: 0.6,
        departmentId: dept1Id,
        isMain: false,
      },
      {
        name: "Slice2",
        rate: 0.4,
        departmentId: dept2Id,
        isMain: false,
      },
    ];

    await client.POST("/u/measurement/meter/slice/{meterId}", {
      params: { path: { meterId: meter.id } },
      body: createSlicePayload,
    });

    await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Seu",
        departmentIds: [dept1Id, dept2Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });

    const res = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Seu2",
        departmentIds: [dept1Id, dept2Id],
        energyResource: "DIESEL",
        meterSliceIds: [],
      },
    });

    expect(res).toBeApiOk();
  });

  it("select same seu and same energy resources", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");
    const dept2Id = await TestHelperDepartment.create(client, "Department2");
    const meter = await TestHelperMeter.create(client, "Meter1");

    const createSlicePayload = [
      {
        name: "Slice1",
        rate: 0.6,
        departmentId: dept1Id,
        isMain: false,
      },
      {
        name: "Slice2",
        rate: 0.4,
        departmentId: dept2Id,
        isMain: false,
      },
    ];

    await client.POST("/u/measurement/meter/slice/{meterId}", {
      params: { path: { meterId: meter.id } },
      body: createSlicePayload,
    });

    await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Seu",
        departmentIds: [dept1Id, dept2Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });

    const res = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Seu2",
        departmentIds: [dept1Id, dept2Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });

    expect(res).toBeApiError(EApiFailCode.RECORD_IN_USE);
  });

  it("metric view values should be ok for meter slices", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const meter1 = await TestHelperMeter.create(client, "Meter 1");
    const meter2 = await TestHelperMeter.create(client, "Meter 2");

    const dept1Id = await TestHelperDepartment.create(client, "Department1");
    const dept2Id = await TestHelperDepartment.create(client, "Department2");

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Seu",
        departmentIds: [dept1Id, dept2Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });
    const seuId = seu.data!.id;

    await TestHelperMetric.addValues(session.orgId, meter1.metricId, [
      { value: 10, datetime: "2025-02-01T00:00:00.000Z" },
      { value: 15, datetime: "2025-02-02T00:00:00.000Z" },
      { value: 30, datetime: "2025-02-03T00:00:00.000Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, meter2.metricId, [
      { value: 20, datetime: "2025-02-01T00:00:00.000Z" },
      { value: 25, datetime: "2025-02-02T00:00:00.000Z" },
      { value: 40, datetime: "2025-02-03T00:00:00.000Z" },
    ]);

    const getRes = await client.GET("/u/measurement/seu/item/{id}/values", {
      params: {
        path: {
          id: seuId,
        },
        query: {
          period: "DAILY",
          ...TestHelperMetric.getFullDatetimeRangeQuery(),
        },
      },
    });

    expect(getRes).toBeApiOk();

    expect(getRes.data!).toStrictEqual({
      recordCount: 2,
      records: [
        { value: 10, datetime: "2025-02-02T00:00:00.000Z" },
        { value: 30, datetime: "2025-02-03T00:00:00.000Z" },
      ],
    });
  });

  it("metric view graph should be ok for meter slices", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const meter1 = await TestHelperMeter.create(client, "Meter 1");
    const meter2 = await TestHelperMeter.create(client, "Meter 2");

    const dept1Id = await TestHelperDepartment.create(client, "Department1");
    const dept2Id = await TestHelperDepartment.create(client, "Department2");

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Seu",
        departmentIds: [dept1Id, dept2Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });
    const seuId = seu.data!.id;

    await TestHelperMetric.addValues(session.orgId, meter1.metricId, [
      { value: 10, datetime: "2025-02-01T00:00:00.000Z" },
      { value: 15, datetime: "2025-02-02T00:00:00.000Z" },
      { value: 30, datetime: "2025-02-03T00:00:00.000Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, meter2.metricId, [
      { value: 20, datetime: "2025-02-01T00:00:00.000Z" },
      { value: 25, datetime: "2025-02-02T00:00:00.000Z" },
      { value: 40, datetime: "2025-02-03T00:00:00.000Z" },
    ]);

    const getRes = await client.GET("/u/measurement/seu/graph", {
      params: {
        query: {
          datetimeMin: "2025-02-01T00:00:00.000Z",
          datetimeMax: "2025-02-02T00:00:00.000Z",
          seuIds: seuId,
          primary: "false",
        },
      },
    });

    expect(getRes).toBeApiOk();

    expect(getRes.data!).toStrictEqual({
      period: "HOURLY",
      series: [
        {
          seu: {
            id: seuId,
            energyResource: "ELECTRIC",
            name: "Seu",
          },
          values: [
            {
              value: 10,
              datetime: "2025-02-02T00:00:00.000Z",
            },
          ],
        },
      ],
    });
  });

  it("should get the seus", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "Meter1");
    const departmentId = meter.departmentId;

    const createResponse = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "test name",
        energyResource: "ELECTRIC",
        meterSliceIds: [],
        departmentIds: [departmentId],
      },
    });

    const createdId = createResponse.data!.id;

    const res = await client.GET("/u/measurement/seu/item", {
      params: {
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });
    expect(res).toBeApiOk();
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          name: "test name",
          energyResource: "ELECTRIC",
          consumption: 0,
          percentage: null,
          departments: [
            {
              id: departmentId,
              name: "Department:Meter1",
            },
          ],
          meterSlices: [
            {
              id: meter.sliceId,
              name: "Metric:Meter1 - Department:Meter1",
              rate: 1,
              departmentId,
            },
          ],
        },
      ],
    });
  });

  it("should get the only gas seus", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "Meter1");
    const departmentId = meter.departmentId;

    await client.POST("/u/measurement/seu/item", {
      body: {
        name: "test name",
        energyResource: "ELECTRIC",
        meterSliceIds: [],
        departmentIds: [departmentId],
      },
    });

    const createGas = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Seu Gas",
        energyResource: "GAS",
        meterSliceIds: [],
        departmentIds: [departmentId],
      },
    });

    const createdId = createGas.data!.id;

    const { datetimeMin, datetimeMax } =
      TestHelperMetric.getFullDatetimeRangeQuery();
    const res = await client.GET("/u/measurement/seu/item", {
      params: {
        query: { datetimeMin, datetimeMax, energyResource: "GAS" },
      },
    });
    expect(res).toBeApiOk();
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          name: "Seu Gas",
          energyResource: "GAS",
          consumption: 0,
          percentage: null,
          departments: [
            {
              id: departmentId,
              name: "Department:Meter1",
            },
          ],
          meterSlices: [],
        },
      ],
    });
  });

  it("should get the seus with ids", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "Meter1");
    const meter2 = await TestHelperMeter.create(client, "Meter2");
    const departmentId = meter.departmentId;
    const departmentId2 = meter2.departmentId;

    const createResponse = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "test name",
        energyResource: "ELECTRIC",
        meterSliceIds: [],
        departmentIds: [departmentId],
      },
    });

    await client.POST("/u/measurement/seu/item", {
      body: {
        name: "test name2",
        energyResource: "ELECTRIC",
        meterSliceIds: [],
        departmentIds: [departmentId2],
      },
    });

    const createdId = createResponse.data!.id;

    const res = await client.GET("/u/measurement/seu/item", {
      params: {
        query: {
          datetimeMin: TestHelperMetric.getFullDatetimeRangeQuery().datetimeMin,
          datetimeMax: TestHelperMetric.getFullDatetimeRangeQuery().datetimeMax,
          seuIds: createdId,
        },
      },
    });

    expect(res).toBeApiOk();

    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          name: "test name",
          energyResource: "ELECTRIC",
          consumption: 0,
          percentage: null,
          departments: [
            {
              id: departmentId,
              name: "Department:Meter1",
            },
          ],
          meterSlices: [
            {
              id: meter.sliceId,
              name: "Metric:Meter1 - Department:Meter1",
              rate: 1,
              departmentId: departmentId,
            },
          ],
        },
      ],
    });
  });

  it("should get the primary seus", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    await TestHelperAdvancedRegressionAnalysis.createAdvancedRegression(
      client,
      { primary: true },
    );

    const res = await client.GET("/u/measurement/seu/item", {
      params: {
        query: {
          datetimeMin: TestHelperMetric.getFullDatetimeRangeQuery().datetimeMin,
          datetimeMax: TestHelperMetric.getFullDatetimeRangeQuery().datetimeMax,
          primary: "true",
        },
      },
    });

    expect(res).toBeApiOk();

    res.data!.records.forEach((record) => {
      record.meterSlices.sort((a, b) => a.name.localeCompare(b.name));
    });

    expect(res.data).toStrictEqual({
      records: [
        {
          consumption: 90,
          departments: [
            {
              id: expect.any(String),
              name: "Test Department",
            },
          ],
          energyResource: "ELECTRIC",
          id: expect.any(String),
          meterSlices: [
            {
              departmentId: expect.any(String),
              id: expect.any(String),
              name: "Metric:Meter1 - Department:Meter1",
              rate: 1,
            },
            {
              departmentId: expect.any(String),
              id: expect.any(String),
              name: "Metric:Meter2 - Department:Meter2",
              rate: 1,
            },
          ],
          name: "Test SEU",
          percentage: 100,
        },
      ],
    });
  });

  it("should get the seus with meter slice", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "Meter1");

    const payload = {
      name: "test name",
      energyResource: "ELECTRIC",
    } as const;

    const createResponse = await client.POST("/u/measurement/seu/item", {
      body: {
        ...payload,
        meterSliceIds: [meter.sliceId],
        departmentIds: [],
      },
    });

    const createdId = createResponse.data!.id;

    const res = await client.GET("/u/measurement/seu/item", {
      params: {
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });

    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload,
          consumption: 0,
          percentage: null,
          departments: [],
          meterSlices: [
            {
              id: meter.sliceId,
              name: "Metric:Meter1 - Department:Meter1",
              rate: 1,
              departmentId: meter.departmentId,
            },
          ],
        },
      ],
    });
  });

  it("should return departments in use", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "Meter1");

    const resCreate = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "test name",
        departmentIds: [meter.departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });

    expect(resCreate).toBeApiOk();

    const res = await client.GET("/u/measurement/seu/departments-in-use");

    expect(res.data).toStrictEqual({
      records: [meter.departmentId],
    });
  });

  it("should be seu name", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "Meter1");

    const createRes = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "testname",
        energyResource: "ELECTRIC",
        meterSliceIds: [],
        departmentIds: [meter.departmentId],
      },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const res = await client.GET("/u/measurement/seu/names");

    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          name: "testname",
          energyResource: "ELECTRIC",
        },
      ],
    });
  });

  it("should update the seu", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");
    const dept2Id = await TestHelperDepartment.create(client, "Department2");
    const meter = await TestHelperMeter.create(client, "Meter1");

    const createSlicePayload = [
      {
        name: "Slice1",
        rate: 0.6,
        departmentId: dept1Id,
        isMain: false,
      },
      {
        name: "Slice2",
        rate: 0.4,
        departmentId: dept2Id,
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

    expect(createSliceRes).toBeApiOk();

    const res = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Seu",
        departmentIds: [dept1Id, dept2Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBodyPart = {
      name: "Test measurement/seu -> name 2",
      energyResource: "ELECTRIC",
    } as const;

    const updateRes = await client.PUT("/u/measurement/seu/item/{id}", {
      params: { path: { id: createdId } },
      body: { ...updateBodyPart, meterSliceIds: [], departmentIds: [dept2Id] },
    });
    expect(updateRes).toBeApiOk();
    const getRes = await client.GET("/u/measurement/seu/item/{id}", {
      params: {
        path: { id: createdId },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });

    expect(getRes).toBeApiOk();
    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBodyPart,
      consumption: 0,
      percentage: null,
      departments: [
        {
          id: dept2Id,
          name: "Department2",
        },
      ],
      meterSlices: [
        {
          id: createSliceRes.data!.createdIds[1],
          name: "Metric:Meter1 - Department2",
          rate: 0.4,
          departmentId: dept2Id,
        },
      ],
    });
  });

  it("Percentage must be calculated properly when main meter consumption exists", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const meterMain = await TestHelperMeter.create(client, "Meter Main", {
      isMain: true,
    });
    const meterSub = await TestHelperMeter.create(client, "Meter Sub");

    const seuRes = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "SEU Percentage Test",
        energyResource: "ELECTRIC",
        meterSliceIds: [meterSub.sliceId],
        departmentIds: [],
      },
    });
    expect(seuRes).toBeApiOk();
    const seuId = seuRes.data!.id;

    await TestHelperMetric.addValues(session.orgId, meterMain.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 50, datetime: "2025-01-02T00:00:00.000Z" },
      { value: 100, datetime: "2025-01-03T00:00:00.000Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, meterSub.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 10, datetime: "2025-01-02T00:00:00.000Z" },
      { value: 20, datetime: "2025-01-03T00:00:00.000Z" },
    ]);

    const getRes = await client.GET("/u/measurement/seu/item/{id}", {
      params: {
        path: { id: seuId },
        query: {
          datetimeMin: "2025-01-01T00:00:00Z",
          datetimeMax: "2025-03-01T00:00:00Z",
        },
      },
    });

    expect(getRes).toBeApiOk();
    expect(getRes.data).toMatchObject({
      id: seuId,
      name: "SEU Percentage Test",
      energyResource: "ELECTRIC",
      consumption: 20, // 10 + 10
      percentage: 20, // (50 + 50) / (10 + 10)
      departments: [],
      meterSlices: [
        {
          id: meterSub.sliceId,
          name: "Metric:Meter Sub - Department:Meter Sub",
          rate: 1,
          departmentId: meterSub.departmentId,
        },
      ],
    });
  });

  it("should get by id the seu", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "Meter1");

    expect(meter).toBeApiOk();

    const res = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test measurement/seu -> name 1",
        departmentIds: [meter.departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET("/u/measurement/seu/item/{id}", {
      params: {
        path: { id: createdId },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      energyResource: "ELECTRIC",
      name: "Test measurement/seu -> name 1",
      consumption: 0,
      percentage: null,
      departments: [
        {
          id: meter.departmentId,
          name: "Department:Meter1",
        },
      ],
      meterSlices: [
        {
          id: meter.sliceId,
          name: "Metric:Meter1 - Department:Meter1",
          rate: 1,
          departmentId: meter.departmentId,
        },
      ],
    });
  });

  it("should delete by id the seu", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "Meter1");

    const createRes = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test measurement/seu -> name 1",
        departmentIds: [meter.departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });

    expect(createRes).toBeApiOk();

    const createId = createRes.data!.id;

    const res = await client.DELETE("/u/measurement/seu/item/{id}", {
      params: { path: { id: createId } },
    });
    expect(res).toBeApiOk();
  });

  it("should throw NOT_FOUND when record is not found", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "Meter1");

    const createRes = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test measurement/seu -> name 1",
        departmentIds: [meter.departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });
    expect(createRes).toBeApiOk();
    const res = await client.DELETE("/u/measurement/seu/item/{id}", {
      params: { path: { id: "00000000-0000-0000-0000-000000000000" } },
    });
    expect(res).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("should throw NOT_FOUND when record is not found", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "Meter1");

    const createRes = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "test Test measurement/seu -> name 1",
        departmentIds: [meter.departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const res = await client.GET("/u/measurement/seu/item/{id}", {
      params: {
        path: { id: "00000000-0000-0000-0000-000000000000" },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });
    expect(res).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("should throw NOT_FOUND when record is not found", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");
    const dept2Id = await TestHelperDepartment.create(client, "Department2");
    const meter = await TestHelperMeter.create(client, "Meter1");

    const createSlicePayload = [
      {
        name: "Slice1",
        rate: 0.6,
        departmentId: dept1Id,
        isMain: false,
      },
      {
        name: "Slice2",
        rate: 0.4,
        departmentId: dept2Id,
        isMain: false,
      },
    ];

    await client.POST("/u/measurement/meter/slice/{meterId}", {
      params: { path: { meterId: meter.id } },
      body: createSlicePayload,
    });

    const createRes = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "test Test measurement/seu -> name 1",
        departmentIds: [dept1Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const updateBody = {
      name: "test Test measurement/seu -> name 2",
      energyResource: "ELECTRIC" as const,
      meterSliceIds: [],
    };

    const updateRes = await client.PUT("/u/measurement/seu/item/{id}", {
      params: { path: { id: "00000000-0000-0000-0000-000000000000" } },
      body: { ...updateBody, departmentIds: [dept2Id] },
    });
    expect(updateRes).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("should throw already exist when department seuId is not empty", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");
    const dept2Id = await TestHelperDepartment.create(client, "Department2");
    const meter = await TestHelperMeter.create(client, "Meter1");

    const createSlicePayload = [
      {
        name: "Slice1",
        rate: 0.6,
        departmentId: dept1Id,
        isMain: false,
      },
      {
        name: "Slice2",
        rate: 0.4,
        departmentId: dept2Id,
        isMain: false,
      },
    ];

    await client.POST("/u/measurement/meter/slice/{meterId}", {
      params: { path: { meterId: meter.id } },
      body: createSlicePayload,
    });

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Existing SEU",
        departmentIds: [dept1Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });
    expect(seu).toBeApiOk();

    const res = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Duplicate SEU",
        departmentIds: [dept1Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });
    expect(res).toBeApiError(EApiFailCode.RECORD_IN_USE);
  });

  it("should throw already exist when department seuId is not empty", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");
    const dept2Id = await TestHelperDepartment.create(client, "Department2");
    const meter = await TestHelperMeter.create(client, "Meter1");

    const createSlicePayload = [
      {
        name: "Slice1",
        rate: 0.6,
        departmentId: dept1Id,
        isMain: false,
      },
      {
        name: "Slice2",
        rate: 0.4,
        departmentId: dept2Id,
        isMain: false,
      },
    ];

    await client.POST("/u/measurement/meter/slice/{meterId}", {
      params: { path: { meterId: meter.id } },
      body: createSlicePayload,
    });

    const seu1 = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "SEU 1",
        departmentIds: [dept1Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });
    expect(seu1).toBeApiOk();
    const seu1Id = seu1.data!.id;

    const seu2 = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "SEU 2",
        departmentIds: [dept2Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });
    expect(seu2).toBeApiOk();

    const updateRes = await client.PUT("/u/measurement/seu/item/{id}", {
      params: { path: { id: seu1Id } },
      body: {
        name: "SEU 1 Updated",
        departmentIds: [dept2Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });
    expect(updateRes).toBeApiError(EApiFailCode.RECORD_IN_USE);
  });

  it("should throw error when selecting departments if some meters of the department are used by other SEUs", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");
    const meter = await TestHelperMeter.create(client, "Meter1", {
      departmentId: dept1Id,
    });

    const seu1 = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "SEU 1",
        departmentIds: [],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter.sliceId],
      },
    });
    expect(seu1).toBeApiOk();

    const seu2 = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "SEU 2",
        departmentIds: [dept1Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });

    expect(seu2).toBeApiError(EApiFailCode.RECORD_IN_USE);
  });

  it("should throw error when selecting meter slices that belong to a department already assigned to another SEU", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const meter = await TestHelperMeter.create(client, "Meter1", {
      departmentId: dept1Id,
    });

    const seu1 = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "SEU 1",
        departmentIds: [dept1Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });
    expect(seu1).toBeApiOk();

    const seu2 = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "SEU 2",
        departmentIds: [],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter.sliceId],
      },
    });

    expect(seu2).toBeApiError(EApiFailCode.RECORD_IN_USE);
  });

  it("should not throw error if selected slice resource is different.", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const meter = await TestHelperMeter.create(client, "Meter1", {
      departmentId: dept1Id,
      energyResource: "WATER",
    });

    const seu1 = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "SEU 1",
        departmentIds: [dept1Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });
    expect(seu1).toBeApiOk();

    const seu2 = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "SEU 2",
        departmentIds: [],
        energyResource: "WATER",
        meterSliceIds: [meter.sliceId],
      },
    });

    expect(seu2).toBeApiOk();
  });

  it("should not throw error if resources is different.", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const seu1 = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "SEU 1",
        departmentIds: [dept1Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });
    expect(seu1).toBeApiOk();

    const seu2 = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "SEU 2",
        departmentIds: [dept1Id],
        energyResource: "WATER",
        meterSliceIds: [],
      },
    });

    expect(seu2).toBeApiOk();
  });

  it("should not throw already exist when department is not changed", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");
    const dept2Id = await TestHelperDepartment.create(client, "Department2");

    const seu1 = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "SEU 1",
        departmentIds: [dept1Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });
    expect(seu1).toBeApiOk();
    const seu1Id = seu1.data!.id;

    const seu2 = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "SEU 2",
        departmentIds: [dept2Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });
    expect(seu2).toBeApiOk();

    // Assignin the same department should not fail
    const updateRes = await client.PUT("/u/measurement/seu/item/{id}", {
      params: { path: { id: seu1Id } },
      body: {
        name: "SEU 1 Updated",
        departmentIds: [dept1Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });
    expect(updateRes).toBeApiOk();
  });

  it("should save only matching department meter slices with the same energy resources", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const meter = await TestHelperMeter.create(client, "meter electric", {
      energyResource: "ELECTRIC",
    });
    const meter2 = await TestHelperMeter.create(client, "meter gas", {
      energyResource: "GAS",
    });

    const createSliceElectricRes = await client.POST(
      "/u/measurement/meter/slice/{meterId}",
      {
        params: { path: { meterId: meter.id } },
        body: [
          {
            name: "Slice Electric",
            rate: 1,
            departmentId: dept1Id,
            isMain: false,
          },
        ],
      },
    );
    expect(createSliceElectricRes).toBeApiOk();

    const createSliceGasRes = await client.POST(
      "/u/measurement/meter/slice/{meterId}",
      {
        params: { path: { meterId: meter2.id } },
        body: [
          {
            name: "Slice Gas",
            rate: 1,
            departmentId: dept1Id,
            isMain: false,
          },
        ],
      },
    );
    expect(createSliceGasRes).toBeApiOk();

    const res = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Seu",
        departmentIds: [dept1Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });

    const seuId = res.data!.id;

    expect(res).toBeApiOk();

    const resSeu = await client.GET("/u/measurement/seu/item/{id}", {
      params: {
        path: { id: seuId },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });

    expect(resSeu.data).toStrictEqual({
      id: seuId,
      energyResource: "ELECTRIC",
      consumption: 0,
      percentage: null,
      departments: [{ id: dept1Id, name: "Department1" }],
      // Slice gas should be not in the list.
      meterSlices: [
        {
          id: createSliceElectricRes.data!.createdIds[0],
          name: "Metric:meter electric - Department1",
          rate: 1,
          departmentId: dept1Id,
        },
      ],
      name: "Seu",
    });
  });

  it("should save only select departments", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const res = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Seu",
        departmentIds: [dept1Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });

    const seuId = res.data!.id;

    expect(res).toBeApiOk();

    const resSeu = await client.GET("/u/measurement/seu/item/{id}", {
      params: {
        path: { id: seuId },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });

    expect(resSeu).toBeApiOk();

    expect(resSeu.data).toStrictEqual({
      id: seuId,
      name: "Seu",
      energyResource: "ELECTRIC",
      consumption: 0,
      percentage: null,
      departments: [{ id: dept1Id, name: "Department1" }],
      meterSlices: [],
    });
  });

  it("should be possible to create with departments that do not have a meter slice.", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const res = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Seu",
        departmentIds: [dept1Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });

    expect(res).toBeApiOk();
  });

  it("should throw BAD_REQUEST when selected meter slices are already member of selected department's meter slices", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "Meter1");

    const res = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Seu",
        departmentIds: [meter.departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter.sliceId],
      },
    });

    expect(res).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("should return only meter slices matching the SEU energy resource", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");
    const dept2Id = await TestHelperDepartment.create(client, "Department2");

    const electricMeter = await TestHelperMeter.create(
      client,
      "Meter Electric",
      { energyResource: "ELECTRIC" },
    );
    expect(electricMeter).toBeApiOk();

    const gasMeter = await TestHelperMeter.create(client, "Meter Gas", {
      energyResource: "GAS",
    });
    expect(gasMeter).toBeApiOk();

    const electricMeterSlice = await client.POST(
      "/u/measurement/meter/slice/{meterId}",
      {
        params: { path: { meterId: electricMeter.id } },
        body: [
          {
            name: "Slice1",
            rate: 1,
            departmentId: dept1Id,
            isMain: false,
          },
        ],
      },
    );

    expect(electricMeterSlice).toBeApiOk();

    const gasMeterSlice = await client.POST(
      "/u/measurement/meter/slice/{meterId}",
      {
        params: { path: { meterId: gasMeter.id } },
        body: [
          {
            name: "Slice2",
            rate: 1,
            departmentId: dept2Id,
            isMain: false,
          },
        ],
      },
    );

    expect(gasMeterSlice).toBeApiOk();

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Seu",
        departmentIds: [dept1Id, dept2Id],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });

    expect(seu).toBeApiOk();

    const seuId = seu.data!.id;

    const resSeu = await client.GET("/u/measurement/seu/item/{id}", {
      params: {
        path: { id: seuId },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });

    expect(resSeu.data).toStrictEqual({
      id: seuId,
      name: "Seu",
      energyResource: "ELECTRIC",
      consumption: 0,
      percentage: null,
      departments: [
        { id: dept1Id, name: "Department1" },
        { id: dept2Id, name: "Department2" },
      ].sort((a, b) => a.id.localeCompare(b.id)),
      meterSlices: [
        {
          id: electricMeterSlice.data!.createdIds[0],
          name: "Metric:Meter Electric - Department1",
          rate: 1,
          departmentId: dept1Id,
        },
      ],
    });
  });

  it("Suggestions with higher percengtage.", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const mainMeter = await TestHelperMeter.create(client, "MainMeter", {
      isMain: true,
    });
    const meterA = await TestHelperMeter.create(client, "MeterA");
    const meterB = await TestHelperMeter.create(client, "MeterB");

    const meterA2 = await TestHelperMeter.create(client, "MeterA2", {
      departmentId: meterA.departmentId,
    });

    const gasMain = await TestHelperMeter.create(client, "GasMain", {
      energyResource: "GAS",
      isMain: true,
    });

    const meterC = await TestHelperMeter.create(client, "MeterC", {
      energyResource: "GAS",
    });

    const meterD = await TestHelperMeter.create(client, "MeterD", {
      energyResource: "GAS",
    });

    const meterE = await TestHelperMeter.create(client, "MeterE");

    await TestHelperMetric.addValues(session.orgId, mainMeter.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 165, datetime: "2025-01-02T00:00:00.000Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, meterA.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 95, datetime: "2025-01-02T00:00:00.000Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, meterA2.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 60, datetime: "2025-01-02T00:00:00.000Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, meterB.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 30, datetime: "2025-01-02T00:00:00.000Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, meterE.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 5, datetime: "2025-01-02T00:00:00.000Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, gasMain.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 100, datetime: "2025-01-02T00:00:00.000Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, meterC.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 120, datetime: "2025-01-02T00:00:00.000Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, meterD.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 50, datetime: "2025-01-02T00:00:00.000Z" },
    ]);

    const res = await client.GET("/u/measurement/seu/suggest", {
      params: {
        query: {
          minConsumptionPercentage: 95,
          datetimeMin: "2025-01-01T00:00:00Z",
          datetimeMax: "2025-03-01T00:00:00Z",
        },
      },
    });

    expect(res).toBeApiOk();

    expect(res.data).toStrictEqual({
      records: [
        {
          name: "Department:MeterA",
          energyResource: "ELECTRIC",
          meterSlices: [
            { id: meterA.sliceId, name: "Metric:MeterA - Department:MeterA" },
            { id: meterA2.sliceId, name: "Metric:MeterA2 - Department:MeterA" },
          ],
        },
        {
          name: "Department:MeterB",
          energyResource: "ELECTRIC",
          meterSlices: [
            {
              id: meterB.sliceId,
              name: "Metric:MeterB - Department:MeterB",
            },
          ],
        },
        {
          name: "Department:MeterC",
          energyResource: "GAS",
          meterSlices: [
            {
              id: meterC.sliceId,
              name: "Metric:MeterC - Department:MeterC",
            },
          ],
        },
      ],
    });
  });

  it("Suggestions with lower percentage", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const mainMeter = await TestHelperMeter.create(client, "MainMeter", {
      isMain: true,
    });
    const meterA = await TestHelperMeter.create(client, "MeterA");
    const meterB = await TestHelperMeter.create(client, "MeterB");

    const meterA2 = await TestHelperMeter.create(client, "MeterA2", {
      departmentId: meterA.departmentId,
    });

    const gasMain = await TestHelperMeter.create(client, "GasMain", {
      energyResource: "GAS",
      isMain: true,
    });

    const meterC = await TestHelperMeter.create(client, "MeterC", {
      energyResource: "GAS",
    });

    const meterD = await TestHelperMeter.create(client, "MeterD", {
      energyResource: "GAS",
    });

    const meterE = await TestHelperMeter.create(client, "MeterE");

    await TestHelperMetric.addValues(session.orgId, mainMeter.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 165, datetime: "2025-01-02T00:00:00.000Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, meterA.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 95, datetime: "2025-01-02T00:00:00.000Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, meterA2.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 60, datetime: "2025-01-02T00:00:00.000Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, meterB.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 30, datetime: "2025-01-02T00:00:00.000Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, meterE.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 5, datetime: "2025-01-02T00:00:00.000Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, gasMain.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 100, datetime: "2025-01-02T00:00:00.000Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, meterC.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 120, datetime: "2025-01-02T00:00:00.000Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, meterD.metricId, [
      { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
      { value: 50, datetime: "2025-01-02T00:00:00.000Z" },
    ]);

    const res = await client.GET("/u/measurement/seu/suggest", {
      params: {
        query: {
          minConsumptionPercentage: 20,
          datetimeMin: "2025-01-01T00:00:00Z",
          datetimeMax: "2025-03-01T00:00:00Z",
        },
      },
    });

    expect(res).toBeApiOk();

    expect(res.data).toStrictEqual({
      records: [
        {
          name: "Department:MeterA",
          energyResource: "ELECTRIC",
          meterSlices: [
            { name: "Metric:MeterA - Department:MeterA", id: meterA.sliceId },
          ],
        },
        {
          name: "Department:MeterC",
          energyResource: "GAS",
          meterSlices: [
            { name: "Metric:MeterC - Department:MeterC", id: meterC.sliceId },
          ],
        },
      ],
    });
  });

  it("should throw BAD_REQUEST meter energy resource does not match", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "Meter1");

    const res = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Seu",
        departmentIds: [],
        energyResource: "WATER",
        meterSliceIds: [meter.sliceId],
      },
    });

    expect(res).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("should let user create seu without department and without meter id", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Seu",
        departmentIds: [],
        energyResource: "ELECTRIC",
        meterSliceIds: [],
      },
    });

    expect(res).toBeApiOk();
  });

  it("should throw bad request because of selected meter is main meter.", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");
    const dept2Id = await TestHelperDepartment.create(client, "Department2");
    const meter = await TestHelperMeter.create(client, "Meter1");

    const createSlicePayload = [
      {
        name: "Slice1",
        rate: 0.6,
        departmentId: dept1Id,
        isMain: true,
      },
      {
        name: "Slice2",
        rate: 0.4,
        departmentId: dept2Id,
        isMain: true,
      },
    ];

    const meterSlices = await client.POST(
      "/u/measurement/meter/slice/{meterId}",
      {
        params: { path: { meterId: meter.id } },
        body: createSlicePayload,
      },
    );

    const res = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Seu",
        departmentIds: [dept1Id, dept2Id],
        energyResource: "ELECTRIC",
        meterSliceIds: meterSlices.data!.createdIds,
      },
    });
    expect(res).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("should throw BAD_REQUEST when selected slices contain a main meter slice", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter = await TestHelperMeter.create(client, "Main Meter", {
      isMain: true,
    });

    const res = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Invalid SEU",
        departmentIds: [],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter.sliceId],
      },
    });

    expect(res).toBeApiError(EApiFailCode.BAD_REQUEST);
  });
});
