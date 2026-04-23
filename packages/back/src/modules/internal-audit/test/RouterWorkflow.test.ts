import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperNonconformity } from "./TestHelperNonconformity";

describe("E2E - RouterWorkflow", () => {
  it("POST / create should be ok!", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const non1Id = await TestHelperNonconformity.createTestNonconformity(
      client,
      "non1",
    );

    const res = await client.POST("/u/internal-audit/workflow/item", {
      body: {
        part: "tespart",
        highLevelSubject: "highlevelsubject",
        subject: "subject",
        reviewerUserId: session.userId,
        questions: "questions",
        necessaries: "necessaries",
        necessaryProof: "necessaryproof",
        obtainedProof: "obtainedproof",
        correctiveActionDecisions: "decision",
        comments: "comments",
        nonconformityIds: [non1Id],
      },
    });
    expect(res).toBeApiOk();
  });
  it("GET / list should be ok!", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const non1Id = await TestHelperNonconformity.createTestNonconformity(
      client,
      "non1",
    );
    const payload = {
      part: "tespart",
      highLevelSubject: "highlevelsubject",
      subject: "subject",
      questions: "questions",
      necessaries: "necessaries",
      necessaryProof: "necessaryproof",
      obtainedProof: "obtainedproof",
      correctiveActionDecisions: "decision",
      comments: "comments",
    };
    const createResponse = await client.POST(
      "/u/internal-audit/workflow/item",
      {
        body: {
          ...payload,
          reviewerUserId: session.userId,
          nonconformityIds: [non1Id],
        },
      },
    );
    const createdId = createResponse.data!.id;

    const res = await client.GET("/u/internal-audit/workflow/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload,
          reviewerUser: {
            id: session.userId,
            displayName: session.userDisplayName,
          },
          nonconformities: [{ id: non1Id, displayName: "non1" }],
        },
      ],
    });
  });
  it("GET / get should be ok with id!", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const non1Id = await TestHelperNonconformity.createTestNonconformity(
      client,
      "non1",
    );

    const payload = {
      part: "tespart",
      highLevelSubject: "highlevelsubject",
      subject: "subject",
      questions: "questions",
      necessaries: "necessaries",
      necessaryProof: "necessaryproof",
      obtainedProof: "obtainedproof",
      correctiveActionDecisions: "decision",
      comments: "comments",
    };
    const createResponse = await client.POST(
      "/u/internal-audit/workflow/item",
      {
        body: {
          ...payload,
          reviewerUserId: session.userId,
          nonconformityIds: [non1Id],
        },
      },
    );

    expect(createResponse).toBeApiOk();
    const createdId = createResponse.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET("/u/internal-audit/workflow/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...payload,
      reviewerUser: {
        id: session.userId,
        displayName: session.userDisplayName,
      },
      nonconformities: [
        {
          id: non1Id,
          displayName: "non1",
        },
      ],
    });
  });
  it("PUT / put should be ok!", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const non1Id = await TestHelperNonconformity.createTestNonconformity(
      client,
      "non1",
    );
    const non2Id = await TestHelperNonconformity.createTestNonconformity(
      client,
      "non2",
    );
    const res = await client.POST("/u/internal-audit/workflow/item", {
      body: {
        part: "tespart",
        highLevelSubject: "highlevelsubject",
        subject: "subject",
        reviewerUserId: session.userId,
        questions: "questions",
        necessaries: "necessaries",
        necessaryProof: "necessaryproof",
        obtainedProof: "obtainedproof",
        correctiveActionDecisions: "decision",
        comments: "comments",
        nonconformityIds: [non1Id],
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBodyPart = {
      part: "tespart2",
      highLevelSubject: "highlevelsubject2",
      subject: "subject2",
      questions: "questions2",
      necessaries: "necessaries2",
      necessaryProof: "necessaryproof2",
      obtainedProof: "obtainedproof2",
      correctiveActionDecisions: "decision2",
      comments: "comments2",
    };
    const updateRes = await client.PUT("/u/internal-audit/workflow/item/{id}", {
      params: { path: { id: createdId } },
      body: {
        ...updateBodyPart,
        reviewerUserId: session.userId,
        nonconformityIds: [non2Id],
      },
    });
    expect(updateRes).toBeApiOk();
  });
  it("E2E - delete should be ok!", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const non1Id = await TestHelperNonconformity.createTestNonconformity(
      client,
      "non1",
    );
    const res = await client.POST("/u/internal-audit/workflow/item", {
      body: {
        part: "tespart",
        highLevelSubject: "highlevelsubject",
        subject: "subject",
        reviewerUserId: session.userId,
        questions: "questions",
        necessaries: "necessaries",
        necessaryProof: "necessaryproof",
        obtainedProof: "obtainedproof",
        correctiveActionDecisions: "decision",
        comments: "comments",
        nonconformityIds: [non1Id],
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE(
      "/u/internal-audit/workflow/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(deleteRes).toBeApiOk();

    const getRes = await client.DELETE("/u/internal-audit/workflow/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
  it("GET/ should be error when record is not found!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const invalidId = "00000000-0000-0000-0000-000000000000";
    const errorRes = await client.GET("/u/internal-audit/workflow/item/{id}", {
      params: { path: { id: invalidId } },
    });
    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("PUT - should be error when record is update!", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const non1Id = await TestHelperNonconformity.createTestNonconformity(
      client,
      "non1",
    );
    const invalidId = "00000000-0000-0000-0000-000000000000";
    const errorRes = await client.PUT("/u/internal-audit/workflow/item/{id}", {
      params: { path: { id: invalidId } },
      body: {
        part: "tespart",
        highLevelSubject: "highlevelsubject",
        subject: "subject",
        reviewerUserId: session.userId,
        questions: "questions",
        necessaries: "necessaries",
        necessaryProof: "necessaryproof",
        obtainedProof: "obtainedproof",
        correctiveActionDecisions: "decision",
        comments: "comments",
        nonconformityIds: [non1Id],
      },
    });
    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
