import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterCopMeasurementPlan", () => {
  it("POST /u/support/cop-measurement-plan should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/support/cop-measurement-plan/item", {
      body: {
        energyVariables: "Test Support/CopMeasurementPlan -> Energy Variable",
        optimalMeasurementTools:
          "Test Support/CopMeasurementPlan -> Optimal Measurement Tool",
        availableMeasurementTools:
          "Test Support/CopMeasurementPlan -> Available Measurement Tool",
        monitoringAbsenceGap:
          "Test Support/CopMeasurementPlan -> Monitoring Absence Gap",
        measurementPlan: "Test Support/CopMeasurementPlan -> Measurement Plan",
      },
    });
    expect(res).toBeApiOk();
  });

  it("PUT /u/support/cop-measurement-plan/:id should update the calibration plan", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/support/cop-measurement-plan/item", {
      body: {
        energyVariables: "Test Support/CopMeasurementPlan -> Energy Variable",
        optimalMeasurementTools:
          "Test Support/CopMeasurementPlan -> Optimal Measurement Tool",
        availableMeasurementTools:
          "Test Support/CopMeasurementPlan -> Available Measurement Tool",
        monitoringAbsenceGap:
          "Test Support/CopMeasurementPlan -> Monitoring Absence Gap",
        measurementPlan: "Test Support/CopMeasurementPlan -> Measurement Plan",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBody = {
      energyVariables: "Test Support/CopMeasurementPlan -> Energy Variable 2",
      optimalMeasurementTools:
        "Test Support/CopMeasurementPlan -> Optimal Measurement Tool 2",
      availableMeasurementTools:
        "Test Support/CopMeasurementPlan -> Available Measurement Tool 2",
      monitoringAbsenceGap:
        "Test Support/CopMeasurementPlan -> Monitoring Absence Gap 2",
      measurementPlan: "Test Support/CopMeasurementPlan -> Measurement Plan 2",
    };

    const updateRes = await client.PUT(
      "/u/support/cop-measurement-plan/item/{id}",
      {
        params: { path: { id: createdId } },
        body: { ...updateBody },
      },
    );

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/support/cop-measurement-plan/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBody,
    });
  });
  it("GET /u/support/cop-measurement-plan", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const payload = {
      energyVariables: "Test Support/CopMeasurementPlan -> Energy Variable",
      optimalMeasurementTools:
        "Test Support/CopMeasurementPlan -> Optimal Measurement Tool",
      availableMeasurementTools:
        "Test Support/CopMeasurementPlan -> Available Measurement Tool",
      monitoringAbsenceGap:
        "Test Support/CopMeasurementPlan -> Monitoring Absence Gap",
      measurementPlan: "Test Support/CopMeasurementPlan -> Measurement Plan",
    };
    const createResponse = await client.POST(
      "/u/support/cop-measurement-plan/item",
      {
        body: { ...payload },
      },
    );
    const createdId = createResponse.data!.id;
    const res = await client.GET("/u/support/cop-measurement-plan/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload,
        },
      ],
    });
  });

  it("GET /u/support/cop-measurement-plan/:id should get the calibration plan", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const payload = {
      energyVariables: "Test Support/CopMeasurementPlan -> Energy Variable",
      optimalMeasurementTools:
        "Test Support/CopMeasurementPlan -> Optimal Measurement Tool",
      availableMeasurementTools:
        "Test Support/CopMeasurementPlan -> Available Measurement Tool",
      monitoringAbsenceGap:
        "Test Support/CopMeasurementPlan -> Monitoring Absence Gap",
      measurementPlan: "Test Support/CopMeasurementPlan -> Measurement Plan",
    };

    const createResponse = await client.POST(
      "/u/support/cop-measurement-plan/item",
      {
        body: { ...payload },
      },
    );

    expect(createResponse).toBeApiOk();
    const createdId = createResponse.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET(
      "/u/support/cop-measurement-plan/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...payload,
    });
  });
  it("DELETE /u/support/cop-measurement-plan/:id should delete the calibration plan", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/support/cop-measurement-plan/item", {
      body: {
        energyVariables: "Test Support/CopMeasurementPlan -> Energy Variable",
        optimalMeasurementTools:
          "Test Support/CopMeasurementPlan -> Optimal Measurement Tool",
        availableMeasurementTools:
          "Test Support/CopMeasurementPlan -> Available Measurement Tool",
        monitoringAbsenceGap:
          "Test Support/CopMeasurementPlan -> Monitoring Absence Gap",
        measurementPlan: "Test Support/CopMeasurementPlan -> Measurement Plan",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE(
      "/u/support/cop-measurement-plan/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/support/cop-measurement-plan/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
