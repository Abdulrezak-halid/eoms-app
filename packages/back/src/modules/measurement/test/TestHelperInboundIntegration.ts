import { IUnit } from "common";
import { expect } from "vitest";

import { ITestClient } from "@/test/utils/UtilTest";

import { IInboundIntegrationConfig } from "../interfaces/IInboundIntegrationConfig";

export namespace TestHelperInboundIntegration {
  export async function create(
    client: ITestClient,
    config: IInboundIntegrationConfig,
    defaultOutputMetricId: string,
    unit: IUnit = "ENERGY_KWH",
  ) {
    const res = await client.POST("/u/measurement/inbound-integration/item", {
      body: {
        name: "Test Integration",
        config,
        outputs: [
          {
            outputKey: "default",
            metricId: defaultOutputMetricId,
            unit,
          },
        ],
      },
    });
    expect(res).toBeApiOk();

    return { id: res.data!.id };
  }
}
