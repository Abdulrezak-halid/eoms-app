import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperMetric } from "@m/measurement/test/TestHelperMetric";

describe("E2E - RouterAccessToken", () => {
  it("should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const metric = await TestHelperMetric.create(client, "metric");

    const res = await client.POST("/u/base/access-token/item", {
      body: {
        name: "test access token",
        permissions: {
          metricResourceValueMetricIds: [metric.id],
          canListMeters: false,
          canListMetrics: false,
          canListSeus: false,
        },
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;

    const getRes = await client.GET("/u/base/access-token/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      name: "test access token",
      token: expect.any(String),
      permissions: {
        metricResourceValueMetrics: [
          {
            id: metric.id,
            name: "metric",
            type: "GAUGE",
          },
        ],
        canListMeters: false,
        canListMetrics: false,
        canListSeus: false,
      },
    });
  });

  it("should be update", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const metric = await TestHelperMetric.create(client, "meter");
    const metricUpdated = await TestHelperMetric.create(
      client,

      "meter updated",
    );

    const res = await client.POST("/u/base/access-token/item", {
      body: {
        name: "test access token",
        permissions: {
          metricResourceValueMetricIds: [metric.id],
          canListMeters: false,
          canListMetrics: false,
          canListSeus: false,
        },
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;

    const updateRes = await client.PUT("/u/base/access-token/item/{id}", {
      params: { path: { id: createdId } },
      body: {
        name: "test access token updated",
        permissions: {
          metricResourceValueMetricIds: [metricUpdated.id],
          canListMeters: false,
          canListMetrics: false,
          canListSeus: false,
        },
      },
    });

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/base/access-token/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      name: "test access token updated",
      token: expect.any(String),
      permissions: {
        metricResourceValueMetrics: [
          {
            id: metricUpdated.id,
            name: "meter updated",
            type: "GAUGE",
          },
        ],
        canListMeters: false,
        canListMetrics: false,
        canListSeus: false,
      },
    });
  });

  it("should be return all items", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const metric1 = await TestHelperMetric.create(client, "meter1");
    const metric2 = await TestHelperMetric.create(client, "meter2");

    const res1 = await client.POST("/u/base/access-token/item", {
      body: {
        name: "test access token 1",
        permissions: {
          metricResourceValueMetricIds: [metric1.id],
          canListMeters: false,
          canListMetrics: false,
          canListSeus: false,
        },
      },
    });
    expect(res1).toBeApiOk();
    const createdId1 = res1.data!.id;

    const res2 = await client.POST("/u/base/access-token/item", {
      body: {
        name: "test access token 2",
        permissions: {
          metricResourceValueMetricIds: [metric2.id],
          canListMeters: false,
          canListMetrics: false,
          canListSeus: false,
        },
      },
    });
    expect(res2).toBeApiOk();
    const createdId2 = res2.data!.id;

    const getRes = await client.GET("/u/base/access-token/item");

    expect(
      getRes.data?.records.sort((a, b) => a.id.localeCompare(b.id)),
    ).toStrictEqual(
      [
        {
          id: createdId1,
          name: "test access token 1",
          token: expect.any(String),
          permissions: {
            metricResourceValueMetrics: [
              {
                id: metric1.id,
                name: "meter1",
                type: "GAUGE",
              },
            ],
            canListMeters: false,
            canListMetrics: false,
            canListSeus: false,
          },
        },
        {
          id: createdId2,
          name: "test access token 2",
          token: expect.any(String),
          permissions: {
            metricResourceValueMetrics: [
              {
                id: metric2.id,
                name: "meter2",
                type: "GAUGE",
              },
            ],
            canListMeters: false,
            canListMetrics: false,
            canListSeus: false,
          },
        },
      ].sort((a, b) => a.id.localeCompare(b.id)),
    );
  });

  it("should be delete", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const metric = await TestHelperMetric.create(client, "meter");

    const res = await client.POST("/u/base/access-token/item", {
      body: {
        name: "test access token",
        permissions: {
          metricResourceValueMetricIds: [metric.id],
          canListMetrics: false,
          canListMeters: false,
          canListSeus: false,
        },
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;

    const deleteRes = await client.DELETE("/u/base/access-token/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET("/u/base/access-token/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("should create with multiple metrics, meters, and seus", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const metric1 = await TestHelperMetric.create(client, "metric1");
    const metric2 = await TestHelperMetric.create(client, "metric2");

    const res = await client.POST("/u/base/access-token/item", {
      body: {
        name: "test access token with multiple permissions",
        permissions: {
          metricResourceValueMetricIds: [metric1.id, metric2.id],
          canListMetrics: true,
          canListMeters: true,
          canListSeus: true,
        },
      },
    });

    expect(res).toBeApiOk();

    const createdId = res.data!.id;

    const getRes = await client.GET("/u/base/access-token/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      name: "test access token with multiple permissions",
      token: expect.any(String),
      permissions: {
        metricResourceValueMetrics: [
          {
            id: metric1.id,
            name: "metric1",
            type: "GAUGE",
          },
          {
            id: metric2.id,
            name: "metric2",
            type: "GAUGE",
          },
        ].toSorted((a, b) => a.id.localeCompare(b.id)),
        canListMeters: true,
        canListMetrics: true,
        canListSeus: true,
      },
    });
  });

  it("should response FORBIDDEN error when request without permission", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: [],
    });
    const res = await client.GET("/u/base/access-token/item");
    expect(res).toBeApiError(EApiFailCode.FORBIDDEN);
  });

  it("with a minimal permission should response ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: ["/BASE/ACCESS_TOKEN"],
    });
    const res = await client.GET("/u/base/access-token/item");
    expect(res).toBeApiOk();
  });
});
