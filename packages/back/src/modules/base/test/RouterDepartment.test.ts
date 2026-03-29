//import { EApiFailCode } from "common";
import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterDepartment", () => {
  it("POST /u/base/department should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/base/department/item", {
      body: {
        name: "test department 1",
        description: "test department desc",
      },
    });
    expect(res).toBeApiOk();
  });

  it("PUT /u/base/department/:id should update the department", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/base/department/item", {
      body: {
        name: "test department 1",
        description: "test department desc",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBody = {
      name: "updated department",
      description: "updated description",
    } as const;

    const updateRes = await client.PUT("/u/base/department/item/{id}", {
      params: { path: { id: createdId } },
      body: updateBody,
    });

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/base/department/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBody,
    });
  });

  it("GET /u/base/department", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const payload = {
      name: "test department 1",
      description: "test department desc",
    } as const;

    const createResponse = await client.POST("/u/base/department/item", {
      body: payload,
    });
    const createdId = createResponse.data!.id;

    const res = await client.GET("/u/base/department/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          ...payload,
          id: createdId,
        },
      ],
    });
  });

  it("GET/ energy base names", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const payload = {
      name: "test department 1",
      description: "test department desc",
    } as const;
    const createRes = await client.POST("/u/base/department/item", {
      body: payload,
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const res = await client.GET("/u/base/department/names");
    expect(res.data).toStrictEqual({
      records: [{ id: createdId, name: payload.name }],
    });
  });

  it("DELETE /u/base/department/:id should delete the department", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/base/department/item", {
      body: {
        name: "test department 1",
        description: "test department desc",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE("/u/base/department/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET("/u/base/department/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("GET /u/base/department/item without permission should response FORBIDDEN error", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: [],
    });
    const res = await client.GET("/u/base/department/item");
    expect(res).toBeApiError(EApiFailCode.FORBIDDEN);
  });

  it("GET /u/base/department/item with a minimal permission should response ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: ["/BASE/DEPARTMENT"],
    });
    const res = await client.GET("/u/base/department/item");
    expect(res).toBeApiOk();
  });
});
