import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterOperation", () => {
  it("Create Operation", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const pipeline = await client.POST("/u/supply-chain/pipeline/item", {
      body: {
        name: "pipeline",
      },
    });
    expect(pipeline).toBeApiOk();

    const createRes = await client.POST(
      "/u/supply-chain/pipeline/operation/item",
      {
        body: {
          index: 0,
          name: "operation",
          pipelineId: pipeline.data!.id,
        },
      },
    );
    expect(createRes).toBeApiOk();
  });

  it("Get Operations", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const pipeline = await client.POST("/u/supply-chain/pipeline/item", {
      body: {
        name: "pipeline",
      },
    });
    expect(pipeline).toBeApiOk();

    const createRes = await client.POST(
      "/u/supply-chain/pipeline/operation/item",
      {
        body: {
          index: 0,
          name: "operation",
          pipelineId: pipeline.data!.id,
        },
      },
    );
    expect(createRes).toBeApiOk();

    const recs = await client.GET("/u/supply-chain/pipeline/operation/item");
    expect(recs.data).toStrictEqual({
      records: [
        {
          createdAt: expect.any(String),
          id: createRes.data!.id,
          index: 0,
          name: "operation",
          pipeline: {
            id: pipeline.data!.id,
            name: "pipeline",
          },
        },
      ],
    });
  });

  it("Get Operation", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const pipeline = await client.POST("/u/supply-chain/pipeline/item", {
      body: {
        name: "pipeline",
      },
    });
    expect(pipeline).toBeApiOk();

    const createRes = await client.POST(
      "/u/supply-chain/pipeline/operation/item",
      {
        body: {
          index: 0,
          name: "operation",
          pipelineId: pipeline.data!.id,
        },
      },
    );
    expect(createRes).toBeApiOk();

    const recs = await client.GET(
      "/u/supply-chain/pipeline/operation/item/{id}",
      {
        params: { path: { id: createRes.data!.id } },
      },
    );

    expect(recs.data).toStrictEqual({
      createdAt: expect.any(String),
      id: createRes.data!.id,
      name: "operation",
      pipeline: {
        id: pipeline.data!.id,
        name: "pipeline",
      },
    });
  });

  it("Update Operation", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const pipeline = await client.POST("/u/supply-chain/pipeline/item", {
      body: {
        name: "pipeline",
      },
    });
    expect(pipeline).toBeApiOk();

    const createRes = await client.POST(
      "/u/supply-chain/pipeline/operation/item",
      {
        body: {
          index: 0,
          name: "operation",
          pipelineId: pipeline.data!.id,
        },
      },
    );
    expect(createRes).toBeApiOk();

    const updateRes = await client.PUT(
      "/u/supply-chain/pipeline/operation/item/{id}",
      {
        params: { path: { id: createRes.data!.id } },
        body: {
          index: 0,
          name: "operation updated",
          pipelineId: pipeline.data!.id,
        },
      },
    );
    expect(updateRes).toBeApiOk();

    const recs = await client.GET(
      "/u/supply-chain/pipeline/operation/item/{id}",
      {
        params: { path: { id: createRes.data!.id } },
      },
    );

    expect(recs.data).toStrictEqual({
      createdAt: expect.any(String),
      id: createRes.data!.id,
      name: "operation updated",
      pipeline: {
        id: pipeline.data!.id,
        name: "pipeline",
      },
    });
  });

  it("Delete Operation", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const pipeline = await client.POST("/u/supply-chain/pipeline/item", {
      body: {
        name: "pipeline",
      },
    });
    expect(pipeline).toBeApiOk();

    const createRes = await client.POST(
      "/u/supply-chain/pipeline/operation/item",
      {
        body: {
          index: 0,
          name: "operation",
          pipelineId: pipeline.data!.id,
        },
      },
    );
    expect(createRes).toBeApiOk();

    const updateRes = await client.DELETE(
      "/u/supply-chain/pipeline/operation/item/{id}",
      { params: { path: { id: createRes.data!.id } } },
    );

    expect(updateRes).toBeApiOk();

    const recs = await client.GET(
      "/u/supply-chain/pipeline/operation/item/{id}",
      {
        params: { path: { id: createRes.data!.id } },
      },
    );

    expect(recs).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("Reorder Operations", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const pipeline = await client.POST("/u/supply-chain/pipeline/item", {
      body: {
        name: "pipeline",
      },
    });
    expect(pipeline).toBeApiOk();

    const operation1 = await client.POST(
      "/u/supply-chain/pipeline/operation/item",
      {
        body: {
          index: 0,
          name: "operation1",
          pipelineId: pipeline.data!.id,
        },
      },
    );
    expect(operation1).toBeApiOk();

    const operation2 = await client.POST(
      "/u/supply-chain/pipeline/operation/item",
      {
        body: {
          index: 1,
          name: "operation2",
          pipelineId: pipeline.data!.id,
        },
      },
    );
    expect(operation2).toBeApiOk();

    const operation3 = await client.POST(
      "/u/supply-chain/pipeline/operation/item",
      {
        body: {
          index: 2,
          name: "operation3",
          pipelineId: pipeline.data!.id,
        },
      },
    );
    expect(operation3).toBeApiOk();

    const updateRes = await client.PUT(
      "/u/supply-chain/pipeline/operation/item/{id}",
      {
        params: { path: { id: operation3.data!.id } },
        body: {
          index: 0,
          name: "operation updated",
          pipelineId: pipeline.data!.id,
        },
      },
    );

    expect(updateRes).toBeApiOk();

    const recs = await client.GET("/u/supply-chain/pipeline/operation/item");

    expect(recs.data).toStrictEqual({
      records: [
        {
          createdAt: expect.any(String),
          id: operation3.data!.id,
          index: 0,
          name: "operation updated",
          pipeline: {
            id: pipeline.data!.id,
            name: "pipeline",
          },
        },
        {
          createdAt: expect.any(String),
          id: operation1.data!.id,
          index: 1,
          name: "operation1",
          pipeline: {
            id: pipeline.data!.id,
            name: "pipeline",
          },
        },
        {
          createdAt: expect.any(String),
          id: operation2.data!.id,
          index: 2,
          name: "operation2",
          pipeline: {
            id: pipeline.data!.id,
            name: "pipeline",
          },
        },
      ],
    });
  });

  it("Get Pipeline Operations", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const pipeline = await client.POST("/u/supply-chain/pipeline/item", {
      body: {
        name: "pipeline",
      },
    });
    expect(pipeline).toBeApiOk();

    const operation1 = await client.POST(
      "/u/supply-chain/pipeline/operation/item",
      {
        body: {
          index: 0,
          name: "operation1",
          pipelineId: pipeline.data!.id,
        },
      },
    );
    expect(operation1).toBeApiOk();

    const operation2 = await client.POST(
      "/u/supply-chain/pipeline/operation/item",
      {
        body: {
          index: 1,
          name: "operation2",
          pipelineId: pipeline.data!.id,
        },
      },
    );
    expect(operation2).toBeApiOk();

    const operation3 = await client.POST(
      "/u/supply-chain/pipeline/operation/item",
      {
        body: {
          index: 2,
          name: "operation3",
          pipelineId: pipeline.data!.id,
        },
      },
    );
    expect(operation3).toBeApiOk();

    const recs = await client.GET("/u/supply-chain/pipeline/operation/item", {
      params: { query: { pipelineId: pipeline.data?.id } },
    });

    expect(recs.data).toStrictEqual({
      records: [
        {
          id: operation1.data!.id,
          index: 0,
          name: "operation1",
          createdAt: expect.any(String),
          pipeline: {
            id: pipeline.data!.id,
            name: "pipeline",
          },
        },
        {
          id: operation2.data!.id,
          index: 1,
          name: "operation2",
          createdAt: expect.any(String),
          pipeline: {
            id: pipeline.data!.id,
            name: "pipeline",
          },
        },
        {
          id: operation3.data!.id,
          index: 2,
          name: "operation3",
          createdAt: expect.any(String),
          pipeline: {
            id: pipeline.data!.id,
            name: "pipeline",
          },
        },
      ],
    });
  });
});
