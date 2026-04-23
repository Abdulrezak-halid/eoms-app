import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperUser } from "@m/base/test/TestHelperUser";
import { TestHelperSeu } from "@m/measurement/test/TestHelperSeu";

import createTestUser = TestHelperUser.createTestUser;

describe("E2E- Critical Operational Parameter", () => {
  it("POST/ critical operational should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const resUser = await createTestUser(client, "name");
    const resUser2 = await createTestUser(client, "name2");
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");

    const res = await client.POST(
      "/u/support/critical-operational-parameter/item",
      {
        body: {
          seuId: seu1.id,
          energyResource: "DIESEL",
          parameter: "Test Parameter",
          period: "MONTHLY",
          unit: "PIECE",
          normalSettingValue: 10,
          lowerLimit: 2,
          upperLimit: 20,
          accuracyCalibrationFrequency: 5,
          measurementTool: "Test Measurement Tool",
          valueResponsibleUserId: resUser.data!.id,
          deviationResponsibleUserId: resUser2.data!.id,
          note: "Test Note",
          controlDate: "2021-10-10",
        },
      },
    );
    expect(res).toBeApiOk();
  });

  it("GET/ critial operational list should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const resUser = await createTestUser(client, "name");
    const resUser2 = await createTestUser(client, "name2");
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");

    const payload = {
      energyResource: "DIESEL",
      parameter: "Test Parameter 2",
      period: "MONTHLY",
      unit: "PIECE",
      normalSettingValue: 20,
      lowerLimit: 3,
      upperLimit: 30,
      accuracyCalibrationFrequency: 6,
      measurementTool: "Test Measurement Tool 2",
      note: "Test Note 2",
      controlDate: "2021-10-11",
    } as const;

    const createResponse = await client.POST(
      "/u/support/critical-operational-parameter/item",
      {
        body: {
          ...payload,
          seuId: seu1.id,
          valueResponsibleUserId: resUser.data!.id,
          deviationResponsibleUserId: resUser2.data!.id,
        },
      },
    );
    const createdId = createResponse.data!.id;

    const res = await client.GET(
      "/u/support/critical-operational-parameter/item",
    );
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload,
          seu: {
            id: seu1.id,
            name: "seu1",
          },
          valueResponsibleUser: {
            id: resUser.data!.id,
            displayName: "name",
          },
          deviationResponsibleUser: {
            id: resUser2.data!.id,
            displayName: "name2",
          },
        },
      ],
    });
  });

  it("GET/ critical operational should be ok with id", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const resUser = await createTestUser(client, "name");
    const resUser2 = await createTestUser(client, "name2");
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");

    const payload = {
      energyResource: "DIESEL",
      parameter: "Test Parameter",
      period: "MONTHLY",
      unit: "PIECE",
      normalSettingValue: 10,
      lowerLimit: 2,
      upperLimit: 20,
      accuracyCalibrationFrequency: 5,
      measurementTool: "Test Measurement Tool",
      note: "Test Note",
      controlDate: "2021-10-10",
    } as const;
    const createResponse = await client.POST(
      "/u/support/critical-operational-parameter/item",
      {
        body: {
          ...payload,
          seuId: seu1.id,
          valueResponsibleUserId: resUser.data!.id,
          deviationResponsibleUserId: resUser2.data!.id,
        },
      },
    );

    expect(createResponse).toBeApiOk();
    const createdId = createResponse.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET(
      "/u/support/critical-operational-parameter/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...payload,
      valueResponsibleUser: {
        id: resUser.data!.id,
        displayName: "name",
      },
      deviationResponsibleUser: {
        id: resUser2.data!.id,
        displayName: "name2",
      },
      seu: {
        id: seu1.id,
        name: "seu1",
      },
    });
  });

  it("PUT/ critical operational should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const resUser = await createTestUser(client, "name");
    const resUser2 = await createTestUser(client, "name2");
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const seu2 = await TestHelperSeu.createTestSeu(client, "seu2");
    const updateUser = await createTestUser(client, "updateexample");

    const res = await client.POST(
      "/u/support/critical-operational-parameter/item",
      {
        body: {
          seuId: seu1.id,
          energyResource: "DIESEL",
          parameter: "Test Parameter",
          period: "MONTHLY",
          unit: "PIECE",
          normalSettingValue: 10,
          lowerLimit: 2,
          upperLimit: 20,
          accuracyCalibrationFrequency: 5,
          measurementTool: "Test Measurement Tool",
          valueResponsibleUserId: resUser.data!.id,
          deviationResponsibleUserId: resUser2.data!.id,
          note: "Test Note",
          controlDate: "2021-10-10",
        },
      },
    );
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBodyPart = {
      energyResource: "DIESEL",
      parameter: "Test Parameter",
      period: "MONTHLY",
      unit: "PIECE",
      normalSettingValue: 10,
      lowerLimit: 2,
      upperLimit: 20,
      accuracyCalibrationFrequency: 5,
      measurementTool: "Test Measurement Tool",
      note: "Test Note",
      controlDate: "2021-10-10",
    } as const;

    const updateRes = await client.PUT(
      "/u/support/critical-operational-parameter/item/{id}",
      {
        params: { path: { id: createdId } },
        body: {
          ...updateBodyPart,
          valueResponsibleUserId: updateUser.data!.id,
          deviationResponsibleUserId: resUser2.data!.id,
          seuId: seu2.id,
        },
      },
    );
    expect(updateRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/support/critical-operational-parameter/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBodyPart,
      valueResponsibleUser: {
        id: updateUser.data!.id,
        displayName: "updateexample",
      },
      deviationResponsibleUser: {
        id: resUser2.data!.id,
        displayName: "name2",
      },
      seu: {
        id: seu2.id,
        name: "seu2",
      },
    });
  });

  it("DELETE/ critical operational should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const resUser = await createTestUser(client, "name");
    const resUser2 = await createTestUser(client, "name2");
    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");

    const res = await client.POST(
      "/u/support/critical-operational-parameter/item",
      {
        body: {
          seuId: seu1.id,
          energyResource: "DIESEL",
          parameter: "Test Parameter",
          period: "MONTHLY",
          unit: "PIECE",
          normalSettingValue: 10,
          lowerLimit: 2,
          upperLimit: 20,
          accuracyCalibrationFrequency: 5,
          measurementTool: "Test Measurement Tool",
          valueResponsibleUserId: resUser.data!.id,
          deviationResponsibleUserId: resUser2.data!.id,
          note: "Test Note",
          controlDate: "2021-10-10",
        },
      },
    );
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE(
      "/u/support/critical-operational-parameter/item/{id}",
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
      "/u/support/critical-operational-parameter/item/{id}",
      {
        params: { path: { id: invalidId } },
      },
    );
    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
