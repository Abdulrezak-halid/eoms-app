import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilArray } from "@m/core/utils/UtilArray";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { SchemaEMetricResourceValuePeriod } from "@m/measurement/schemas/SchemaEMetricResourceValuePeriod";
import { SchemaEUnitGroup } from "@m/measurement/schemas/SchemaEUnitGroup";
import { ServiceMetric } from "@m/measurement/services/ServiceMetric";

import { ServiceCorrelation } from "../services/ServiceCorrelation";

export const RouterCorrelation = UtilOpenApi.createRouter<IHonoContextUser>();

RouterCorrelation.openapi(
  createRoute({
    method: "post",
    path: "/run",
    request: UtilOpenApi.genRequestJson(
      z.object({
        metricIds: UtilArray.zUniqueArray(SchemaUuid),
        datetimeStart: SchemaDatetime,
        datetimeEnd: SchemaDatetime,
      }),
    ),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        period: SchemaEMetricResourceValuePeriod,
        correlations: z.array(
          z.object({
            metricAId: SchemaUuid,
            metricBId: SchemaUuid,
            value: z.number(),
            recordCount: z.number(),
            // interpolatedRecordCount: z.number(),
            // interpolateRate: z.number(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const { metricIds, datetimeStart, datetimeEnd } = c.req.valid("json");
    await ServiceMetric.checkOrgOwnership(c.var, metricIds);
    const result = await ServiceCorrelation.calculate(c.var, {
      metricIds,
      datetimeStart,
      datetimeEnd,
    });
    return c.json(result);
  },
);

RouterCorrelation.openapi(
  createRoute({
    method: "post",
    path: "/commit",
    request: UtilOpenApi.genRequestJson(
      z.object({
        metricIds: UtilArray.zUniqueArray(SchemaUuid),
        datetimeStart: SchemaDatetime,
        datetimeEnd: SchemaDatetime,
      }),
    ),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const { metricIds, datetimeStart, datetimeEnd } = c.req.valid("json");
    await ServiceMetric.checkOrgOwnership(c.var, metricIds);
    const result = await ServiceCorrelation.calculate(c.var, {
      metricIds,
      datetimeStart,
      datetimeEnd,
    });
    const metrics = await ServiceMetric.getNames(c.var, {
      ids: metricIds,
    });
    await ServiceCorrelation.saveResults(c.var, {
      orgId: c.var.session.orgId,
      userId: c.var.session.userId,
      datetimeStart,
      datetimeEnd,
      period: result.period,
      metrics: metrics.map((d) => ({
        id: d.id,
        name: d.name,
        unitGroup: d.unitGroup,
      })),
      correlations: result.correlations,
    });

    return UtilHono.resNull(c);
  },
);

RouterCorrelation.openapi(
  createRoute({
    method: "delete",
    path: "/results/{resultId}",
    request: UtilOpenApi.genRequestParam({ resultId: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const { resultId } = c.req.valid("param");
    await ServiceCorrelation.removeResult(c.var, resultId);

    return UtilHono.resNull(c);
  },
);

RouterCorrelation.openapi(
  createRoute({
    method: "get",
    path: "/results",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            metrics: z.array(
              z.object({
                id: SchemaUuid,
                name: SchemaString,
                unitGroup: SchemaEUnitGroup,
              }),
            ),
            datetimeStart: SchemaDatetime,
            datetimeEnd: SchemaDatetime,
            period: SchemaEMetricResourceValuePeriod,
            createdAt: SchemaDatetime,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceCorrelation.getAllResults(c.var);
    return c.json({ records });
  },
);

RouterCorrelation.openapi(
  createRoute({
    method: "get",
    path: "/values/{resultId}",
    request: UtilOpenApi.genRequestParam({ resultId: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        result: z.object({
          id: SchemaUuid,
          metrics: z.array(
            z.object({
              id: SchemaUuid,
              name: SchemaString,
              unitGroup: SchemaEUnitGroup,
            }),
          ),
          datetimeStart: SchemaDatetime,
          datetimeEnd: SchemaDatetime,
          period: SchemaEMetricResourceValuePeriod,
          createdAt: SchemaDatetime,
          values: z.array(
            z.object({
              metricAId: SchemaUuid,
              metricBId: SchemaUuid,
              value: z.number(),
              recordCount: z.number(),
              // interpolatedRecordCount: z.number(),
              // interpolateRate: z.number(),
            }),
          ),
        }),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const result = await ServiceCorrelation.getResult(c.var, param.resultId);
    return c.json({ result });
  },
);
