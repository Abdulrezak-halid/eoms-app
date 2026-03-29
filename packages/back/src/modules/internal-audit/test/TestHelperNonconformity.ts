import { UtilDate } from "common";
import { expect } from "vitest";

import { ITestClient } from "@/test/utils/UtilTest";

import { TestHelperUser } from "@m/base/test/TestHelperUser";

export namespace TestHelperNonconformity {
  import createTestUser = TestHelperUser.createTestUser;

  export async function createTestNonconformity(
    client: ITestClient,
    name: string,
  ) {
    const resUser = await createTestUser(client, name);
    const resUser2 = await createTestUser(client, name + "2");
    const non1 = await client.POST("/u/internal-audit/nonconformity/item", {
      body: {
        definition: name,
        no: 123,
        identifiedAt: UtilDate.getNowUtcIsoDate(),
        requirement: "Test Requirement",
        source: "Test Source",
        potentialResult: "Test Potential Result",
        rootCause: "Test Root Cause",
        action: "Test Action",
        targetIdentificationDate: UtilDate.getNowUtcIsoDate(),
        actualIdentificationDate: UtilDate.getNowUtcIsoDate(),
        isCorrectiveActionOpen: true,
        responsibleUserId: resUser.data!.id,
        reviewerUserId: resUser2.data!.id,
        reviewerFeedback: "Test Reviewer Feedback",
      },
    });
    expect(non1).toBeApiOk();
    return non1.data!.id;
  }
}
