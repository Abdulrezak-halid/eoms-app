import { EApiFailCode, UtilDate } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - SwotAnalysis", () => {
  it("POST /Swot Analysis should be ok", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/planning/risk-swot-analysis/item", {
      body: {
        type: "Test Swot",
        description: "Swot Analysis",
        solutions: "Solution",
        responsibleUserId: session.userId,
        analysisCreatedAt: UtilDate.getNowUtcIsoDate(),
        estimatedCompletionDate: UtilDate.getNowUtcIsoDate(),
        completedAt: UtilDate.getNowUtcIsoDate(),
        isActionRequired: true,
      },
    });
    expect(res).toBeApiOk();
  });

  it("GET /Swot Analysis list should be ok", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const payload = {
      type: "Test Swot2",
      description: "Swot Analysis2",
      solutions: "Solution2",
      analysisCreatedAt: UtilDate.getNowUtcIsoDate(),
      estimatedCompletionDate: UtilDate.getNowUtcIsoDate(),
      completedAt: UtilDate.getNowUtcIsoDate(),
      isActionRequired: true,
    };
    const createResponse = await client.POST(
      "/u/planning/risk-swot-analysis/item",
      {
        body: { ...payload, responsibleUserId: session.userId },
      },
    );
    const createdId = createResponse.data!.id;
    const res = await client.GET("/u/planning/risk-swot-analysis/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload,
          responsibleUser: {
            id: session.userId,
            displayName: session.userDisplayName,
          },
        },
      ],
    });
  });

  it("GET /Swot Analysis return correct details", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const payload = {
      type: "Test Swot3",
      description: "Swot Analysis3",
      solutions: "Solution3",
      analysisCreatedAt: UtilDate.getNowUtcIsoDate(),
      estimatedCompletionDate: UtilDate.getNowUtcIsoDate(),
      completedAt: UtilDate.getNowUtcIsoDate(),
      isActionRequired: true,
    };

    const createResponse = await client.POST(
      "/u/planning/risk-swot-analysis/item",
      {
        body: { ...payload, responsibleUserId: session.userId },
      },
    );

    expect(createResponse).toBeApiOk();
    const createdId = createResponse.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET(
      "/u/planning/risk-swot-analysis/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...payload,
      responsibleUser: {
        id: session.userId,
        displayName: session.userDisplayName,
      },
    });
  });

  it("PUT/ Swot Analysis should update", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/planning/risk-swot-analysis/item", {
      body: {
        type: "Test Swot3",
        description: "Swot Analysis3",
        solutions: "Solution3",
        responsibleUserId: session.userId,
        analysisCreatedAt: UtilDate.getNowUtcIsoDate(),
        estimatedCompletionDate: UtilDate.getNowUtcIsoDate(),
        completedAt: UtilDate.getNowUtcIsoDate(),
        isActionRequired: true,
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBodyPart = {
      type: "Test Swot3",
      description: "Swot Analysis3",
      solutions: "Solution3",
      analysisCreatedAt: UtilDate.getNowUtcIsoDate(),
      estimatedCompletionDate: UtilDate.getNowUtcIsoDate(),
      completedAt: UtilDate.getNowUtcIsoDate(),
      isActionRequired: true,
    };

    const updateRes = await client.PUT(
      "/u/planning/risk-swot-analysis/item/{id}",
      {
        params: { path: { id: createdId } },
        body: { ...updateBodyPart, responsibleUserId: session.userId },
      },
    );

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/planning/risk-swot-analysis/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBodyPart,
      responsibleUser: {
        id: session.userId,
        displayName: session.userDisplayName,
      },
    });
  });
  it("DELETE /Swot Analysis should delete", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/planning/risk-swot-analysis/item", {
      body: {
        type: "Test Swot3",
        description: "Swot Analysis3",
        solutions: "Solution3",
        responsibleUserId: session.userId,
        analysisCreatedAt: UtilDate.getNowUtcIsoDate(),
        estimatedCompletionDate: UtilDate.getNowUtcIsoDate(),
        completedAt: UtilDate.getNowUtcIsoDate(),
        isActionRequired: true,
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE(
      "/u/planning/risk-swot-analysis/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/planning/risk-swot-analysis/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
