import { createRoute, z } from "@hono/zod-openapi";

import { guardPermission } from "@m/base/middlewares/guardPermission";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { SchemaWidgetConfig } from "../schemas/SchemaWidgetConfig";
import { ServiceDashboardWidget } from "../services/ServiceDashboardWidget";

export const RouterDashboardWidget =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterDashboardWidget.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            index: z.number(),
            column: z.number(),
            config: SchemaWidgetConfig,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceDashboardWidget.getAll(c.var);
    return c.json({ records });
  },
);

RouterDashboardWidget.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        index: z.number(),
        column: z.number(),
        config: SchemaWidgetConfig,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const record = await ServiceDashboardWidget.get(c.var, param.id);
    return c.json(record);
  },
);

RouterDashboardWidget.use(guardPermission("/DASHBOARD/WIDGET/EDIT"));

RouterDashboardWidget.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        index: z.number().min(0),
        column: z.number().min(0),
        config: SchemaWidgetConfig,
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

    await ServiceDashboardWidget.checkConfigOrgOwnership(c.var, json.config);

    const id = await ServiceDashboardWidget.create(
      c.var,
      json.index,
      json.column,
      json.config,
    );
    return c.json({ id });
  },
);

RouterDashboardWidget.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          config: SchemaWidgetConfig,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");

    await ServiceDashboardWidget.checkConfigOrgOwnership(c.var, json.config);

    await ServiceDashboardWidget.update(c.var, param.id, json.config);
    return UtilHono.resNull(c);
  },
);

RouterDashboardWidget.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}/position",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          index: z.number().min(0),
          column: z.number().min(0),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceDashboardWidget.updatePosition(
      c.var,
      param.id,
      json.column,
      json.index,
    );
    return UtilHono.resNull(c);
  },
);

RouterDashboardWidget.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceDashboardWidget.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
