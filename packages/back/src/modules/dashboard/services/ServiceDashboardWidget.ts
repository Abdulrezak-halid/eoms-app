import { z } from "@hono/zod-openapi";
import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { ServiceAdvancedRegression } from "@m/analysis/services/ServiceAdvancedRegression";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";
import { ServiceDataViewProfile } from "@m/analysis/services/ServiceDataViewProfile";
import { ServiceMetric } from "@m/measurement/services/ServiceMetric";
import { ServiceSeu } from "@m/measurement/services/ServiceSeu";

import { IWidgetConfig } from "../interfaces/IWidgetConfig";
import { TbDashboardWidget } from "../orm/TbDashboardWidget";
import { TbDashboardWidgetSeu } from "../orm/TbDashboardWidgetSeu";
import { SchemaWidgetConfig } from "../schemas/SchemaWidgetConfig";

export namespace ServiceDashboardWidget {
  export async function checkConfigOrgOwnership(
    c: IContextUser,
    config: z.infer<typeof SchemaWidgetConfig>,
  ) {
    if (config.type === "GRAPH_SEU_VALUE") {
      await ServiceSeu.checkOrgOwnership(c, config.seuIds);
    }
    if (
      config.type === "GRAPH_ADVANCED_REGRESSION_RESULT" &&
      config.regressionResultId
    ) {
      await ServiceAdvancedRegression.checkOrgOwnership(c, [
        config.regressionResultId,
      ]);
    }
    if (config.type === "GRAPH_DATA_VIEW_VALUE") {
      await ServiceDataViewProfile.checkOrgOwnership(c, [config.dataViewId]);
    }
    if (config.type === "GRAPH_METRIC") {
      await ServiceMetric.checkOrgOwnership(c, [config.metricId]);
    }

    if (config.type === "SEU_PIE_CHART") {
      await ServiceSeu.checkOrgOwnership(c, config.seuIds);
    }
  }

  function configToDbFields(config: IWidgetConfig) {
    switch (config.type) {
      case "GRAPH_SEU_VALUE":
      case "ENERGY_POLICY":
        return {
          widgetType: config.type,
          dataViewId: null,
          regressionResultId: null,
          metricId: null,
        };
      case "ENERGY_RESOURCE_PIE_CHART":
        return {
          widgetType: config.type,
          dataViewId: null,
          regressionResultId: null,
          metricId: null,
        };
      case "SEU_PIE_CHART":
        return {
          widgetType: config.type,
          dataViewId: null,
          regressionResultId: null,
          metricId: null,
        };
      case "GRAPH_ADVANCED_REGRESSION_RESULT":
        return {
          widgetType: config.type,
          dataViewId: null,
          regressionResultId: config.regressionResultId,
          metricId: null,
        };
      case "GRAPH_DATA_VIEW_VALUE":
        return {
          widgetType: config.type,
          dataViewId: config.dataViewId,
          regressionResultId: null,
          metricId: null,
        };
      case "GRAPH_METRIC":
        return {
          widgetType: config.type,
          dataViewId: null,
          regressionResultId: null,
          metricId: config.metricId,
        };
    }
  }

  function dbFieldsToConfig(record: {
    id: string;
    index: number;
    column: number;
    type: string;
    dataViewId: string | null;
    regressionResultId: string | null;
    seuIds: string[];
    metricId: string | null;
  }): {
    id: string;
    index: number;
    column: number;
    config: z.infer<typeof SchemaWidgetConfig>;
  } {
    const base = {
      id: record.id,
      index: record.index,
      column: record.column,
    };

    switch (record.type) {
      case "GRAPH_SEU_VALUE":
        return {
          ...base,
          config: { type: record.type, seuIds: record.seuIds },
        };
      case "GRAPH_ADVANCED_REGRESSION_RESULT":
        return {
          ...base,
          config: {
            type: record.type,
            regressionResultId: record.regressionResultId,
          },
        };
      case "GRAPH_DATA_VIEW_VALUE":
        return {
          ...base,
          config: {
            type: record.type,
            dataViewId: record.dataViewId as string,
          },
        };
      case "GRAPH_METRIC":
        return {
          ...base,
          config: {
            type: record.type,
            metricId: record.metricId as string,
          },
        };
      case "ENERGY_POLICY":
        return {
          ...base,
          config: {
            type: record.type,
          },
        };

      case "SEU_PIE_CHART":
        return {
          ...base,
          config: {
            type: record.type,
            seuIds: record.seuIds,
          },
        };
      case "ENERGY_RESOURCE_PIE_CHART":
        return {
          ...base,
          config: {
            type: record.type,
          },
        };

      default:
        throw new ApiException(EApiFailCode.INTERNAL, "Unknown graph type");
    }
  }

