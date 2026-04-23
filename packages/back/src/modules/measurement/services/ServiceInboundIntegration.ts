import { EApiFailCode, IUnit } from "common";
import { and, eq } from "drizzle-orm";

import { TbAgent } from "@m/agent/orm/TbAgent";
import { ApiException } from "@m/core/exceptions/ApiException";
import {
  IContextAccessToken,
  IContextOrg,
  IContextUser,
} from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";

import {
  IInboundIntegrationConfig,
  IInboundIntegrationConfigGetter,
} from "../interfaces/IInboundIntegrationConfig";
import { IInboundIntegrationType } from "../interfaces/IInboundIntegrationType";
import { TbInboundIntegration } from "../orm/TbInboundIntegration";
import { TbInboundIntegrationParamAgent } from "../orm/TbInboundIntegrationParamAgent";
import { TbMetric } from "../orm/TbMetric";
import { TbMetricIntegrationOutput } from "../orm/TbMetricIntegrationOutput";

function mapRecordToGetterObject(record: {
  id: string;
  name: string;
  type: IInboundIntegrationType;
  paramAgent: {
    id: string;
    name: string;
  } | null;
  outputs: {
    outputKey: string;
    metricId: string;
    metricName: string;
    unit: IUnit;
  }[];
  enabled: boolean;
  lastRunAt: string | null;
}) {
  const config: IInboundIntegrationConfigGetter =
    record.type === "AGENT"
      ? {
          type: record.type,
          agent: record.paramAgent!,
        }
      : {
          type: record.type,
        };

  return {
    id: record.id,
    name: record.name,
    config: config,
    outputs: record.outputs,
    enabled: record.enabled,
    lastRunAt: record.lastRunAt,
  };
}

export namespace ServiceInboundIntegration {
  export async function get(c: IContextUser | IContextAccessToken, id: string) {
    const [record] = await c.db
      .select({
        id: TbInboundIntegration.id,
        name: TbInboundIntegration.name,
        type: TbInboundIntegration.type,
        paramAgent: {
          id: TbAgent.id,
          name: TbAgent.name,
        },
        outputs: UtilDb.jsonAgg(
          {
            outputKey: TbMetricIntegrationOutput.outputKey,
            metricId: TbMetric.id,
            metricName: TbMetric.name,
            unit: TbMetricIntegrationOutput.unit,
          },
          {
            excludeNull: true,
            orderBy: TbMetric.name,
          },
        ),
        enabled: TbInboundIntegration.enabled,
        lastRunAt: TbInboundIntegration.lastRunAt,
      })
      .from(TbInboundIntegration)

      // Outputs
      .leftJoin(
        TbMetricIntegrationOutput,
        and(
          eq(TbMetricIntegrationOutput.orgId, TbInboundIntegration.orgId),
          eq(
            TbMetricIntegrationOutput.inboundIntegrationId,
            TbInboundIntegration.id,
          ),
        ),
      )
      .leftJoin(TbMetric, eq(TbMetric.id, TbMetricIntegrationOutput.metricId))

      // Agent
      .leftJoin(
        TbInboundIntegrationParamAgent,
        eq(TbInboundIntegrationParamAgent.subjectId, TbInboundIntegration.id),
      )
      .leftJoin(TbAgent, eq(TbAgent.id, TbInboundIntegrationParamAgent.agentId))

      .where(
        and(
          eq(TbInboundIntegration.id, id),
          eq(TbInboundIntegration.orgId, c.session.orgId),
        ),
      )
      .groupBy(TbInboundIntegration.id, TbAgent.id);

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return mapRecordToGetterObject(record);
  }

  export async function getAll(c: IContextUser) {
    const records = await c.db
      .select({
        id: TbInboundIntegration.id,
        name: TbInboundIntegration.name,
        type: TbInboundIntegration.type,
        paramAgent: {
          id: TbAgent.id,
          name: TbAgent.name,
        },
        outputs: UtilDb.jsonAgg(
          {
            outputKey: TbMetricIntegrationOutput.outputKey,
            metricId: TbMetric.id,
            metricName: TbMetric.name,
            unit: TbMetricIntegrationOutput.unit,
          },
          {
            excludeNull: true,
            orderBy: TbMetric.name,
          },
        ),
        enabled: TbInboundIntegration.enabled,
        lastRunAt: TbInboundIntegration.lastRunAt,
      })
      .from(TbInboundIntegration)

      // Outputs
      .leftJoin(
        TbMetricIntegrationOutput,
        and(
          eq(TbMetricIntegrationOutput.orgId, TbInboundIntegration.orgId),
          eq(
            TbMetricIntegrationOutput.inboundIntegrationId,
            TbInboundIntegration.id,
          ),
        ),
      )
      .leftJoin(TbMetric, eq(TbMetric.id, TbMetricIntegrationOutput.metricId))

      // Agent
      .leftJoin(
        TbInboundIntegrationParamAgent,
        eq(TbInboundIntegrationParamAgent.subjectId, TbInboundIntegration.id),
      )
      .leftJoin(TbAgent, eq(TbAgent.id, TbInboundIntegrationParamAgent.agentId))

      .where(eq(TbInboundIntegration.orgId, c.session.orgId))
      .groupBy(TbInboundIntegration.id, TbAgent.id)
      .orderBy(TbInboundIntegration.createdAt);

    return records.map((d) => mapRecordToGetterObject(d));
  }

