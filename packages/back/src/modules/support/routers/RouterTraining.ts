import { createRoute, z } from "@hono/zod-openapi";

import type { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { ServiceQdmsIntegration } from "@m/dms/services/ServiceQdmsIntegration";

import { SchemaETrainingCategory } from "../schema/SchemaETrainingCategory";
import { ServiceTraining } from "../services/ServiceTraining";

export const RouterTraining = UtilOpenApi.createRouter<IHonoContextUser>();

RouterTraining.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            title: SchemaString,
            date: SchemaDate,
            category: SchemaETrainingCategory,
            trainerUser: z.object({
              id: SchemaUuid,
              displayName: SchemaString,
            }),
          }),
        ),
        qdmsIntegrationId: SchemaUuid.optional(),
      }),
    ),
  }),
  async (c) => {
    const qdmsIntegrationId = await ServiceQdmsIntegration.getIdByBindingPage(
      c.var,
      "TRAININGS",
    );
    const records = await ServiceTraining.getAll(c.var);
    return c.json({ records, qdmsIntegrationId });
  },
);

RouterTraining.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        title: SchemaString,
        date: SchemaDate,
        category: SchemaETrainingCategory,
        trainerUserId: SchemaUuid,
      }),
    ),
    responses: UtilOpenApi.genResponseJson(z.object({ id: SchemaUuid })),
  }),
  async (c) => {
    const json = c.req.valid("json");
    const createdId = await ServiceTraining.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterTraining.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        title: SchemaString,
        date: SchemaDate,
        category: SchemaETrainingCategory,
        trainerUser: z.object({
          id: SchemaUuid,
          displayName: SchemaString,
        }),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceTraining.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterTraining.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          title: SchemaString,
          date: SchemaDate,
          category: SchemaETrainingCategory,
          trainerUserId: SchemaUuid,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceTraining.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterTraining.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceTraining.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
