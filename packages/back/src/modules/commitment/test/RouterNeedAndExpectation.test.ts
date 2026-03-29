import { EApiFailCode, UtilDate } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperDepartment } from "@m/base/test/TestHelperDepartment";

describe("E2E - RouterNeedAndExpectation", () => {
  it("POST /u/commitment/need-and-expectation should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const dept2Id = await TestHelperDepartment.create(client, "Department2");

    const res = await client.POST("/u/commitment/need-and-expectation/item", {
      body: {
        interestedParty:
          "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party",
        interestedPartyNeedsAndExpectations:
          "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party Needs And Expectations",
        isIncludedInEnms: true,
        evaluationMethod:
          "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Evaluation Method",
        revisionDate: UtilDate.getNowUtcIsoDate(),
        departmentIds: [dept1Id, dept2Id],
      },
    });
    expect(res).toBeApiOk();
  });

  it("GET /u/commitment/need-and-expectation should get the commitment internal external considerations", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const payload = {
      interestedParty:
        "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party",
      interestedPartyNeedsAndExpectations:
        "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party Needs And Expectations",
      isIncludedInEnms: true,
      evaluationMethod:
        "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Evaluation Method",
      revisionDate: UtilDate.getNowUtcIsoDate(),
    };
    const resCreate = await client.POST(
      "/u/commitment/need-and-expectation/item",
      {
        body: { ...payload, departmentIds: [dept1Id] },
      },
    );

    const res = await client.GET("/u/commitment/need-and-expectation/item");

    expect(res.data).toStrictEqual({
      records: [
        {
          id: resCreate.data!.id,
          ...payload,
          departments: [
            {
              id: dept1Id,
              name: "Department1",
            },
          ],
        },
      ],
    });
  });

  it("PUT /u/commitment/need-and-expectation/{id} should update the commitment internal external consideration", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const dept2Id = await TestHelperDepartment.create(client, "Department2");

    const res = await client.POST("/u/commitment/need-and-expectation/item", {
      body: {
        interestedParty:
          "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party",
        interestedPartyNeedsAndExpectations:
          "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party Needs And Expectations",
        isIncludedInEnms: true,
        evaluationMethod:
          "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Evaluation Method",
        revisionDate: UtilDate.getNowUtcIsoDate(),
        departmentIds: [dept1Id],
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBodyPart = {
      interestedParty:
        "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party",
      interestedPartyNeedsAndExpectations:
        "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party Needs And Expectations",
      isIncludedInEnms: true,
      evaluationMethod:
        "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Evaluation Method",
      revisionDate: UtilDate.getNowUtcIsoDate(),
    };

    const updateRes = await client.PUT(
      "/u/commitment/need-and-expectation/item/{id}",
      {
        params: { path: { id: createdId } },
        body: { ...updateBodyPart, departmentIds: [dept2Id] },
      },
    );

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/commitment/need-and-expectation/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBodyPart,
      departments: [
        {
          id: dept2Id,
          name: "Department2",
        },
      ],
    });
  });

  it("GET /u/commitment/need-and-expectation/{id} should get by id the commitment internal external consideration", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const payload = {
      interestedParty:
        "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party",
      interestedPartyNeedsAndExpectations:
        "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party Needs And Expectations",
      isIncludedInEnms: true,
      evaluationMethod:
        "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Evaluation Method",
      revisionDate: UtilDate.getNowUtcIsoDate(),
    };
    const res = await client.POST("/u/commitment/need-and-expectation/item", {
      body: {
        ...payload,
        departmentIds: [dept1Id],
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET(
      "/u/commitment/need-and-expectation/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...payload,
      departments: [
        {
          id: dept1Id,
          name: "Department1",
        },
      ],
    });
  });

  it("DELETE /u/commitment/need-and-expectation/{id} should delete by id the commitment internal external consideration", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const createRes = await client.POST(
      "/u/commitment/need-and-expectation/item",
      {
        body: {
          interestedParty:
            "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party",
          interestedPartyNeedsAndExpectations:
            "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party Needs And Expectations",
          isIncludedInEnms: true,
          evaluationMethod:
            "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Evaluation Method",
          revisionDate: UtilDate.getNowUtcIsoDate(),
          departmentIds: [dept1Id],
        },
      },
    );

    expect(createRes).toBeApiOk();

    const createdId = createRes.data!.id;

    const res = await client.DELETE(
      "/u/commitment/need-and-expectation/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(res).toBeApiOk();
  });

  it("DELETE /u/commitment/need-and-expectation/{id} should throw NOT_FOUND when record is not found", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const createRes = await client.POST(
      "/u/commitment/need-and-expectation/item",
      {
        body: {
          interestedParty:
            "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party",
          interestedPartyNeedsAndExpectations:
            "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party Needs And Expectations",
          isIncludedInEnms: true,
          evaluationMethod:
            "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Evaluation Method",
          revisionDate: UtilDate.getNowUtcIsoDate(),
          departmentIds: [dept1Id],
        },
      },
    );
    expect(createRes).toBeApiOk();

    const res = await client.DELETE(
      "/u/commitment/need-and-expectation/item/{id}",
      {
        params: { path: { id: "00000000-0000-0000-0000-000000000000" } },
      },
    );
    expect(res).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("GET /u/commitment/need-and-expectation/{id} should throw NOT_FOUND when record is not found", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const createRes = await client.POST(
      "/u/commitment/need-and-expectation/item",
      {
        body: {
          interestedParty:
            "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party",
          interestedPartyNeedsAndExpectations:
            "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party Needs And Expectations",
          isIncludedInEnms: true,
          evaluationMethod:
            "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Evaluation Method",
          revisionDate: UtilDate.getNowUtcIsoDate(),
          departmentIds: [dept1Id],
        },
      },
    );
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const res = await client.GET(
      "/u/commitment/need-and-expectation/item/{id}",
      {
        params: { path: { id: "00000000-0000-0000-0000-000000000000" } },
      },
    );

    expect(res).toBeApiError(EApiFailCode.NOT_FOUND);
  });
  it("PUT /u/commitment/need-and-expectation/{id} should throw NOT_FOUND when record is not found", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const createRes = await client.POST(
      "/u/commitment/need-and-expectation/item",
      {
        body: {
          interestedParty:
            "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party",
          interestedPartyNeedsAndExpectations:
            "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Interested Party Needs And Expectations",
          isIncludedInEnms: true,
          evaluationMethod:
            "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Evaluation Method",
          revisionDate: UtilDate.getNowUtcIsoDate(),
          departmentIds: [dept1Id],
        },
      },
    );
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const updateBody = {
      interestedParty:
        "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Updated Interested Party",
      interestedPartyNeedsAndExpectations:
        "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Updated Needs And Expectations",
      isIncludedInEnms: false,
      evaluationMethod:
        "Test Commitment/NeedAndExpectationNeedsAndExpectations -> Updated Evaluation Method",
      revisionDate: UtilDate.getNowUtcIsoDate(),
    };

    const updateRes = await client.PUT(
      "/u/commitment/need-and-expectation/item/{id}",
      {
        params: { path: { id: "00000000-0000-0000-0000-000000000000" } },
        body: { ...updateBody, departmentIds: [dept1Id] },
      },
    );

    expect(updateRes).toBeApiError(EApiFailCode.BAD_REQUEST);
  });
});
