import { createRoute, z } from "@hono/zod-openapi";
import { MAX_API_NUMBER_VALUE } from "common";

import { ServiceUser } from "@m/base/services/ServiceUser";
import type { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { ServiceRiskForceFieldAnalysis } from "@m/planning/services/ServiceRiskForceFieldAnalysis";

export const RouterRiskForceFieldAnalysis =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterRiskForceFieldAnalysis.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            parameter: SchemaString,
            score: z.number(),
            responsibleUser: z.object({
              id: SchemaUuid,
              displayName: SchemaString,
            }),
            solutions: SchemaStringLong,
            completedAt: SchemaDate,
            estimatedCompletionDate: SchemaDate,
            isSucceed: z.boolean(),
            isFollowUpRequired: z.boolean(),
            isActionRequired: z.boolean(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceRiskForceFieldAnalysis.getAll(c.var);
    return c.json({ records });
  },
);

RouterRiskForceFieldAnalysis.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        parameter: SchemaString,
        score: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        responsibleUserId: SchemaUuid,
        solutions: SchemaStringLong,
        completedAt: SchemaDate,
        estimatedCompletionDate: SchemaDate,
        isSucceed: z.boolean(),
        isFollowUpRequired: z.boolean(),
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
    const createdId = await ServiceRiskForceFieldAnalysis.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterRiskForceFieldAnalysis.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        parameter: SchemaString,
        score: z.number(),
        responsibleUser: z.object({
          id: SchemaUuid,
          displayName: SchemaString,
        }),
        solutions: SchemaStringLong,
        completedAt: SchemaDate,
        estimatedCompletionDate: SchemaDate,
        isSucceed: z.boolean(),
        isFollowUpRequired: z.boolean(),
        isActionRequired: z.boolean(),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const records = await ServiceRiskForceFieldAnalysis.get(c.var, param.id);
    return c.json(records);
  },
);

RouterRiskForceFieldAnalysis.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          parameter: SchemaString,
          score: z.number().min(0).max(MAX_API_NUMBER_VALUE),
          responsibleUserId: SchemaUuid,
          solutions: SchemaStringLong,
          completedAt: SchemaDate,
          estimatedCompletionDate: SchemaDate,
          isSucceed: z.boolean(),
          isFollowUpRequired: z.boolean(),
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
    await ServiceRiskForceFieldAnalysis.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterRiskForceFieldAnalysis.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceRiskForceFieldAnalysis.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
