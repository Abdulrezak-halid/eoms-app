import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterDesign", () => {
  it("POST/ should be ok!", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/planning/design/item", {
      body: {
        name: "testname",
        no: 2,
        purpose: "purpose",
        impact: "impact",
        estimatedSavings: 2,
        estimatedAdditionalCost: 3,
        estimatedTurnaroundMonths: 4,
        leaderUserId: session.userId,
        potentialNonEnergyBenefits: "test1",
      },
    });

    expect(res).toBeApiOk();
  });

  it("GET/ should be ok!", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const payload = {
      name: "testname",
      no: 2,
      purpose: "purpose",
      impact: "impact",
      estimatedSavings: 2,
      estimatedAdditionalCost: 3,
      estimatedTurnaroundMonths: 4,
      potentialNonEnergyBenefits: "test1",
    };
    const createResponse = await client.POST("/u/planning/design/item", {
      body: { ...payload, leaderUserId: session.userId },
    });
    const createdId = createResponse.data!.id;
    const res = await client.GET("/u/planning/design/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          ...payload,
          id: createdId,
          leaderUser: {
            id: session.userId,
            displayName: session.userDisplayName,
          },
          ideaCount: 0,
        },
      ],
    });
  });

  it("GET/ should be ok :{id}", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/planning/design/item", {
      body: {
        name: "testname",
        no: 2,
        purpose: "purpose",
        impact: "impact",
        estimatedSavings: 2,
        estimatedAdditionalCost: 3,
        estimatedTurnaroundMonths: 4,
        leaderUserId: session.userId,
        potentialNonEnergyBenefits: "test1",
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET("/u/planning/design/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      name: "testname",
      no: 2,
      purpose: "purpose",
      impact: "impact",
      estimatedSavings: 2,
      estimatedAdditionalCost: 3,
      estimatedTurnaroundMonths: 4,
      leaderUser: {
        id: session.userId,
        displayName: session.userDisplayName,
      },
      potentialNonEnergyBenefits: "test1",
      ideaCount: 0,
    });
  });

  it("PUT/ should be ok!", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/planning/design/item", {
      body: {
        name: "testname",
        no: 2,
        purpose: "purpose",
        impact: "impact",
        estimatedSavings: 2,
        estimatedAdditionalCost: 3,
        estimatedTurnaroundMonths: 4,
        leaderUserId: session.userId,
        potentialNonEnergyBenefits: "test1",
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBodyPart = {
      name: "testname2",
      no: 2,
      purpose: "purpose2",
      impact: "impact2",
      estimatedSavings: 2,
      estimatedAdditionalCost: 3,
      estimatedTurnaroundMonths: 4,
      potentialNonEnergyBenefits: "test2",
    };
    const updateRes = await client.PUT("/u/planning/design/item/{id}", {
      params: { path: { id: createdId } },
      body: { ...updateBodyPart, leaderUserId: session.userId },
    });
    expect(updateRes).toBeApiOk();
  });

  it("DELETE/: should be ok!", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/planning/design/item", {
      body: {
        name: "testname",
        no: 2,
        purpose: "purpose",
        impact: "impact",
        estimatedSavings: 2,
        estimatedAdditionalCost: 3,
        estimatedTurnaroundMonths: 4,
        leaderUserId: session.userId,
        potentialNonEnergyBenefits: "test1",
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE("/u/planning/design/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET("/u/planning/design/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("GET/ should be error when record is not found", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const invalidId = "00000000-0000-0000-0000-000000000000";
    const errorRes = await client.GET("/u/planning/design/item/{id}", {
      params: { path: { id: invalidId } },
    });
    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
