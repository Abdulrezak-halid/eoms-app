import { EApiFailCode, UtilDate } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - ComplianceObligationeomscle", () => {
  it("Create compliance obligation eomscle", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const compliance = await client.POST(
      "/u/commitment/compliance-obligation/item",
      {
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
      },
    );
    const res = await client.POST(
      "/u/commitment/compliance-obligation/item/{subjectId}/eomscle",
      {
        params: {
          path: {
            subjectId: compliance.data!.id,
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

    expect(res).toBeApiOk();
  });

  it("Get all compliance obligation eomscles", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const compliance = await client.POST(
      "/u/commitment/compliance-obligation/item",
      {
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
      },
    );

    const payload = {
      relatedeomscleNo: "001",
      description: "eomscle description 1",
      currentApplication: "Application 1",
      conformityAssessment: "Assessment 1",
      conformityAssessmentPeriod: "YEARLY" as const,
      lastConformityAssessment: UtilDate.getNowUtcIsoDate(),
    };
    const eomscle = await client.POST(
      "/u/commitment/compliance-obligation/item/{subjectId}/eomscle",
      {
        params: {
          path: {
            subjectId: compliance.data!.id,
          },
        },
        body: payload,
      },
    );

    const res = await client.GET(
      "/u/commitment/compliance-obligation/item/{subjectId}/eomscle",
      {
        params: {
          path: {
            subjectId: compliance.data!.id,
          },
        },
      },
    );

    expect(res.data).toStrictEqual({
      records: [
        {
          ...payload,
          id: eomscle.data!.id,
        },
      ],
    });
  });

  it("Get compliance obligation eomscle", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const compliance = await client.POST(
      "/u/commitment/compliance-obligation/item",
      {
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
      },
    );

    const payload = {
      relatedeomscleNo: "001",
      description: "eomscle description 1",
      currentApplication: "Application 1",
      conformityAssessment: "Assessment 1",
      conformityAssessmentPeriod: "YEARLY" as const,
      lastConformityAssessment: UtilDate.getNowUtcIsoDate(),
    };
    const eomscle = await client.POST(
      "/u/commitment/compliance-obligation/item/{subjectId}/eomscle",
      {
        params: {
          path: {
            subjectId: compliance.data!.id,
          },
        },
        body: payload,
      },
    );

    const res = await client.GET(
      "/u/commitment/compliance-obligation/item/{subjectId}/eomscle/{id}",
      {
        params: {
          path: {
            id: eomscle.data!.id,
            subjectId: compliance.data!.id,
          },
        },
      },
    );

    expect(res.data).toStrictEqual({
      ...payload,
      id: eomscle.data!.id,
    });
  });

  it("Update compliance obligation eomscle", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const compliance = await client.POST(
      "/u/commitment/compliance-obligation/item",
      {
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
      },
    );

    const payload = {
      relatedeomscleNo: "001",
      description: "eomscle description 1",
      currentApplication: "Application 1",
      conformityAssessment: "Assessment 1",
      conformityAssessmentPeriod: "YEARLY" as const,
      lastConformityAssessment: UtilDate.getNowUtcIsoDate(),
    };

    const eomscle = await client.POST(
      "/u/commitment/compliance-obligation/item/{subjectId}/eomscle",
      {
        params: {
          path: {
            subjectId: compliance.data!.id,
          },
        },
        body: payload,
      },
    );

    const updatePayload = {
      relatedeomscleNo: "002",
      description: "eomscle description 2",
      currentApplication: "Application 2",
      conformityAssessment: "Assessment 2",
      lastConformityAssessment: UtilDate.getNowUtcIsoDate(),
    };

    await client.PUT(
      "/u/commitment/compliance-obligation/item/{subjectId}/eomscle/{id}",
      {
        params: {
          path: {
            id: eomscle.data!.id,
            subjectId: compliance.data!.id,
          },
        },
        body: {
          conformityAssessmentPeriod: "MONTHLY",
          ...updatePayload,
        },
      },
    );
    const res = await client.GET(
      "/u/commitment/compliance-obligation/item/{subjectId}/eomscle/{id}",
      {
        params: {
          path: {
            id: eomscle.data!.id,
            subjectId: compliance.data!.id,
          },
        },
      },
    );
    expect(res.data).toStrictEqual({
      ...updatePayload,
      conformityAssessmentPeriod: "MONTHLY",
      id: eomscle.data!.id,
    });
  });

  it("Delete compliance obligation eomscle", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const compliance = await client.POST(
      "/u/commitment/compliance-obligation/item",
      {
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
      },
    );

    const eomscle = await client.POST(
      "/u/commitment/compliance-obligation/item/{subjectId}/eomscle",
      {
        params: {
          path: {
            subjectId: compliance.data!.id,
          },
        },
        body: {
          conformityAssessmentPeriod: "YEARLY",
          relatedeomscleNo: "001",
          description: "eomscle description 1",
          currentApplication: "Application 1",
          conformityAssessment: "Assessment 1",
          lastConformityAssessment: UtilDate.getNowUtcIsoDate(),
        },
      },
    );

    await client.DELETE(
      "/u/commitment/compliance-obligation/item/{subjectId}/eomscle/{id}",
      {
        params: {
          path: {
            id: eomscle.data!.id,
            subjectId: compliance.data!.id,
          },
        },
      },
    );
    const res = await client.GET(
      "/u/commitment/compliance-obligation/item/{subjectId}/eomscle/{id}",
      {
        params: {
          path: {
            id: eomscle.data!.id,
            subjectId: compliance.data!.id,
          },
        },
      },
    );
    expect(res).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("Response error when record is not found", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const invalidId = "00000000-0000-0000-0000-000000000000";
    const errorRes = await client.GET(
      "/u/commitment/compliance-obligation/item/{subjectId}/eomscle/{id}",
      {
        params: { path: { id: invalidId, subjectId: invalidId } },
      },
    );
    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
