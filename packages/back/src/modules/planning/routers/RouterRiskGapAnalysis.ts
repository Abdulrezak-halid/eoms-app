import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceRiskGapAnalysis } from "../services/ServiceRiskGapAnalysis";

export const RouterRiskGapAnalysis =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterRiskGapAnalysis.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            question: SchemaString,
            headings: SchemaString,
            score: z.number(),
            evidence: SchemaStringLong,
            consideration: SchemaStringLong,
            isActionRequired: z.boolean(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceRiskGapAnalysis.getAll(c.var);
    return c.json({ records });
  },
);

RouterRiskGapAnalysis.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        question: SchemaString,
        headings: SchemaString,
        score: z.number(),
        evidence: SchemaStringLong,
        consideration: SchemaStringLong,
        isActionRequired: z.boolean(),
      }),
    ),
  }),
  async (c) => {
    const gapAnalysis = await ServiceRiskGapAnalysis.get(
      c.var,
      c.req.param("id"),
    );
    return c.json(gapAnalysis);
  },
);

RouterRiskGapAnalysis.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        question: SchemaString,
        headings: SchemaString,
        score: z.number().min(0).max(5),
        evidence: SchemaStringLong,
        consideration: SchemaStringLong,
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
    const id = await ServiceRiskGapAnalysis.create(c.var, json);
    return c.json({ id });
  },
);

RouterRiskGapAnalysis.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          question: SchemaString,
          headings: SchemaString,
          score: z.number().min(0).max(5),
          evidence: SchemaStringLong,
          consideration: SchemaStringLong,
          isActionRequired: z.boolean(),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceRiskGapAnalysis.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterRiskGapAnalysis.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceRiskGapAnalysis.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
