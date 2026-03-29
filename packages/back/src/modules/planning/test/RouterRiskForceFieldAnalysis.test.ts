import { EApiFailCode, UtilDate } from "common";
import { EXAMPLE_USER_NAME } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterPlanningRiskForceFieldAnalysis", () => {
  it("POST /u/planning/risk-force-field-analysis should be ok", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST(
      "/u/planning/risk-force-field-analysis/item",
      {
        body: {
          parameter: "Test Planning/RiskForceFieldAnalysis -> Parameter",
          score: 1,
          solutions: "Test Planning/RiskForceFieldAnalysis -> Solutions",
          responsibleUserId: session.userId,
          completedAt: UtilDate.getNowUtcIsoDate(),
          estimatedCompletionDate: UtilDate.getNowUtcIsoDate(),
          isSucceed: true,
          isFollowUpRequired: true,
          isActionRequired: true,
        },
      },
    );
    expect(res).toBeApiOk();
  });

  it("PUT /u/planning/risk-force-field-analysis/:id should update the action plan", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST(
      "/u/planning/risk-force-field-analysis/item",
      {
        body: {
          parameter: "Test Planning/RiskForceFieldAnalysis -> Parameter",
          score: 1,
          solutions: "Test Planning/RiskForceFieldAnalysis -> Solutions",
          responsibleUserId: session.userId,
          completedAt: UtilDate.getNowUtcIsoDate(),
          estimatedCompletionDate: UtilDate.getNowUtcIsoDate(),
          isSucceed: true,
          isFollowUpRequired: true,
          isActionRequired: true,
        },
      },
    );

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBody = {
      parameter: "Test Planning/RiskForceFieldAnalysis -> Parameter",
      score: 1,
      solutions: "Test Planning/RiskForceFieldAnalysis -> Solutions",
      completedAt: UtilDate.getNowUtcIsoDate(),
      estimatedCompletionDate: UtilDate.getNowUtcIsoDate(),
      isSucceed: true,
      isFollowUpRequired: true,
      isActionRequired: true,
    };

    const updateRes = await client.PUT(
      "/u/planning/risk-force-field-analysis/item/{id}",
      {
        params: { path: { id: createdId } },
        body: { ...updateBody, responsibleUserId: session.userId },
      },
    );

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/planning/risk-force-field-analysis/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBody,
      responsibleUser: {
        id: session.userId,
        displayName: session.userDisplayName,
      },
    });
  });

  it("GET /u/planning/risk-force-field-analysis", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const payload = {
      parameter: "Test Planning/RiskForceFieldAnalysis -> Parameter",
      score: 1,
      solutions: "Test Planning/RiskForceFieldAnalysis -> Solutions",
      responsibleUser: {
        displayName: EXAMPLE_USER_NAME,
        id: session.userId,
      },
      completedAt: UtilDate.getNowUtcIsoDate(),
      estimatedCompletionDate: UtilDate.getNowUtcIsoDate(),
      isSucceed: true,
      isFollowUpRequired: true,
      isActionRequired: true,
    };
    const createResponse = await client.POST(
      "/u/planning/risk-force-field-analysis/item",
      {
        body: { ...payload, responsibleUserId: session.userId },
      },
    );
    const createdId = createResponse.data!.id;
    const res = await client.GET("/u/planning/risk-force-field-analysis/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          ...payload,
          id: createdId,
        },
      ],
    });
  });

  it("GET /u/planning/risk-force-field-analysis/:id should get the action plan", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const payload = {
      parameter: "Test Planning/RiskForceFieldAnalysis -> Parameter",
      score: 1,
      solutions: "Test Planning/RiskForceFieldAnalysis -> Solutions",
      completedAt: UtilDate.getNowUtcIsoDate(),
      estimatedCompletionDate: UtilDate.getNowUtcIsoDate(),
      isSucceed: true,
      isFollowUpRequired: true,
      isActionRequired: true,
    };
    const createResponse = await client.POST(
      "/u/planning/risk-force-field-analysis/item",
      {
        body: { ...payload, responsibleUserId: session.userId },
      },
    );

    expect(createResponse).toBeApiOk();
    const createdId = createResponse.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET(
      "/u/planning/risk-force-field-analysis/item/{id}",
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

  it("DELETE /u/planning/risk-force-field-analysis/:id should delete the action plan", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST(
      "/u/planning/risk-force-field-analysis/item",
      {
        body: {
          parameter: "Test Planning/RiskForceFieldAnalysis -> Parameter",
          score: 1,
          solutions: "Test Planning/RiskForceFieldAnalysis -> Solutions",
          responsibleUserId: session.userId,
          completedAt: UtilDate.getNowUtcIsoDate(),
          estimatedCompletionDate: UtilDate.getNowUtcIsoDate(),
          isSucceed: true,
          isFollowUpRequired: true,
          isActionRequired: true,
        },
      },
    );

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE(
      "/u/planning/risk-force-field-analysis/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/planning/risk-force-field-analysis/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
