/**
 * @file: MqConsumerAgentReading.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 01.08.2025
 * Last Modified Date: 02.10.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";
import { eq, inArray } from "drizzle-orm";

import { UtilVersion } from "@m/base/utils/UtilVersion";
import { IContextCore } from "@m/core/interfaces/IContext";
import { errorToObject } from "@m/core/middlewares/ErrorHandler";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";

import { TbInboundIntegration } from "../orm/TbInboundIntegration";
import { TbInboundIntegrationParamAgent } from "../orm/TbInboundIntegrationParamAgent";
import { TbMetricIntegrationOutput } from "../orm/TbMetricIntegrationOutput";
import { SchemaAgentReading } from "../schemas/SchemaAgentReading";
import { SchemaVersionMajorMinor } from "../schemas/SchemaVersionMajorMinor";
import { ServiceMetric } from "../services/ServiceMetric";

const SUPPORTED_AGENT_READING_VERSION_MAJOR = 0;
const SUPPORTED_AGENT_READING_VERSION_MINOR = 1;

export async function MqConsumerAgentReading(c: IContextCore, message: Buffer) {
  let agentId: string | undefined;

  try {
    const json = JSON.parse(message.toString());

    // Early parse id field to log in case of actual parse error
    if (json && typeof json === "object" && "agentId" in json) {
      agentId = json.agentId;
    }

    const parsed = z
      .object({
        version: SchemaVersionMajorMinor,
        agentId: SchemaUuid,
        message: SchemaAgentReading,
      })
      .parse(json);

    const {
      version,
      message: { registers, datetime },
    } = parsed;

    UtilVersion.checkVersion(
      SUPPORTED_AGENT_READING_VERSION_MAJOR,
      SUPPORTED_AGENT_READING_VERSION_MINOR,
      version,
    );

    const outputs = await c.db
      .select({
        orgId: TbMetricIntegrationOutput.orgId,
        outputKey: TbMetricIntegrationOutput.outputKey,
        metricId: TbMetricIntegrationOutput.metricId,
        unit: TbMetricIntegrationOutput.unit,
        integrationId: TbInboundIntegrationParamAgent.subjectId,
      })
      .from(TbInboundIntegrationParamAgent)
      .innerJoin(
        TbMetricIntegrationOutput,
        eq(
          TbMetricIntegrationOutput.inboundIntegrationId,
          TbInboundIntegrationParamAgent.subjectId,
        ),
      )
      .where(eq(TbInboundIntegrationParamAgent.agentId, parsed.agentId));

    if (!outputs.length) {
      // Error is thrown to not acknowledge the message
      throw new Error(
        "Agent is not found or no output is found that is bound to the agent.",
      );
    }

    let savedValueCount = 0;
    for (const register of registers) {
      const filteredOutputs = outputs.filter(
        (d) => d.outputKey === register.code,
      );
      if (!filteredOutputs.length) {
        c.logger.warn(
          { agentId, registerCode: register.code },
          "Register code is not found in output list and value is skipped.",
        );
        continue;
      }

      for (const output of filteredOutputs) {
        try {
          await ServiceMetric.addValues(
            c,
            output.orgId,
            output.metricId,
            output.unit,
            [{ datetime, value: register.value }],
            [
              {
                type: "INTERNAL",
                key: "SOURCE",
                value: "INBOUND_INTEGRATION",
              },
              {
                type: "INTERNAL",
                key: "INBOUND_INTEGRATION_TYPE",
                value: "AGENT",
              },
            ],
          );

          ++savedValueCount;
        } catch (e) {
          c.logger.error(
            {
              agentId,
              registerCode: register.code,
              registerUnit: output.unit,
              error: errorToObject(e),
            },
            "Saving a value is failed.",
          );
        }
      }
    }

    if (savedValueCount > 0) {
      const uniqueIntegrationIds = [
        ...new Set(outputs.map((o) => o.integrationId)),
      ];

      // No orgId, that's why ServiceInboundIntegration.setLastRun is not used
      await c.db
        .update(TbInboundIntegration)
        .set({ lastRunAt: c.nowDatetime })
        .where(inArray(TbInboundIntegration.id, uniqueIntegrationIds));
    }

    c.logger.info(
      {
        agentId,
        savedValueCount,
        incomingRegisterCount: registers.length,
      },
      "Agent values are saved successfully.",
    );
  } catch (e) {
    c.logger.error(
      {
        agentId,
        error: errorToObject(e),
      },
      "Failed to process agent reading message.",
    );
    throw e;
  }
}
