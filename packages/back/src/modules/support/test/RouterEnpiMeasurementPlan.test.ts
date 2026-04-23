import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperEnpi } from "./TestHelperEnpi";

describe("E2E- RouterEnpiMeasurementPlan", () => {
  it("E2E-POST / Create should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const enpiId = await TestHelperEnpi.createTestEnpi(client);
    const res = await client.POST("/u/support/enpi-measurement-plan/item", {
      body: {
        enpiId,
        energyInput: 2,
        energyVariables: "energyVariables",
        idealMeasurementTools: "idealMeasurementTools",
        availableMeasurementTools: "availableMeasurementTools",
        monitoringAbsenceGap: "monitoringAbsenceGap",
        measurementPlan: "measurementPlan",
        requiredRange: 3,
        engineeringUnit: "engineeringUnit",
        dataCollectionMethod: "dataCollectionMethod",
        dataCollectionPeriod: "dataCollectionPeriod",
      },
    });
    expect(res).toBeApiOk();
  });
  it("E2E-GET / List should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const enpiId = await TestHelperEnpi.createTestEnpi(client);
    const payload = {
      energyInput: 2,
      energyVariables: "energyVariables",
      idealMeasurementTools: "idealMeassurementTools",
      availableMeasurementTools: "availableMeasurementTools",
      monitoringAbsenceGap: "monitoringAbsenceGap",
      measurementPlan: "measurementPlan",
      requiredRange: 3,
      engineeringUnit: "engineeringUnit",
      dataCollectionMethod: "dataCollectionMethod",
      dataCollectionPeriod: "dataCollectionPeriod",
    };
    const createResponse = await client.POST(
      "/u/support/enpi-measurement-plan/item",
      {
        body: { ...payload, enpiId },
      },
    );
    const createdId = createResponse.data!.id;

    const res = await client.GET("/u/support/enpi-measurement-plan/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload,
          enpi: {
            displayName: "test equipment",
            id: enpiId,
          },
        },
      ],
    });
  });

  it("E2E-GET / Get by id should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const enpiId = await TestHelperEnpi.createTestEnpi(client);
    const res = await client.POST("/u/support/enpi-measurement-plan/item", {
      body: {
        enpiId,
        energyInput: 2,
        energyVariables: "energyVariables",
        idealMeasurementTools: "idealMeassurementTools",
        availableMeasurementTools: "availableMeasurementTools",
        monitoringAbsenceGap: "monitoringAbsenceGap",
        measurementPlan: "measurementPlan",
        requiredRange: 3,
        engineeringUnit: "engineeringUnit",
        dataCollectionMethod: "dataCollectionMethod",
        dataCollectionPeriod: "dataCollectionPeriod",
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET(
      "/u/support/enpi-measurement-plan/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(getRes.data).toStrictEqual({
      id: createdId,
      enpi: {
        displayName: "test equipment",
        id: enpiId,
      },
      energyInput: 2,
      energyVariables: "energyVariables",
      idealMeasurementTools: "idealMeassurementTools",
      availableMeasurementTools: "availableMeasurementTools",
      monitoringAbsenceGap: "monitoringAbsenceGap",
      measurementPlan: "measurementPlan",
      requiredRange: 3,
      engineeringUnit: "engineeringUnit",
      dataCollectionMethod: "dataCollectionMethod",
      dataCollectionPeriod: "dataCollectionPeriod",
    });
  });

  it("E2E-PUT / Update should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const enpiId = await TestHelperEnpi.createTestEnpi(client);
    const res = await client.POST("/u/support/enpi-measurement-plan/item", {
      body: {
        enpiId,
        energyInput: 2,
        energyVariables: "energyVariables",
        idealMeasurementTools: "idealMeassurementTools",
        availableMeasurementTools: "availableMeasurementTools",
        monitoringAbsenceGap: "monitoringAbsenceGap",
        measurementPlan: "measurementPlan",
        requiredRange: 3,
        engineeringUnit: "engineeringUnit",
        dataCollectionMethod: "dataCollectionMethod",
        dataCollectionPeriod: "dataCollectionPeriod",
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBody = {
      energyInput: 3,
      energyVariables: "energyVariables2",
      idealMeasurementTools: "idealMeassurementTools2",
      availableMeasurementTools: "availableMeasurementTools2",
      monitoringAbsenceGap: "monitoringAbsenceGap2",
      measurementPlan: "measurementPlan2",
      requiredRange: 4,
      engineeringUnit: "engineeringUnit2",
      dataCollectionMethod: "dataCollectionMethod2",
      dataCollectionPeriod: "dataCollectionPeriod2",
    };
    const updateRes = await client.PUT(
      "/u/support/enpi-measurement-plan/item/{id}",
      {
        params: { path: { id: createdId } },
        body: { ...updateBody, enpiId },
      },
    );
    expect(updateRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/support/enpi-measurement-plan/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBody,
      enpi: {
        displayName: "test equipment",
        id: enpiId,
      },
    });
  });
  it("E2E-DELETE / Delete should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const enpiId = await TestHelperEnpi.createTestEnpi(client);
    const res = await client.POST("/u/support/enpi-measurement-plan/item", {
      body: {
        enpiId,
        energyInput: 3,
        energyVariables: "energyVariables2",
        idealMeasurementTools: "idealMeassurementTools2",
        availableMeasurementTools: "availableMeasurementTools2",
        monitoringAbsenceGap: "monitoringAbsenceGap2",
        measurementPlan: "measurementPlan2",
        requiredRange: 4,
        engineeringUnit: "engineeringUnit2",
        dataCollectionMethod: "dataCollectionMethod2",
        dataCollectionPeriod: "dataCollectionPeriod2",
      },
    });
    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE(
      "/u/support/enpi-measurement-plan/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(deleteRes).toBeApiOk();
  });
  it("E2E-Error/ When no record this test should be ok!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const invalidId = "00000000-0000-0000-0000-000000000000";
    const errorRes = await client.GET(
      "/u/support/enpi-measurement-plan/item/{id}",
      {
        params: { path: { id: invalidId } },
      },
    );
    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
