import { EApiFailCode, UtilDate } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperUser } from "@m/base/test/TestHelperUser";

import createTestUser = TestHelperUser.createTestUser;

describe("E2E-RouterCommunicationAwarenessPlan", () => {
  it("POST/ E2E Communication Awareness Plan should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const user1 = await createTestUser(client, "name");
    expect(user1).toBeApiOk();
    const user1Id = user1.data!.id;

    const user2 = await createTestUser(client, "name2");
    expect(user2).toBeApiOk();
    const user2Id = user2.data!.id;

    const res = await client.POST(
      "/u/support/communication-awareness-plan/item",
      {
        body: {
          action: "action",
          type: "EXTERNAL",
          information: "information",
          releasedAt: UtilDate.getNowUtcIsoDate(),
          releaseLocations: ["headquartersBuilding", "generalOffice"],
          feedback: "feedback",
          targetUserIds: [user1Id, user2Id],
        },
      },
    );
    expect(res).toBeApiOk();
  });

  it("GET / E2E Communication Awareness Plan should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const user1 = await createTestUser(client, "name");
    expect(user1).toBeApiOk();
    const user1Id = user1.data!.id;

    const payload = {
      action: "action",
      type: "EXTERNAL" as const,
      information: "information",
      releasedAt: UtilDate.getNowUtcIsoDate(),
      releaseLocations: ["headquartersBuilding", "generalOffice"],
      feedback: "feedback",
    };
    const createResponse = await client.POST(
      "/u/support/communication-awareness-plan/item",
      {
        body: { ...payload, targetUserIds: [user1Id] },
      },
    );
    const createdId = createResponse.data!.id;

    const res = await client.GET(
      "/u/support/communication-awareness-plan/item",
    );

    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload,
          targetUsers: [
            {
              id: user1Id,
              displayName: "name",
            },
          ],
        },
      ],
    });
  });

  it("GET /E2E Communication Awareness Plan should be ok with id", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const user1 = await createTestUser(client, "name");
    const user1Id = user1.data!.id;

    const payload = {
      action: "action",
      type: "EXTERNAL" as const,
      information: "information",
      releasedAt: UtilDate.getNowUtcIsoDate(),
      releaseLocations: ["headquartersBuilding", "generalOffice"],
      feedback: "feedback",
    };
    const createResponse = await client.POST(
      "/u/support/communication-awareness-plan/item",
      {
        body: { ...payload, targetUserIds: [user1Id] },
      },
    );

    expect(createResponse).toBeApiOk();
    const createdId = createResponse.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET(
      "/u/support/communication-awareness-plan/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...payload,
      targetUsers: [
        {
          id: user1Id,
          displayName: "name",
        },
      ],
    });
  });
  it("PUT /E2E Communication Awareness Plan should be ok with id", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const user1 = await createTestUser(client, "name");
    expect(user1).toBeApiOk();
    const user1Id = user1.data!.id;

    const user2 = await createTestUser(client, "name2");
    expect(user2).toBeApiOk();
    const user2Id = user2.data!.id;

    const res = await client.POST(
      "/u/support/communication-awareness-plan/item",
      {
        body: {
          action: "action",
          type: "EXTERNAL",
          information: "information",
          releasedAt: UtilDate.getNowUtcIsoDate(),
          releaseLocations: ["headquartersBuilding", "generalOffice"],
          feedback: "feedback",
          targetUserIds: [user1Id],
        },
      },
    );

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBodyPart = {
      action: "action2",
      type: "EXTERNAL" as const,
      information: "information2",
      releasedAt: UtilDate.getNowUtcIsoDate(),
      releaseLocations: ["headquartersBuilding", "generalOffice"],
      feedback: "feedback",
    };

    const updateRes = await client.PUT(
      "/u/support/communication-awareness-plan/item/{id}",
      {
        params: { path: { id: createdId } },
        body: { ...updateBodyPart, targetUserIds: [user2Id] },
      },
    );

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/support/communication-awareness-plan/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBodyPart,
      targetUsers: [
        {
          id: user2Id,
          displayName: "name2",
        },
      ],
    });
  });

  it("DELETE /Communication Awareness Plan should delete", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const user1 = await createTestUser(client, "name");
    expect(user1).toBeApiOk();
    const user1Id = user1.data!.id;

    const createRes = await client.POST(
      "/u/support/communication-awareness-plan/item",
      {
        body: {
          action: "action",
          type: "EXTERNAL",
          information: "information",
          releasedAt: UtilDate.getNowUtcIsoDate(),
          releaseLocations: ["headquartersBuilding", "generalOffice"],
          feedback: "feedback",
          targetUserIds: [user1Id],
        },
      },
    );

    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const res = await client.DELETE(
      "/u/support/communication-awareness-plan/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(res).toBeApiOk();
  });

  it("DELETE / should throw NOT_FOUND when record is not found", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const user1 = await createTestUser(client, "name");
    expect(user1).toBeApiOk();
    const user1Id = user1.data!.id;

    const createRes = await client.POST(
      "/u/support/communication-awareness-plan/item",
      {
        body: {
          action: "action2",
          type: "EXTERNAL",
          information: "information2",
          releasedAt: UtilDate.getNowUtcIsoDate(),
          releaseLocations: ["headquartersBuilding", "generalOffice"],
          feedback: "feedback2",
          targetUserIds: [user1Id],
        },
      },
    );

    expect(createRes).toBeApiOk();

    const res = await client.DELETE(
      "/u/support/communication-awareness-plan/item/{id}",
      {
        params: { path: { id: "00000000-0000-0000-0000-000000000000" } },
      },
    );
    expect(res).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
