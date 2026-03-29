import { createRoute } from "@hono/zod-openapi";
import { EApiFailCode } from "common";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceOrganizationBanner } from "../services/ServiceOrganizationBanner";

export const RouterOrganizationBanner =
  UtilOpenApi.createRouter<IHonoContextUser>();

// TODO make RouterSysOrganization a common route, and use there for banner
RouterOrganizationBanner.openapi(
  createRoute({
    method: "get",
    // Id is for browser not to cache different banners with the same route
    path: "/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseFile(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    if (param.id !== c.var.session.orgId) {
      throw new ApiException(
        EApiFailCode.FORBIDDEN,
        "User can fetch only its own organization banner.",
      );
    }
    const content = await ServiceOrganizationBanner.getFile(c.var, param.id);
    return UtilHono.resFile(c, content, {
      contentType: "image/webp",
    });
  },
);
