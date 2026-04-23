import { EApiFailCode, UtilDate } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperSeu } from "@m/measurement/test/TestHelperSeu";

describe("E2E -RouterProcurementProcedure", () => {
  it("POST/ Procurement should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const seu = await TestHelperSeu.createTestSeu(client, "seu");

    expect(seu.id).toBeApiOk();

    const res2 = await client.POST("/u/support/procurement-procedure/item", {
      body: {
        equipmentSpecifications: "equipment",
        serviceSpecifications: "service1",
        nextReviewAt: UtilDate.getNowUtcIsoDate(),
        seuId: seu.id,
      },
    });
    expect(res2).toBeApiOk();
  });

  it("GET/ Procurement should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const seu = await TestHelperSeu.createTestSeu(client, "seu");

    expect(seu.id).toBeApiOk();

    const payload2 = {
      equipmentSpecifications: "equipment",
      serviceSpecifications: "service1",
      nextReviewAt: UtilDate.getNowUtcIsoDate(),
      seu: {
        id: seu.id,
        name: "seu",
      },
    };

    const createResponse = await client.POST(
      "/u/support/procurement-procedure/item",
      {
        body: { ...payload2, seuId: seu.id },
      },
    );
    const createdId = createResponse.data!.id;
    const res = await client.GET("/u/support/procurement-procedure/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload2,
          seu: {
            id: seu.id,
            name: "seu",
          },
        },
      ],
    });
  });

  it("GET/ Procurement should be ok with id!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const seu = await TestHelperSeu.createTestSeu(client, "seu");

    expect(seu.id).toBeApiOk();

    const payload = {
      equipmentSpecifications: "equipment",
      serviceSpecifications: "service1",
      nextReviewAt: UtilDate.getNowUtcIsoDate(),
    };
    const createResponse = await client.POST(
      "/u/support/procurement-procedure/item",
      {
        body: { ...payload, seuId: seu.id },
      },
    );

    expect(createResponse).toBeApiOk();
    const createdId = createResponse.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET(
      "/u/support/procurement-procedure/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...payload,
      seu: {
        id: seu.id,
        name: "seu",
      },
    });
  });

  it("PUT/ Procurement should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const seu1 = await TestHelperSeu.createTestSeu(
      client,
      "Test measurement/seu -> name 1",
    );
    const seu2 = await TestHelperSeu.createTestSeu(
      client,
      "Test measurement/seu -> name 2",
    );

    const res = await client.POST("/u/support/procurement-procedure/item", {
      body: {
        equipmentSpecifications: "equipment",
        serviceSpecifications: "service1",
        nextReviewAt: UtilDate.getNowUtcIsoDate(),
        seuId: seu1.id,
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBodyPart = {
      equipmentSpecifications: "updated equipment",
      serviceSpecifications: "updated service",
      nextReviewAt: UtilDate.getNowUtcIsoDate(),
    };

    const updateRes = await client.PUT(
      "/u/support/procurement-procedure/item/{id}",
      {
        params: { path: { id: createdId } },
        body: { ...updateBodyPart, seuId: seu2.id },
      },
    );
    expect(updateRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/support/procurement-procedure/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBodyPart,
      seu: {
        id: seu2.id,
        name: "Test measurement/seu -> name 2",
      },
    });
  });

  it("DELETE/ Procurement should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const seu = await TestHelperSeu.createTestSeu(client, "seu");

    expect(seu.id).toBeApiOk();

    const createRes = await client.POST(
      "/u/support/procurement-procedure/item",
      {
        body: {
          equipmentSpecifications: "Test equipment",
          serviceSpecifications: "Test service",
          nextReviewAt: UtilDate.getNowUtcIsoDate(),
          seuId: seu.id,
        },
      },
    );
    expect(createRes).toBeApiOk();

    const createdId = createRes.data!.id;

    const res = await client.DELETE(
      "/u/support/procurement-procedure/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(res).toBeApiOk();
  });

  it("GET/ should be error when record is not found!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const invalidId = "00000000-0000-0000-0000-000000000000";
    const errorRes = await client.GET(
      "/u/support/procurement-procedure/item/{id}",
      {
        params: { path: { id: invalidId } },
      },
    );
    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
