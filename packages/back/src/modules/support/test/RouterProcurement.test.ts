import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterProcurement", () => {
  it("POST/ Should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/support/procurement/item", {
      body: {
        product: "product",
        category: "category",
        criteriaList: "criterialist",
        suggestedBrand: "suggestedbrand",
        additionalSpecifications: "suggestedspecification",
        price: 2,
        annualMaintenanceCost: 3,
        lifetimeYears: 4,
      },
    });
    expect(res).toBeApiOk();
  });

  it("GET/ should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const payload = {
      product: "product",
      category: "category",
      criteriaList: "criterialist",
      suggestedBrand: "suggestedbrand",
      additionalSpecifications: "suggestedspecification",
      price: 2,
      annualMaintenanceCost: 3,
      lifetimeYears: 4,
    };
    const createResponse = await client.POST("/u/support/procurement/item", {
      body: payload,
    });
    const createdId = createResponse.data!.id;
    const res = await client.GET("/u/support/procurement/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload,
        },
      ],
    });
  });
  it("GET/ should be ok with id!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const payload = {
        product: "product",
        category: "category",
        criteriaList: "criterialist",
        suggestedBrand: "suggestedbrand",
        additionalSpecifications: "suggestedspecification",
        price: 2,
        annualMaintenanceCost: 3,
        lifetimeYears: 4,
      },
      createResponse = await client.POST("/u/support/procurement/item", {
        body: payload,
      });

    expect(createResponse).toBeApiOk();
    const createdId = createResponse.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET("/u/support/procurement/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      ...payload,
      id: createdId,
    });
  });

  it("PUT/ Should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const createRes = await client.POST("/u/support/procurement/item", {
      body: {
        product: "product",
        category: "category",
        criteriaList: "criterialist",
        suggestedBrand: "suggestedbrand",
        additionalSpecifications: "suggestedspecification",
        price: 2,
        annualMaintenanceCost: 3,
        lifetimeYears: 4,
      },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const updateBody = {
      product: "product2",
      category: "category2",
      criteriaList: "criterialist2",
      suggestedBrand: "suggestedbrand2",
      additionalSpecifications: "suggestedspecification",
      price: 2,
      annualMaintenanceCost: 3,
      lifetimeYears: 4,
    };
    const updateRes = await client.PUT("/u/support/procurement/item/{id}", {
      params: { path: { id: createdId } },
      body: { ...updateBody },
    });
    expect(updateRes).toBeApiOk();
  });

  it("DELETE/ Should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const createRes = await client.POST("/u/support/procurement/item", {
      body: {
        product: "product2",
        category: "category2",
        criteriaList: "criterialist2",
        suggestedBrand: "suggestedbrand2",
        additionalSpecifications: "suggestedspecification",
        price: 2,
        annualMaintenanceCost: 3,
        lifetimeYears: 4,
      },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE("/u/support/procurement/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET("/u/support/procurement/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
  it("GET/ Should be error when record is not found!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const invalidId = "00000000-0000-0000-0000-000000000000";
    const errorRes = await client.GET("/u/support/procurement/item/{id}", {
      params: { path: { id: invalidId } },
    });
    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
