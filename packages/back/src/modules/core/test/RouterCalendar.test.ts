import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterCalendar", () => {
  it("Create a calendar entry", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/core/calendar/item", {
      body: {
        name: "test",
        type: "CUSTOM",
        datetime: "2025-03-01T00:00:00Z",
        description: "test description",
        datetimeEnd: "2025-03-02T00:00:00Z",
      },
    });
    expect(res).toBeApiOk();
  });

  it("Get all calendar entries", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const body = {
      name: "test",
      type: "CUSTOM",
      datetime: "2025-03-01T00:00:00.000Z",
      description: "test description",
      datetimeEnd: "2025-03-02T00:00:00.000Z",
    } as const;
    const createResponse = await client.POST("/u/core/calendar/item", {
      body: body,
    });
    const createdId = createResponse.data!.id;
    const res = await client.GET("/u/core/calendar/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          ...body,
          id: createdId,
        },
      ],
    });
  });

  it("Update calendar entries", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/core/calendar/item", {
      body: {
        name: "test",
        type: "CUSTOM",
        datetime: "2025-03-01T00:00:00Z",
        description: "test description",
        datetimeEnd: "2025-03-02T00:00:00Z",
      },
    });

    expect(res).toBeApiOk();

    const updateBody = {
      name: "test 2",
      type: "CUSTOM",
      datetime: "2025-03-01T00:00:00.000Z",
      description: "test description",
      datetimeEnd: "2025-03-02T00:00:00.000Z",
    } as const;

    const updateRes = await client.PUT("/u/core/calendar/item/{id}", {
      params: { path: { id: res.data!.id } },
      body: updateBody,
    });

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/core/calendar/item/{id}", {
      params: { path: { id: res.data!.id } },
    });

    expect(getRes.data).toStrictEqual({
      id: res.data!.id,
      ...updateBody,
    });
  });

  it("Delete calendar entries", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const body = {
      name: "test",
      type: "CUSTOM",
      datetime: "2025-03-01T00:00:00.000Z",
      description: "test description",
      datetimeEnd: "2025-03-02T00:00:00.000Z",
    } as const;

    const res = await client.POST("/u/core/calendar/item", {
      body: body,
    });

    expect(res).toBeApiOk();

    const deleteRes = await client.DELETE("/u/core/calendar/item/{id}", {
      params: { path: { id: res.data!.id } },
    });

    expect(deleteRes).toBeApiOk();
  });

  it("Get calendar entry", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const body = {
      name: "test",
      type: "CUSTOM",
      datetime: "2025-03-01T00:00:00.000Z",
      description: "test description",
      datetimeEnd: "2025-03-02T00:00:00.000Z",
    } as const;

    const res = await client.POST("/u/core/calendar/item", {
      body: body,
    });

    expect(res).toBeApiOk();

    const getRes = await client.GET("/u/core/calendar/item/{id}", {
      params: { path: { id: res.data!.id } },
    });

    expect(getRes.data).toStrictEqual({
      id: res.data!.id,
      ...body,
    });
  });

  it("Get calendar must throw NOT_FOUND", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const getRes = await client.GET("/u/core/calendar/item/{id}", {
      params: { path: { id: "123e4567-e89b-12d3-a456-426614174000" } },
    });

    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
