import { createRoute, z } from "@hono/zod-openapi";

import { ServiceUser } from "@m/base/services/ServiceUser";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilArray } from "@m/core/utils/UtilArray";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceNonconformity } from "../services/ServiceNonconformity";
import { ServiceWorkflow } from "../services/ServiceWorkflow";

export const RouterWorkflow = UtilOpenApi.createRouter<IHonoContextUser>();

RouterWorkflow.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            part: SchemaString,
            highLevelSubject: SchemaString,
            subject: SchemaString,
            reviewerUser: z.object({
              id: SchemaUuid,
              displayName: SchemaString,
            }),
            questions: SchemaString,
            necessaries: SchemaString,
            necessaryProof: SchemaString,
            obtainedProof: SchemaString,
            correctiveActionDecisions: SchemaString,
            comments: SchemaString,
            nonconformities: z.array(
              z.object({
                id: SchemaUuid,
                displayName: SchemaString,
              }),
            ),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceWorkflow.getAll(c.var);
    return c.json({ records });
  },
);

RouterWorkflow.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        part: SchemaString,
        highLevelSubject: SchemaString,
        subject: SchemaString,
        reviewerUserId: SchemaUuid,
        questions: SchemaString,
        necessaries: SchemaString,
        necessaryProof: SchemaString,
        obtainedProof: SchemaString,
        correctiveActionDecisions: SchemaString,
        comments: SchemaString,
        nonconformityIds: UtilArray.zUniqueArray(SchemaUuid),
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
    await ServiceUser.checkOrgOwnership(c.var, [json.reviewerUserId]);
    await ServiceNonconformity.checkOrgOwnership(c.var, json.nonconformityIds);
    const createdId = await ServiceWorkflow.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterWorkflow.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        part: SchemaString,
        highLevelSubject: SchemaString,
        subject: SchemaString,
        reviewerUser: z.object({
          id: SchemaUuid,
          displayName: SchemaString,
        }),
        questions: SchemaString,
        necessaries: SchemaString,
        necessaryProof: SchemaString,
        obtainedProof: SchemaString,
        correctiveActionDecisions: SchemaString,
        comments: SchemaString,
        nonconformities: z.array(
          z.object({
            id: SchemaUuid,
            displayName: SchemaString,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceWorkflow.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterWorkflow.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          part: SchemaString,
          highLevelSubject: SchemaString,
          subject: SchemaString,
          reviewerUserId: SchemaUuid,
          questions: SchemaString,
          necessaries: SchemaString,
          necessaryProof: SchemaString,
          obtainedProof: SchemaString,
          correctiveActionDecisions: SchemaString,
          comments: SchemaString,
          nonconformityIds: UtilArray.zUniqueArray(SchemaUuid),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceUser.checkOrgOwnership(c.var, [json.reviewerUserId]);
    await ServiceNonconformity.checkOrgOwnership(c.var, json.nonconformityIds);
    await ServiceWorkflow.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);
RouterWorkflow.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceWorkflow.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
