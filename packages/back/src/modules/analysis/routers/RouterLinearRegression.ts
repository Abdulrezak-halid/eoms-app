import { createRoute, z } from "@hono/zod-openapi";
import { EApiFailCode } from "common";

import { SchemaEEnergyResource } from "@m/base/schemas/SchemaEEnergyResource";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilArray } from "@m/core/utils/UtilArray";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { SchemaEMetricResourceValuePeriod } from "@m/measurement/schemas/SchemaEMetricResourceValuePeriod";
import { SchemaEUnitGroup } from "@m/measurement/schemas/SchemaEUnitGroup";
import { ServiceMeterSlice } from "@m/measurement/services/ServiceMeterSlice";
import { ServiceMetric } from "@m/measurement/services/ServiceMetric";

import { ServiceLinearRegression } from "../services/ServiceLinearRegression";

export const RouterLinearRegression =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterLinearRegression.openapi(
  createRoute({
    method: "post",
    path: "/run",
    request: UtilOpenApi.genRequestJson(
      z.object({
        meterSliceIds: UtilArray.zUniqueArray(SchemaUuid),
        driverId: SchemaUuid,
        datetimeStart: SchemaDatetime,
        datetimeEnd: SchemaDatetime,
      }),
    ),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        period: SchemaEMetricResourceValuePeriod,
        slope: z.number(),
        intercept: z.number(),
        rSquared: z.number(),
        ignoredRecordCount: z.number(),
        // interpolateRate: z.number(),
        // interpolatedRecordCount: z.number(),
        dataPoints: z.array(
          z.object({
            x: z.number(),
            y: z.number(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const { meterSliceIds, driverId, datetimeStart, datetimeEnd } =
      c.req.valid("json");

    await ServiceMetric.checkOrgOwnership(c.var, [driverId]);
    await ServiceMetric.refuseMetricUnitGroups(c.var, [driverId], ["ENERGY"]);
    await ServiceMeterSlice.checkOrgOwnership(c.var, meterSliceIds);
    // await ServiceMeterSlice.validateNonMain(c.var, meterSliceIds);

    const result = await ServiceLinearRegression.calculate(c.var, {
      meterSliceIds,
      driverId,
      datetimeStart,
      datetimeEnd,
    });

    return c.json(result);
  },
);

RouterLinearRegression.openapi(
  createRoute({
    method: "post",
    path: "/commit",
    request: UtilOpenApi.genRequestJson(
      z.object({
        meterSliceIds: UtilArray.zUniqueArray(SchemaUuid),
        driverId: SchemaUuid,
        datetimeStart: SchemaDatetime,
        datetimeEnd: SchemaDatetime,
      }),
    ),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const { meterSliceIds, driverId, datetimeStart, datetimeEnd } =
      c.req.valid("json");

    await ServiceMetric.checkOrgOwnership(c.var, [driverId]);
    await ServiceMetric.refuseMetricUnitGroups(c.var, [driverId], ["ENERGY"]);
    await ServiceMeterSlice.checkOrgOwnership(c.var, meterSliceIds);

    const result = await ServiceLinearRegression.calculate(c.var, {
      meterSliceIds,
      driverId,
      datetimeStart,
      datetimeEnd,
    });
    const meterSlices = await ServiceMeterSlice.getNames(c.var, {
      ids: meterSliceIds,
    });

    if (!meterSlices.length) {
      throw new ApiException(
        EApiFailCode.INTERNAL,
        "Unexpectedly meter slice count is zero.",
      );
    }

    const [driver] = await ServiceMetric.getNames(c.var, {
      ids: [driverId],
    });

    if (!driver) {
      throw new ApiException(
        EApiFailCode.INTERNAL,
        "Unexpectedly driver name is not found.",
      );
    }

    const energyResource = await ServiceMeterSlice.getEnergyResource(
      c.var,
      meterSlices[0].id,
    );

    await ServiceLinearRegression.saveResults(c.var, {
      energyResource,
      meterSlices: meterSlices.map((d) => ({ id: d.id, name: d.name })),
      driver: { id: driver.id, name: driver.name, unitGroup: driver.unitGroup },
      datetimeStart,
      datetimeEnd,
      result,
      userId: c.var.session.userId,
      orgId: c.var.session.orgId,
    });

    return UtilHono.resNull(c);
  },
);

RouterLinearRegression.openapi(
  createRoute({
    method: "delete",
    path: "/results/{resultId}",
    request: UtilOpenApi.genRequestParam({ resultId: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const { resultId } = c.req.valid("param");
    await ServiceLinearRegression.removeResult(c.var, resultId);

    return UtilHono.resNull(c);
  },
);

RouterLinearRegression.openapi(
  createRoute({
    method: "get",
    path: "/results",
    responses: UtilOpenApi.genResponseJson(
      z.array(
        z.object({
          id: SchemaUuid,
          energyResource: SchemaEEnergyResource,
          meterSlices: z.array(
            z.object({
              id: SchemaUuid,
              name: SchemaString,
            }),
          ),
          driver: z.object({
            id: SchemaUuid,
            name: SchemaString,
          }),
          slope: z.number(),
          intercept: z.number(),
          rSquared: z.number(),
          ignoredRecordCount: z.number(),
          // interpolateRate: z.number(),
          // interpolatedRecordCount: z.number(),
          datetimeStart: SchemaDatetime,
          datetimeEnd: SchemaDatetime,
          period: SchemaEMetricResourceValuePeriod,
          createdAt: SchemaDatetime,
        }),
      ),
    ),
  }),
  async (c) => {
    const results = await ServiceLinearRegression.getAllResults(c.var);
    return c.json(results);
  },
);

RouterLinearRegression.openapi(
  createRoute({
    method: "get",
    path: "/values/{resultId}",
    request: UtilOpenApi.genRequestParam({ resultId: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        result: z.object({
          id: SchemaUuid,
          energyResource: SchemaEEnergyResource,
          meterSlices: z.array(
            z.object({
              id: SchemaUuid,
              name: SchemaString,
            }),
          ),
          driver: z.object({
            id: SchemaUuid,
            name: SchemaString,
            unitGroup: SchemaEUnitGroup,
          }),
          datetimeStart: SchemaDatetime,
          datetimeEnd: SchemaDatetime,
          period: SchemaEMetricResourceValuePeriod,
          createdAt: SchemaDatetime,
          slope: z.number(),
          intercept: z.number(),
          rSquared: z.number(),
          ignoredRecordCount: z.number(),
          // interpolateRate: z.number(),
          // interpolatedRecordCount: z.number(),
          values: z.array(
            z.object({
              x: z.number(),
              y: z.number(),
            }),
          ),
        }),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const result = await ServiceLinearRegression.getResult(
      c.var,
      param.resultId,
    );
    return c.json({ result });
  },
);
