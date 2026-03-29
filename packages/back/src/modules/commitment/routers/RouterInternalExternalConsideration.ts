import { createRoute, z } from "@hono/zod-openapi";

import { ServiceDepartment } from "@m/base/services/ServiceDepartment";
import type { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilArray } from "@m/core/utils/UtilArray";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceInternalExternalConsideration } from "../services/ServiceInternalExternalConsideration";

export const RouterInternalExternalConsideration =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterInternalExternalConsideration.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            specific: SchemaString,
            impactPoint: SchemaString,
            evaluationMethod: SchemaString,
            revisionDate: SchemaDate,
            updatedAt: SchemaDatetime,
            departments: z.array(
              z.object({ id: SchemaUuid, name: SchemaString }),
            ),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const rec = await ServiceInternalExternalConsideration.getAll(c.var);
    return c.json(rec);
  },
);

RouterInternalExternalConsideration.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}/history",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            specific: SchemaString,
            impactPoint: SchemaString,
            evaluationMethod: SchemaString,
            revisionDate: SchemaDate,
            updatedAt: SchemaDatetime,
            departments: z.array(
              z.object({ id: SchemaUuid, name: SchemaString }),
            ),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceInternalExternalConsideration.getHistory(
      c.var,
      param.id,
    );
    return c.json(rec);
  },
);

RouterInternalExternalConsideration.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        specific: SchemaString,
        impactPoint: SchemaString,
        evaluationMethod: SchemaString,
        revisionDate: SchemaDate,
        departmentIds: UtilArray.zUniqueArray(SchemaUuid),
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
    await ServiceDepartment.checkOrgOwnership(c.var, json.departmentIds);
    const createdId = await ServiceInternalExternalConsideration.create(
      c.var,
      json,
    );
    return c.json({ id: createdId });
  },
);

RouterInternalExternalConsideration.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        specific: SchemaString,
        impactPoint: SchemaString,
        evaluationMethod: SchemaString,
        revisionDate: SchemaDate,
        updatedAt: SchemaDatetime,
        departments: z.array(z.object({ id: SchemaUuid, name: SchemaString })),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceInternalExternalConsideration.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterInternalExternalConsideration.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          specific: SchemaString,
          impactPoint: SchemaString,
          evaluationMethod: SchemaString,
          revisionDate: SchemaDate,
          departmentIds: UtilArray.zUniqueArray(SchemaUuid),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");

    await ServiceDepartment.checkOrgOwnership(c.var, json.departmentIds);
    await ServiceInternalExternalConsideration.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterInternalExternalConsideration.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");

    await ServiceInternalExternalConsideration.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
