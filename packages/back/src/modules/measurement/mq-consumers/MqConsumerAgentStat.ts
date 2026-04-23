import { z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";

import { TbAgent } from "@m/agent/orm/TbAgent";
import { UtilVersion } from "@m/base/utils/UtilVersion";
import { IContextCore } from "@m/core/interfaces/IContext";
import { errorToObject } from "@m/core/middlewares/ErrorHandler";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilDb } from "@m/core/utils/UtilDb";

import { SchemaAgentStat } from "../schemas/SchemaAgentStat";
import { SchemaEAgentStatType } from "../schemas/SchemaEAgentStatType";
import { SchemaVersionMajorMinor } from "../schemas/SchemaVersionMajorMinor";

const SUPPORTED_AGENT_STAT_VERSION_MAJOR = 0;
const SUPPORTED_AGENT_STAT_VERSION_MINOR = 1;

export async function MqConsumerAgentStat(c: IContextCore, message: Buffer) {
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
        message: z.object({
          type: SchemaEAgentStatType,
          stats: SchemaAgentStat,
        }),
      })
      .parse(json);

    const {
      version,
      message: { type, stats },
    } = parsed;

    UtilVersion.checkVersion(
      SUPPORTED_AGENT_STAT_VERSION_MAJOR,
      SUPPORTED_AGENT_STAT_VERSION_MINOR,
      version,
    );

    const result = await c.db
      .update(TbAgent)
      .set({ statType: type, stats, datetimeStat: c.nowDatetime })
      .where(eq(TbAgent.id, parsed.agentId));

    if (!UtilDb.getAffectedRows(result)) {
      // No need to throw error, agent stats messages are temporary
      c.logger.warn(
        {
          agentId,
          statType: type,
        },
        "Agent is not found to save stats.",
      );
      return;
    }

    c.logger.info(
      {
        agentId,
        statType: type,
      },
      "Agent stats are saved successfully.",
    );
  } catch (e) {
    c.logger.error(
      {
        agentId,
        error: errorToObject(e),
      },
      "Failed to save agent stats.",
    );
    throw e;
  }
}
