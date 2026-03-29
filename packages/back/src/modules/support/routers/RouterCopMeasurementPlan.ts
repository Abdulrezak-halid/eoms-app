import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { ServiceCopMeasurementPlan } from "@m/support/services/ServiceCopMeasurementPlan";

import genRequestParam = UtilOpenApi.genRequestParam;

export const RouterCopMeasurementPlan =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterCopMeasurementPlan.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            energyVariables: SchemaString,
            optimalMeasurementTools: SchemaString,
            availableMeasurementTools: SchemaString,
            monitoringAbsenceGap: SchemaString,
            measurementPlan: SchemaString,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceCopMeasurementPlan.getAll(c.var);
    return c.json({ records });
  },
);

RouterCopMeasurementPlan.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        energyVariables: SchemaString,
        optimalMeasurementTools: SchemaString,
        availableMeasurementTools: SchemaString,
        monitoringAbsenceGap: SchemaString,
        measurementPlan: SchemaString,
      }),
    ),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
      }),
    ),
  }),
  async (c) => {
    const json = c.req.valid("json");
    const createdId = await ServiceCopMeasurementPlan.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterCopMeasurementPlan.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        energyVariables: SchemaString,
        optimalMeasurementTools: SchemaString,
        availableMeasurementTools: SchemaString,
        monitoringAbsenceGap: SchemaString,
        measurementPlan: SchemaString,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const records = await ServiceCopMeasurementPlan.get(c.var, param.id);
    return c.json(records);
  },
);

RouterCopMeasurementPlan.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          energyVariables: SchemaString,
          optimalMeasurementTools: SchemaString,
          availableMeasurementTools: SchemaString,
          monitoringAbsenceGap: SchemaString,
          measurementPlan: SchemaString,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceCopMeasurementPlan.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterCopMeasurementPlan.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceCopMeasurementPlan.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
