import { IUnitGroup, UtilDate } from "common";
import { expect } from "vitest";

import { ITestClient, UtilTest } from "@/test/utils/UtilTest";

import { ServiceDb } from "@m/core/services/ServiceDb";

import { IMetricResourceLabel } from "../interfaces/IMetricResourceLabel";
import { IMetricType } from "../interfaces/IMetricType";
import { TbMetricResourceValueRaw } from "../orm/TbMetricResourceValueRaw";
import { ServiceMetric } from "../services/ServiceMetric";

export namespace TestHelperMetric {
  export async function create(
    client: ITestClient,
    name: string,
    options?: {
      unitGroup?: IUnitGroup;
      type?: IMetricType;
    },
  ) {
    const metric1 = await client.POST("/u/measurement/metric/item", {
      body: {
        name: name,
        description: "Metric Description",
        unitGroup: options?.unitGroup || "TEMPERATURE",
        type: options?.type || "GAUGE",
      },
    });
    expect(metric1).toBeApiOk();

    return metric1.data!;
  }

  export function getTestResourceLabels(): IMetricResourceLabel[] {
    return [
      {
        type: "USER_DEFINED",
        key: "SOURCE",
        value: "TEST",
      },
    ];
  }

  export async function findTestResource(orgId: string, metricId: string) {
    const context = UtilTest.createTestContext();
    return await ServiceMetric.findOrCreateResource(
      context,
      orgId,
      metricId,
      getTestResourceLabels(),
    );
  }

  export async function addValues(
    orgId: string,
    metricId: string,
    values: {
      value: number;
      datetime: string;
    }[],
  ) {
    const context = UtilTest.createTestContext();
    const resourceId = await findTestResource(orgId, metricId);
    const type = await ServiceMetric.getType({ ...context, orgId }, metricId);
    await ServiceDb.get()
      .insert(TbMetricResourceValueRaw)
      .values(
        values.map((v) => ({
          orgId,
          type:
            type === "GAUGE"
              ? ("GAUGE" as const)
              : ("COUNTER_CUMULATIVE" as const),
          resourceId,
          value: v.value,
          datetime: v.datetime,
        })),
      );

    return resourceId;
  }

  export function getFullDatetimeRangeQuery() {
    const oldestDate = new Date();
    oldestDate.setTime(0);
    return {
      datetimeMin: UtilDate.objToIsoDatetime(oldestDate),
      datetimeMax: UtilDate.objToIsoDatetime(new Date()),
    };
  }
}
