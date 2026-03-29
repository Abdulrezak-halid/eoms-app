import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterProduct", () => {
  it("POST /u/product-base/product should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/product-base/product/item", {
      body: {
        code: "test code",
        description: "test desc",
        unit: "APPARENT_POWER",
      },
    });
    expect(res).toBeApiOk();
  });

  it("GET /Product list should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const payload = {
      code: "test code",
      description: "test desc",
      unit: "ENERGY",
    } as const;
    const createResponse = await client.POST("/u/product-base/product/item", {
      body: payload,
    });
    const createdId = createResponse.data!.id;
    const res = await client.GET("/u/product-base/product/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          ...payload,
          id: createdId,
        },
      ],
    });
  });
  it("PUT /Product should update", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/product-base/product/item", {
      body: {
        code: "test code",
        description: "test desc",
        unit: "FREQUENCY",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBody = {
      code: "test code",
      description: "test desc",
      unit: "PIECE",
    } as const;

    const updateRes = await client.PUT("/u/product-base/product/item/{id}", {
      params: { path: { id: createdId } },
      body: updateBody,
    });

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/product-base/product/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBody,
    });
  });

  it("DELETE /product should delete ", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/product-base/product/item", {
      body: {
        code: "code",
        description: "text5",
        unit: "POWER",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE("/u/product-base/product/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(deleteRes).toBeApiOk();
  });

  it("GET /Product should return the correct product details", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/product-base/product/item", {
      body: {
        code: "code",
        description: "test description",
        unit: "PRECIPITATION",
      },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET("/u/product-base/product/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes).toBeApiOk();
    expect(getRes.data).toStrictEqual({
      id: createdId,
      code: "code",
      description: "test description",
      unit: "PRECIPITATION",
    });

    const res = await client.GET("/u/product-base/product/item/{id}", {
      params: { path: { id: "00000000-0000-0000-0000-000000000000" } },
    });
    expect(res).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("GET /u/product-base/product/item without permission should response FORBIDDEN error", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: [],
    });
    const res = await client.GET("/u/product-base/product/item");
    expect(res).toBeApiError(EApiFailCode.FORBIDDEN);
  });

  it("GET /u/product-base/product/item with a minimal permission should response ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: ["/PRODUCT"],
    });
    const res = await client.GET("/u/product-base/product/item");
    expect(res).toBeApiOk();
  });

  it("should respond PLAN_DISABLED_OP error without correct organization plan feature", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: [] },
    });
    const res = await client.GET("/u/product-base/product/item");
    expect(res).toBeApiError(EApiFailCode.PLAN_DISABLED_OP);
  });

  it("should work with correct organization plan feature", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: ["PRODUCT"] },
    });
    const res = await client.GET("/u/product-base/product/item");
    expect(res).toBeApiOk();
  });
});
