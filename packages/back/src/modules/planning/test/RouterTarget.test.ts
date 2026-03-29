import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterTarget", () => {
  it("POST /u/planning/target should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/planning/target/item", {
      body: {
        year: 2025,
        energyResource: "GAS",
        consumption: 2000,
        percentage: 75,
      },
    });
    expect(res).toBeApiOk();
  });

  it("PUT /u/planning/target/:id should update the energy policy", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/planning/target/item", {
      body: {
        year: 2025,
        energyResource: "GAS",
        consumption: 2000,
        percentage: 75,
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBody = {
      year: 2026,
      energyResource: "GAS",
      consumption: 2026,
      percentage: 85,
    } as const;

    const updateRes = await client.PUT("/u/planning/target/item/{id}", {
      params: { path: { id: createdId } },
      body: updateBody,
    });

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/planning/target/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(getRes.data).toStrictEqual({
      ...updateBody,
    });
  });

  it("GET /u/planning/target ", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const payload = {
      year: 2025,
      energyResource: "GAS",
      consumption: 2000,
      percentage: 75,
    } as const;
    const createResponse = await client.POST("/u/planning/target/item", {
      body: payload,
    });
    const createdId = createResponse.data!.id;
    const res = await client.GET("/u/planning/target/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload,
        },
      ],
    });
  });

  it("GET /u/planning/target/:id should get the energy policy", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const payload = {
      year: 2025,
      energyResource: "GAS",
      consumption: 2000,
      percentage: 75,
    } as const;
    const res = await client.POST("/u/planning/target/item", {
      body: payload,
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET("/u/planning/target/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual(payload);
  });
  it("DELETE /u/planning/target/:id should delete the energy policy", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/planning/target/item", {
      body: {
        year: 2025,
        energyResource: "GAS",
        consumption: 2000,
        percentage: 75,
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE("/u/planning/target/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET("/u/planning/target/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
