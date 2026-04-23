import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaMessageQueueTaskStatus } from "@m/core/schemas/SchemaMessageQueueTaskStatus";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringBoolean } from "@m/core/schemas/SchemaStringBoolean";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilArray } from "@m/core/utils/UtilArray";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { SchemaEMetricResourceValuePeriod } from "@m/measurement/schemas/SchemaEMetricResourceValuePeriod";
import { SchemaEUnitGroup } from "@m/measurement/schemas/SchemaEUnitGroup";
import { SchemaTimedValueList } from "@m/measurement/schemas/SchemaTimedValueList";
import { ServiceMeterSlice } from "@m/measurement/services/ServiceMeterSlice";
import { ServiceMetric } from "@m/measurement/services/ServiceMetric";
import { ServiceSeu } from "@m/measurement/services/ServiceSeu";

import { SchemaAdvancedRegressionResult } from "../schemas/SchemaAdvancedRegressionResult";
import { SchemaAdvancedRegressionSuggestionFail } from "../schemas/SchemaAdvancedRegressionSuggestionFail";
import { ServiceAdvancedRegression } from "../services/ServiceAdvancedRegression";

export const RouterAdvancedRegression =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterAdvancedRegression.openapi(
  createRoute({
    method: "post",
    path: "/run",
    request: UtilOpenApi.genRequestJson(
      z.object({
        seuId: SchemaUuid.optional(),
        meterSliceIds: UtilArray.zUniqueArray(SchemaUuid).optional(),
        driverIds: UtilArray.zUniqueArray(SchemaUuid),
        dateTrainStart: SchemaDatetime,
        dateTrainEnd: SchemaDatetime,
        datePredictStart: SchemaDatetime,
        datePredictEnd: SchemaDatetime,
      }),
    ),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        trainRecordIgnoredCount: z.number(),
        // trainRecordInterpolateRate: z.number(),
        // trainRecordInterpolatedCount: z.number(),
        period: SchemaEMetricResourceValuePeriod,
        rSquared: z.number().nullable(),
        rmse: z.number(),
        expectedValues: SchemaTimedValueList,
        observedValues: SchemaTimedValueList,
        differenceValues: SchemaTimedValueList,
        cumulativeDifferenceValues: SchemaTimedValueList,
      }),
    ),
  }),
  async (c) => {
    const {
      seuId,
      meterSliceIds,
      driverIds,
      dateTrainStart,
      dateTrainEnd,
      datePredictStart,
      datePredictEnd,
    } = c.req.valid("json");

    await ServiceMetric.checkOrgOwnership(c.var, driverIds);
    await ServiceMetric.refuseMetricUnitGroups(c.var, driverIds, ["ENERGY"]);
    if (seuId) {
      await ServiceSeu.checkOrgOwnership(c.var, [seuId]);
    } else if (meterSliceIds) {
      await ServiceMeterSlice.checkOrgOwnership(c.var, meterSliceIds);
    }

    const result = await ServiceAdvancedRegression.calculate(c.var, {
      driverIds,
      dateTrainStart,
      dateTrainEnd,
      datePredictStart,
      datePredictEnd,
      seuId,
      meterSliceIds,
    });

    return c.json(result);
  },
);

RouterAdvancedRegression.openapi(
  createRoute({
    method: "post",
    path: "/commit",
    request: UtilOpenApi.genRequestJson(
      z.object({
        seuId: SchemaUuid.optional(),
        meterSliceIds: UtilArray.zUniqueArray(SchemaUuid).optional(),
        driverIds: UtilArray.zUniqueArray(SchemaUuid),
        dateTrainStart: SchemaDatetime,
        dateTrainEnd: SchemaDatetime,
        datePredictStart: SchemaDatetime,
        datePredictEnd: SchemaDatetime,
      }),
    ),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
      }),
    ),
  }),
  async (c) => {
    const {
      seuId,
      meterSliceIds,
      driverIds,
      dateTrainStart,
      dateTrainEnd,
      datePredictStart,
      datePredictEnd,
    } = c.req.valid("json");

    await ServiceMetric.checkOrgOwnership(c.var, driverIds);
    await ServiceMetric.refuseMetricUnitGroups(c.var, driverIds, ["ENERGY"]);
    if (seuId) {
      await ServiceSeu.checkOrgOwnership(c.var, [seuId]);
    } else if (meterSliceIds) {
      await ServiceMeterSlice.checkOrgOwnership(c.var, meterSliceIds);
    }

    const result = await ServiceAdvancedRegression.calculate(c.var, {
      driverIds,
      dateTrainStart,
      dateTrainEnd,
      datePredictStart,
      datePredictEnd,
      seuId,
      meterSliceIds,
    });

    const id = await ServiceAdvancedRegression.saveResults(c.var, {
      orgId: c.var.session.orgId,
      userId: c.var.session.userId,
      dateTrainStart,
      dateTrainEnd,
      datePredictStart,
      datePredictEnd,
      driverIds,
      seuId,
      meterSliceIds,
      result,
    });

    return c.json({ id });
  },
);

