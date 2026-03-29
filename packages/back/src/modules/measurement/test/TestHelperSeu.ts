import { expect } from "vitest";

import { ITestClient } from "@/test/utils/UtilTest";

import { TestHelperDepartment } from "@m/base/test/TestHelperDepartment";

import { TestHelperMeter } from "./TestHelperMeter";
import { TestHelperMetric } from "./TestHelperMetric";

export namespace TestHelperSeu {
  export async function createTestSeu(
    client: ITestClient,
    name: string,
    options?: {
      meterName?: string;
      metricId?: string;
    },
  ) {
    const dept1Id = await TestHelperDepartment.create(
      client,
      `${name} - Department`,
    );

    const meter = await TestHelperMeter.create(
      client,
      options?.meterName || `${name} - Meter`,
      { metricId: options?.metricId },
    );

    expect(meter).toBeApiOk();

    const resSeuCreate = await client.POST("/u/measurement/seu/item", {
      body: {
        name,
        departmentIds: [dept1Id],
        meterSliceIds: [meter.sliceId],
        energyResource: "ELECTRIC",
      },
    });

    expect(resSeuCreate).toBeApiOk();

    const oldestDate = new Date();
    oldestDate.setTime(0);
    const resSeuGet = await client.GET("/u/measurement/seu/item/{id}", {
      params: {
        path: { id: resSeuCreate.data!.id },
        query: TestHelperMetric.getFullDatetimeRangeQuery(),
      },
    });

    expect(resSeuGet).toBeApiOk();

    return { ...resSeuGet.data!, metricId: meter.metricId, meterId: meter.id };
  }

  export async function createSeuWithValues(
    client: ITestClient,
    options?: { name?: string; hasMain?: boolean },
  ) {
    const sessionRes = await client.GET("/g/session");
    expect(sessionRes).toBeApiOk();

    const session = sessionRes.data!.session!;

    const departmentId = await TestHelperDepartment.create(
      client,
      options?.name ? `${options.name}:department` : "Test Department",
    );

    let mainMeterResourceId: string | undefined;

    if (options?.hasMain) {
      const mainMeter = await TestHelperMeter.create(client, "Main Meter", {
        departmentId: departmentId,
        isMain: true,
      });

      mainMeterResourceId = await TestHelperMetric.addValues(
        session.orgId,
        mainMeter.metricId,
        [
          { value: 0, datetime: "2024-12-01T00:00:00Z" },
          { value: 30, datetime: "2025-01-01T00:00:00Z" },
          { value: 50, datetime: "2025-02-01T00:00:00Z" },
          { value: 100, datetime: "2025-03-01T00:00:00Z" },
        ],
      );
    }

    const meter1 = await TestHelperMeter.create(
      client,
      options?.name ? `${options.name}:meter1` : "Meter1",
    );
    const meter2 = await TestHelperMeter.create(
      client,
      options?.name ? `${options.name}:meter2` : "Meter2",
    );

    const driver1 = await TestHelperMetric.create(
      client,
      options?.name ? `${options.name}:driver1` : "Driver1",
    );
    const driver2 = await TestHelperMetric.create(
      client,
      options?.name ? `${options.name}:driver2` : "Driver2",
    );

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: options?.name || "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });

    const seuId = seu.data!.id;

    const meter1ResourceId = await TestHelperMetric.addValues(
      session.orgId,
      meter1.metricId,
      [
        { value: 0, datetime: "2024-12-01T00:00:00Z" },
        { value: 10, datetime: "2025-01-01T00:00:00Z" },
        { value: 20, datetime: "2025-02-01T00:00:00Z" },
        { value: 30, datetime: "2025-03-01T00:00:00Z" },
      ],
    );

    const meter2ResourceId = await TestHelperMetric.addValues(
      session.orgId,
      meter2.metricId,
      [
        { value: 0, datetime: "2024-12-01T00:00:00Z" },
        { value: 20, datetime: "2025-01-01T00:00:00Z" },
        { value: 40, datetime: "2025-02-01T00:00:00Z" },
        { value: 60, datetime: "2025-03-01T00:00:00Z" },
      ],
    );

    const driver1ResourceId = await TestHelperMetric.addValues(
      session.orgId,
      driver1.id,
      [
        { value: 1, datetime: "2025-01-01T00:00:00Z" },
        { value: 1, datetime: "2025-02-01T00:00:00Z" },
        { value: 1, datetime: "2025-03-01T00:00:00Z" },
      ],
    );

    const driver2ResourceId = await TestHelperMetric.addValues(
      session.orgId,
      driver2.id,
      [
        { value: 2, datetime: "2025-01-01T00:00:00Z" },
        { value: 2, datetime: "2025-02-01T00:00:00Z" },
        { value: 2, datetime: "2025-03-01T00:00:00Z" },
      ],
    );

    return {
      id: seuId,
      driverId1: driver1.id,
      driverId2: driver2.id,
      mainMeterResourceId,
      meter1ResourceId,
      meter2ResourceId,
      driver1ResourceId,
      driver2ResourceId,
    };
  }
}
