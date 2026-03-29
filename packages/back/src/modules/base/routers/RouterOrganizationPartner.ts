import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { guardOrganizationPlanFeature } from "../middlewares/guardOrganizationPlanFeature";
import { guardPermission } from "../middlewares/guardPermission";
import { SchemaOrganizationPartnerRelationType } from "../schemas/SchemaOrganizationPartnerRelationType";
import { ServiceOrganizationPartner } from "../services/ServiceOrganizationPartner";
import { RouterOrganizationPartnerToken } from "./RouterOrganizationPartnerToken";

export const RouterOrganizationPartner =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterOrganizationPartner.route("/token", RouterOrganizationPartnerToken);

RouterOrganizationPartner.use(
  guardOrganizationPlanFeature("ORGANIZATION_PARTNER"),
);
RouterOrganizationPartner.use(guardPermission("/BASE/ORGANIZATION_PARTNER"));

RouterOrganizationPartner.openapi(
  createRoute({
    method: "get",
    path: "/item/{partnerId}",
    request: UtilOpenApi.genRequestParam({ partnerId: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        partnerId: SchemaUuid,
        relationType: SchemaOrganizationPartnerRelationType,
        displayName: SchemaString,
        hasBanner: z.boolean(),
        fullName: SchemaString,
        address: SchemaString,
        phones: z.array(SchemaString),
        email: SchemaString,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const organization = await ServiceOrganizationPartner.get(
      c.var,
      param.partnerId,
    );
    return c.json(organization);
  },
);

RouterOrganizationPartner.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            partnerId: SchemaUuid,
            relationType: SchemaOrganizationPartnerRelationType,
            displayName: SchemaString,
            hasBanner: z.boolean(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceOrganizationPartner.getAll(c.var);
    return c.json({ records });
  },
);

RouterOrganizationPartner.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(z.object({ token: SchemaString })),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const json = c.req.valid("json");
    await ServiceOrganizationPartner.create(c.var, json.token);
    return UtilHono.resNull(c);
  },
);

RouterOrganizationPartner.openapi(
  createRoute({
    method: "delete",
    path: "/item/{partnerId}",
    request: UtilOpenApi.genRequestParam({ partnerId: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceOrganizationPartner.remove(c.var, param.partnerId);
    return UtilHono.resNull(c);
  },
);
