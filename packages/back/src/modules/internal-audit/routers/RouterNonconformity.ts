import { createRoute, z } from "@hono/zod-openapi";
import { MAX_API_NUMBER_VALUE } from "common";

import { ServiceUser } from "@m/base/services/ServiceUser";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { ServiceNonconformity } from "@m/internal-audit/services/ServiceNonconformity";

export const RouterNonconformity = UtilOpenApi.createRouter<IHonoContextUser>();

RouterNonconformity.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            definition: SchemaString,
            no: z.number(),
            identifiedAt: SchemaDate,
            requirement: SchemaString,
            source: SchemaString,
            potentialResult: SchemaString,
            rootCause: SchemaString,
            action: SchemaString,
            targetIdentificationDate: SchemaDate,
            actualIdentificationDate: SchemaDate,
            isCorrectiveActionOpen: z.boolean(),
            responsibleUser: z.object({
              id: SchemaUuid,
              displayName: SchemaString,
            }),
            reviewerUser: z.object({
              id: SchemaUuid,
              displayName: SchemaString,
            }),
            reviewerFeedback: SchemaString,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceNonconformity.getAll(c.var);
    return c.json({ records });
  },
);

RouterNonconformity.openapi(
  createRoute({
    method: "get",
    path: "/names",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            displayName: SchemaString,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceNonconformity.getNames(c.var);
    return c.json({ records });
  },
);

RouterNonconformity.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        definition: SchemaString,
        no: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        identifiedAt: SchemaDate,
        requirement: SchemaString,
        source: SchemaString,
        potentialResult: SchemaString,
        rootCause: SchemaString,
        action: SchemaString,
        targetIdentificationDate: SchemaDate,
        actualIdentificationDate: SchemaDate,
        isCorrectiveActionOpen: z.boolean(),
        responsibleUserId: SchemaString,
        reviewerUserId: SchemaString,
        reviewerFeedback: SchemaString,
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
    await ServiceUser.checkOrgOwnership(c.var, [
      json.responsibleUserId,
      json.reviewerUserId,
    ]);
    const createdId = await ServiceNonconformity.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterNonconformity.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        definition: SchemaString,
        no: z.number(),
        identifiedAt: SchemaDate,
        requirement: SchemaString,
        source: SchemaString,
        potentialResult: SchemaString,
        rootCause: SchemaString,
        action: SchemaString,
        targetIdentificationDate: SchemaDate,
        actualIdentificationDate: SchemaDate,
        isCorrectiveActionOpen: z.boolean(),
        responsibleUser: z.object({
          id: SchemaUuid,
          displayName: SchemaString,
        }),
        reviewerUser: z.object({
          id: SchemaUuid,
          displayName: SchemaString,
        }),
        reviewerFeedback: SchemaString,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceNonconformity.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterNonconformity.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          definition: SchemaString,
          no: z.number().min(0).max(MAX_API_NUMBER_VALUE),
          identifiedAt: SchemaDate,
          requirement: SchemaString,
          source: SchemaString,
          potentialResult: SchemaString,
          rootCause: SchemaString,
          action: SchemaString,
          targetIdentificationDate: SchemaDate,
          actualIdentificationDate: SchemaDate,
          isCorrectiveActionOpen: z.boolean(),
          responsibleUserId: SchemaString,
          reviewerUserId: SchemaString,
          reviewerFeedback: SchemaString,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const json = c.req.valid("json");
    const param = c.req.valid("param");
    await ServiceUser.checkOrgOwnership(c.var, [
      json.responsibleUserId,
      json.reviewerUserId,
    ]);
    await ServiceNonconformity.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterNonconformity.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceNonconformity.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
