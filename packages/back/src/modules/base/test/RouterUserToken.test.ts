import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterUserToken", () => {
  it("should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/base/user-token/item", {
      body: {
        name: "test user token",
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;

    const getRes = await client.GET("/u/base/user-token/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      name: "test user token",
      token: expect.any(String),
    });
  });

  it("should be update", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/base/user-token/item", {
      body: {
        name: "test user token",
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;

    const updateRes = await client.PUT("/u/base/user-token/item/{id}", {
      params: { path: { id: createdId } },
      body: {
        name: "test user token updated",
      },
    });

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/base/user-token/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      name: "test user token updated",
      token: expect.any(String),
    });
  });

  it("should be return all items", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res1 = await client.POST("/u/base/user-token/item", {
      body: {
        name: "test user token 1",
      },
    });
    expect(res1).toBeApiOk();
    const createdId1 = res1.data!.id;

    const res2 = await client.POST("/u/base/user-token/item", {
      body: {
        name: "test user token 2",
      },
    });
    expect(res2).toBeApiOk();
    const createdId2 = res2.data!.id;

    const getRes = await client.GET("/u/base/user-token/item");

    expect(
      getRes.data?.records.sort((a, b) => a.id.localeCompare(b.id)),
    ).toStrictEqual(
      [
        {
          id: createdId1,
          name: "test user token 1",
          token: expect.any(String),
        },
        {
          id: createdId2,
          name: "test user token 2",
          token: expect.any(String),
        },
      ].sort((a, b) => a.id.localeCompare(b.id)),
    );
  });

  it("should be delete", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/base/user-token/item", {
      body: {
        name: "test user token",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;

    const deleteRes = await client.DELETE("/u/base/user-token/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET("/u/base/user-token/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("should create with multiple metrics, meters, and seus", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/base/user-token/item", {
      body: {
        name: "test user token with multiple permissions",
      },
    });

    expect(res).toBeApiOk();

    const createdId = res.data!.id;

    const getRes = await client.GET("/u/base/user-token/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      name: "test user token with multiple permissions",
      token: expect.any(String),
    });
  });

  it("should response PLAN_DISABLED_OP error when request without organization feature", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: [] },
    });
    const res = await client.GET("/u/base/user-token/item");
    expect(res).toBeApiError(EApiFailCode.PLAN_DISABLED_OP);
  });

  it("with a minimal organization feature should response ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: ["USER_TOKEN"] },
    });
    const res = await client.GET("/u/base/user-token/item");
    expect(res).toBeApiOk();
  });

  it("should response FORBIDDEN error when request without permission", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: [],
    });
    const res = await client.GET("/u/base/user-token/item");
    expect(res).toBeApiError(EApiFailCode.FORBIDDEN);
  });

  it("with a minimal permission should response ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: ["/BASE/USER_TOKEN"],
    });
    const res = await client.GET("/u/base/user-token/item");
    expect(res).toBeApiOk();
  });
});
