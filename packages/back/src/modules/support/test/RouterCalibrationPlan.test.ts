import { EApiFailCode, UtilDate } from "common";
import { EXAMPLE_USER_NAME } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterCalibrationPlan", () => {
  it("POST /u/support/calibration-plan should be ok", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/support/calibration-plan/item", {
      body: {
        deviceType: "Test Support/CalibrationPlan -> Device Type",
        deviceNo: "Test Support/CalibrationPlan -> Device No",
        brand: "Test Support/CalibrationPlan -> Brand",
        location: "Test Support/CalibrationPlan -> Location",
        calibration: "Test Support/CalibrationPlan -> Calibration",
        calibrationNo: "Test Support/CalibrationPlan -> Calibration No",
        responsibleUserId: session.userId,
        dueTo: UtilDate.getNowUtcIsoDate(),
        nextDate: UtilDate.getNowUtcIsoDate(),
        evaluationResult: "Test Support/CalibrationPlan -> Evaluation Result",
      },
    });
    expect(res).toBeApiOk();
  });

  it("PUT /u/support/calibration-plan/:id should update the calibration plan", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/support/calibration-plan/item", {
      body: {
        deviceType: "Test Support/CalibrationPlan -> Device Type",
        deviceNo: "Test Support/CalibrationPlan -> Device No",
        brand: "Test Support/CalibrationPlan -> Brand",
        location: "Test Support/CalibrationPlan -> Location",
        calibration: "Test Support/CalibrationPlan -> Calibration",
        calibrationNo: "Test Support/CalibrationPlan -> Calibration No",
        responsibleUserId: session.userId,
        dueTo: UtilDate.getNowUtcIsoDate(),
        nextDate: UtilDate.getNowUtcIsoDate(),
        evaluationResult: "Test Support/CalibrationPlan -> Evaluation Result",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBody = {
      deviceType: "Updated Device Type",
      deviceNo: "Updated Device No",
      brand: "Updated Brand",
      location: "Updated Location",
      calibration: "Updated Calibration",
      calibrationNo: "Updated Calibration No",
      dueTo: UtilDate.getNowUtcIsoDate(),
      nextDate: UtilDate.getNowUtcIsoDate(),
      evaluationResult: "Updated Evaluation Result",
    };

    const updateRes = await client.PUT(
      "/u/support/calibration-plan/item/{id}",
      {
        params: { path: { id: createdId } },
        body: { ...updateBody, responsibleUserId: session.userId },
      },
    );

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/support/calibration-plan/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBody,
      responsibleUser: {
        id: session.userId,
        displayName: session.userDisplayName,
      },
    });
  });
  it("GET /u/support/calibration-plan", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const payload = {
      deviceType: "Test Support/CalibrationPlan -> Device Type",
      deviceNo: "Test Support/CalibrationPlan -> Device No",
      brand: "Test Support/CalibrationPlan -> Brand",
      location: "Test Support/CalibrationPlan -> Location",
      calibration: "Test Support/CalibrationPlan -> Calibration",
      calibrationNo: "Test Support/CalibrationPlan -> Calibration No",
      dueTo: UtilDate.getNowUtcIsoDate(),
      nextDate: UtilDate.getNowUtcIsoDate(),
      evaluationResult: "Test Support/CalibrationPlan -> Evaluation Result",
    };
    const createResponse = await client.POST(
      "/u/support/calibration-plan/item",
      {
        body: { ...payload, responsibleUserId: session.userId },
      },
    );
    const createdId = createResponse.data!.id;
    const res = await client.GET("/u/support/calibration-plan/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload,
          responsibleUser: {
            displayName: EXAMPLE_USER_NAME,
            id: session.userId,
          },
        },
      ],
    });
  });

  it("GET /u/support/calibration-plan/:id should get the calibration plan", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const payload = {
      deviceType: "Test Support/CalibrationPlan -> Device Type",
      deviceNo: "Test Support/CalibrationPlan -> Device No",
      brand: "Test Support/CalibrationPlan -> Brand",
      location: "Test Support/CalibrationPlan -> Location",
      calibration: "Test Support/CalibrationPlan -> Calibration",
      calibrationNo: "Test Support/CalibrationPlan -> Calibration No",
      dueTo: UtilDate.getNowUtcIsoDate(),
      nextDate: UtilDate.getNowUtcIsoDate(),
      evaluationResult: "Test Support/CalibrationPlan -> Evaluation Result",
    };
    const createResponse = await client.POST(
      "/u/support/calibration-plan/item",
      {
        body: { ...payload, responsibleUserId: session.userId },
      },
    );

    expect(createResponse).toBeApiOk();
    const createdId = createResponse.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET("/u/support/calibration-plan/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...payload,
      responsibleUser: {
        id: session.userId,
        displayName: EXAMPLE_USER_NAME,
      },
    });
  });
  it("DELETE /u/support/calibration-plan/:id should delete the calibration plan", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/support/calibration-plan/item", {
      body: {
        deviceType: "Test Support/CalibrationPlan -> Device Type",
        deviceNo: "Test Support/CalibrationPlan -> Device No",
        brand: "Test Support/CalibrationPlan -> Brand",
        location: "Test Support/CalibrationPlan -> Location",
        calibration: "Test Support/CalibrationPlan -> Calibration",
        calibrationNo: "Test Support/CalibrationPlan -> Calibration No",
        responsibleUserId: session.userId,
        dueTo: UtilDate.getNowUtcIsoDate(),
        nextDate: UtilDate.getNowUtcIsoDate(),
        evaluationResult: "Test Support/CalibrationPlan -> Evaluation Result",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE(
      "/u/support/calibration-plan/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET("/u/support/calibration-plan/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
