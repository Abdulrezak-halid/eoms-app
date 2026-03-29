import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { ServiceNotification } from "@m/core/services/ServiceNotification";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { SchemaDatetime } from "../schemas/SchemaDatetime";
import { SchemaNotificationContent } from "../schemas/SchemaNotificationContent";
import { SchemaUuid } from "../schemas/SchemaUuid";
import { UtilHono } from "../utils/UtilHono";

export const RouterNotification = UtilOpenApi.createRouter<IHonoContextUser>();

RouterNotification.openapi(
  createRoute({
    method: "get",
    path: "/list",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            content: SchemaNotificationContent,
            read: z.boolean(),
            createdAt: SchemaDatetime,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceNotification.getAll(c.var);
    return c.json({ records });
  },
);

RouterNotification.openapi(
  createRoute({
    method: "put",
    path: "/set-read",
    request: UtilOpenApi.genRequestJson(
      z.object({
        id: SchemaUuid.optional(),
      }),
    ),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const json = c.req.valid("json");
    await ServiceNotification.setRead(c.var, json.id);
    return UtilHono.resNull(c);
  },
);
