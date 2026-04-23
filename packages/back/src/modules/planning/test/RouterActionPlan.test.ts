//import { EApiFailCode } from "common";
import { EApiFailCode, UtilDate } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterActionPlan", () => {
  it("POST /u/planning/action-plan should be ok", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/planning/action-plan/item", {
      body: {
        name: "Test Action Plan",
        reasonsForStatus: "Test Reasons for Status",
        actualSavingsVerifications: "Test Actual Savings Verifications",
        actualSavings: "Test Actual Savings",
        startDate: UtilDate.getNowUtcIsoDate(),
        targetIdentificationDate: UtilDate.getNowUtcIsoDate(),
        actualIdentificationDate: UtilDate.getNowUtcIsoDate(),
        responsibleUserId: session.userId,
        approvementStatus: "APPROVED",
      },
    });
    expect(res).toBeApiOk();
  });

  it("PUT /u/planning/action-plan/:id should update the action plan", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/planning/action-plan/item", {
      body: {
        name: "Test Action Plan",
        reasonsForStatus: "Test Reasons for Status",
        actualSavingsVerifications: "Test Actual Savings Verifications",
        actualSavings: "Test Actual Savings",
        startDate: UtilDate.getNowUtcIsoDate(),
        targetIdentificationDate: UtilDate.getNowUtcIsoDate(),
        actualIdentificationDate: UtilDate.getNowUtcIsoDate(),
        responsibleUserId: session.userId,
        approvementStatus: "APPROVED",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBodyPart = {
      name: "Test Action Plan update",
      reasonsForStatus: "Test Reasons for Status update",
      actualSavingsVerifications: "Test Actual Savings Verifications update",
      actualSavings: "Test Actual Savings update",
      startDate: UtilDate.getNowUtcIsoDate(),
      targetIdentificationDate: UtilDate.getNowUtcIsoDate(),
      actualIdentificationDate: UtilDate.getNowUtcIsoDate(),
      approvementStatus: "REJECTED",
    } as const;

    const updateRes = await client.PUT("/u/planning/action-plan/item/{id}", {
      params: { path: { id: createdId } },
      body: { ...updateBodyPart, responsibleUserId: session.userId },
    });

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/planning/action-plan/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBodyPart,
      responsibleUser: {
        id: session.userId,
        displayName: session.userDisplayName,
      },
    });
  });

  it("GET /u/planning/action-plan", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const payload = {
      name: "Test Action Plan",
      reasonsForStatus: "Test Reasons for Status",
      actualSavingsVerifications: "Test Actual Savings Verifications",
      actualSavings: "Test Actual Savings",
      startDate: UtilDate.getNowUtcIsoDate(),
      targetIdentificationDate: UtilDate.getNowUtcIsoDate(),
      actualIdentificationDate: UtilDate.getNowUtcIsoDate(),
      approvementStatus: "APPROVED",
    } as const;
    const createResponse = await client.POST("/u/planning/action-plan/item", {
      body: { ...payload, responsibleUserId: session.userId },
    });
    const createdId = createResponse.data!.id;
    const res = await client.GET("/u/planning/action-plan/item");
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

  it("GET /u/planning/action-plan/:id should get the action plan", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const payload = {
      name: "Test Action Plan",
      reasonsForStatus: "Test Reasons for Status",
      actualSavingsVerifications: "Test Actual Savings Verifications",
      actualSavings: "Test Actual Savings",
      startDate: UtilDate.getNowUtcIsoDate(),
      targetIdentificationDate: UtilDate.getNowUtcIsoDate(),
      actualIdentificationDate: UtilDate.getNowUtcIsoDate(),
      approvementStatus: "APPROVED",
    } as const;

    const res = await client.POST("/u/planning/action-plan/item", {
      body: { ...payload, responsibleUserId: session.userId },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET("/u/planning/action-plan/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...payload,
      responsibleUser: {
        id: session.userId,
        displayName: session.userDisplayName,
      },
    });
  });

  it("DELETE /u/planning/action-plan/:id should delete the action plan", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/planning/action-plan/item", {
      body: {
        name: "Test Action Plan",
        reasonsForStatus: "Test Reasons for Status",
        actualSavingsVerifications: "Test Actual Savings Verifications",
        actualSavings: "Test Actual Savings",
        startDate: UtilDate.getNowUtcIsoDate(),
        targetIdentificationDate: UtilDate.getNowUtcIsoDate(),
        actualIdentificationDate: UtilDate.getNowUtcIsoDate(),
        responsibleUserId: session.userId,
        approvementStatus: "APPROVED",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE("/u/planning/action-plan/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET("/u/planning/action-plan/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
