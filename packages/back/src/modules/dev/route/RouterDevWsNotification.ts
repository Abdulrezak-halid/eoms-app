import { createRoute, z } from "@hono/zod-openapi";

import { ServiceSession } from "@m/base/services/ServiceSession";
import { IHonoContextCore } from "@m/core/interfaces/IContext";
import { SchemaWsServerMessage } from "@m/core/schemas/SchemaWsServerMessage";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

export const RouterDevWsNotification =
  UtilOpenApi.createRouter<IHonoContextCore>();

RouterDevWsNotification.openapi(
  createRoute({
    method: "post",
    path: "/test",
    request: UtilOpenApi.genRequestJson(
      z.object({
        target: z.enum(["USER", "ORGANIZATION"]),
        message: SchemaWsServerMessage,
      }),
    ),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const json = c.req.valid("json");

    const session = await ServiceSession.validateAndGetSession(c);
    if (json.target === "USER") {
      c.var.ws.sendMessageToUser(session.userId, json.message);
    } else {
      c.var.ws.sendMessageToOrganization(session.orgId, json.message);
    }

    return UtilHono.resNull(c);
  },
);
