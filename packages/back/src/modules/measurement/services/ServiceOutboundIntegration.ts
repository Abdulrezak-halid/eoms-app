/**
 * @file: ServiceOutboundIntegration.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 02.03.2025
 * Last Modified Date: 09.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { EApiFailCode } from "common";
import { and, eq, isNull, ne, or } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import {
  IContextCore,
  IContextOrg,
  IContextUser,
} from "@m/core/interfaces/IContext";
import { ITimedValue } from "@m/core/interfaces/ITimedValue";
import { errorToObject } from "@m/core/middlewares/ErrorHandler";
import { ServiceJob } from "@m/core/services/ServiceJob";
import { ServiceNotification } from "@m/core/services/ServiceNotification";
import { UtilDb } from "@m/core/utils/UtilDb";

import { IMetricIntegrationOutput } from "../interfaces/IMetricIntegrationOutput";
import { IOutboundIntegrationConfig } from "../interfaces/IOutboundIntegrationConfig";
import { IOutboundIntegrationRunResultItem } from "../interfaces/IOutboundIntegrationHandler";
import { IOutboundIntegrationType } from "../interfaces/IOutboundIntegrationType";
import { TbMetric } from "../orm/TbMetric";
import { TbMetricIntegrationOutput } from "../orm/TbMetricIntegrationOutput";
import { TbOutboundIntegration } from "../orm/TbOutboundIntegration";
import { TbOutboundIntegrationRunnerJob } from "../orm/TbOutboundIntegrationRunnerJob";
import { getOutboundIntegrationHandler } from "../outbound-integration-handlers";
import { UtilMetricResourceValuePeriod } from "../utils/UtilMetricResourceValuePeriod";
import { ServiceMetric } from "./ServiceMetric";

export namespace ServiceOutboundIntegration {
  export async function getConfigCore(
    c: IContextCore,
    orgId: string,
    id: string,
  ): Promise<IOutboundIntegrationConfig> {
    const [record] = await c.db
      .select({
        period: TbOutboundIntegration.period,
        type: TbOutboundIntegration.type,
      })
      .from(TbOutboundIntegration)
      .where(
        and(
          eq(TbOutboundIntegration.id, id),
          eq(TbOutboundIntegration.orgId, orgId),
        ),
      );

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return {
      ...record,
      param: await getOutboundIntegrationHandler(record.type).get(c, orgId, id),
    } as IOutboundIntegrationConfig;
  }

  export async function getConfig(
    c: IContextUser,
    id: string,
  ): Promise<IOutboundIntegrationConfig> {
    return getConfigCore(c, c.session.orgId, id);
  }

  export async function getAll(c: IContextOrg) {
    const records = await c.db
      .select({
        id: TbOutboundIntegration.id,
        name: TbOutboundIntegration.name,
        config: {
          period: TbOutboundIntegration.period,
          type: TbOutboundIntegration.type,
        },
        outputs: UtilDb.jsonAgg(
          {
            outputKey: TbMetricIntegrationOutput.outputKey,
            isHealthy: TbMetricIntegrationOutput.isHealthy,
            metricId: TbMetric.id,
            metricName: TbMetric.name,
            unit: TbMetricIntegrationOutput.unit,
          },
          {
            excludeNull: true,
            orderBy: TbMetric.name,
          },
        ),
        enabled: TbOutboundIntegration.enabled,
        lastRunAt: UtilDb.isoDatetime(TbOutboundIntegration.lastRunAt),
      })
      .from(TbOutboundIntegration)
      .leftJoin(
        TbMetricIntegrationOutput,
        and(
          eq(TbMetricIntegrationOutput.orgId, TbOutboundIntegration.orgId),
          eq(
            TbMetricIntegrationOutput.outboundIntegrationId,
            TbOutboundIntegration.id,
          ),
        ),
      )
      .leftJoin(TbMetric, eq(TbMetric.id, TbMetricIntegrationOutput.metricId))
      .where(eq(TbOutboundIntegration.orgId, c.orgId))
      .groupBy(TbOutboundIntegration.id)
      .orderBy(TbOutboundIntegration.createdAt);

    return await Promise.all(
      records.map(async (record) => ({
        ...record,
        config: {
          ...record.config,
          param: await getOutboundIntegrationHandler(record.config.type).get(
            c,
            c.orgId,
            record.id,
          ),
        } as IOutboundIntegrationConfig,
      })),
    );
  }

  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbOutboundIntegration.id,
        name: TbOutboundIntegration.name,
        config: {
          period: TbOutboundIntegration.period,
          type: TbOutboundIntegration.type,
        },
        outputs: UtilDb.jsonAgg(
          {
            outputKey: TbMetricIntegrationOutput.outputKey,
            isHealthy: TbMetricIntegrationOutput.isHealthy,
            metricId: TbMetric.id,
            metricName: TbMetric.name,
            unit: TbMetricIntegrationOutput.unit,
          },
          {
            excludeNull: true,
            orderBy: TbMetric.name,
          },
        ),
        enabled: TbOutboundIntegration.enabled,
        lastRunAt: UtilDb.isoDatetime(TbOutboundIntegration.lastRunAt),
      })
      .from(TbOutboundIntegration)
      .leftJoin(
        TbMetricIntegrationOutput,
        and(
          eq(TbMetricIntegrationOutput.orgId, TbOutboundIntegration.orgId),
          eq(
            TbMetricIntegrationOutput.outboundIntegrationId,
            TbOutboundIntegration.id,
          ),
        ),
      )
      .leftJoin(TbMetric, eq(TbMetric.id, TbMetricIntegrationOutput.metricId))
      .where(
        and(
          eq(TbOutboundIntegration.id, id),
          eq(TbOutboundIntegration.orgId, c.session.orgId),
        ),
      )
      .groupBy(TbOutboundIntegration.id);

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return {
      ...record,
      config: {
        ...record.config,
        param: await getOutboundIntegrationHandler(record.config.type).get(
          c,
          c.session.orgId,
          id,
        ),
      } as IOutboundIntegrationConfig,
    };
  }

  export async function create(
    c: IContextUser,
    name: string,
    config: IOutboundIntegrationConfig,
    outputs: IMetricIntegrationOutput[],
  ) {
    return await c.db.transaction(async (tx) => {
      const cTx = { ...c, db: tx };

      await ServiceMetric.checkUnits(
        cTx,
        outputs.map((d) => ({
          id: d.metricId,
          unit: d.unit,
        })),
      );

      // Create integration record
      const [{ id }] = await tx
        .insert(TbOutboundIntegration)
        .values({
          orgId: c.session.orgId,
          createdBy: c.session.userId,
          createdAt: c.nowDatetime,
          name,
          type: config.type,
          period: config.period,
        })
        .returning({ id: TbOutboundIntegration.id });

      // Create integration detail record
      await getOutboundIntegrationHandler(config.type).create(
        cTx,
        c.session.orgId,
        id,
        config.param,
      );

      // Save outputs
      if (outputs.length) {
        await tx.insert(TbMetricIntegrationOutput).values(
          outputs.map((d) => ({
            orgId: c.session.orgId,
            outboundIntegrationId: id,
            outputKey: d.outputKey,
            metricId: d.metricId,
            unit: d.unit,
          })),
        );
      }

      // Schedule runner job
      await createJobs({ ...c, db: tx }, id);

      return id;
    });
  }

  export async function update(
    c: IContextUser,
    id: string,
    name: string,
    config: IOutboundIntegrationConfig,
    outputs: IMetricIntegrationOutput[],
  ) {
    await c.db.transaction(async (tx) => {
      const cTx = { ...c, db: tx };

      await ServiceMetric.checkUnits(
        cTx,
        outputs.map((d) => ({
          id: d.metricId,
          unit: d.unit,
        })),
      );

      // Update integration record
      await tx
        .update(TbOutboundIntegration)
        .set({
          name,
          type: config.type,
          period: config.period,
        })
        .where(
          and(
            eq(TbOutboundIntegration.orgId, c.session.orgId),
            eq(TbOutboundIntegration.id, id),
          ),
        );

      // Update integration detail record
      await getOutboundIntegrationHandler(config.type).remove(
        cTx,
        c.session.orgId,
        id,
      );
      await getOutboundIntegrationHandler(config.type).create(
        cTx,
        c.session.orgId,
        id,
        config.param,
      );

      // Update outputs
      await tx
        .delete(TbMetricIntegrationOutput)
        .where(
          and(
            eq(TbMetricIntegrationOutput.orgId, c.session.orgId),
            eq(TbMetricIntegrationOutput.outboundIntegrationId, id),
          ),
        );
      if (outputs.length) {
        await tx.insert(TbMetricIntegrationOutput).values(
          outputs.map((d) => ({
            orgId: c.session.orgId,
            outboundIntegrationId: id,
            outputKey: d.outputKey,
            metricId: d.metricId,
            unit: d.unit,
          })),
        );
      }
    });

    // Job operations are at the end of transaction on purpose.
    //   Job system does follow transaction,
    //   so if transaction is aborted above,
    //   job operations are not rollbacked.
    // ---------------------------------------------------------------------
    // Remove old runner job
    const [oldRunnerJobRecord] = await c.db
      .delete(TbOutboundIntegrationRunnerJob)
      .where(
        and(
          eq(TbOutboundIntegrationRunnerJob.orgId, c.session.orgId),
          eq(TbOutboundIntegrationRunnerJob.subjectId, id),
        ),
      )
      .returning({
        jobId: TbOutboundIntegrationRunnerJob.jobId,
      });
    if (oldRunnerJobRecord) {
      await ServiceJob.remove(c, oldRunnerJobRecord.jobId);
    }

    // Create new runner job
    const runnerJobResult = await ServiceJob.schedule(c, c.session.orgId, {
      name: "METRIC_OUTBOUND_INTEGRATION_RUNNER",
      type: "CRON",
      rule: UtilMetricResourceValuePeriod.getCronExpression(config.period),
    });
    await c.db.insert(TbOutboundIntegrationRunnerJob).values({
      orgId: c.session.orgId,
      subjectId: id,
      jobId: runnerJobResult.id,
    });
  }

  export async function enable(c: IContextUser, id: string, enabled: boolean) {
    await c.db.transaction(async (tx) => {
      await tx
        .update(TbOutboundIntegration)
        .set({ enabled })
        .where(
          and(
            eq(TbOutboundIntegration.id, id),
            eq(TbOutboundIntegration.orgId, c.orgId),
          ),
        );

      if (enabled === false) {
        await clearJobs({ ...c, db: tx }, id);
      } else {
        await createJobs({ ...c, db: tx }, id);
      }
    });
  }

  export async function clearJobs(c: IContextUser, id: string) {
    const deletedRunnerJobs = await c.db
      .delete(TbOutboundIntegrationRunnerJob)
      .where(
        and(
          eq(TbOutboundIntegrationRunnerJob.subjectId, id),
          eq(TbOutboundIntegrationRunnerJob.orgId, c.session.orgId),
        ),
      )
      .returning({ jobId: TbOutboundIntegrationRunnerJob.jobId });

    for (const record of deletedRunnerJobs) {
      await ServiceJob.remove(c, record.jobId);
    }
  }

  export async function createJobs(c: IContextUser, id: string) {
    const config = await getConfig(c, id);

    const runnerJobResult = await ServiceJob.schedule(c, c.session.orgId, {
      name: "METRIC_OUTBOUND_INTEGRATION_RUNNER",
      type: "CRON",
      rule: UtilMetricResourceValuePeriod.getCronExpression(config.period),
    });

    await c.db.insert(TbOutboundIntegrationRunnerJob).values({
      orgId: c.session.orgId,
      subjectId: id,
      jobId: runnerJobResult.id,
    });
  }

  export async function getOutputs(
    c: IContextCore,
    orgId: string,
    id: string,
  ): Promise<IMetricIntegrationOutput[]> {
    return await c.db
      .select({
        outputKey: TbMetricIntegrationOutput.outputKey,
        isHealthy: TbMetricIntegrationOutput.isHealthy,
        metricId: TbMetricIntegrationOutput.metricId,
        unit: TbMetricIntegrationOutput.unit,
      })
      .from(TbMetricIntegrationOutput)
      .where(
        and(
          eq(TbMetricIntegrationOutput.orgId, orgId),
          eq(TbMetricIntegrationOutput.outboundIntegrationId, id),
        ),
      );
  }

  export async function getOutputsWithMetricName(c: IContextUser, id: string) {
    return await c.db
      .select({
        outputKey: TbMetricIntegrationOutput.outputKey,
        metricId: TbMetricIntegrationOutput.metricId,
        metricName: TbMetric.name,
        isHealthy: TbMetricIntegrationOutput.isHealthy,
        unit: TbMetricIntegrationOutput.unit,
      })
      .from(TbMetricIntegrationOutput)
      .innerJoin(TbMetric, eq(TbMetric.id, TbMetricIntegrationOutput.metricId))
      .where(
        and(
          eq(TbMetricIntegrationOutput.orgId, c.session.orgId),
          eq(TbMetricIntegrationOutput.outboundIntegrationId, id),
        ),
      );
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db.transaction(async (tx) => {
      const cTx = { ...c, db: tx };

      const [record] = await tx
        .select({ type: TbOutboundIntegration.type })
        .from(TbOutboundIntegration)
        .where(
          and(
            eq(TbOutboundIntegration.id, id),
            eq(TbOutboundIntegration.orgId, c.session.orgId),
          ),
        );

      if (!record) {
        throw new ApiException(
          EApiFailCode.NOT_FOUND,
          "Metric integration not found or already deleted.",
        );
      }

      await tx
        .delete(TbMetricIntegrationOutput)
        .where(
          and(
            eq(TbMetricIntegrationOutput.outboundIntegrationId, id),
            eq(TbMetricIntegrationOutput.orgId, c.session.orgId),
          ),
        );

      await clearJobs({ ...c, db: tx }, id);

      await getOutboundIntegrationHandler(record.type).remove(
        cTx,
        c.session.orgId,
        id,
      );

      await tx
        .delete(TbOutboundIntegration)
        .where(
          and(
            eq(TbOutboundIntegration.id, id),
            eq(TbOutboundIntegration.orgId, c.session.orgId),
          ),
        )
        .returning({ type: TbOutboundIntegration.type });
    });
  }

  export async function run(
    c: IContextCore,
    config: IOutboundIntegrationConfig,
    outputKeys?: string[],
  ) {
    const logger = c.logger.child({
      name: "ServiceOutboundIntegration",
      config,
    });

    let result;

    try {
      result = await getOutboundIntegrationHandler(config.type).run(
        c,
        {
          period: config.period,
          outputKeys,
        },
        config.param,
      );
    } catch (error) {
      logger.error({ error: errorToObject(error) }, "Integration run failed.");
      throw new ApiException(EApiFailCode.BAD_REQUEST);
    }

    let recordCountSuccess = 0;
    let recordCountFailed = 0;

    for (const record of result) {
      if (record.data) {
        ++recordCountSuccess;
        continue;
      }
      ++recordCountFailed;
    }

    logger.info(
      { recordCountSuccess, recordCountFailed },
      "Integration run success.",
    );

    return result;
  }

  export async function saveValues(
    c: IContextCore,
    orgId: string,
    id: string,
    outputs: IMetricIntegrationOutput[],
    result: IOutboundIntegrationRunResultItem[],
    // Just for metric labels
    type: IOutboundIntegrationType,
  ) {
    const logger = c.logger.child({
      name: "ServiceOutboundIntegration",
      integration: {
        id,
        orgId,
        outputs,
      },
    });

    if (outputs.length === 0) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "No outputs defined for the integration.",
      );
    }

    let countInsert = 0;

    const resourceIdPairs: { outputKey: string; resourceId: string }[] = [];

    for (const { outputKey, metricId, unit } of outputs) {
      const values = result
        .filter((d) => d.outputKey === outputKey && d.data)
        .map((d) => d.data as ITimedValue);

      if (!values.length) {
        logger.warn(
          { metricId, outputKey },
          "Cannot find a record for the output.",
        );
        continue;
      }

      try {
        const resourceId = await ServiceMetric.addValues(
          c,
          orgId,
          metricId,
          unit,
          values,
          [
            {
              type: "INTERNAL",
              key: "SOURCE",
              value: "OUTBOUND_INTEGRATION",
            },
            {
              type: "INTERNAL",
              key: "OUTBOUND_INTEGRATION_TYPE",
              value: type,
            },
          ],
        );

        await c.db
          .update(TbMetricIntegrationOutput)
          .set({ isHealthy: true })
          .where(
            and(
              eq(TbMetricIntegrationOutput.outboundIntegrationId, id),
              eq(TbMetricIntegrationOutput.orgId, orgId),
            ),
          );

        resourceIdPairs.push({ outputKey, resourceId });

        countInsert += values.length;
      } catch (e) {
        const [updatedIntegration] = await c.db
          .update(TbMetricIntegrationOutput)
          .set({ isHealthy: false })
          .where(
            and(
              eq(TbMetricIntegrationOutput.outboundIntegrationId, id),
              eq(TbMetricIntegrationOutput.orgId, orgId),
              or(
                ne(TbMetricIntegrationOutput.isHealthy, false),
                isNull(TbMetricIntegrationOutput.isHealthy),
              ),
            ),
          )
          .returning({ isHealthy: TbMetricIntegrationOutput.isHealthy });

        if (updatedIntegration) {
          const [metric] = await c.db
            .select({ name: TbMetric.name })
            .from(TbMetric)
            .where(and(eq(TbMetric.orgId, orgId), eq(TbMetric.id, metricId)))
            .limit(1);

          await ServiceNotification.notifyOrganization(c, orgId, {
            type: "OUTBOUND_INTEGRATION_BROKEN",
            integrationType: type,
            metricName: metric.name,
          });
        }

        logger.error(
          { metricId, outputKey, error: errorToObject(e) },
          "Failed to feed metric value and skipped the output",
        );
      }
    }

    const countSkipped = result.length - countInsert;

    if (countInsert) {
      logger.info(
        { insertedRecordCount: countInsert, resourceIdPairs },
        "Saved integration values successfully.",
      );
    }
    if (countSkipped) {
      logger.warn(
        { skippedRecordCount: countSkipped },
        "Some records are skipped.",
      );
    }

    return resourceIdPairs;
  }

  export async function runAndSaveValues(
    c: IContextCore,
    orgId: string,
    id: string,
  ) {
    const outputs = await ServiceOutboundIntegration.getOutputs(c, orgId, id);

    if (!outputs.length) {
      c.logger.warn(
        "No output is set for metric integration. Integration run is skipped.",
      );
      return;
    }

    const config = await ServiceOutboundIntegration.getConfigCore(c, orgId, id);

    const result = await ServiceOutboundIntegration.run(
      c,
      config,
      outputs.map((d) => d.outputKey),
    );

    await ServiceOutboundIntegration.saveValues(
      c,
      orgId,
      id,
      outputs,
      result,
      config.type,
    );

    await c.db
      .update(TbOutboundIntegration)
      .set({ lastRunAt: c.nowDatetime })
      .where(
        and(
          eq(TbOutboundIntegration.orgId, orgId),
          eq(TbOutboundIntegration.id, id),
        ),
      );
  }
}
