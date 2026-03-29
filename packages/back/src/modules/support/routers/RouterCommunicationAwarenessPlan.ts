import { createRoute, z } from "@hono/zod-openapi";

import { ServiceUser } from "@m/base/services/ServiceUser";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilArray } from "@m/core/utils/UtilArray";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { ServiceQdmsIntegration } from "@m/dms/services/ServiceQdmsIntegration";

import { SchemaEPlanType } from "../schema/SchemaEPlanType";
import { ServiceCommunicationAwarenessPlan } from "../services/ServiceCommunicationAwarenessPlan";

export const RouterCommunicationAwarenessPlan =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterCommunicationAwarenessPlan.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            action: SchemaString,
            type: SchemaEPlanType,
            information: SchemaString,
            releasedAt: SchemaDate,
            releaseLocations: z.array(SchemaString),
            feedback: SchemaString,
            targetUsers: z.array(
              z.object({ id: SchemaUuid, displayName: SchemaString }),
            ),
          }),
        ),
        qdmsIntegrationId: SchemaUuid.optional(),
      }),
    ),
  }),
  async (c) => {
    const qdmsIntegrationId = await ServiceQdmsIntegration.getIdByBindingPage(
      c.var,
      "COMMUNICATION_AND_AWARENESS_PLANS",
    );
    const records = await ServiceCommunicationAwarenessPlan.getAll(c.var);
    return c.json({ records, qdmsIntegrationId });
  },
);

RouterCommunicationAwarenessPlan.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        action: SchemaString,
        type: SchemaEPlanType,
        information: SchemaString,
        releasedAt: SchemaDate,
        releaseLocations: UtilArray.zUniqueArray(SchemaString),
        feedback: SchemaString,
        targetUserIds: UtilArray.zUniqueArray(SchemaUuid),
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
    await ServiceUser.checkOrgOwnership(c.var, json.targetUserIds);
    const createdId = await ServiceCommunicationAwarenessPlan.create(
      c.var,
      json,
    );
    return c.json({ id: createdId });
  },
);

RouterCommunicationAwarenessPlan.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        action: SchemaString,
        type: SchemaEPlanType,
        information: SchemaString,
        releasedAt: SchemaDate,
        releaseLocations: z.array(SchemaString),
        feedback: SchemaString,
        targetUsers: z.array(
          z.object({ id: SchemaUuid, displayName: SchemaString }),
        ),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceCommunicationAwarenessPlan.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterCommunicationAwarenessPlan.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          action: SchemaString,
          type: SchemaEPlanType,
          information: SchemaString,
          releasedAt: SchemaDate,
          releaseLocations: UtilArray.zUniqueArray(SchemaString),
          feedback: SchemaString,
          targetUserIds: UtilArray.zUniqueArray(SchemaUuid),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceUser.checkOrgOwnership(c.var, json.targetUserIds);
    await ServiceCommunicationAwarenessPlan.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);
RouterCommunicationAwarenessPlan.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceCommunicationAwarenessPlan.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
