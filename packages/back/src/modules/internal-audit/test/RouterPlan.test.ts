import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperUser } from "@m/base/test/TestHelperUser";
import { TestHelperSeu } from "@m/measurement/test/TestHelperSeu";

describe("E2E - internal - audit router plan", () => {
  it("POST/ router plan should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const resUser = await TestHelperUser.createTestUser(client, "name");
    const res = await client.POST("/u/internal-audit/plan/item", {
      body: {
        seuId: seu1.id,
        name: "Test Plan",
        responsibleUserId: resUser.data!.id,
        scheduleDate: "2021-10-10",
      },
    });
    expect(res).toBeApiOk();
  });
  it("GET/ router plan list should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const resUser = await TestHelperUser.createTestUser(client, "name");
    const payload = {
      name: "Test Plan",
      scheduleDate: "2021-10-10",
    };
    const createResponse = await client.POST("/u/internal-audit/plan/item", {
      body: {
        ...payload,
        seuId: seu1.id,
        responsibleUserId: resUser.data!.id,
      },
    });
    const createdId = createResponse.data!.id;

    const res = await client.GET("/u/internal-audit/plan/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload,
          seu: {
            id: seu1.id,
            name: "seu1",
          },
          responsibleUser: {
            id: resUser.data!.id,
            displayName: "name",
          },
        },
      ],
    });
  });
  it("GET/ router plan should be ok with id!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const resUser = await TestHelperUser.createTestUser(client, "name");

    const payload = {
      name: "Test Plan",
      scheduleDate: "2021-10-10",
    };
    const createResponse = await client.POST("/u/internal-audit/plan/item", {
      body: {
        ...payload,
        seuId: seu1.id,
        responsibleUserId: resUser.data!.id,
      },
    });

    expect(createResponse).toBeApiOk();
    const createdId = createResponse.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET("/u/internal-audit/plan/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...payload,
      seu: {
        id: seu1.id,
        name: "seu1",
      },
      responsibleUser: {
        id: resUser.data!.id,
        displayName: "name",
      },
    });
  });
  it("PUT/ router plan should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const seu2 = await TestHelperSeu.createTestSeu(client, "seu2");
    const resUser = await TestHelperUser.createTestUser(client, "name");
    const resUser2 = await TestHelperUser.createTestUser(client, "name2");

    const res = await client.POST("/u/internal-audit/plan/item", {
      body: {
        seuId: seu1.id,
        name: "Test Plan",
        responsibleUserId: resUser.data!.id,
        scheduleDate: "2021-10-10",
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBodyPart = {
      name: "Test Plan Update",
      scheduleDate: "2021-10-11",
    };

    const updateRes = await client.PUT("/u/internal-audit/plan/item/{id}", {
      params: { path: { id: createdId } },
      body: {
        ...updateBodyPart,
        seuId: seu2.id,
        responsibleUserId: resUser2.data!.id,
      },
    });
    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/internal-audit/plan/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBodyPart,
      seu: {
        id: seu2.id,
        name: "seu2",
      },
      responsibleUser: {
        id: resUser2.data!.id,
        displayName: "name2",
      },
    });
  });
  it("DELETE/ router should be delete!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const resUser = await TestHelperUser.createTestUser(client, "name");
    const res = await client.POST("/u/internal-audit/plan/item", {
      body: {
        seuId: seu1.id,
        name: "Test Plan",
        responsibleUserId: resUser.data!.id,
        scheduleDate: "2021-10-10",
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE("/u/internal-audit/plan/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(deleteRes).toBeApiOk();
  });
  it("GET/ should be error when record is not found", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const invalidId = "00000000-0000-0000-0000-000000000000";
    const errorRes = await client.GET("/u/internal-audit/plan/item/{id}", {
      params: { path: { id: invalidId } },
    });
    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
