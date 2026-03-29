import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { SchemaECalendarEntryType } from "../schemas/SchemaCalendarEntryType";
import { ServiceCalendar } from "../services/ServiceCalendar";

export const RouterCalendar = UtilOpenApi.createRouter<IHonoContextUser>();

RouterCalendar.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        name: SchemaString,
        description: SchemaString.nullable(),
        datetime: SchemaDatetime,
        datetimeEnd: SchemaDatetime.optional(),
        type: SchemaECalendarEntryType,
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
    const createdId = await ServiceCalendar.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterCalendar.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            description: SchemaString.nullable(),
            datetime: SchemaDatetime,
            datetimeEnd: SchemaDatetime.nullable(),
            type: SchemaECalendarEntryType,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceCalendar.getAll(c.var);
    return c.json({ records });
  },
);

RouterCalendar.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        description: SchemaString.nullable(),
        datetime: SchemaDatetime,
        datetimeEnd: SchemaDatetime.nullable(),
        type: SchemaECalendarEntryType,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const record = await ServiceCalendar.get(c.var, param.id);
    return c.json(record);
  },
);

RouterCalendar.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
          description: SchemaString.nullable(),
          datetime: SchemaDatetime,
          datetimeEnd: SchemaDatetime.optional(),
          type: SchemaECalendarEntryType,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceCalendar.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterCalendar.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceCalendar.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
