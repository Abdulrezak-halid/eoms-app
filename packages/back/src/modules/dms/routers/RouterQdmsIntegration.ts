import { createRoute, z } from "@hono/zod-openapi";

import { guardOrganizationPlanFeature } from "@m/base/middlewares/guardOrganizationPlanFeature";
import { guardPermission } from "@m/base/middlewares/guardPermission";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUrl } from "@m/core/schemas/SchemaUrl";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { SchemaEQdmsIntegrationBindingPage } from "../schemas/SchemaEQdmsIntegrationBindingPage";
import { ServiceQdmsIntegration } from "../services/ServiceQdmsIntegration";

export const RouterQdmsIntegration =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterQdmsIntegration.use(guardOrganizationPlanFeature("QDMS"));
RouterQdmsIntegration.use(guardPermission("/DMS/QDMS_INTEGRATION"));

RouterQdmsIntegration.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            bindingPage: SchemaEQdmsIntegrationBindingPage,
            endpointUrl: SchemaUrl,
            isEnabled: z.boolean(),
            lastFetchedAt: SchemaDatetime.nullable(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceQdmsIntegration.getAll(c.var);
    return c.json({ records });
  },
);

RouterQdmsIntegration.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        bindingPage: SchemaEQdmsIntegrationBindingPage,
        endpointUrl: SchemaUrl,
        isEnabled: z.boolean(),
        lastFetchedAt: SchemaDatetime.nullable(),
      }),
    ),
  }),
  async (c) => {
    const record = await ServiceQdmsIntegration.get(c.var, c.req.param("id"));
    return c.json(record);
  },
);

RouterQdmsIntegration.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        name: SchemaString,
        endpointUrl: SchemaUrl,
        bindingPage: SchemaEQdmsIntegrationBindingPage,
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
    const createdId = await ServiceQdmsIntegration.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterQdmsIntegration.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
          endpointUrl: SchemaUrl,
          bindingPage: SchemaEQdmsIntegrationBindingPage,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceQdmsIntegration.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterQdmsIntegration.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}/set-enabled",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          value: z.boolean(),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceQdmsIntegration.setEnabled(c.var, param.id, json.value);
    return UtilHono.resNull(c);
  },
);

RouterQdmsIntegration.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceQdmsIntegration.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);

RouterQdmsIntegration.openapi(
  createRoute({
    method: "post",
    path: "/item/{id}/fetch",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    await ServiceQdmsIntegration.fetchEntry(c.var, c.req.param("id"));
    return UtilHono.resNull(c);
  },
);

RouterQdmsIntegration.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}/file",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseFile(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceQdmsIntegration.checkOrgOwnership(c.var, [param.id]);

    const content = await ServiceQdmsIntegration.getFileContent(
      c.var,
      param.id,
    );

    return UtilHono.resFile(c, content, {
      contentType: "application/pdf",
    });
  },
);
