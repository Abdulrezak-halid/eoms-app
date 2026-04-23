import { createRoute, z } from "@hono/zod-openapi";
import { MAX_API_NUMBER_VALUE } from "common";

import { ServiceUser } from "@m/base/services/ServiceUser";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { ServiceQdmsIntegration } from "@m/dms/services/ServiceQdmsIntegration";

import { ServiceDesign } from "../services/ServiceDesign";
import { RouterDesignIdea } from "./RouterDesignIdea";

export const RouterDesign = UtilOpenApi.createRouter<IHonoContextUser>();

RouterDesign.route("/", RouterDesignIdea);

RouterDesign.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            no: z.number(),
            purpose: SchemaString,
            impact: SchemaString,
            estimatedSavings: z.number(),
            estimatedAdditionalCost: z.number(),
            estimatedTurnaroundMonths: z.number(),
            leaderUser: z.object({
              id: SchemaUuid,
              displayName: SchemaString,
            }),
            potentialNonEnergyBenefits: SchemaStringLong,
            ideaCount: z.number(),
          }),
        ),
        qdmsIntegrationId: SchemaUuid.optional(),
      }),
    ),
  }),
  async (c) => {
    const qdmsIntegrationId = await ServiceQdmsIntegration.getIdByBindingPage(
      c.var,
      "DESIGNS",
    );
    const records = await ServiceDesign.getAll(c.var);
    return c.json({ records, qdmsIntegrationId });
  },
);

RouterDesign.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        no: z.number(),
        purpose: SchemaString,
        impact: SchemaString,
        estimatedSavings: z.number(),
        estimatedAdditionalCost: z.number(),
        estimatedTurnaroundMonths: z.number(),
        leaderUser: z.object({
          id: SchemaUuid,
          displayName: SchemaString,
        }),
        potentialNonEnergyBenefits: SchemaStringLong,
        ideaCount: z.number(),
      }),
    ),
  }),
  async (c) => {
    const planningDesign = await ServiceDesign.get(c.var, c.req.param("id"));
    return c.json(planningDesign);
  },
);

RouterDesign.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        name: SchemaString,
        no: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        purpose: SchemaString,
        impact: SchemaString,
        estimatedSavings: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        estimatedAdditionalCost: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        estimatedTurnaroundMonths: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        leaderUserId: SchemaUuid,
        potentialNonEnergyBenefits: SchemaStringLong,
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
    await ServiceUser.checkOrgOwnership(c.var, [json.leaderUserId]);
    const createdId = await ServiceDesign.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterDesign.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
          no: z.number().min(0).max(MAX_API_NUMBER_VALUE),
          purpose: SchemaString,
          impact: SchemaString,
          estimatedSavings: z.number().min(0).max(MAX_API_NUMBER_VALUE),
          estimatedAdditionalCost: z.number().min(0).max(MAX_API_NUMBER_VALUE),
          estimatedTurnaroundMonths: z
            .number()
            .min(0)
            .max(MAX_API_NUMBER_VALUE),
          leaderUserId: SchemaUuid,
          potentialNonEnergyBenefits: SchemaStringLong,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceUser.checkOrgOwnership(c.var, [json.leaderUserId]);
    await ServiceDesign.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterDesign.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceDesign.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
