import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { ServiceSeu } from "@m/measurement/services/ServiceSeu";

import { ServiceProcurementProcedure } from "../services/ServiceProcurementProcedure";

export const RouterProcurementProcedure =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterProcurementProcedure.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            equipmentSpecifications: SchemaString,
            serviceSpecifications: SchemaStringLong,
            nextReviewAt: SchemaDate,
            seu: z.object({
              id: SchemaUuid,
              name: SchemaString,
            }),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceProcurementProcedure.getAll(c.var);
    return c.json({ records });
  },
);

RouterProcurementProcedure.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        equipmentSpecifications: SchemaString,
        serviceSpecifications: SchemaStringLong,
        nextReviewAt: SchemaDate,
        seu: z.object({
          id: SchemaUuid,
          name: SchemaString,
        }),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceProcurementProcedure.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterProcurementProcedure.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        equipmentSpecifications: SchemaString,
        serviceSpecifications: SchemaStringLong,
        nextReviewAt: SchemaDate,
        seuId: SchemaUuid,
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
    await ServiceSeu.checkOrgOwnership(c.var, [json.seuId]);
    const createdId = await ServiceProcurementProcedure.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterProcurementProcedure.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          equipmentSpecifications: SchemaString,
          serviceSpecifications: SchemaStringLong,
          nextReviewAt: SchemaDate,
          seuId: SchemaUuid,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const json = c.req.valid("json");
    const param = c.req.valid("param");
    await ServiceSeu.checkOrgOwnership(c.var, [json.seuId]);
    await ServiceProcurementProcedure.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterProcurementProcedure.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceProcurementProcedure.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