RouterAdvancedRegression.openapi(
  createRoute({
    method: "put",
    path: "/set-primary",
    request: UtilOpenApi.genRequestJson(
      z.object({
        id: SchemaUuid,
        value: z.boolean(),
      }),
    ),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const json = c.req.valid("json");
    await ServiceAdvancedRegression.setPrimary(c.var, json.id, json.value);
    return UtilHono.resNull(c);
  },
);

RouterAdvancedRegression.openapi(
  createRoute({
    method: "delete",
    path: "/result/{resultId}",
    request: UtilOpenApi.genRequestParam({ resultId: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const { resultId } = c.req.valid("param");
    await ServiceAdvancedRegression.removeResult(c.var, resultId);

    return UtilHono.resNull(c);
  },
);

RouterAdvancedRegression.openapi(
  createRoute({
    method: "get",
    path: "/result",
    request: UtilOpenApi.genRequestQuery({
      datetimeMin: SchemaDatetime.optional(),
      datetimeMax: SchemaDatetime.optional(),
      primary: SchemaStringBoolean.optional(),
    }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            seu: z
              .object({
                id: SchemaUuid,
                name: SchemaString,
              })
              .nullable(),
            drivers: z.array(
              z.object({
                id: SchemaUuid,
                name: SchemaString,
                unitGroup: SchemaEUnitGroup,
              }),
            ),
            slices: z.array(
              z.object({
                id: SchemaUuid,
                name: SchemaString,
              }),
            ),
            primary: z.boolean(),
            rSquared: z.number().nullable(),
            rmse: z.number(),
            dateTrainStart: SchemaDatetime,
            dateTrainEnd: SchemaDatetime,
            datePredictStart: SchemaDatetime,
            datePredictEnd: SchemaDatetime,
            trainRecordIgnoredCount: z.number(),
            // trainRecordInterpolateRate: z.number(),
            // trainRecordInterpolatedCount: z.number(),
            period: SchemaEMetricResourceValuePeriod,
            createdAt: SchemaDatetime,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const query = c.req.valid("query");
    const records = await ServiceAdvancedRegression.getAllResults(c.var, query);
    return c.json({ records });
  },
);

RouterAdvancedRegression.openapi(
  createRoute({
    method: "get",
    path: "/result/{resultId}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ resultId: SchemaUuid }),
      query: UtilOpenApi.genRequestQuerySub({
        includeSources: SchemaStringBoolean.optional(),
      }),
    },
    responses: UtilOpenApi.genResponseJson(SchemaAdvancedRegressionResult),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const query = c.req.valid("query");
    const result = await ServiceAdvancedRegression.getResult(
      c.var,
      query.includeSources,
      param.resultId,
    );
    return c.json(result);
  },
);

RouterAdvancedRegression.openapi(
  createRoute({
    method: "get",
    path: "/latest/result",
    request: UtilOpenApi.genRequestQuery({
      includeSources: SchemaStringBoolean.optional(),
    }),
    responses: UtilOpenApi.genResponseJson(SchemaAdvancedRegressionResult),
  }),
  async (c) => {
    const query = c.req.valid("query");
    const result = await ServiceAdvancedRegression.getResult(
      c.var,
      query.includeSources,
    );
    return c.json(result);
  },
);

RouterAdvancedRegression.openapi(
  createRoute({
    method: "post",
    path: "/suggest",
    request: {
      query: UtilOpenApi.genRequestQuerySub({
        datetimeMin: SchemaDatetime,
        datetimeMax: SchemaDatetime,
      }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          seuId: SchemaUuid.optional(),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        ids: SchemaUuid.array(),
      }),
    ),
  }),

  async (c) => {
    const json = c.req.valid("json");
    const query = c.req.valid("query");

    if (json.seuId) {
      await ServiceSeu.checkOrgOwnership(c.var, [json.seuId]);
    }

    const ids = await ServiceAdvancedRegression.createSuggestions(
      c.var,
      query,
      json.seuId,
    );

    return c.json({ ids });
  },
);

RouterAdvancedRegression.openapi(
  createRoute({
    method: "get",
    path: "/suggest",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            createdAt: SchemaDatetime,
            datetimeStart: SchemaDatetime,
            datetimeEnd: SchemaDatetime,
            failInfo: SchemaAdvancedRegressionSuggestionFail.nullable(),
            seu: z.object({
              id: SchemaUuid,
              name: SchemaString,
            }),
            status: SchemaMessageQueueTaskStatus,
            drivers: z.array(
              z.object({
                id: SchemaUuid,
                name: SchemaString,
                unitGroup: SchemaEUnitGroup,
              }),
            ),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceAdvancedRegression.getSuggestions(c.var);
    return c.json({ records });
  },
);

RouterAdvancedRegression.openapi(
  createRoute({
    method: "get",
    path: "/suggest/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        createdAt: SchemaDatetime,
        datetimeStart: SchemaDatetime,
        datetimeEnd: SchemaDatetime,
        failInfo: SchemaAdvancedRegressionSuggestionFail.nullable(),
        seu: z.object({
          id: SchemaUuid,
          name: SchemaString,
        }),
        status: SchemaMessageQueueTaskStatus,
        drivers: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            unitGroup: SchemaEUnitGroup,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const record = await ServiceAdvancedRegression.getSuggestion(
      c.var,
      param.id,
    );
    return c.json(record);
  },
);

RouterAdvancedRegression.openapi(
  createRoute({
    method: "delete",
    path: "/suggest/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceAdvancedRegression.deleteSuggestion(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
