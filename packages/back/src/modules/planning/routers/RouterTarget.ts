import { createRoute, z } from "@hono/zod-openapi";
import { MAX_API_NUMBER_VALUE } from "common";

import { SchemaEEnergyResource } from "@m/base/schemas/SchemaEEnergyResource";
import { ServiceOrganization } from "@m/base/services/ServiceOrganization";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { SchemaYear } from "@m/core/schemas/SchemaYear";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { ServiceTarget } from "@m/planning/services/ServiceTarget";

export const RouterTarget = UtilOpenApi.createRouter<IHonoContextUser>();

RouterTarget.openapi(
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
            year: SchemaYear,
            energyResource: SchemaEEnergyResource,
            consumption: z.number().min(0),
            percentage: z.number().min(0).max(100),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const query = c.req.valid("query");
    const records = await ServiceTarget.getAll(
      c.var,
      c.var.session.orgId,
      query,
    );
    return c.json({ records });
  },
);

RouterTarget.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        year: SchemaYear,
        energyResource: SchemaEEnergyResource,
        consumption: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        percentage: z.number().min(0).max(100),
      }),
    ),
    responses: UtilOpenApi.genResponseJson(z.object({ id: SchemaUuid })),
  }),
  async (c) => {
    const json = c.req.valid("json");

    await ServiceOrganization.hasEnergyResource(c.var, [json.energyResource]);
    const createdId = await ServiceTarget.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterTarget.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        year: SchemaYear,
        energyResource: SchemaEEnergyResource,
        consumption: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        percentage: z.number().min(0).max(100),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const record = await ServiceTarget.get(c.var, param.id);
    return c.json(record);
  },
);

RouterTarget.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          year: SchemaYear,
          energyResource: SchemaEEnergyResource,
          consumption: z.number().min(0),
          percentage: z.number().min(0).max(100),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");

    await ServiceOrganization.hasEnergyResource(c.var, [json.energyResource]);
    await ServiceTarget.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterTarget.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceTarget.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
