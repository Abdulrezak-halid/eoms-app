import { createRoute, z } from "@hono/zod-openapi";

import { ServiceDepartment } from "@m/base/services/ServiceDepartment";
import { ServiceNeedAndExpectation } from "@m/commitment/services/ServiceNeedAndExpectation";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilArray } from "@m/core/utils/UtilArray";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

export const RouterNeedAndExpectation =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterNeedAndExpectation.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            interestedParty: SchemaString,
            interestedPartyNeedsAndExpectations: SchemaString,
            isIncludedInEnms: z.boolean(),
            evaluationMethod: SchemaString,
            revisionDate: SchemaDate,
            departments: z.array(
              z.object({
                id: SchemaUuid,
                name: SchemaString,
              }),
            ),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceNeedAndExpectation.getAll(c.var);
    return c.json(records);
  },
);

RouterNeedAndExpectation.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        interestedParty: SchemaString,
        interestedPartyNeedsAndExpectations: SchemaString,
        isIncludedInEnms: z.boolean(),
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
    const createdId = await ServiceNeedAndExpectation.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterNeedAndExpectation.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        interestedParty: SchemaString,
        interestedPartyNeedsAndExpectations: SchemaString,
        isIncludedInEnms: z.boolean(),
        evaluationMethod: SchemaString,
        revisionDate: SchemaDate,
        departments: z.array(z.object({ id: SchemaUuid, name: SchemaString })),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const record = await ServiceNeedAndExpectation.get(c.var, param.id);
    return c.json(record);
  },
);

RouterNeedAndExpectation.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          interestedParty: SchemaString,
          interestedPartyNeedsAndExpectations: SchemaString,
          isIncludedInEnms: z.boolean(),
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
    await ServiceNeedAndExpectation.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterNeedAndExpectation.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceNeedAndExpectation.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
