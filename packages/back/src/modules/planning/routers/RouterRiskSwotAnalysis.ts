import { createRoute, z } from "@hono/zod-openapi";

import { ServiceUser } from "@m/base/services/ServiceUser";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceRiskSwotAnalysis } from "../services/ServiceRiskSwotAnalysis";

export const RouterRiskSwotAnalysis =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterRiskSwotAnalysis.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            type: SchemaString,
            description: SchemaStringLong.nullable(),
            solutions: SchemaString,
            responsibleUser: z.object({
              id: SchemaUuid,
              displayName: SchemaString,
            }),
            analysisCreatedAt: SchemaDate,
            estimatedCompletionDate: SchemaDate,
            completedAt: SchemaDate,
            isActionRequired: z.boolean(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceRiskSwotAnalysis.getAll(c.var);
    return c.json({ records });
  },
);

RouterRiskSwotAnalysis.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        type: SchemaString,
        description: SchemaStringLong.nullable(),
        solutions: SchemaString,
        responsibleUser: z.object({
          id: SchemaUuid,
          displayName: SchemaString,
        }),
        analysisCreatedAt: SchemaDate,
        estimatedCompletionDate: SchemaDate,
        completedAt: SchemaDate,
        isActionRequired: z.boolean(),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceRiskSwotAnalysis.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterRiskSwotAnalysis.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        type: SchemaString,
        description: SchemaStringLong.nullable(),
        solutions: SchemaString,
        responsibleUserId: SchemaUuid,
        analysisCreatedAt: SchemaDate,
        estimatedCompletionDate: SchemaDate,
        completedAt: SchemaDate,
        isActionRequired: z.boolean(),
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
    const createdId = await ServiceRiskSwotAnalysis.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterRiskSwotAnalysis.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          type: SchemaString,
          description: SchemaStringLong.nullable(),
          solutions: SchemaString,
          responsibleUserId: SchemaUuid,
          analysisCreatedAt: SchemaDate,
          estimatedCompletionDate: SchemaDate,
          completedAt: SchemaDate,
          isActionRequired: z.boolean(),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceUser.checkOrgOwnership(c.var, [json.responsibleUserId]);
    await ServiceRiskSwotAnalysis.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterRiskSwotAnalysis.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceRiskSwotAnalysis.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