  export async function create(
    c: IContextUser,
    name: string,
    config: IInboundIntegrationConfig,
    outputs: { outputKey: string; metricId: string; unit: IUnit }[],
  ) {
    return await c.db.transaction(async (tx) => {
      const [record] = await tx
        .insert(TbInboundIntegration)
        .values({
          orgId: c.session.orgId,
          createdBy: c.session.userId,
          createdAt: c.nowDatetime,
          name: name,
          type: config.type,
        })
        .returning({ id: TbInboundIntegration.id });

      // Param tables
      switch (config.type) {
        case "WEBHOOK":
          break;
        case "AGENT": {
          await tx.insert(TbInboundIntegrationParamAgent).values({
            orgId: c.session.orgId,
            subjectId: record.id,
            agentId: config.agentId,
          });
          break;
        }
      }

      // Outputs
      if (outputs.length) {
        await tx.insert(TbMetricIntegrationOutput).values(
          outputs.map((d) => ({
            orgId: c.session.orgId,
            inboundIntegrationId: record.id,
            outputKey: d.outputKey,
            metricId: d.metricId,
            unit: d.unit,
          })),
        );
      }

      return record.id;
    });
  }

  export async function update(
    c: IContextUser,
    id: string,
    name: string,
    config: IInboundIntegrationConfig,
    outputs: { outputKey: string; metricId: string; unit: IUnit }[],
  ) {
    return await c.db.transaction(async (tx) => {
      const result = await tx
        .update(TbInboundIntegration)
        .set({
          name: name,
          type: config.type,
        })
        .where(
          and(
            eq(TbInboundIntegration.id, id),
            eq(TbInboundIntegration.orgId, c.session.orgId),
          ),
        );

      if (!UtilDb.getAffectedRows(result)) {
        throw new ApiException(
          EApiFailCode.NOT_FOUND,
          "Inbound integration record is not found to update.",
        );
      }

      // Param tables
      await tx
        .delete(TbInboundIntegrationParamAgent)
        .where(
          and(
            eq(TbInboundIntegrationParamAgent.orgId, c.session.orgId),
            eq(TbInboundIntegrationParamAgent.subjectId, id),
          ),
        );

      switch (config.type) {
        case "WEBHOOK":
          break;
        case "AGENT": {
          await tx.insert(TbInboundIntegrationParamAgent).values({
            orgId: c.session.orgId,
            subjectId: id,
            agentId: config.agentId,
          });
          break;
        }
      }

      // Outputs
      await tx
        .delete(TbMetricIntegrationOutput)
        .where(
          and(
            eq(TbMetricIntegrationOutput.orgId, c.session.orgId),
            eq(TbMetricIntegrationOutput.inboundIntegrationId, id),
          ),
        );

      if (outputs.length) {
        await tx.insert(TbMetricIntegrationOutput).values(
          outputs.map((d) => ({
            orgId: c.session.orgId,
            inboundIntegrationId: id,
            outputKey: d.outputKey,
            metricId: d.metricId,
            unit: d.unit,
          })),
        );
      }
    });
  }

  export async function enable(c: IContextUser, id: string, enabled: boolean) {
    await c.db
      .update(TbInboundIntegration)
      .set({ enabled })
      .where(
        and(
          eq(TbInboundIntegration.id, id),
          eq(TbInboundIntegration.orgId, c.orgId),
        ),
      );
  }

  export async function remove(c: IContextUser, id: string) {
    return await c.db.transaction(async (tx) => {
      // Outputs
      await tx
        .delete(TbMetricIntegrationOutput)
        .where(
          and(
            eq(TbMetricIntegrationOutput.orgId, c.session.orgId),
            eq(TbMetricIntegrationOutput.inboundIntegrationId, id),
          ),
        );

      // Param tables
      await tx
        .delete(TbInboundIntegrationParamAgent)
        .where(
          and(
            eq(TbInboundIntegrationParamAgent.orgId, c.session.orgId),
            eq(TbInboundIntegrationParamAgent.subjectId, id),
          ),
        );

      const result = await tx
        .delete(TbInboundIntegration)
        .where(
          and(
            eq(TbInboundIntegration.id, id),
            eq(TbInboundIntegration.orgId, c.session.orgId),
          ),
        );

      if (!UtilDb.getAffectedRows(result)) {
        throw new ApiException(
          EApiFailCode.NOT_FOUND,
          "Inbound integration not found or already deleted.",
        );
      }
    });
  }

  export async function setLastRun(c: IContextOrg, id: string) {
    await c.db
      .update(TbInboundIntegration)
      .set({ lastRunAt: c.nowDatetime })
      .where(
        and(
          eq(TbInboundIntegration.orgId, c.orgId),
          eq(TbInboundIntegration.id, id),
        ),
      );
  }
}
