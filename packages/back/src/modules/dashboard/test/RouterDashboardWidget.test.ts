import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperAdvancedRegressionAnalysis } from "@m/analysis/test/TestHelperAdvancedRegressionAnalysis";
import { TestHelperMetric } from "@m/measurement/test/TestHelperMetric";
import { TestHelperSeu } from "@m/measurement/test/TestHelperSeu";

describe("E2E - Dashboard Widget", () => {
  it("Create dashboard widget", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    await TestHelperSeu.createTestSeu(client, "Test Seu");
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const seu2 = await TestHelperSeu.createTestSeu(client, "seu2");
    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 1,
        index: 0,
        config: {
          type: "GRAPH_SEU_VALUE",
          seuIds: [seu1.id, seu2.id],
        },
      },
    });
    expect(res).toBeApiOk();
  });

  it("Get seu dashboard widget", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    await TestHelperSeu.createTestSeu(client, "Test Seu");
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const seu2 = await TestHelperSeu.createTestSeu(client, "seu2");

    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 0,
        config: {
          type: "GRAPH_SEU_VALUE",
          seuIds: [seu1.id, seu2.id],
        },
      },
    });

    expect(res).toBeApiOk();
    const widget = await client.GET("/u/dashboard/widget/item/{id}", {
      params: { path: { id: res.data!.id } },
    });
    expect(widget.data).toStrictEqual({
      config: {
        seuIds: [seu1.id, seu2.id].sort((a, b) => a.localeCompare(b)),
        type: "GRAPH_SEU_VALUE",
      },
      id: res.data!.id,
      column: 0,
      index: 0,
    });
  });

  it("Get data view dashboard widget", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const metric1 = await TestHelperMetric.create(client, "Driver 1");
    const metric2 = await TestHelperMetric.create(client, "Driver 2");

    await TestHelperMetric.addValues(session.orgId, metric1.id, [
      { value: 1, datetime: "2025-12-01T00:00:00.000Z" },
    ]);
    await TestHelperMetric.addValues(session.orgId, metric2.id, [
      { value: 1, datetime: "2025-12-01T00:00:00.000Z" },
    ]);

    const createRes = await client.POST("/u/analysis/data-view/profile", {
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

    const profileId = createRes.data!.id;

    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 0,
        config: {
          type: "GRAPH_DATA_VIEW_VALUE",
          dataViewId: profileId,
        },
      },
    });

    expect(res).toBeApiOk();
    const widget = await client.GET("/u/dashboard/widget/item/{id}", {
      params: { path: { id: res.data!.id } },
    });
    expect(widget.data).toStrictEqual({
      config: {
        type: "GRAPH_DATA_VIEW_VALUE",
        dataViewId: profileId,
      },
      id: res.data!.id,
      column: 0,
      index: 0,
    });
  });

  it("Get advanced regression dashboard widget", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const analysis =
      await TestHelperAdvancedRegressionAnalysis.createAdvancedRegression(
        client,
      );
    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 0,
        config: {
          type: "GRAPH_ADVANCED_REGRESSION_RESULT",
          regressionResultId: analysis.id,
        },
      },
    });
    expect(res).toBeApiOk();
    const widget = await client.GET("/u/dashboard/widget/item/{id}", {
      params: { path: { id: res.data!.id } },
    });

    expect(widget.data).toStrictEqual({
      config: {
        regressionResultId: analysis.id,
        type: "GRAPH_ADVANCED_REGRESSION_RESULT",
      },
      id: res.data?.id,
      column: 0,
      index: 0,
    });
  });

  it("Get energy policy dashboard widget", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const policy = await client.POST("/u/commitment/energy-policy/item", {
      body: {
        content: "Energy Policy Content",
        period: "MONTHLY",
        type: "ENERGY_POLICY",
        target: "Energy Policy Target",
      },
    });

    expect(policy).toBeApiOk();

    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        index: 0,
        column: 0,
        config: {
          type: "ENERGY_POLICY",
        },
      },
    });

    expect(res).toBeApiOk();
    const widget = await client.GET("/u/dashboard/widget/item/{id}", {
      params: { path: { id: res.data!.id } },
    });

    expect(widget.data).toStrictEqual({
      id: res.data?.id,
      index: 0,
      column: 0,
      config: {
        type: "ENERGY_POLICY",
      },
    });
  });

  it("Get SEU pie chart dashboard widget", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const seu2 = await TestHelperSeu.createTestSeu(client, "seu2");

    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 0,
        config: {
          type: "SEU_PIE_CHART",
          seuIds: [seu1.id, seu2.id],
        },
      },
    });

    expect(res).toBeApiOk();

    const widget = await client.GET("/u/dashboard/widget/item/{id}", {
      params: { path: { id: res.data!.id } },
    });

    expect(widget.data).toStrictEqual({
      config: {
        seuIds: [seu1.id, seu2.id].sort((a, b) => a.localeCompare(b)),
        type: "SEU_PIE_CHART",
      },
      id: res.data!.id,
      column: 0,
      index: 0,
    });
  });

  it("Get energy resource pie chart dashboard widget", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        index: 0,
        column: 0,
        config: {
          type: "ENERGY_RESOURCE_PIE_CHART",
        },
      },
    });

    expect(res).toBeApiOk();

    const widget = await client.GET("/u/dashboard/widget/item/{id}", {
      params: { path: { id: res.data!.id } },
    });

    expect(widget.data).toStrictEqual({
      id: res.data?.id,
      index: 0,
      column: 0,
      config: {
        type: "ENERGY_RESOURCE_PIE_CHART",
      },
    });
  });

  it("Get all dashboard widget", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    await TestHelperSeu.createTestSeu(client, "Test Seu");
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const seu2 = await TestHelperSeu.createTestSeu(client, "seu2");
    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 0,
        config: {
          type: "GRAPH_SEU_VALUE",
          seuIds: [seu1.id, seu2.id],
        },
      },
    });

    const res2 = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 1,
        config: {
          type: "GRAPH_SEU_VALUE",
          seuIds: [seu1.id, seu2.id],
        },
      },
    });

    expect(res).toBeApiOk();
    const widgets = await client.GET("/u/dashboard/widget/item");
    expect(widgets.data).toStrictEqual({
      records: [
        {
          config: {
            seuIds: [seu1.id, seu2.id],
            type: "GRAPH_SEU_VALUE",
          },
          id: res.data!.id,
          column: 0,
          index: 0,
        },
        {
          config: {
            seuIds: [seu1.id, seu2.id],
            type: "GRAPH_SEU_VALUE",
          },
          id: res2.data!.id,
          column: 0,
          index: 1,
        },
      ],
    });
  });

  it("Get metric widget", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    await TestHelperSeu.createTestSeu(client, "Test Seu");
    const metric = await TestHelperMetric.create(client, "Test Metric");

    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 0,
        config: {
          type: "GRAPH_METRIC",
          metricId: metric.id,
        },
      },
    });
    expect(res).toBeApiOk();
    const widget = await client.GET("/u/dashboard/widget/item/{id}", {
      params: { path: { id: res.data!.id } },
    });

    expect(widget.data).toStrictEqual({
      config: {
        metricId: metric.id,
        type: "GRAPH_METRIC",
      },
      id: res.data?.id,
      column: 0,
      index: 0,
    });
  });

  it("Change index for dashboard", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    await TestHelperSeu.createTestSeu(client, "Test Seu");
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const seu2 = await TestHelperSeu.createTestSeu(client, "seu2");
    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 0,
        config: {
          type: "GRAPH_SEU_VALUE",
          seuIds: [seu1.id, seu2.id],
        },
      },
    });

    const res2 = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 1,
        config: {
          type: "GRAPH_SEU_VALUE",
          seuIds: [seu1.id, seu2.id],
        },
      },
    });

    expect(res).toBeApiOk();

    const widget = await client.PUT("/u/dashboard/widget/item/{id}/position", {
      params: { path: { id: res.data!.id } },
      body: {
        column: 0,
        index: 1,
      },
    });

    expect(widget).toBeApiOk();

    const widgets = await client.GET("/u/dashboard/widget/item");
    expect(widgets.data).toStrictEqual({
      records: [
        {
          config: {
            seuIds: [seu1.id, seu2.id],
            type: "GRAPH_SEU_VALUE",
          },
          id: res2.data!.id,
          column: 0,
          index: 0,
        },
        {
          config: {
            seuIds: [seu1.id, seu2.id],
            type: "GRAPH_SEU_VALUE",
          },
          id: res.data!.id,
          column: 0,
          index: 1,
        },
      ],
    });
  });

  it("Insert widget in the middle of column should shift only same column", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const seu2 = await TestHelperSeu.createTestSeu(client, "seu2");
    const seu3 = await TestHelperSeu.createTestSeu(client, "seu3");

    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 0,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu1.id] },
      },
    });
    const res2 = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 1,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu2.id] },
      },
    });
    const res3 = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 1,
        index: 0,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu3.id] },
      },
    });

    const wNew = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 1,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu1.id, seu2.id] },
      },
    });
    expect(wNew).toBeApiOk();

    const widgets = await client.GET("/u/dashboard/widget/item");
    expect(widgets.data!.records).toStrictEqual([
      {
        id: res.data!.id,
        column: 0,
        index: 0,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu1.id] },
      },
      {
        id: wNew.data!.id,
        column: 0,
        index: 1,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu1.id, seu2.id] },
      },
      {
        id: res2.data!.id,
        column: 0,
        index: 2,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu2.id] },
      },
      {
        id: res3.data!.id,
        column: 1,
        index: 0,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu3.id] },
      },
    ]);
  });

  it("Adding widget with max index + 1 should work but greater should fail", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");

    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 0,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu1.id] },
      },
    });
    expect(res).toBeApiOk();

    const res2 = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 1,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu1.id] },
      },
    });
    expect(res2).toBeApiOk();

    const res3 = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 3,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu1.id] },
      },
    });
    expect(res3).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("Moving widget within same column should reorder correctly", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const seu2 = await TestHelperSeu.createTestSeu(client, "seu2");
    const seu3 = await TestHelperSeu.createTestSeu(client, "seu3");

    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 0,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu1.id] },
      },
    });
    const res2 = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 1,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu2.id] },
      },
    });
    const res3 = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 2,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu3.id] },
      },
    });

    const moved = await client.PUT("/u/dashboard/widget/item/{id}/position", {
      params: { path: { id: res3.data!.id } },
      body: { column: 0, index: 0 },
    });
    expect(moved).toBeApiOk();

    const widgets = await client.GET("/u/dashboard/widget/item");
    expect(widgets.data!.records).toStrictEqual([
      {
        id: res3.data!.id,
        column: 0,
        index: 0,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu3.id] },
      },
      {
        id: res.data!.id,
        column: 0,
        index: 1,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu1.id] },
      },
      {
        id: res2.data!.id,
        column: 0,
        index: 2,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu2.id] },
      },
    ]);
  });

  it("Moving widget between columns should reorder both columns", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const seu2 = await TestHelperSeu.createTestSeu(client, "seu2");
    const seu3 = await TestHelperSeu.createTestSeu(client, "seu3");

    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 0,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu1.id] },
      },
    });
    const res2 = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 1,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu2.id] },
      },
    });
    const res3 = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 1,
        index: 0,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu3.id] },
      },
    });

    const res4 = await client.PUT("/u/dashboard/widget/item/{id}/position", {
      params: { path: { id: res2.data!.id } },
      body: { column: 1, index: 1 },
    });
    expect(res4).toBeApiOk();

    const widgets = await client.GET("/u/dashboard/widget/item");
    expect(widgets.data!.records).toStrictEqual([
      {
        id: res.data!.id,
        column: 0,
        index: 0,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu1.id] },
      },
      {
        id: res3.data!.id,
        column: 1,
        index: 0,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu3.id] },
      },
      {
        id: res2.data!.id,
        column: 1,
        index: 1,
        config: { type: "GRAPH_SEU_VALUE", seuIds: [seu2.id] },
      },
    ]);
  });

  it("Change column and index for dashboard", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    await TestHelperSeu.createTestSeu(client, "Test Seu");
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const seu2 = await TestHelperSeu.createTestSeu(client, "seu2");
    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 0,
        config: {
          type: "GRAPH_SEU_VALUE",
          seuIds: [seu1.id, seu2.id],
        },
      },
    });

    const res2 = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 1,
        config: {
          type: "GRAPH_SEU_VALUE",
          seuIds: [seu1.id, seu2.id],
        },
      },
    });
    const res3 = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 1,
        index: 0,
        config: {
          type: "GRAPH_SEU_VALUE",
          seuIds: [seu1.id, seu2.id],
        },
      },
    });

    //
    // [a:{index:1,column:1}]
    // [b:{index:2,column:1}]
    // [c:{index:1,column:2}]
    //

    expect(res).toBeApiOk();

    const widget = await client.PUT("/u/dashboard/widget/item/{id}/position", {
      params: { path: { id: res2.data!.id } },
      body: {
        column: 1,
        index: 0,
      },
    });

    //
    // [a:{index:1,column:2}]
    // [b:{index:1,column:1}]
    // [c:{index:2,column:2}]
    //

    expect(widget).toBeApiOk();
    const widgets = await client.GET("/u/dashboard/widget/item");

    expect(widgets.data).toStrictEqual({
      records: [
        {
          column: 0,
          index: 0,
          config: {
            seuIds: [seu1.id, seu2.id],
            type: "GRAPH_SEU_VALUE",
          },
          id: res.data!.id,
        },
        {
          column: 1,
          index: 0,
          config: {
            seuIds: [seu1.id, seu2.id],
            type: "GRAPH_SEU_VALUE",
          },
          id: res2.data!.id,
        },
        {
          column: 1,
          index: 1,
          config: {
            seuIds: [seu1.id, seu2.id],
            type: "GRAPH_SEU_VALUE",
          },
          id: res3.data!.id,
        },
      ],
    });
  });

  it("Update dashboard widget", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    await TestHelperSeu.createTestSeu(client, "Test Seu");
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const seu2 = await TestHelperSeu.createTestSeu(client, "seu2");
    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 0,
        config: {
          type: "GRAPH_SEU_VALUE",
          seuIds: [seu2.id],
        },
      },
    });

    expect(res).toBeApiOk();

    const widget = await client.PUT("/u/dashboard/widget/item/{id}", {
      params: { path: { id: res.data!.id } },
      body: {
        config: {
          type: "GRAPH_SEU_VALUE",
          seuIds: [seu1.id],
        },
      },
    });

    expect(widget).toBeApiOk();

    const widgets = await client.GET("/u/dashboard/widget/item");
    expect(widgets.data).toStrictEqual({
      records: [
        {
          config: {
            seuIds: [seu1.id],
            type: "GRAPH_SEU_VALUE",
          },
          id: res.data!.id,
          column: 0,
          index: 0,
        },
      ],
    });
  });

  it("Delete dashboard widget", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    await TestHelperSeu.createTestSeu(client, "Test Seu");
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const seu2 = await TestHelperSeu.createTestSeu(client, "seu2");

    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        column: 0,
        index: 0,
        config: {
          type: "GRAPH_SEU_VALUE",
          seuIds: [seu1.id, seu2.id],
        },
      },
    });

    expect(res).toBeApiOk();
    const remove = await client.DELETE("/u/dashboard/widget/item/{id}", {
      params: { path: { id: res.data!.id } },
    });

    expect(remove).toBeApiOk();
    const widgets = await client.GET("/u/dashboard/widget/item");
    expect(widgets.data).toStrictEqual({ records: [] });
  });

  it("Get widget must be not found", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const widget = await client.GET("/u/dashboard/widget/item/{id}", {
      params: { path: { id: "f3f21c8e-8a7b-4a97-9a77-2fcb8be7d1c4" } },
    });

    expect(widget).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("Post route without permission should response FORBIDDEN error", async () => {
    const { client: client0 } = await UtilTest.createClientLoggedIn();
    const seu = await TestHelperSeu.createTestSeu(client0, "Test Seu");
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: [],
    });
    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        index: 0,
        column: 0,
        config: {
          type: "GRAPH_SEU_VALUE",
          seuIds: [seu.id],
        },
      },
    });
    expect(res).toBeApiError(EApiFailCode.FORBIDDEN);
  });

  it("Post route with a minimal permission should response ok", async () => {
    const { client: client0 } = await UtilTest.createClientLoggedIn();
    const seu = await TestHelperSeu.createTestSeu(client0, "Test Seu");
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: ["/DASHBOARD/WIDGET/EDIT"],
    });
    const res = await client.POST("/u/dashboard/widget/item", {
      body: {
        index: 0,
        column: 0,
        config: {
          type: "GRAPH_SEU_VALUE",
          seuIds: [seu.id],
        },
      },
    });
    expect(res).toBeApiOk();
  });

  it("Get route without permission should response ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: [],
    });
    const res = await client.GET("/u/dashboard/widget/item");
    expect(res).toBeApiOk();
  });
});
