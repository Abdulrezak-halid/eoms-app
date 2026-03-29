import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterPipeline", () => {
  it("Create Pipeline", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const pipeline = await client.POST("/u/supply-chain/pipeline/item", {
      body: {
        name: "pipeline",
      },
    });
    expect(pipeline).toBeApiOk();
  });

  it("Get Pipelines", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const pipeline = await client.POST("/u/supply-chain/pipeline/item", {
      body: {
        name: "pipeline",
      },
    });
    expect(pipeline).toBeApiOk();

    const recs = await client.GET("/u/supply-chain/pipeline/item");
    expect(recs.data).toStrictEqual({
      records: [
        {
          createdAt: expect.any(String),
          id: pipeline.data!.id,
          name: "pipeline",
        },
      ],
    });
  });

  it("Get Pipeline", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const pipeline = await client.POST("/u/supply-chain/pipeline/item", {
      body: {
        name: "pipeline",
      },
    });
    expect(pipeline).toBeApiOk();

    const recs = await client.GET("/u/supply-chain/pipeline/item/{id}", {
      params: { path: { id: pipeline.data!.id } },
    });

    expect(recs.data).toStrictEqual({
      createdAt: expect.any(String),
      id: pipeline.data!.id,
      name: "pipeline",
    });
  });

  it("Update Pipeline", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const pipeline = await client.POST("/u/supply-chain/pipeline/item", {
      body: {
        name: "pipeline",
      },
    });
    expect(pipeline).toBeApiOk();

    const updateRes = await client.PUT("/u/supply-chain/pipeline/item/{id}", {
      params: { path: { id: pipeline.data!.id } },
      body: {
        name: "Updated Pipeline",
      },
    });
    expect(updateRes).toBeApiOk();

    const recs = await client.GET("/u/supply-chain/pipeline/item/{id}", {
      params: { path: { id: pipeline.data!.id } },
    });

    expect(recs.data).toStrictEqual({
      createdAt: expect.any(String),
      id: pipeline.data!.id,
      name: "Updated Pipeline",
    });
  });

  it("Delete Pipeline", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const pipeline = await client.POST("/u/supply-chain/pipeline/item", {
      body: {
        name: "pipeline",
      },
    });
    expect(pipeline).toBeApiOk();

    const updateRes = await client.DELETE(
      "/u/supply-chain/pipeline/item/{id}",
      { params: { path: { id: pipeline.data!.id } } },
    );

    expect(updateRes).toBeApiOk();

    const recs = await client.GET("/u/supply-chain/pipeline/item/{id}", {
      params: { path: { id: pipeline.data!.id } },
    });

    expect(recs).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
