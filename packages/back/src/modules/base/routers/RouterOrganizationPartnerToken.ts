import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceOrganizationPartnerToken } from "../services/ServiceOrganizationPartnerToken";

export const RouterOrganizationPartnerToken =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterOrganizationPartnerToken.openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        token: z.string(),
        createdAt: SchemaDatetime,
        createdBy: z.object({ id: SchemaUuid, name: SchemaString }),
      }),
    ),
  }),
  async (c) => {
    const rec = await ServiceOrganizationPartnerToken.get(c.var);
    return c.json(rec);
  },
);

RouterOrganizationPartnerToken.openapi(
  createRoute({
    method: "put",
    path: "/",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        token: z.string(),
      }),
    ),
  }),
  async (c) => {
    const token = await ServiceOrganizationPartnerToken.save(c.var);
    return c.json({ token });
  },
);

RouterOrganizationPartnerToken.openapi(
  createRoute({
    method: "delete",
    path: "/",
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    await ServiceOrganizationPartnerToken.remove(c.var);
    return UtilHono.resNull(c);
  },
);
