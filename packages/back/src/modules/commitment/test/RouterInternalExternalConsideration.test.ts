import { EApiFailCode, UtilDate } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperDepartment } from "@m/base/test/TestHelperDepartment";

describe("E2E - RouterInternalExternalConsideration", () => {
  it("POST /u/commitment/internal-external-consideration should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const dept2Id = await TestHelperDepartment.create(client, "Department2");

    const res = await client.POST(
      "/u/commitment/internal-external-consideration/item",
      {
        body: {
          specific: "Test Commitment Internal External Consideration",
          impactPoint: "impact Point",
          evaluationMethod: "Evaluation Method",
          revisionDate: UtilDate.getNowUtcIsoDate(),
          departmentIds: [dept1Id, dept2Id],
        },
      },
    );
    expect(res).toBeApiOk();
  });

  it("GET /u/commitment/internal-external-consideration/ should get the commitment internal external considerations", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const payload = {
      specific: "Test Commitment Internal External Consideration",
      impactPoint: "impact Point",
      evaluationMethod: "Evaluation Method",
      revisionDate: UtilDate.getNowUtcIsoDate(),
    };
    const createResponse = await client.POST(
      "/u/commitment/internal-external-consideration/item",
      {
        body: { ...payload, departmentIds: [dept1Id] },
      },
    );
    const createdId = createResponse.data!.id;

    const res = await client.GET(
      "/u/commitment/internal-external-consideration/item",
    );

    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload,
          departments: [
            {
              id: dept1Id,
              name: "Department1",
            },
          ],
          updatedAt: expect.any(String),
        },
      ],
    });
  });

  it("PUT /u/commitment/internal-external-consideration/{id} should update the commitment internal external consideration", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const dept2Id = await TestHelperDepartment.create(client, "Department2");

    const res = await client.POST(
      "/u/commitment/internal-external-consideration/item",
      {
        body: {
          specific: "Test Commitment Internal External Consideration",
          impactPoint: "impact Point",
          evaluationMethod: "Evaluation Method",
          revisionDate: UtilDate.getNowUtcIsoDate(),
          departmentIds: [dept1Id],
        },
      },
    );

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBodyPart = {
      specific: "Test Commitment Internal External Consideration 2",
      impactPoint: "impact Point 2",
      evaluationMethod: "Evaluation Method 2",
      revisionDate: UtilDate.getNowUtcIsoDate(),
    };

    const updateRes = await client.PUT(
      "/u/commitment/internal-external-consideration/item/{id}",
      {
        params: { path: { id: createdId } },
        body: { ...updateBodyPart, departmentIds: [dept2Id] },
      },
    );

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/commitment/internal-external-consideration/item/{id}",
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
      updatedAt: expect.any(String),
    });
  });

  it("GET /u/commitment/internal-external-consideration/{id} should get by id the commitment internal external consideration", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const payload = {
      specific: "Test Commitment Internal External Consideration",
      impactPoint: "impact Point",
      evaluationMethod: "Evaluation Method",
      revisionDate: UtilDate.getNowUtcIsoDate(),
    };
    const res = await client.POST(
      "/u/commitment/internal-external-consideration/item",
      {
        body: { ...payload, departmentIds: [dept1Id] },
      },
    );

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET(
      "/u/commitment/internal-external-consideration/item/{id}",
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
      updatedAt: expect.any(String),
    });
  });

  it("DELETE /u/commitment/internal-external-consideration/{id} should delete by id the commitment internal external consideration", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const createRes = await client.POST(
      "/u/commitment/internal-external-consideration/item",
      {
        body: {
          specific: "Test Commitment Internal External Consideration",
          impactPoint: "impact Point",
          evaluationMethod: "Evaluation Method",
          revisionDate: UtilDate.getNowUtcIsoDate(),
          departmentIds: [dept1Id],
        },
      },
    );

    expect(createRes).toBeApiOk();

    const createdId = createRes.data!.id;

    const res = await client.DELETE(
      "/u/commitment/internal-external-consideration/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(res).toBeApiOk();
  });

  it("DELETE /u/commitment/internal-external-consideration/{id} should throw NOT_FOUND when record is not found", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const createRes = await client.POST(
      "/u/commitment/internal-external-consideration/item",
      {
        body: {
          specific: "Test Commitment Internal External Consideration",
          impactPoint: "impact Point",
          evaluationMethod: "Evaluation Method",
          revisionDate: UtilDate.getNowUtcIsoDate(),
          departmentIds: [dept1Id],
        },
      },
    );

    expect(createRes).toBeApiOk();

    const res = await client.DELETE(
      "/u/commitment/internal-external-consideration/item/{id}",
      {
        params: { path: { id: "00000000-0000-0000-0000-000000000000" } },
      },
    );
    expect(res).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("should return previous record in history after update", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");
    const dept2Id = await TestHelperDepartment.create(client, "Department2");

    const initialPayload = {
      specific: "Initial Specific",
      impactPoint: "Initial Impact",
      evaluationMethod: "Initial Evaluation",
      revisionDate: UtilDate.getNowUtcIsoDate(),
      departmentIds: [dept1Id],
    };
    const createRes = await client.POST(
      "/u/commitment/internal-external-consideration/item",
      { body: initialPayload },
    );
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;

    const updatedPayload = {
      specific: "Updated Specific",
      impactPoint: "Updated Impact",
      evaluationMethod: "Updated Evaluation",
      revisionDate: UtilDate.getNowUtcIsoDate(),
      departmentIds: [dept2Id],
    };
    const updateRes = await client.PUT(
      "/u/commitment/internal-external-consideration/item/{id}",
      {
        params: { path: { id: createdId } },
        body: updatedPayload,
      },
    );
    expect(updateRes).toBeApiOk();

    const historyRes = await client.GET(
      "/u/commitment/internal-external-consideration/item/{id}/history",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(historyRes).toBeApiOk();

    const historyRecord = historyRes.data!.records[0];
    expect(historyRecord).toMatchObject({
      specific: initialPayload.specific,
      impactPoint: initialPayload.impactPoint,
      evaluationMethod: initialPayload.evaluationMethod,
      revisionDate: initialPayload.revisionDate,
      departments: [
        {
          id: dept1Id,
          name: "Department1",
        },
      ],
      updatedAt: expect.any(String),
    });
  });

  it("should throw NOT_FOUND when trying to delete a child (history) record", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");
    const dept2Id = await TestHelperDepartment.create(client, "Department2");

    const initialPayload = {
      specific: "Initial Specific",
      impactPoint: "Initial Impact",
      evaluationMethod: "Initial Evaluation",
      revisionDate: UtilDate.getNowUtcIsoDate(),
      departmentIds: [dept1Id],
    };
    const createRes = await client.POST(
      "/u/commitment/internal-external-consideration/item",
      { body: initialPayload },
    );
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;

    const updatedPayload = {
      specific: "Updated Specific",
      impactPoint: "Updated Impact",
      evaluationMethod: "Updated Evaluation",
      revisionDate: UtilDate.getNowUtcIsoDate(),
      departmentIds: [dept2Id],
    };
    const updateRes = await client.PUT(
      "/u/commitment/internal-external-consideration/item/{id}",
      {
        params: { path: { id: createdId } },
        body: updatedPayload,
      },
    );
    expect(updateRes).toBeApiOk();

    const historyRes = await client.GET(
      "/u/commitment/internal-external-consideration/item/{id}/history",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(historyRes).toBeApiOk();
    const childId = historyRes.data!.records[0].id;

    const deleteRes = await client.DELETE(
      "/u/commitment/internal-external-consideration/item/{id}",
      {
        params: { path: { id: childId } },
      },
    );
    expect(deleteRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
