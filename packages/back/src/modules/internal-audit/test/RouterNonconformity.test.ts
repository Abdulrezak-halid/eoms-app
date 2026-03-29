import { EApiFailCode, UtilDate } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperUser } from "@m/base/test/TestHelperUser";

import createTestUser = TestHelperUser.createTestUser;

describe("E2E- Nonconformity", () => {
  it("POST/ Nonconformity should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const resUser = await createTestUser(client, "name");
    const resUser2 = await createTestUser(client, "name2");

    const res = await client.POST("/u/internal-audit/nonconformity/item", {
      body: {
        definition: "Test Definition",
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
    expect(res).toBeApiOk();
  });

  it("GET/ Nonconformity list should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const resUser = await createTestUser(client, "name");
    const resUser2 = await createTestUser(client, "name2");

    const payload = {
      definition: "Test Definition",
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
      reviewerFeedback: "Test Reviewer Feedback",
    };

    const createResponse = await client.POST(
      "/u/internal-audit/nonconformity/item",
      {
        body: {
          ...payload,
          responsibleUserId: resUser.data!.id,
          reviewerUserId: resUser2.data!.id,
        },
      },
    );

    const createdId = createResponse.data!.id;

    const res = await client.GET("/u/internal-audit/nonconformity/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          ...payload,
          id: createdId,
          responsibleUser: {
            id: resUser.data!.id,
            displayName: "name",
          },
          reviewerUser: {
            id: resUser2.data!.id,
            displayName: "name2",
          },
        },
      ],
    });
  });
  it("GET /names - Nonconformity names should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const resUser = await createTestUser(client, "name");
    const resUser2 = await createTestUser(client, "name2");

    const payload = {
      definition: "Test Definition",
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
      reviewerFeedback: "Test Reviewer Feedback",
    };

    const res = await client.POST("/u/internal-audit/nonconformity/item", {
      body: {
        ...payload,
        responsibleUserId: resUser.data!.id,
        reviewerUserId: resUser2.data!.id,
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const resNames = await client.GET("/u/internal-audit/nonconformity/names");
    expect(resNames).toBeApiOk();
    expect(resNames.data).toStrictEqual({
      records: [
        {
          id: createdId,
          displayName: payload.definition,
        },
      ],
    });
  });

  it("GET/ Nonconformity should be ok with id", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const resUser = await createTestUser(client, "name");
    const resUser2 = await createTestUser(client, "name2");

    const res = await client.POST("/u/internal-audit/nonconformity/item", {
      body: {
        definition: "Test Definition",
        no: 123,
        identifiedAt: "2021-10-11",
        requirement: "Test Requirement",
        source: "Test Source",
        potentialResult: "Test Potential Result",
        rootCause: "Test Root Cause",
        action: "Test Action",
        targetIdentificationDate: "2021-10-11",
        actualIdentificationDate: "2021-10-11",
        isCorrectiveActionOpen: true,
        responsibleUserId: resUser.data!.id,
        reviewerUserId: resUser2.data!.id,
        reviewerFeedback: "Test Reviewer Feedback",
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET(
      "/u/internal-audit/nonconformity/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(getRes.data).toStrictEqual({
      id: createdId,
      definition: "Test Definition",
      no: 123,
      identifiedAt: "2021-10-11",
      requirement: "Test Requirement",
      source: "Test Source",
      potentialResult: "Test Potential Result",
      rootCause: "Test Root Cause",
      action: "Test Action",
      targetIdentificationDate: "2021-10-11",
      actualIdentificationDate: "2021-10-11",
      isCorrectiveActionOpen: true,
      responsibleUser: {
        displayName: "name",
        id: resUser.data!.id,
      },
      reviewerUser: {
        displayName: "name2",
        id: resUser2.data!.id,
      },
      reviewerFeedback: "Test Reviewer Feedback",
    });
  });

  it("PUT/ Nonconformity should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const resUser = await createTestUser(client, "name");
    const resUser2 = await createTestUser(client, "name2");

    const updateUser = await createTestUser(client, "updateexample");

    const res = await client.POST("/u/internal-audit/nonconformity/item", {
      body: {
        definition: "Test Definition",
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
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBodyPart = {
      definition: "Test Definition 2",
      no: 123,
      identifiedAt: UtilDate.getNowUtcIsoDate(),
      requirement: "Test Requirement 2",
      source: "Test Source",
      potentialResult: "Test Potential Result 2",
      rootCause: "Test Root Cause",
      action: "Test Action",
      targetIdentificationDate: UtilDate.getNowUtcIsoDate(),
      actualIdentificationDate: UtilDate.getNowUtcIsoDate(),
      isCorrectiveActionOpen: true,
      reviewerFeedback: "Test Reviewer Feedback 2",
    };

    const updateRes = await client.PUT(
      "/u/internal-audit/nonconformity/item/{id}",
      {
        params: { path: { id: createdId } },
        body: {
          ...updateBodyPart,
          responsibleUserId: resUser2.data!.id,
          reviewerUserId: updateUser.data!.id,
        },
      },
    );
    expect(updateRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/internal-audit/nonconformity/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBodyPart,
      reviewerUser: {
        id: updateUser.data!.id,
        displayName: "updateexample",
      },
      responsibleUser: {
        id: resUser2.data!.id,
        displayName: "name2",
      },
    });
  });

  it("DELETE/ Nonconformity should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const resUser = await createTestUser(client, "name");
    const resUser2 = await createTestUser(client, "name2");

    const res = await client.POST("/u/internal-audit/nonconformity/item", {
      body: {
        definition: "Test Definition",
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
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE(
      "/u/internal-audit/nonconformity/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(deleteRes).toBeApiOk();
  });

  it("GET/ should be error when record is not found!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const invalidId = "00000000-0000-0000-0000-000000000000";
    const errorRes = await client.GET(
      "/u/internal-audit/nonconformity/item/{id}",
      {
        params: { path: { id: invalidId } },
      },
    );
    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
