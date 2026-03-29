import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - router-planning-risk-gap-analysis", () => {
  it("POST /u/router-planning-risk-gap-analysis should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/planning/risk-gap-analysis/item", {
      body: {
        question: "hello",
        headings: "Gap1",
        score: 3,
        evidence: "gap2",
        consideration: "gap3",
        isActionRequired: true,
      },
    });
    expect(res).toBeApiOk();
  });

  it("GET /router-planning-risk-gap-analysis list should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const payload = {
      question: "hello",
      headings: "Gap1",
      score: 3,
      evidence: "gap2",
      consideration: "gap3",
      isActionRequired: true,
    };
    const createResponse = await client.POST(
      "/u/planning/risk-gap-analysis/item",
      {
        body: payload,
      },
    );
    const createdId = createResponse.data!.id;
    const res = await client.GET("/u/planning/risk-gap-analysis/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload,
        },
      ],
    });
  });

  it("GET /router-planning-risk-gap-analysis should return the correct driver details", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/planning/risk-gap-analysis/item", {
      body: {
        question: "hello",
        headings: "Gap1",
        score: 3,
        evidence: "gap2",
        consideration: "gap3",
        isActionRequired: true,
      },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET("/u/planning/risk-gap-analysis/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes).toBeApiOk();
    expect(getRes.data).toStrictEqual({
      id: createdId,
      question: "hello",
      headings: "Gap1",
      score: 3,
      evidence: "gap2",
      consideration: "gap3",
      isActionRequired: true,
    });
  });

  it("GET /router-planning-risk-gap-analysis should response error when record is not found", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const invalidId = "00000000-0000-0000-0000-000000000000";
    const errorRes = await client.GET(
      "/u/planning/risk-gap-analysis/item/{id}",
      {
        params: { path: { id: invalidId } },
      },
    );
    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("PUT /router-planning-risk-gap-analysis should update", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/planning/risk-gap-analysis/item", {
      body: {
        question: "hello",
        headings: "Gap1",
        score: 3,
        evidence: "gap2",
        consideration: "gap3",
        isActionRequired: true,
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBody = {
      question: "hello1",
      headings: "Gap2",
      score: 4,
      evidence: "gap3",
      consideration: "gap4",
      isActionRequired: true,
    };

    const updateRes = await client.PUT(
      "/u/planning/risk-gap-analysis/item/{id}",
      {
        params: { path: { id: createdId } },
        body: updateBody,
      },
    );

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/planning/risk-gap-analysis/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBody,
    });
  });

  it("DELETE /router-planning-risk-gap-analysis should delete ", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/planning/risk-gap-analysis/item", {
      body: {
        question: "hello1",
        headings: "Gap2",
        score: 4,
        evidence: "gap3",
        consideration: "gap4",
        isActionRequired: true,
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE(
      "/u/planning/risk-gap-analysis/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(deleteRes).toBeApiOk();
  });
});
