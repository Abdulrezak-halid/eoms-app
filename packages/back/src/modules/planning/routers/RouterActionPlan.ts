import { createRoute, z } from "@hono/zod-openapi";

import { ServiceUser } from "@m/base/services/ServiceUser";
import type { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { SchemaEDocumentApprovementStatus } from "@m/planning/schemas/SchemaEDocumentApprovementStatus";

import { ServiceActionPlan } from "../services/ServiceActionPlan";

export const RouterActionPlan = UtilOpenApi.createRouter<IHonoContextUser>();

RouterActionPlan.openapi(
  createRoute({
    method: "get",
    path: "/item",
    request: UtilOpenApi.genRequestQuery({
      datetimeMin: SchemaDatetime.optional(),
      datetimeMax: SchemaDatetime.optional(),
    }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            reasonsForStatus: SchemaString,
            actualSavingsVerifications: SchemaString,
            actualSavings: SchemaString,
            startDate: SchemaDate,
            targetIdentificationDate: SchemaDate,
            actualIdentificationDate: SchemaDate,
            approvementStatus: SchemaEDocumentApprovementStatus,
            responsibleUser: z.object({
              id: SchemaUuid,
              displayName: SchemaString,
            }),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const query = c.req.valid("query");
    const records = await ServiceActionPlan.getAll(
      c.var,
      c.var.session.orgId,
      query,
    );
    return c.json({ records });
  },
);

RouterActionPlan.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        name: SchemaString,
        reasonsForStatus: SchemaString,
        actualSavingsVerifications: SchemaString,
        actualSavings: SchemaString,
        startDate: SchemaDate,
        targetIdentificationDate: SchemaDate,
        actualIdentificationDate: SchemaDate,
        approvementStatus: SchemaEDocumentApprovementStatus,
        responsibleUserId: SchemaUuid,
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
    const createdId = await ServiceActionPlan.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterActionPlan.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        reasonsForStatus: SchemaString,
        actualSavingsVerifications: SchemaString,
        actualSavings: SchemaString,
        startDate: SchemaDate,
        targetIdentificationDate: SchemaDate,
        actualIdentificationDate: SchemaDate,
        approvementStatus: SchemaEDocumentApprovementStatus,
        responsibleUser: z.object({
          id: SchemaUuid,
          displayName: SchemaString,
        }),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceActionPlan.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterActionPlan.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
          reasonsForStatus: SchemaString,
          actualSavingsVerifications: SchemaString,
          actualSavings: SchemaString,
          startDate: SchemaDate,
          targetIdentificationDate: SchemaDate,
          actualIdentificationDate: SchemaDate,
          approvementStatus: SchemaEDocumentApprovementStatus,
          responsibleUserId: SchemaUuid,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceUser.checkOrgOwnership(c.var, [json.responsibleUserId]);
    await ServiceActionPlan.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterActionPlan.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceActionPlan.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
