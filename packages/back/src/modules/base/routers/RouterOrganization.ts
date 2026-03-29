import { createRoute, z } from "@hono/zod-openapi";

import { SchemaOrganizationPlan } from "@m/base/schemas/SchemaOrganizationPlan";
import { ServiceOrganization } from "@m/base/services/ServiceOrganization";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { SchemaEEnergyResource } from "../schemas/SchemaEEnergyResource";
import { RouterOrganizationBanner } from "./RouterOrganizationBanner";
import { RouterOrganizationPartner } from "./RouterOrganizationPartner";

export const RouterOrganization = UtilOpenApi.createRouter<IHonoContextUser>();

RouterOrganization.route("/banner", RouterOrganizationBanner);
RouterOrganization.route("/partner", RouterOrganizationPartner);

RouterOrganization.openapi(
  createRoute({
    method: "get",
    path: "/energy-resources",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        energyResources: z.array(SchemaEEnergyResource),
      }),
    ),
  }),
  async (c) => {
    const orgConfig = await ServiceOrganization.getConfig(
      c.var,
      c.var.session.orgId,
    );
    return c.json({ energyResources: orgConfig.energyResources });
  },
);

RouterOrganization.openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        displayName: SchemaString,
        fullName: SchemaString,
        address: SchemaString,
        phones: z.array(SchemaString),
        email: SchemaString,
        config: z.object({
          energyResources: z.array(SchemaEEnergyResource),
        }),
        workspace: SchemaString,
        plan: SchemaOrganizationPlan,
      }),
    ),
  }),
  async (c) => {
    const organization = await ServiceOrganization.get(
      c.var,
      c.var.session.orgId,
    );
    return c.json(organization);
  },
);

UtilOpenApi.tag(RouterOrganization, "Module: Organization");
