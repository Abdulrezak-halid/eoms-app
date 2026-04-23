import { EApiFailCode, UtilDate } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterTraining", () => {
  it("Create", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/support/training/item", {
      body: {
        title: "Test Training",
        trainerUserId: session.userId,
        category: "COMPETENCE",
        date: UtilDate.getNowUtcIsoDate(),
      },
    });
    expect(res).toBeApiOk();
  });

  it("Update", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/support/training/item", {
      body: {
        title: "Test Training",
        trainerUserId: session.userId,
        category: "COMPETENCE",
        date: UtilDate.getNowUtcIsoDate(),
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBody = {
      title: "Test Training 2",
      category: "AWARENESS",
      date: UtilDate.getNowUtcIsoDate(),
    } as const;

    const updateRes = await client.PUT("/u/support/training/item/{id}", {
      params: { path: { id: createdId } },
      body: { ...updateBody, trainerUserId: session.userId },
    });

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/support/training/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBody,
      trainerUser: {
        id: session.userId,
        displayName: session.userDisplayName,
      },
    });
  });

  it("Get All", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const payload = {
      title: "Test Training",
      category: "COMPETENCE",
      date: UtilDate.getNowUtcIsoDate(),
    } as const;
    const resCreate = await client.POST("/u/support/training/item", {
      body: { ...payload, trainerUserId: session.userId },
    });

    const res = await client.GET("/u/support/training/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: resCreate.data!.id,
          ...payload,
          trainerUser: {
            id: session.userId,
            displayName: session.userDisplayName,
          },
        },
      ],
    });
  });

  it("Get By Id", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const payload = {
      title: "Test Training",
      category: "COMPETENCE",
      date: UtilDate.getNowUtcIsoDate(),
    } as const;
    const resCreate = await client.POST("/u/support/training/item", {
      body: {
        ...payload,
        trainerUserId: session.userId,
      },
    });

    expect(resCreate).toBeApiOk();
    const createdId = resCreate.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET("/u/support/training/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...payload,
      trainerUser: {
        id: session.userId,
        displayName: session.userDisplayName,
      },
    });
  });

  it("Delete", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/support/training/item", {
      body: {
        title: "Test Training",
        trainerUserId: session.userId,
        category: "COMPETENCE",
        date: UtilDate.getNowUtcIsoDate(),
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE("/u/support/training/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET("/u/support/training/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
