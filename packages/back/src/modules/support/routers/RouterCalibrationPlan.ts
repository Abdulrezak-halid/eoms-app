import { createRoute, z } from "@hono/zod-openapi";

import { ServiceUser } from "@m/base/services/ServiceUser";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { ServiceCalibrationPlan } from "@m/support/services/ServiceCalibrationPlan";

export const RouterCalibrationPlan =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterCalibrationPlan.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            deviceType: SchemaString,
            deviceNo: SchemaString,
            brand: SchemaString,
            location: SchemaString,
            calibration: SchemaString,
            calibrationNo: SchemaString,
            responsibleUser: z.object({
              id: SchemaUuid,
              displayName: SchemaString,
            }),
            dueTo: SchemaDate,
            nextDate: SchemaDate,
            evaluationResult: SchemaString,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceCalibrationPlan.getAll(c.var);
    return c.json({ records });
  },
);

RouterCalibrationPlan.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        deviceType: SchemaString,
        deviceNo: SchemaString,
        brand: SchemaString,
        location: SchemaString,
        calibration: SchemaString,
        calibrationNo: SchemaString,
        responsibleUserId: SchemaUuid,
        dueTo: SchemaDate,
        nextDate: SchemaDate,
        evaluationResult: SchemaString,
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
    await ServiceUser.checkOrgOwnership(c.var, [json.responsibleUserId]);
    const createdId = await ServiceCalibrationPlan.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterCalibrationPlan.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        deviceType: SchemaString,
        deviceNo: SchemaString,
        brand: SchemaString,
        location: SchemaString,
        calibration: SchemaString,
        calibrationNo: SchemaString,
        responsibleUser: z.object({
          id: SchemaUuid,
          displayName: SchemaString,
        }),
        dueTo: SchemaDate,
        nextDate: SchemaDate,
        evaluationResult: SchemaString,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceCalibrationPlan.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterCalibrationPlan.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          deviceType: SchemaString,
          deviceNo: SchemaString,
          brand: SchemaString,
          location: SchemaString,
          calibration: SchemaString,
          calibrationNo: SchemaString,
          responsibleUserId: SchemaUuid,
          dueTo: SchemaDate,
          nextDate: SchemaDate,
          evaluationResult: SchemaString,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceUser.checkOrgOwnership(c.var, [json.responsibleUserId]);
    await ServiceCalibrationPlan.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterCalibrationPlan.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceCalibrationPlan.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
