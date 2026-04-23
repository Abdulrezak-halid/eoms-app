import { createRoute, z } from "@hono/zod-openapi";
import { MAX_API_NUMBER_VALUE } from "common";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { ServiceQdmsIntegration } from "@m/dms/services/ServiceQdmsIntegration";

import { ServiceProcurement } from "../services/ServiceProcurement";

export const RouterProcurement = UtilOpenApi.createRouter<IHonoContextUser>();

RouterProcurement.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            product: SchemaString,
            category: SchemaString,
            criteriaList: SchemaString,
            suggestedBrand: SchemaString,
            additionalSpecifications: SchemaStringLong,
            price: z.number(),
            annualMaintenanceCost: z.number(),
            lifetimeYears: z.number(),
          }),
        ),
        qdmsIntegrationId: SchemaUuid.optional(),
      }),
    ),
  }),
  async (c) => {
    const qdmsIntegrationId = await ServiceQdmsIntegration.getIdByBindingPage(
      c.var,
      "PROCUREMENTS",
    );
    const records = await ServiceProcurement.getAll(c.var);
    return c.json({ records, qdmsIntegrationId });
  },
);

RouterProcurement.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        product: SchemaString,
        category: SchemaString,
        criteriaList: SchemaString,
        suggestedBrand: SchemaString,
        additionalSpecifications: SchemaStringLong,
        price: z.number(),
        annualMaintenanceCost: z.number(),
        lifetimeYears: z.number(),
      }),
    ),
  }),
  async (c) => {
    const supportProcurement = await ServiceProcurement.get(
      c.var,
      c.req.param("id"),
    );
    return c.json(supportProcurement);
  },
);

RouterProcurement.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        product: SchemaString,
        category: SchemaString,
        criteriaList: SchemaString,
        suggestedBrand: SchemaString,
        additionalSpecifications: SchemaStringLong,
        price: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        annualMaintenanceCost: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        lifetimeYears: z.number().min(0).max(MAX_API_NUMBER_VALUE),
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
    const createdId = await ServiceProcurement.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterProcurement.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          product: SchemaString,
          category: SchemaString,
          criteriaList: SchemaString,
          suggestedBrand: SchemaString,
          additionalSpecifications: SchemaStringLong,
          price: z.number().min(0).max(MAX_API_NUMBER_VALUE),
          annualMaintenanceCost: z.number().min(0).max(MAX_API_NUMBER_VALUE),
          lifetimeYears: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceProcurement.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterProcurement.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceProcurement.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
