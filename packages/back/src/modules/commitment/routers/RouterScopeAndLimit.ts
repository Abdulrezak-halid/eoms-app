import { createRoute, z } from "@hono/zod-openapi";

import { SchemaEEnergyResource } from "@m/base/schemas/SchemaEEnergyResource";
import { ServiceDepartment } from "@m/base/services/ServiceDepartment";
import { ServiceOrganization } from "@m/base/services/ServiceOrganization";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilArray } from "@m/core/utils/UtilArray";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { ServiceQdmsIntegration } from "@m/dms/services/ServiceQdmsIntegration";

import { ServiceScopeAndLimit } from "../services/ServiceScopeAndLimit";

export const RouterScopeAndLimit = UtilOpenApi.createRouter<IHonoContextUser>();

RouterScopeAndLimit.openapi(
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
            physicalLimits: SchemaString,
            excludedResources: UtilArray.zUniqueArray(SchemaEEnergyResource),
            excludedResourceReason: SchemaStringLong,
            products: UtilArray.zUniqueArray(SchemaString),
            departments: z.array(
              z.object({
                id: SchemaUuid,
                name: SchemaString,
              }),
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
      "SCOPE_AND_LIMITS",
    );
    const query = c.req.valid("query");
    const records = await ServiceScopeAndLimit.getAll(
      c.var,
      c.var.session.orgId,
      query,
    );
    return c.json({ records, qdmsIntegrationId });
  },
);

RouterScopeAndLimit.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        physicalLimits: SchemaString,
        excludedResources: UtilArray.zUniqueArray(SchemaEEnergyResource),
        excludedResourceReason: SchemaStringLong,
        products: UtilArray.zUniqueArray(SchemaString),
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
    await ServiceOrganization.hasEnergyResource(c.var, json.excludedResources);
    const createdId = await ServiceScopeAndLimit.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterScopeAndLimit.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        physicalLimits: SchemaString,
        excludedResources: UtilArray.zUniqueArray(SchemaEEnergyResource),
        excludedResourceReason: SchemaStringLong,
        products: UtilArray.zUniqueArray(SchemaString),
        departments: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceScopeAndLimit.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterScopeAndLimit.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          physicalLimits: SchemaString,
          excludedResources: UtilArray.zUniqueArray(SchemaEEnergyResource),
          excludedResourceReason: SchemaStringLong,
          products: UtilArray.zUniqueArray(SchemaString),
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
    await ServiceOrganization.hasEnergyResource(c.var, json.excludedResources);
    await ServiceScopeAndLimit.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);
RouterScopeAndLimit.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceScopeAndLimit.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
