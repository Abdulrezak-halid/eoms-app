import { IDtoEEnergyResource } from "common/build-api-schema";
import { expect } from "vitest";

import { ITestClient } from "@/test/utils/UtilTest";

import { TestHelperDepartment } from "@m/base/test/TestHelperDepartment";

import { TestHelperMetric } from "./TestHelperMetric";

export namespace TestHelperMeter {
  export async function create(
    client: ITestClient,
    name: string,
    options?: {
      energyResource?: IDtoEEnergyResource;
      sliceName?: string;
      metricId?: string;
      departmentId?: string;
      isMain?: boolean;
    },
  ) {
    let departmentId = options?.departmentId;
    if (!departmentId) {
      departmentId = await TestHelperDepartment.create(
        client,
        `Department:${name}`,
      );
    }

    let metricId = options?.metricId;
    if (!metricId) {
      const metric = await TestHelperMetric.create(client, `Metric:${name}`, {
        unitGroup: "ENERGY",
        type: "COUNTER",
      });
      metricId = metric.id;
    }

    const meter = await client.POST("/u/measurement/meter/item", {
      body: {
        name,
        metricId,
        energyResource: options?.energyResource || "ELECTRIC",
        departmentId,
        energyConversionRate: 1,
        isMain: options?.isMain || false,
      },
    });

    expect(meter).toBeApiOk();

    return { ...meter.data!, metricId, departmentId };
  }

  export async function createMainMetersWithValues(
    client: ITestClient,
    orgId: string,
  ) {
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    /** MAIN METERS */

    const electricMain1 = await TestHelperMeter.create(
      client,
      "Main-Electric-1",
      {
        departmentId,
        isMain: true,
        energyResource: "ELECTRIC",
      },
    );

    const electricMain2 = await TestHelperMeter.create(
      client,
      "Main-Electric-2",
      {
        departmentId,
        isMain: true,
        energyResource: "ELECTRIC",
      },
    );

    const gasMain = await TestHelperMeter.create(client, "Main-Gas", {
      departmentId,
      isMain: true,
      energyResource: "GAS",
    });

    const waterMain = await TestHelperMeter.create(client, "Main-Water", {
      departmentId,
      isMain: true,
      energyResource: "WATER",
    });

    /** VALUES */

    /** ELECTRIC MAIN 1 */

    await TestHelperMetric.addValues(orgId, electricMain1.metricId, [
      {
        value: 10,
        datetime: "2025-01-01T00:00:00Z",
      },
      {
        value: 20,
        datetime: "2025-02-01T00:00:00Z",
      },

      {
        value: 45,
        datetime: "2025-03-01T00:00:00Z",
      },
    ]);

    /** ELECTRIC MAIN 2 */

    await TestHelperMetric.addValues(orgId, electricMain2.metricId, [
      {
        value: 10,
        datetime: "2025-01-01T00:00:00Z",
      },
      {
        value: 20,
        datetime: "2025-02-01T00:00:00Z",
      },
      {
        value: 30,
        datetime: "2025-03-01T00:00:00Z",
      },
    ]);

    /** GAS MAIN */

    await TestHelperMetric.addValues(orgId, gasMain.metricId, [
      {
        value: 10,
        datetime: "2025-01-01T00:00:00Z",
      },
      {
        value: 30,
        datetime: "2025-02-01T00:00:00Z",
      },
      {
        value: 60,
        datetime: "2025-03-01T00:00:00Z",
      },
    ]);

    /** WATER MAIN */

    await TestHelperMetric.addValues(orgId, waterMain.metricId, [
      {
        value: 10,
        datetime: "2025-01-01T00:00:00Z",
      },
      {
        value: 20,
        datetime: "2025-02-01T00:00:00Z",
      },
      {
        value: 30,
        datetime: "2025-03-01T00:00:00Z",
      },
    ]);

    return {
      departmentId,
      electricMain1,
      electricMain2,
      gasMain,
      waterMain,
    };
  }
}