  export async function getAll(c: IContextUser) {
    const results = await c.db
      .select({
        id: TbDashboardWidget.id,
        index: TbDashboardWidget.index,
        column: TbDashboardWidget.column,
        type: TbDashboardWidget.widgetType,
        dataViewId: TbDashboardWidget.dataViewId,
        regressionResultId: TbDashboardWidget.regressionResultId,
        seuIds: UtilDb.arrayAgg(TbDashboardWidgetSeu.seuId, {
          excludeNull: true,
        }),
        metricId: TbDashboardWidget.metricId,
      })
      .from(TbDashboardWidget)
      .leftJoin(
        TbDashboardWidgetSeu,
        and(
          eq(TbDashboardWidgetSeu.subjectId, TbDashboardWidget.id),
          eq(TbDashboardWidgetSeu.orgId, c.session.orgId),
        ),
      )
      .where(eq(TbDashboardWidget.orgId, c.session.orgId))
      .groupBy(TbDashboardWidget.id)
      .orderBy(TbDashboardWidget.column, TbDashboardWidget.index);

    return results.map((d) => dbFieldsToConfig(d));
  }

  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbDashboardWidget.id,
        index: TbDashboardWidget.index,
        column: TbDashboardWidget.column,
        type: TbDashboardWidget.widgetType,
        dataViewId: TbDashboardWidget.dataViewId,
        regressionResultId: TbDashboardWidget.regressionResultId,
        seuIds: UtilDb.arrayAgg(TbDashboardWidgetSeu.seuId, {
          excludeNull: true,
        }),
        metricId: TbDashboardWidget.metricId,
      })
      .from(TbDashboardWidget)
      .leftJoin(
        TbDashboardWidgetSeu,
        and(
          eq(TbDashboardWidgetSeu.subjectId, TbDashboardWidget.id),
          eq(TbDashboardWidgetSeu.orgId, c.session.orgId),
        ),
      )
      .where(
        and(
          eq(TbDashboardWidget.orgId, c.session.orgId),
          eq(TbDashboardWidget.id, id),
        ),
      )
      .groupBy(TbDashboardWidget.id);

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return dbFieldsToConfig(record);
  }

  export async function create(
    c: IContextUser,
    index: number,
    column: number,
    config: IWidgetConfig,
  ) {
    const values = configToDbFields(config);
    return await c.db.transaction(async (tx) => {
      await UtilDb.reorderRecords({ ...c, db: tx }, TbDashboardWidget, {
        columnField: "column",
        columnValue: column,

        index: index,
        updatedId: undefined,
      });
      const [record] = await tx
        .insert(TbDashboardWidget)
        .values({
          index: index,
          column: column,
          ...values,
          orgId: c.session.orgId,
          createdAt: c.nowDatetime,
          createdBy: c.session.userId,
        })
        .returning({ id: TbDashboardWidget.id });
      if (config.type === "GRAPH_SEU_VALUE") {
        await tx.insert(TbDashboardWidgetSeu).values(
          config.seuIds.map((seuId) => ({
            subjectId: record.id,
            seuId,
            orgId: c.session.orgId,
          })),
        );
      }
      if (config.type === "SEU_PIE_CHART") {
        await tx.insert(TbDashboardWidgetSeu).values(
          config.seuIds.map((seuId) => ({
            subjectId: record.id,
            seuId,
            orgId: c.session.orgId,
          })),
        );
      }

      return record.id;
    });
  }

  export async function update(
    c: IContextUser,
    id: string,
    config: IWidgetConfig,
  ) {
    const values = configToDbFields(config);
    await c.db.transaction(async (tx) => {
      const [record] = await tx
        .update(TbDashboardWidget)
        .set({
          ...values,
        })
        .where(
          and(
            eq(TbDashboardWidget.id, id),
            eq(TbDashboardWidget.orgId, c.session.orgId),
          ),
        )
        .returning({ id: TbDashboardWidget.id });
      if (config.type === "GRAPH_SEU_VALUE") {
        await tx
          .delete(TbDashboardWidgetSeu)
          .where(
            and(
              eq(TbDashboardWidgetSeu.subjectId, record.id),
              eq(TbDashboardWidgetSeu.orgId, c.session.orgId),
            ),
          );
        await tx.insert(TbDashboardWidgetSeu).values(
          config.seuIds.map((seuId) => ({
            subjectId: record.id,
            seuId,
            orgId: c.session.orgId,
          })),
        );
      }
      if (config.type === "SEU_PIE_CHART") {
        await tx
          .delete(TbDashboardWidgetSeu)
          .where(
            and(
              eq(TbDashboardWidgetSeu.subjectId, record.id),
              eq(TbDashboardWidgetSeu.orgId, c.session.orgId),
            ),
          );
        await tx.insert(TbDashboardWidgetSeu).values(
          config.seuIds.map((seuId) => ({
            subjectId: record.id,
            seuId,
            orgId: c.session.orgId,
          })),
        );
      }

      return record.id;
    });
  }

  export async function updatePosition(
    c: IContextUser,
    id: string,
    column: number,
    index: number,
  ) {
    await UtilDb.reorderRecords(c, TbDashboardWidget, {
      columnField: "column",
      columnValue: column,

      index: index,
      updatedId: id,
    });
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbDashboardWidgetSeu)
        .where(
          and(
            eq(TbDashboardWidgetSeu.orgId, c.session.orgId),
            eq(TbDashboardWidgetSeu.subjectId, id),
          ),
        );
      await tx
        .delete(TbDashboardWidget)
        .where(
          and(
            eq(TbDashboardWidget.id, id),
            eq(TbDashboardWidget.orgId, c.session.orgId),
          ),
        );
    });
  }
}
