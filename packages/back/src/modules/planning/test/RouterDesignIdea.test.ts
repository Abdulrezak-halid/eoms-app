import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterDesignIdea", () => {
  it("Create", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const design = await client.POST("/u/planning/design/item", {
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
    const res = await client.POST("/u/planning/design/item/{designId}/idea", {
      params: { path: { designId: design.data!.id } },
      body: {
        name: "name",
        no: "no",
        risks: "risks",
        reduction: "reduction",
      },
    });

    expect(res).toBeApiOk();
  });

  it("Get All idea", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const design = await client.POST("/u/planning/design/item", {
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

    const idea = await client.POST("/u/planning/design/item/{designId}/idea", {
      params: { path: { designId: design.data!.id } },
      body: {
        name: "name",
        no: "no",
        risks: "risks",
        reduction: "reduction",
      },
    });

    const createdId = design.data!.id;
    const res = await client.GET("/u/planning/design/item/{designId}/idea", {
      params: { path: { designId: createdId } },
    });
    expect(res.data).toStrictEqual({
      records: [
        {
          id: idea.data!.id,
          name: "name",
          no: "no",
          risks: "risks",
          reduction: "reduction",
        },
      ],
    });
  });

  it("Get by id idea", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const design = await client.POST("/u/planning/design/item", {
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

    const idea = await client.POST("/u/planning/design/item/{designId}/idea", {
      params: { path: { designId: design.data!.id } },
      body: {
        name: "name",
        no: "no",
        risks: "risks",
        reduction: "reduction",
      },
    });

    const createdId = design.data!.id;
    const res = await client.GET(
      "/u/planning/design/item/{designId}/idea/{id}",
      {
        params: { path: { id: idea.data!.id, designId: createdId } },
      },
    );
    expect(res.data).toStrictEqual({
      id: idea.data!.id,
      name: "name",
      no: "no",
      risks: "risks",
      reduction: "reduction",
    });
  });

  it("Update idea", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const design = await client.POST("/u/planning/design/item", {
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

    const idea = await client.POST("/u/planning/design/item/{designId}/idea", {
      params: { path: { designId: design.data!.id } },
      body: {
        name: "name",
        no: "no",
        risks: "risks",
        reduction: "reduction",
      },
    });

    const createdId = design.data!.id;

    await client.PUT("/u/planning/design/item/{designId}/idea/{id}", {
      params: { path: { id: idea.data!.id, designId: createdId } },
      body: {
        name: "updated name",
        no: "updated no",
        risks: "updated risks",
        reduction: "updated reduction",
        ideaId: idea.data!.id,
      },
    });
    const res = await client.GET(
      "/u/planning/design/item/{designId}/idea/{id}",
      {
        params: { path: { id: idea.data!.id, designId: createdId } },
      },
    );
    expect(res.data).toStrictEqual({
      id: idea.data!.id,
      name: "updated name",
      no: "updated no",
      risks: "updated risks",
      reduction: "updated reduction",
    });
  });

  it("Delete idea", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const design = await client.POST("/u/planning/design/item", {
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

    const idea = await client.POST("/u/planning/design/item/{designId}/idea", {
      params: { path: { designId: design.data!.id } },
      body: {
        name: "name",
        no: "no",
        risks: "risks",
        reduction: "reduction",
      },
    });

    const createdId = design.data!.id;

    await client.DELETE("/u/planning/design/item/{designId}/idea/{id}", {
      params: { path: { id: idea.data!.id, designId: createdId } },
    });

    const res = await client.GET(
      "/u/planning/design/item/{designId}/idea/{id}",
      {
        params: { path: { id: idea.data!.id, designId: createdId } },
      },
    );

    expect(res).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("Throw not found for get by id without record", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.GET(
      "/u/planning/design/item/{designId}/idea/{id}",
      {
        params: {
          path: {
            id: "00000000-0000-0000-0000-000000000000",
            designId: "00000000-0000-0000-0000-000000000000",
          },
        },
      },
    );
    expect(res).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
