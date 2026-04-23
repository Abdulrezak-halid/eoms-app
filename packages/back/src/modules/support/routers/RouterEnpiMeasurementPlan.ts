import { createRoute, z } from "@hono/zod-openapi";
import { MAX_API_NUMBER_VALUE } from "common";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceEnpiMeasurementPlan } from "../services/ServiceEnpiMeasurementPlan";

export const RouterEnpiMeasurementPlan =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterEnpiMeasurementPlan.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            enpi: z.object({
              displayName: SchemaString,
              id: SchemaUuid,
            }),
            energyInput: z.number(),
            energyVariables: SchemaString,
            idealMeasurementTools: SchemaString,
            availableMeasurementTools: SchemaString,
            monitoringAbsenceGap: SchemaString,
            measurementPlan: SchemaString,
            requiredRange: z.number(),
            engineeringUnit: SchemaString,
            dataCollectionMethod: SchemaString,
            dataCollectionPeriod: SchemaString,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceEnpiMeasurementPlan.getAll(c.var);
    return c.json({ records });
  },
);
RouterEnpiMeasurementPlan.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        enpi: z.object({
          displayName: SchemaString,
          id: SchemaUuid,
        }),
        energyInput: z.number(),
        energyVariables: SchemaString,
        idealMeasurementTools: SchemaString,
        availableMeasurementTools: SchemaString,
        monitoringAbsenceGap: SchemaString,
        measurementPlan: SchemaString,
        requiredRange: z.number(),
        engineeringUnit: SchemaString,
        dataCollectionMethod: SchemaString,
        dataCollectionPeriod: SchemaString,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceEnpiMeasurementPlan.get(c.var, param.id);
    return c.json(rec);
  },
);
RouterEnpiMeasurementPlan.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        enpiId: SchemaUuid,
        energyInput: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        energyVariables: SchemaString,
        idealMeasurementTools: SchemaString,
        availableMeasurementTools: SchemaString,
        monitoringAbsenceGap: SchemaString,
        measurementPlan: SchemaString,
        requiredRange: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        engineeringUnit: SchemaString,
        dataCollectionMethod: SchemaString,
        dataCollectionPeriod: SchemaString,
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
    const createdId = await ServiceEnpiMeasurementPlan.create(c.var, json);
    return c.json({ id: createdId });
  },
);
RouterEnpiMeasurementPlan.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          enpiId: SchemaUuid,
          energyInput: z.number().min(0).max(MAX_API_NUMBER_VALUE),
          energyVariables: SchemaString,
          idealMeasurementTools: SchemaString,
          availableMeasurementTools: SchemaString,
          monitoringAbsenceGap: SchemaString,
          measurementPlan: SchemaString,
          requiredRange: z.number().min(0).max(MAX_API_NUMBER_VALUE),
          engineeringUnit: SchemaString,
          dataCollectionMethod: SchemaString,
          dataCollectionPeriod: SchemaString,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const json = c.req.valid("json");
    const param = c.req.valid("param");
    await ServiceEnpiMeasurementPlan.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);
RouterEnpiMeasurementPlan.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceEnpiMeasurementPlan.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
