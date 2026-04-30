import { EApiFailCode, UtilDate } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - ComplianceObligation", () => {
  it("POST /should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/commitment/compliance-obligation/item", {
      body: {
        complianceObligation: "test department 1",
        officialNewspaperNo: "test department desc",
        officialNewspaperPublicationDate: UtilDate.getNowUtcIsoDate(),
        reviewPeriod: "MONTHLY",
        reviewDate: UtilDate.getNowUtcIsoDate(),
        revisionNo: "22",
        revisionDate: UtilDate.getNowUtcIsoDate(),
        isLegalActive: true,
      },
    });
    expect(res).toBeApiOk();
  });
  it("GET / its should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const payload = {
      complianceObligation: "test department 1",
      officialNewspaperNo: "test department desc",
      officialNewspaperPublicationDate: UtilDate.getNowUtcIsoDate(),
      reviewPeriod: "QUARTERLY" as const,
      reviewDate: UtilDate.getNowUtcIsoDate(),
      revisionNo: "22",
      revisionDate: UtilDate.getNowUtcIsoDate(),
      isLegalActive: true,
    };
    const createResponse = await client.POST(
      "/u/commitment/compliance-obligation/item",
      {
        body: payload,
      },
    );
    const createdId = createResponse.data!.id;
    const res = await client.GET("/u/commitment/compliance-obligation/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload,
          eomscleCount: 0,
        },
      ],
    });
  });

  it("GET / with eomscles should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const payload = {
      complianceObligation: "test department 1",
      officialNewspaperNo: "test department desc",
      officialNewspaperPublicationDate: UtilDate.getNowUtcIsoDate(),
      reviewPeriod: "QUARTERLY" as const,
      reviewDate: UtilDate.getNowUtcIsoDate(),
      revisionNo: "22",
      revisionDate: UtilDate.getNowUtcIsoDate(),
      isLegalActive: true,
    };
    const createResponse = await client.POST(
      "/u/commitment/compliance-obligation/item",
      {
        body: payload,
      },
    );
    expect(createResponse).toBeApiOk();
    const createdId = createResponse.data!.id;

    const reseomscle = await client.POST(
      "/u/commitment/compliance-obligation/item/{subjectId}/eomscle",
      {
        params: {
          path: {
            subjectId: createdId,
          },
        },
        body: {
          relatedeomscleNo: "001",
          description: "eomscle description 1",
          currentApplication: "Application 1",
          conformityAssessment: "Assessment 1",
          conformityAssessmentPeriod: "YEARLY",
          lastConformityAssessment: UtilDate.getNowUtcIsoDate(),
        },
      },
    );
    expect(reseomscle).toBeApiOk();

    const res = await client.GET("/u/commitment/compliance-obligation/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload,
          eomscleCount: 1,
        },
      ],
    });
  });

  it("GET /should return the correct details", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const payload = {
      complianceObligation: "test department 1",
      officialNewspaperNo: "test department desc",
      officialNewspaperPublicationDate: UtilDate.getNowUtcIsoDate(),
      reviewPeriod: "WEEKLY" as const,
      reviewDate: UtilDate.getNowUtcIsoDate(),
      revisionNo: "22",
      revisionDate: UtilDate.getNowUtcIsoDate(),
      isLegalActive: true,
    };

    const createRes = await client.POST(
      "/u/commitment/compliance-obligation/item",
      {
        body: payload,
      },
    );
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET(
      "/u/commitment/compliance-obligation/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...payload,
      eomscleCount: 0,
    });
  });

  it("PUT /it should update", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/commitment/compliance-obligation/item", {
      body: {
        complianceObligation: "test department 1",
        officialNewspaperNo: "test department desc",
        officialNewspaperPublicationDate: UtilDate.getNowUtcIsoDate(),
        reviewPeriod: "QUARTERLY" as const,
        reviewDate: UtilDate.getNowUtcIsoDate(),
        revisionNo: "22",
        revisionDate: UtilDate.getNowUtcIsoDate(),
        isLegalActive: true,
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBody = {
      complianceObligation: "test department 1",
      officialNewspaperNo: "test department desc",
      officialNewspaperPublicationDate: UtilDate.getNowUtcIsoDate(),
      reviewPeriod: "QUARTERLY" as const,
      reviewDate: UtilDate.getNowUtcIsoDate(),
      revisionNo: "22",
      revisionDate: UtilDate.getNowUtcIsoDate(),
      isLegalActive: true,
    };

    const updateRes = await client.PUT(
      "/u/commitment/compliance-obligation/item/{id}",
      {
        params: { path: { id: createdId } },
        body: updateBody,
      },
    );

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/commitment/compliance-obligation/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBody,
      eomscleCount: 0,
    });
  });
  it("DELETE /it should delete ", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/commitment/compliance-obligation/item", {
      body: {
        complianceObligation: "test department 1",
        officialNewspaperNo: "test department desc",
        officialNewspaperPublicationDate: UtilDate.getNowUtcIsoDate(),
        reviewPeriod: "QUARTERLY",
        reviewDate: UtilDate.getNowUtcIsoDate(),
        revisionNo: "22",
        revisionDate: UtilDate.getNowUtcIsoDate(),
        isLegalActive: true,
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE(
      "/u/commitment/compliance-obligation/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(deleteRes).toBeApiOk();
  });
  it("GET / should response error when record is not found", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const invalidId = "00000000-0000-0000-0000-000000000000";
    const errorRes = await client.GET(
      "/u/commitment/compliance-obligation/item/{id}",
      {
        params: { path: { id: invalidId } },
      },
    );
    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
