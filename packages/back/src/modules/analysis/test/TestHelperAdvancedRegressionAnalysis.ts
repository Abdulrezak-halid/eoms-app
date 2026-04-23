import { eq } from "drizzle-orm";
import { expect } from "vitest";

import { ITestClient } from "@/test/utils/UtilTest";

import { TestHelperDepartment } from "@m/base/test/TestHelperDepartment";
import { ServiceDb } from "@m/core/services/ServiceDb";
import { TestHelperMeter } from "@m/measurement/test/TestHelperMeter";
import { TestHelperMetric } from "@m/measurement/test/TestHelperMetric";

import { TbAdvancedRegressionResult } from "../orm/TbAdvancedRegressionResult";

export namespace TestHelperAdvancedRegressionAnalysis {
  export async function createAdvancedRegression(
    client: ITestClient,
    options?: { primary?: boolean; hasMain?: boolean },
  ) {
    const sessionRes = await client.GET("/g/session");
    expect(sessionRes).toBeApiOk();

    const session = sessionRes.data!.session!;

    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    if (options?.hasMain) {
      const mainMeter = await TestHelperMeter.create(client, "mainMeter", {
        departmentId: departmentId,
        isMain: true,
      });
      await TestHelperMetric.addValues(session.orgId, mainMeter.metricId, [
        { value: 0, datetime: "2024-12-01T00:00:00Z" },
        { value: 50, datetime: "2025-01-01T00:00:00Z" },
        { value: 90, datetime: "2025-02-01T00:00:00Z" },
        { value: 110, datetime: "2025-03-01T00:00:00Z" },
      ]);
    }
    const meter1 = await TestHelperMeter.create(client, "Meter1");
    const meter2 = await TestHelperMeter.create(client, "Meter2");

    const driver1 = await TestHelperMetric.create(client, "Driver1");
    const driver2 = await TestHelperMetric.create(client, "Driver2");

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });

    const seuId = seu.data!.id;

    await TestHelperMetric.addValues(session.orgId, meter1.metricId, [
      { value: 0, datetime: "2024-12-01T00:00:00Z" },
      { value: 10, datetime: "2025-01-01T00:00:00Z" },
      { value: 20, datetime: "2025-02-01T00:00:00Z" },
      { value: 30, datetime: "2025-03-01T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, meter2.metricId, [
      { value: 0, datetime: "2024-12-01T00:00:00Z" },
      { value: 20, datetime: "2025-01-01T00:00:00Z" },
      { value: 40, datetime: "2025-02-01T00:00:00Z" },
      { value: 60, datetime: "2025-03-01T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, driver1.id, [
      { value: 1, datetime: "2025-01-01T00:00:00Z" },
      { value: 1, datetime: "2025-02-01T00:00:00Z" },
      { value: 1, datetime: "2025-03-01T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, driver2.id, [
      { value: 2, datetime: "2025-01-01T00:00:00Z" },
      { value: 2, datetime: "2025-02-01T00:00:00Z" },
      { value: 2, datetime: "2025-03-01T00:00:00Z" },
    ]);

    const save = await client.POST("/u/analysis/advanced-regression/commit", {
      body: {
        seuId,
        driverIds: [driver1.id, driver2.id],
        dateTrainStart: "2025-01-01T00:00:00Z",
        dateTrainEnd: "2025-03-01T00:00:00Z",
        datePredictStart: "2025-01-01T00:00:00Z",
        datePredictEnd: "2025-03-01T00:00:00Z",
      },
    });

    expect(save).toBeApiOk();

    if (options?.primary) {
      await client.PUT("/u/analysis/advanced-regression/set-primary", {
        body: {
          id: save.data!.id,
          value: true,
        },
      });
    }

    const selectId = await ServiceDb.get()
      .select({ id: TbAdvancedRegressionResult.id })
      .from(TbAdvancedRegressionResult)
      .where(eq(TbAdvancedRegressionResult.orgId, session.orgId));

    const resultId = selectId[0]?.id;

    if (!resultId) {
      throw new Error("Failed to create advanced regression result");
    }

    return { id: resultId, driver1 };
  }
}
