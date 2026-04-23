import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperSeu } from "@m/measurement/test/TestHelperSeu";

describe("E2E - RouterEnergySavingOpportunity", () => {
  it("POST /u/planning/energy-saving-opportunity should be ok", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const seu2 = await TestHelperSeu.createTestSeu(client, "seu2");

    const res = await client.POST(
      "/u/planning/energy-saving-opportunity/item",
      {
        body: {
          name: "Test Energy Saving Opportunity",
          notes: "Test Note",
          responsibleUserId: session.userId,
          approvementStatus: "APPROVED",
          investmentApplicationPeriodMonth: 5,
          investmentBudget: 10000,
          estimatedBudgetSaving: 5000,
          paybackMonth: 24,
          calculationMethodOfPayback: "Simple Payback",
          estimatedSavings: [
            { energyResource: "ELECTRIC", value: 5000 },
            { energyResource: "GAS", value: 2000 },
          ],
          seuIds: [seu1.id, seu2.id],
        },
      },
    );
    expect(res).toBeApiOk();
  });

  it("PUT /u/planning/energy-saving-opportunity/:id should update the energy saving opportunity", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const seu2 = await TestHelperSeu.createTestSeu(client, "seu2");

    const res = await client.POST(
      "/u/planning/energy-saving-opportunity/item",
      {
        body: {
          name: "Test Energy Saving Opportunity",
          notes: "Test Note",
          responsibleUserId: session.userId,
          approvementStatus: "APPROVED",
          investmentApplicationPeriodMonth: 5,
          investmentBudget: 10000,
          estimatedBudgetSaving: 5000,
          paybackMonth: 24,
          calculationMethodOfPayback: "Simple Payback",
          estimatedSavings: [{ energyResource: "ELECTRIC", value: 5000 }],
          seuIds: [seu1.id],
        },
      },
    );

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBodyPart = {
      name: "Test Energy Saving Opportunity",
      notes: "Test Note updated",
      approvementStatus: "REJECTED" as const,
      investmentApplicationPeriodMonth: 6,
      investmentBudget: 12000,
      estimatedBudgetSaving: 6000,
      paybackMonth: 30,
      calculationMethodOfPayback: "Discounted Payback",
      estimatedSavings: [{ energyResource: "ELECTRIC" as const, value: 6000 }],
    };

    const updateRes = await client.PUT(
      "/u/planning/energy-saving-opportunity/item/{id}",
      {
        params: { path: { id: createdId } },
        body: {
          ...updateBodyPart,
          responsibleUserId: session.userId,
          seuIds: [seu2.id],
        },
      },
    );

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/planning/energy-saving-opportunity/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBodyPart,
      responsibleUser: {
        id: session.userId,
        displayName: session.userDisplayName,
      },
      seus: [
        {
          id: seu2.id,
          name: "seu2",
        },
      ],
    });
  });

  it("GET /u/planning/energy-saving-opportunity", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");

    const payload = {
      name: "Test Energy Saving Opportunity",
      notes: "Test Note",
      approvementStatus: "APPROVED" as const,
      investmentApplicationPeriodMonth: 5,
      investmentBudget: 10000,
      estimatedBudgetSaving: 5000,
      paybackMonth: 24,
      calculationMethodOfPayback: "Simple Payback",
      estimatedSavings: [{ energyResource: "ELECTRIC" as const, value: 5000 }],
    };

    const createResponse = await client.POST(
      "/u/planning/energy-saving-opportunity/item",
      {
        body: {
          ...payload,
          responsibleUserId: session.userId,
          seuIds: [seu1.id],
        },
      },
    );
    const createdId = createResponse.data!.id;
    const res = await client.GET("/u/planning/energy-saving-opportunity/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload,
          responsibleUser: {
            id: session.userId,
            displayName: "admin",
          },

          seus: [{ id: seu1.id, name: "seu1" }],
        },
      ],
    });
  });

  it("GET /u/planning/energy-saving-opportunity/:id should get the energy saving opportunity", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");

    const payload = {
      name: "Test Energy Saving Opportunity",
      notes: "Test Note",
      approvementStatus: "APPROVED" as const,
      investmentApplicationPeriodMonth: 5,
      investmentBudget: 10000,
      estimatedBudgetSaving: 5000,
      paybackMonth: 24,
      calculationMethodOfPayback: "Simple Payback",
      estimatedSavings: [{ energyResource: "ELECTRIC" as const, value: 5000 }],
    };

    const createResponse = await client.POST(
      "/u/planning/energy-saving-opportunity/item",
      {
        body: {
          ...payload,
          responsibleUserId: session.userId,
          seuIds: [seu1.id],
        },
      },
    );

    expect(createResponse).toBeApiOk();
    const createdId = createResponse.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET(
      "/u/planning/energy-saving-opportunity/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...payload,
      responsibleUser: {
        id: session.userId,
        displayName: session.userDisplayName,
      },
      seus: [
        {
          id: seu1.id,
          name: "seu1",
        },
      ],
    });
  });

  it("DELETE /u/planning/energy-saving-opportunity/:id should delete the energy saving opportunity", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");

    const res = await client.POST(
      "/u/planning/energy-saving-opportunity/item",
      {
        body: {
          name: "Test Energy Saving Opportunity",
          notes: "Test Note",
          responsibleUserId: session.userId,
          approvementStatus: "APPROVED",
          investmentApplicationPeriodMonth: 5,
          investmentBudget: 10000,
          estimatedBudgetSaving: 5000,
          paybackMonth: 24,
          calculationMethodOfPayback: "Simple Payback",
          estimatedSavings: [{ energyResource: "ELECTRIC", value: 5000 }],
          seuIds: [seu1.id],
        },
      },
    );

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE(
      "/u/planning/energy-saving-opportunity/item/{id}",
      { params: { path: { id: createdId } } },
    );
    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/planning/energy-saving-opportunity/item/{id}",
      { params: { path: { id: createdId } } },
    );
    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);

    const deleteRes2 = await client.DELETE(
      "/u/planning/energy-saving-opportunity/item/{id}",
      { params: { path: { id: createdId } } },
    );
    expect(deleteRes2).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("GET/ should be error when record is not found!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const invalidId = "00000000-0000-0000-0000-000000000000";
    const errorRes = await client.GET(
      "/u/planning/energy-saving-opportunity/item/{id}",
      {
        params: { path: { id: invalidId } },
      },
    );
    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("PUT/ should be error when record is not found!", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const invalidId = "00000000-0000-0000-0000-000000000000";
    const errorRes = await client.PUT(
      "/u/planning/energy-saving-opportunity/item/{id}",
      {
        params: { path: { id: invalidId } },
        body: {
          name: "Test Energy Saving Opportunity",
          notes: "Test Note",
          responsibleUserId: session.userId,
          approvementStatus: "APPROVED",
          investmentApplicationPeriodMonth: 5,
          investmentBudget: 10000,
          estimatedBudgetSaving: 5000,
          paybackMonth: 24,
          calculationMethodOfPayback: "Simple Payback",
          estimatedSavings: [{ energyResource: "ELECTRIC", value: 5000 }],
          seuIds: [seu1.id],
        },
      },
    );
    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("POST /u/planning/energy-saving-opportunity/item should return BAD_REQUEST when estimatedSavings contains a value <= 0 or estimatedSavings is empty", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const res = await client.POST(
      "/u/planning/energy-saving-opportunity/item",
      {
        body: {
          name: "Test Energy Saving Opportunity",
          notes: "Test Note",
          responsibleUserId: session.userId,
          approvementStatus: "APPROVED",
          investmentApplicationPeriodMonth: 5,
          investmentBudget: 10000,
          estimatedBudgetSaving: 5000,
          paybackMonth: 24,
          calculationMethodOfPayback: "Simple Payback",
          estimatedSavings: [],
          seuIds: [],
        },
      },
    );

    expect(res).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("PUT /u/planning/energy-saving-opportunity/item/{id} should return BAD_REQUEST when estimatedSavings contains a value <= 0 or estimatedSavings is empty", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");

    const res = await client.POST(
      "/u/planning/energy-saving-opportunity/item",
      {
        body: {
          name: "Test Energy Saving Opportunity",
          notes: "Test Note",
          responsibleUserId: session.userId,
          approvementStatus: "APPROVED",
          investmentApplicationPeriodMonth: 5,
          investmentBudget: 10000,
          estimatedBudgetSaving: 5000,
          paybackMonth: 24,
          calculationMethodOfPayback: "Simple Payback",
          estimatedSavings: [{ energyResource: "ELECTRIC", value: 5000 }],
          seuIds: [seu1.id],
        },
      },
    );

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateRes = await client.PUT(
      "/u/planning/energy-saving-opportunity/item/{id}",
      {
        params: { path: { id: createdId } },
        body: {
          name: "Test Energy Saving Opportunity",
          notes: "Test Note updated",
          approvementStatus: "REJECTED",
          investmentApplicationPeriodMonth: 6,
          investmentBudget: 12000,
          estimatedBudgetSaving: 6000,
          paybackMonth: 30,
          calculationMethodOfPayback: "Discounted Payback",
          estimatedSavings: [{ energyResource: "ELECTRIC", value: 0 }],
          seuIds: [seu1.id],
          responsibleUserId: session.userId,
        },
      },
    );

    expect(updateRes).toBeApiError(EApiFailCode.BAD_REQUEST);
  });
});
