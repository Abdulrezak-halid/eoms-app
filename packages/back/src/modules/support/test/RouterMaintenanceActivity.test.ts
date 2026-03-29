import { EApiFailCode, UtilDate } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperSeu } from "@m/measurement/test/TestHelperSeu";

describe("E2E -RouterProcurementProcedure", () => {
  it("POST/ Maintenance Activity should be ok!", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const seu = await TestHelperSeu.createTestSeu(client, "Department1");

    const res2 = await client.POST("/u/support/maintenance-activity/item", {
      body: {
        task: "Test support/maintenance-activity -> task 1",
        note: "Test support/maintenance-activity -> note 1",
        lastMaintainedAt: UtilDate.getNowUtcIsoDate(),
        responsibleUserId: session.userId,
        period: "MONTHLY",
        seuId: seu.id,
      },
    });
    expect(res2).toBeApiOk();
  });

  it("GET/ Maintenance Activity should be ok!", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const seu = await TestHelperSeu.createTestSeu(client, "seu");

    expect(seu.id).toBeApiOk();

    const payload2 = {
      task: "Test support/maintenance-activity -> task 1",
      note: "Test support/maintenance-activity -> note 1",
      lastMaintainedAt: UtilDate.getNowUtcIsoDate(),
      period: "MONTHLY",
    } as const;

    const createResponse = await client.POST(
      "/u/support/maintenance-activity/item",
      {
        body: {
          ...payload2,
          seuId: seu.id,
          responsibleUserId: session.userId,
        },
      },
    );
    const createdId = createResponse.data!.id;

    const res = await client.GET("/u/support/maintenance-activity/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          responsibleUser: {
            id: session.userId,
            name: session.userDisplayName,
          },
          seu: {
            id: seu.id,
            name: "seu",
          },
          ...payload2,
        },
      ],
    });
  });

  it("GET/ Maintenance Activity should be ok with id!", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const seu = await TestHelperSeu.createTestSeu(client, "seu");

    expect(seu.id).toBeApiOk();

    const payload2 = {
      task: "Test support/maintenance-activity -> task 1",
      note: "Test support/maintenance-activity -> note 1",
      lastMaintainedAt: UtilDate.getNowUtcIsoDate(),
      period: "MONTHLY",
    } as const;
    const createResponse = await client.POST(
      "/u/support/maintenance-activity/item",
      {
        body: {
          ...payload2,
          seuId: seu.id,
          responsibleUserId: session.userId,
        },
      },
    );

    expect(createResponse).toBeApiOk();
    const createdId = createResponse.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET(
      "/u/support/maintenance-activity/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...payload2,
      responsibleUser: {
        id: session.userId,
        name: session.userDisplayName,
      },
      seu: {
        id: seu.id,
        name: "seu",
      },
    });
  });

  it("PUT/ Maintenance Activity should be ok!", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const seu1 = await TestHelperSeu.createTestSeu(
      client,
      "Test measurement/seu -> name 1",
    );
    const seu2 = await TestHelperSeu.createTestSeu(
      client,
      "Test measurement/seu -> name 2",
    );

    const res = await client.POST("/u/support/maintenance-activity/item", {
      body: {
        task: "Test support/maintenance-activity -> task 1",
        note: "Test support/maintenance-activity -> note 1",
        lastMaintainedAt: UtilDate.getNowUtcIsoDate(),
        responsibleUserId: session.userId,
        period: "MONTHLY",
        seuId: seu1.id,
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBodyPart = {
      task: "Test support/maintenance-activity -> task 1",
      note: "Test support/maintenance-activity -> note 1",
      lastMaintainedAt: UtilDate.getNowUtcIsoDate(),
      period: "MONTHLY",
    } as const;

    const updateRes = await client.PUT(
      "/u/support/maintenance-activity/item/{id}",
      {
        params: { path: { id: createdId } },
        body: {
          ...updateBodyPart,
          seuId: seu2.id,
          responsibleUserId: session.userId,
        },
      },
    );
    expect(updateRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/support/maintenance-activity/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBodyPart,
      responsibleUser: {
        id: session.userId,
        name: session.userDisplayName,
      },
      seu: {
        id: seu2.id,
        name: "Test measurement/seu -> name 2",
      },
    });
  });

  it("DELETE/ Maintenance Activity should be ok!", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const seu = await TestHelperSeu.createTestSeu(client, "seu");

    expect(seu.id).toBeApiOk();

    const createRes = await client.POST(
      "/u/support/maintenance-activity/item",
      {
        body: {
          task: "Test support/maintenance-activity -> task 1",
          note: "Test support/maintenance-activity -> note 1",
          lastMaintainedAt: UtilDate.getNowUtcIsoDate(),
          responsibleUserId: session.userId,
          period: "MONTHLY",
          seuId: seu.id,
        },
      },
    );
    expect(createRes).toBeApiOk();

    const createdId = createRes.data!.id;

    const res = await client.DELETE(
      "/u/support/maintenance-activity/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(res).toBeApiOk();
  });

  it("GET/ should be error when record is not found!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const invalidId = "00000000-0000-0000-0000-000000000000";
    const errorRes = await client.GET(
      "/u/support/maintenance-activity/item/{id}",
      {
        params: { path: { id: invalidId } },
      },
    );
    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("PUT /u/support/maintenance-activity/{id} should throw NOT_FOUND when record is not found", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const seu = await TestHelperSeu.createTestSeu(client, "seu");

    expect(seu.id).toBeApiOk();

    const updateBodyPart = {
      task: "Test support/maintenance-activity -> task 1",
      note: "Test support/maintenance-activity -> note 1",
      lastMaintainedAt: UtilDate.getNowUtcIsoDate(),
      period: "MONTHLY",
      seuId: seu.id,
      responsibleUserId: session.userId,
    } as const;

    const res = await client.PUT("/u/support/maintenance-activity/item/{id}", {
      params: { path: { id: "00000000-0000-0000-0000-000000000000" } },
      body: updateBodyPart,
    });

    expect(res).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
