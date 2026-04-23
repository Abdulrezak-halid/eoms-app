import { IDtoEMetricResourceValuePeriod } from "common/build-api-schema";
import { eq } from "drizzle-orm";
import { vi } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { IContextUser } from "@m/core/interfaces/IContext";
import { ServiceDb } from "@m/core/services/ServiceDb";

import { IMetricIntegrationOutput } from "../interfaces/IMetricIntegrationOutput";
import { IOutboundIntegrationConfig } from "../interfaces/IOutboundIntegrationConfig";
import {
  IOutboundIntegrationHandler,
  IOutboundIntegrationRunResultItem,
} from "../interfaces/IOutboundIntegrationHandler";
import { TbOutboundIntegrationRunnerJob } from "../orm/TbOutboundIntegrationRunnerJob";
import * as HandlerIndex from "../outbound-integration-handlers";
import { ServiceOutboundIntegration } from "../services/ServiceOutboundIntegration";

export namespace TestHelperOutboundIntegration {
  export async function create(
    c: IContextUser,
    options?: {
      period?: IDtoEMetricResourceValuePeriod;
      metricId?: string;
      outputs?: IMetricIntegrationOutput[];
      results?: IOutboundIntegrationRunResultItem[];
      param?: unknown;
    },
  ) {
    const mockedCb = vi.fn(() => {
      return (
        options?.results || [
          {
            outputKey: "default",
            data: { value: 0, datetime: "2025-01-01T00:00:00.000Z" },
          },
          {
            outputKey: "default",
            data: { value: 10, datetime: "2025-01-01T01:00:00.000Z" },
          },
        ]
      );
    });

    vi.spyOn(HandlerIndex, "getOutboundIntegrationHandler").mockImplementation(
      () => {
        return {
          async get() {
            return await Promise.resolve(options?.param || { field: 1 });
          },
          async create() {},
          async remove() {},

          run: mockedCb,
        } satisfies IOutboundIntegrationHandler<unknown>;
      },
    );

    const config = {
      period: options?.period || "DAILY",
      type: "DUMMY",
    } as unknown as IOutboundIntegrationConfig;

    const integrationId = await ServiceOutboundIntegration.create(
      c,
      "Outbound Integration",
      config,
      options?.outputs
        ? options.outputs
        : options?.metricId
          ? [
              {
                outputKey: "default",
                metricId: options.metricId,
                unit: "ENERGY_KWH",
              },
            ]
          : [],
    );

    const [{ jobId: runnerJobId }] = await ServiceDb.get()
      .select({ jobId: TbOutboundIntegrationRunnerJob.jobId })
      .from(TbOutboundIntegrationRunnerJob)
      .where(eq(TbOutboundIntegrationRunnerJob.subjectId, integrationId));

    const contextJobRunner = UtilTest.createTestContextJob(
      c.session.orgId,
      runnerJobId,
    );

    return {
      mockedCb,
      config,
      integrationId,
      contextJobRunner,
    };
  }
}
