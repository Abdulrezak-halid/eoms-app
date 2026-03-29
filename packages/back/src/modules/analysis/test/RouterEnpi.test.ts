import { EApiFailCode, UtilDate } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperSeu } from "@m/measurement/test/TestHelperSeu";

describe("E2E - RouterEnpi", () => {
  it("should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu = await TestHelperSeu.createTestSeu(client, "seu1");
    const createRes = await client.POST("/u/analysis/enpi/item", {
      body: {
        seuId: seu.id,
        equipment: "test equipment",
        targetedDate: UtilDate.getNowUtcIsoDate(),
        targetedImprovement: 10,
      },
    });
    expect(createRes).toBeApiOk();
  });

  it("create and get enpi", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const payload = {
      equipment: "test equipment",
      targetedDate: UtilDate.getNowUtcIsoDate(),
      targetedImprovement: 10,
    };
    const createRes = await client.POST("/u/analysis/enpi/item", {
      body: {
        ...payload,
        seuId: seu1.id,
      },
    });
    const enpiId = createRes.data!.id;
    const getRes = await client.GET("/u/analysis/enpi/item/{id}", {
      params: { path: { id: enpiId } },
    });
    expect(getRes.data).toStrictEqual({
      ...payload,
      id: enpiId,
      seu: { id: seu1.id, name: "seu1" },
    });
  });

  it("create and get names", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const payload = {
      equipment: "test equipment",
      targetedDate: UtilDate.getNowUtcIsoDate(),
      targetedImprovement: 10,
    };
    const createRes = await client.POST("/u/analysis/enpi/item", {
      body: {
        ...payload,
        seuId: seu1.id,
      },
    });
    const enpiId = createRes.data!.id;
    const getRes = await client.GET("/u/analysis/enpi/names");
    expect(getRes.data).toStrictEqual({
      records: [{ id: enpiId, displayName: "test equipment" }],
    });
  });

  it("create,update and get", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const payload = {
      seuId: seu1.id,
      equipment: "test equipment",
      targetedDate: UtilDate.getNowUtcIsoDate(),
      targetedImprovement: 10,
    };
    const createRes = await client.POST("/u/analysis/enpi/item", {
      body: {
        ...payload,
      },
    });
    const enpiId = createRes.data!.id;

    const updatePayload = {
      equipment: "test equipment 2",
      targetedDate: UtilDate.getNowUtcIsoDate(),
      targetedImprovement: 10,
    };

    await client.PUT("/u/analysis/enpi/item/{id}", {
      params: { path: { id: enpiId } },
      body: { ...updatePayload, seuId: seu1.id },
    });

    const getRes = await client.GET("/u/analysis/enpi/item/{id}", {
      params: { path: { id: enpiId } },
    });

    expect(getRes.data).toStrictEqual({
      id: enpiId,
      ...updatePayload,
      seu: { id: seu1.id, name: "seu1" },
    });
  });

  it("create and getAll enpis", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const payload = {
      equipment: "test equipment",
      targetedDate: UtilDate.getNowUtcIsoDate(),
      targetedImprovement: 10,
    };
    const createRes = await client.POST("/u/analysis/enpi/item", {
      body: {
        ...payload,
        seuId: seu1.id,
      },
    });
    const enpiId = createRes.data!.id;

    const getRes = await client.GET("/u/analysis/enpi/item");
    expect(getRes.data).toStrictEqual({
      records: [{ ...payload, id: enpiId, seu: { id: seu1.id, name: "seu1" } }],
    });
  });

  it("create and delete enpi", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu1Id = await TestHelperSeu.createTestSeu(client, "seu1");
    const payload = {
      seuId: seu1Id.id,
      equipment: "test equipment",
      targetedDate: UtilDate.getNowUtcIsoDate(),
      targetedImprovement: 10,
    };
    const createRes = await client.POST("/u/analysis/enpi/item", {
      body: {
        ...payload,
      },
    });
    const enpiId = createRes.data!.id;

    await client.DELETE("/u/analysis/enpi/item/{id}", {
      params: { path: { id: enpiId } },
    });
    const getRes = await client.GET("/u/analysis/enpi/item");
    expect(getRes.data).toStrictEqual({ records: [] });
  });

  it("create,delete and should throw not found", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu1Id = await TestHelperSeu.createTestSeu(client, "seu1");
    const payload = {
      seuId: seu1Id.id,
      equipment: "test equipment",
      targetedDate: UtilDate.getNowUtcIsoDate(),
      targetedImprovement: 10,
    };
    const createRes = await client.POST("/u/analysis/enpi/item", {
      body: {
        ...payload,
      },
    });
    const enpiId = createRes.data!.id;

    await client.DELETE("/u/analysis/enpi/item/{id}", {
      params: { path: { id: enpiId } },
    });
    const getRes = await client.GET("/u/analysis/enpi/item/{id}", {
      params: { path: { id: enpiId } },
    });
    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
