import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterEnergyPolicy", () => {
  it("POST /u/commitment/energy-policy should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/commitment/energy-policy/item", {
      body: {
        content: "Test Commitment/EnergyPolicy -> Content",
        period: "MONTHLY",
        type: "Test Commitment/EnergyPolicy -> Type",
        target: "Test Commitment/EnergyPolicy -> Target",
      },
    });
    expect(res).toBeApiOk();
  });

  it("PUT /u/commitment/energy-policy/:id should update the energy policy", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/commitment/energy-policy/item", {
      body: {
        content: "Test Commitment/EnergyPolicy -> Content",
        period: "QUARTERLY",
        type: "Test Commitment/EnergyPolicy -> Type",
        target: "Test Commitment/EnergyPolicy -> Target",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBody = {
      content: "Test Commitment/EnergyPolicy -> Content",
      period: "QUARTERLY",
      type: "Test Commitment/EnergyPolicy -> Type",
      target: "Test Commitment/EnergyPolicy -> Target",
    } as const;

    const updateRes = await client.PUT(
      "/u/commitment/energy-policy/item/{id}",
      {
        params: { path: { id: createdId } },
        body: updateBody,
      },
    );

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/commitment/energy-policy/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBody,
    });
  });

  it("GET /u/commitment/energy-policy ", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const payload = {
      content: "Test Commitment/EnergyPolicy -> Content",
      period: "WEEKLY",
      type: "Test Commitment/EnergyPolicy -> Type",
      target: "Test Commitment/EnergyPolicy -> Target",
    } as const;
    const createResponse = await client.POST(
      "/u/commitment/energy-policy/item",
      {
        body: payload,
      },
    );
    const createdId = createResponse.data!.id;
    const res = await client.GET("/u/commitment/energy-policy/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          ...payload,
          id: createdId,
        },
      ],
    });
  });

  it("GET /u/commitment/energy-policy/:id should get the energy policy", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/commitment/energy-policy/item", {
      body: {
        content: "Test Commitment/EnergyPolicy -> Content",
        period: "YEARLY",
        type: "Test Commitment/EnergyPolicy -> Type",
        target: "Test Commitment/EnergyPolicy -> Target",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET("/u/commitment/energy-policy/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      content: "Test Commitment/EnergyPolicy -> Content",
      period: "YEARLY",
      type: "Test Commitment/EnergyPolicy -> Type",
      target: "Test Commitment/EnergyPolicy -> Target",
    });
  });
  it("DELETE /u/commitment/energy-policy/:id should delete the energy policy", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/commitment/energy-policy/item", {
      body: {
        content: "Test Commitment/EnergyPolicy -> Content",
        period: "YEARLY",
        type: "Test Commitment/EnergyPolicy -> Type",
        target: "Test Commitment/EnergyPolicy -> Target",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE(
      "/u/commitment/energy-policy/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET("/u/commitment/energy-policy/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
