import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperDepartment } from "@m/base/test/TestHelperDepartment";

describe("E2E - RouterScopeandLimit", () => {
  it("POST/ create should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const dept2Id = await TestHelperDepartment.create(client, "Department2");

    const res = await client.POST("/u/commitment/scope-and-limit/item", {
      body: {
        physicalLimits: "pyhsicalimit",
        excludedResources: ["ELECTRIC"],
        excludedResourceReason: "reason",
        products: ["product"],
        departmentIds: [dept1Id, dept2Id],
      },
    });

    expect(res).toBeApiOk();

    const createdId = res.data!.id;

    const getRes = await client.GET("/u/commitment/scope-and-limit/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      physicalLimits: "pyhsicalimit",

      excludedResources: ["ELECTRIC"],
      excludedResourceReason: "reason",
      products: ["product"],
      departments: [
        {
          id: dept1Id,
          name: "Department1",
        },
        {
          id: dept2Id,
          name: "Department2",
        },
      ],
    });
  });

  it("GET/ list should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const payload = {
      physicalLimits: "pyhsicalimit",
      excludedResources: ["WATER" as const],
      excludedResourceReason: "reason",
      products: ["product"],
    };
    const responseCreaId = await client.POST(
      "/u/commitment/scope-and-limit/item",
      {
        body: { ...payload, departmentIds: [dept1Id] },
      },
    );
    const res = await client.GET("/u/commitment/scope-and-limit/item");

    expect(res.data).toStrictEqual({
      records: [
        {
          id: responseCreaId.data?.id,
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

  it("GET/ should be ok with id!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const res = await client.POST("/u/commitment/scope-and-limit/item", {
      body: {
        physicalLimits: "pyhsicalimit",

        excludedResources: ["ELECTRIC"],
        excludedResourceReason: "reason",
        products: ["product"],
        departmentIds: [dept1Id],
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET("/u/commitment/scope-and-limit/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(getRes.data).toStrictEqual({
      id: createdId,
      physicalLimits: "pyhsicalimit",
      excludedResources: ["ELECTRIC"],
      excludedResourceReason: "reason",
      products: ["product"],
      departments: [
        {
          id: dept1Id,
          name: "Department1",
        },
      ],
    });
  });

  it("PUT/ should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const dept2Id = await TestHelperDepartment.create(client, "Department2");

    const res = await client.POST("/u/commitment/scope-and-limit/item", {
      body: {
        physicalLimits: "pyhsicalimit",

        excludedResources: ["ELECTRIC"],
        excludedResourceReason: "reason",
        products: ["product"],
        departmentIds: [dept1Id],
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBodyPart = {
      physicalLimits: "pyhsical2",
      excludedResources: ["ELECTRIC" as const],
      excludedResourceReason: "reason2",
      products: ["product2"],
    };

    const updateRes = await client.PUT(
      "/u/commitment/scope-and-limit/item/{id}",
      {
        params: { path: { id: createdId } },
        body: { ...updateBodyPart, departmentIds: [dept2Id] },
      },
    );
    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/commitment/scope-and-limit/item/{id}", {
      params: { path: { id: createdId } },
    });
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

  it("DELETE / delete should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const createRes = await client.POST("/u/commitment/scope-and-limit/item", {
      body: {
        physicalLimits: "pyhsicalimit",

        excludedResources: ["ELECTRIC"],
        excludedResourceReason: "reason",
        products: ["product"],
        departmentIds: [dept1Id],
      },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE(
      "/u/commitment/scope-and-limit/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(deleteRes).toBeApiOk();
    const getRes = await client.DELETE(
      "/u/commitment/scope-and-limit/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("GET/ should be error when record is not found!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const invalidId = "00000000-0000-0000-0000-000000000000";
    const errorRes = await client.GET(
      "/u/commitment/scope-and-limit/item/{id}",
      {
        params: { path: { id: invalidId } },
      },
    );
    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("PUT/ should be error when record is not found!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const dept1Id = await TestHelperDepartment.create(client, "Department1");

    const invalidId = "00000000-0000-0000-0000-000000000000";

    const updateBody = {
      physicalLimits: "pyhsical2",

      excludedResources: ["ELECTRIC" as const],
      excludedResourceReason: "reason2",
      products: ["product2"],
      departmentIds: [dept1Id],
    };

    const errorRes = await client.PUT(
      "/u/commitment/scope-and-limit/item/{id}",
      {
        params: { path: { id: invalidId } },
        body: updateBody,
      },
    );

    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
