import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperMeter } from "./TestHelperMeter";
import { TestHelperMetric } from "./TestHelperMetric";
import { TestHelperSeu } from "./TestHelperSeu";

describe("E2E - RouterDataViewProfile", () => {
  it("should be create for driver", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const metric = await TestHelperMetric.create(client, "Driver");
    const metric2 = await TestHelperMetric.create(client, "Driver 2");

    const createRes = await client.POST("/u/measurement/data-view/profile", {
      body: {
        name: "test",
        description: "test",
        options: {
          type: "METRIC",
          metricIds: [metric.id, metric2.id],
        },
      },
    });
    expect(createRes).toBeApiOk();
    const profileId = createRes.data!.id;

    const getRes = await client.GET("/u/measurement/data-view/profile");

    expect(getRes).toBeApiOk();
    expect(getRes.data).toStrictEqual({
      records: [
        {
          id: profileId,
          name: "test",
          description: "test",
          options: {
            type: "METRIC",
            metrics: [
              {
                id: metric.id,
                name: "Driver",
              },
              {
                id: metric2.id,
                name: "Driver 2",
              },
            ],
          },
        },
      ],
    });
  });

  it("should be create for meter slice", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const meter = await TestHelperMeter.create(client, "Meter");

    const createRes = await client.POST("/u/measurement/data-view/profile", {
      body: {
        name: "test",
        description: "test",
        options: {
          type: "METER_SLICE",
          meterSliceIds: [meter.sliceId],
          energyResource: "ELECTRIC",
        },
      },
    });
    const profileId = createRes.data!.id;
    expect(createRes).toBeApiOk();
    const getRes = await client.GET("/u/measurement/data-view/profile");
    expect(getRes.data).toStrictEqual({
      records: [
        {
          id: profileId,
          name: "test",
          description: "test",
          options: {
            type: "METER_SLICE",
            meterSlices: [
              {
                id: meter.sliceId,
                name: "Metric:Meter - Department:Meter",
                energyResource: "ELECTRIC",
              },
            ],
          },
        },
      ],
    });
  });

  it("should be return for seu", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu = await TestHelperSeu.createTestSeu(client, "Seu");

    const createRes = await client.POST("/u/measurement/data-view/profile", {
      body: {
        name: "test",
        description: "test",
        options: {
          type: "SEU",
          energyResource: "ELECTRIC",
          seuIds: [seu.id],
        },
      },
    });
    const profileId = createRes.data!.id;
    expect(createRes).toBeApiOk();
    const getRes = await client.GET("/u/measurement/data-view/profile");
    expect(getRes.data).toStrictEqual({
      records: [
        {
          id: profileId,
          name: "test",
          description: "test",
          options: {
            seus: [
              {
                id: seu.id,
                name: "Seu",
                energyResource: "ELECTRIC",
              },
            ],
            type: "SEU",
          },
        },
      ],
    });
  });

  it("should be return get all", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu = await TestHelperSeu.createTestSeu(client, "Seu");

    const createSeuProfileRes = await client.POST(
      "/u/measurement/data-view/profile",
      {
        body: {
          name: "test",
          description: "test",
          options: {
            type: "SEU",
            energyResource: "ELECTRIC",
            seuIds: [seu.id],
          },
        },
      },
    );

    const metric = await TestHelperMetric.create(client, "Driver");
    const metric2 = await TestHelperMetric.create(client, "Driver 2");

    const createDriverProfileRes = await client.POST(
      "/u/measurement/data-view/profile",
      {
        body: {
          name: "test 2",
          description: "test",
          options: {
            type: "METRIC",
            metricIds: [metric.id, metric2.id],
          },
        },
      },
    );

    const driverProfileId = createDriverProfileRes.data!.id;
    expect(createDriverProfileRes).toBeApiOk();

    const seuProfileId = createSeuProfileRes.data!.id;
    expect(createSeuProfileRes).toBeApiOk();

    const getRes = await client.GET("/u/measurement/data-view/profile");
    // Service orders by created at, but it is not included in response,
    //   so to strict match, sort by id
    expect(
      getRes.data?.records.sort((a, b) => a.id.localeCompare(b.id)),
    ).toStrictEqual(
      [
        {
          id: seuProfileId,
          name: "test",
          description: "test",
          options: {
            type: "SEU",
            seus: [
              {
                id: seu.id,
                name: "Seu",
                energyResource: "ELECTRIC",
              },
            ],
          },
        },
        {
          id: driverProfileId,
          name: "test 2",
          description: "test",
          options: {
            type: "METRIC",
            metrics: [
              {
                id: metric.id,
                name: "Driver",
              },
              {
                id: metric2.id,
                name: "Driver 2",
              },
            ],
          },
        },
      ].sort((a, b) => a.id.localeCompare(b.id)),
    );
  });

  it("should be update and get for driver", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const metric = await TestHelperMetric.create(client, "Driver 1");
    const metric2 = await TestHelperMetric.create(client, "Driver 2");

    const payload = {
      name: "test",
      description: "test",
    };
    const updateBody = {
      name: "test",
      description: "updated",
    };

    const createRes = await client.POST("/u/measurement/data-view/profile", {
      body: {
        ...payload,
        options: {
          type: "METRIC",
          metricIds: [metric.id],
        },
      },
    });

    await client.PUT("/u/measurement/data-view/profile/{id}", {
      params: { path: { id: createRes.data!.id } },
      body: {
        ...updateBody,
        options: {
          type: "METRIC",
          metricIds: [metric2.id],
        },
      },
    });

    const profileId = createRes.data!.id;
    expect(createRes).toBeApiOk();
    const getRes = await client.GET("/u/measurement/data-view/profile/{id}", {
      params: { path: { id: profileId } },
    });
    expect(getRes).toBeApiOk();
    expect(getRes.data).toStrictEqual({
      ...updateBody,
      id: profileId,
      options: {
        type: "METRIC",
        metrics: [
          {
            id: metric2.id,
            name: "Driver 2",
          },
        ],
      },
    });
  });

  it("should be update and get for meter slice", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const meter1 = await TestHelperMeter.create(client, "Meter");
    const meter2 = await TestHelperMeter.create(client, "Meter 2");

    const payload = {
      name: "test",
      description: "test",
    };
    const updateBody = {
      name: "test",
      description: "updated",
    };

    const createRes = await client.POST("/u/measurement/data-view/profile", {
      body: {
        ...payload,
        options: {
          meterSliceIds: [meter1.sliceId],
          type: "METER_SLICE",
          energyResource: "ELECTRIC",
        },
      },
    });

    await client.PUT("/u/measurement/data-view/profile/{id}", {
      params: { path: { id: createRes.data!.id } },
      body: {
        ...updateBody,
        options: {
          meterSliceIds: [meter2.sliceId],
          type: "METER_SLICE",
          energyResource: "ELECTRIC",
        },
      },
    });

    const profileId = createRes.data!.id;
    expect(createRes).toBeApiOk();
    const getRes = await client.GET("/u/measurement/data-view/profile/{id}", {
      params: { path: { id: profileId } },
    });
    expect(getRes).toBeApiOk();
    expect(getRes.data).toStrictEqual({
      ...updateBody,
      id: profileId,
      options: {
        meterSlices: [
          {
            id: meter2.sliceId,
            name: "Metric:Meter 2 - Department:Meter 2",
            energyResource: "ELECTRIC",
          },
        ],
        type: "METER_SLICE",
      },
    });
  });

  it("should be update and get for seu", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const seu2 = await TestHelperSeu.createTestSeu(client, "seu2");

    const payload = {
      name: "test",
      description: "test",
    };
    const updateBody = {
      name: "test",
      description: "updated",
    };

    const createRes = await client.POST("/u/measurement/data-view/profile", {
      body: {
        ...payload,
        options: {
          type: "SEU",
          energyResource: "ELECTRIC",
          seuIds: [seu1.id],
        },
      },
    });

    await client.PUT("/u/measurement/data-view/profile/{id}", {
      params: { path: { id: createRes.data!.id } },
      body: {
        ...updateBody,
        options: {
          type: "SEU",
          energyResource: "ELECTRIC",
          seuIds: [seu2.id],
        },
      },
    });

    const profileId = createRes.data!.id;
    expect(createRes).toBeApiOk();
    const getRes = await client.GET("/u/measurement/data-view/profile/{id}", {
      params: { path: { id: profileId } },
    });
    expect(getRes).toBeApiOk();
    expect(getRes.data).toStrictEqual({
      ...updateBody,
      id: profileId,
      options: {
        type: "SEU",
        seus: [
          {
            id: seu2.id,
            name: "seu2",
            energyResource: "ELECTRIC",
          },
        ],
      },
    });
  });

  it("should be delete", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const metric = await TestHelperMetric.create(client, "metric");

    const payload = {
      name: "test",
      description: "test",
    };
    const createRes = await client.POST("/u/measurement/data-view/profile", {
      body: {
        ...payload,
        options: {
          type: "METRIC",
          metricIds: [metric.id],
        },
      },
    });
    const profileId = createRes.data!.id;
    expect(createRes).toBeApiOk();
    const deleteRes = await client.DELETE(
      "/u/measurement/data-view/profile/{id}",
      {
        params: { path: { id: profileId } },
      },
    );
    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET("/u/measurement/data-view/profile");

    expect(getRes.data).toStrictEqual({ records: [] });
  });

  it("should return NOT_FOUND error when getting a deleted profile", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const metric = await TestHelperMetric.create(client, "metric");

    const payload = {
      name: "test",
      description: "test",
    };
    const createRes = await client.POST("/u/measurement/data-view/profile", {
      body: {
        ...payload,
        options: {
          type: "METRIC",
          metricIds: [metric.id],
        },
      },
    });
    const profileId = createRes.data!.id;
    expect(createRes).toBeApiOk();
    const deleteRes = await client.DELETE(
      "/u/measurement/data-view/profile/{id}",
      {
        params: { path: { id: profileId } },
      },
    );
    expect(deleteRes).toBeApiOk();
    const getRes = await client.GET("/u/measurement/data-view/profile/{id}", {
      params: { path: { id: profileId } },
    });
    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("should return error with bad request", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const metric = await TestHelperMetric.create(client, "metric");
    const createRes = await client.POST("/u/measurement/data-view/profile", {
      body: {
        name: "test",
        description: "test",
        options: {
          type: "SEU",
          energyResource: "ELECTRIC",
          seuIds: [metric.id],
        },
      },
    });

    expect(createRes).toBeApiError(EApiFailCode.FOREIGN_KEY_NOT_FOUND);
  });

  it("should return error with bad request when different energy resource", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const electricSeu = await TestHelperSeu.createTestSeu(client, "Seu 1");

    const createRes = await client.POST("/u/measurement/data-view/profile", {
      body: {
        name: "test",
        description: "test",
        options: {
          type: "SEU",
          energyResource: "GAS",
          seuIds: [electricSeu.id],
        },
      },
    });

    expect(createRes).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("should return error with bad request when different energy resource", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    // Energy resource is electric
    const meterSlice1 = await TestHelperMeter.create(client, "Meter slice");

    const payload = {
      name: "test",
      description: "test",
    };

    const createRes = await client.POST("/u/measurement/data-view/profile", {
      body: {
        ...payload,
        options: {
          type: "METER_SLICE",
          meterSliceIds: [meterSlice1.sliceId],
          energyResource: "WATER",
        },
      },
    });
    expect(createRes).toBeApiError(EApiFailCode.BAD_REQUEST);
  });
});
