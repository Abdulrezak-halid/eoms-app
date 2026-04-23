import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { SchemaReport } from "../schemas/SchemaReport";
import { SchemaPlainOrTranslatableText } from "../schemas/SchemaTranslatableKeys";
import { ServiceReportProfile } from "../services/ServiceReportProfile";

export const RouterReportProfile = UtilOpenApi.createRouter<IHonoContextUser>();

RouterReportProfile.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            title: SchemaPlainOrTranslatableText,
            commonLabel: SchemaPlainOrTranslatableText.nullable(),
            description: SchemaPlainOrTranslatableText.nullable(),
            isCommon: z.boolean(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceReportProfile.getAll(c.var);
    return c.json({ records });
  },
);

RouterReportProfile.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        title: SchemaPlainOrTranslatableText,
        commonLabel: SchemaPlainOrTranslatableText.nullable(),
        description: SchemaPlainOrTranslatableText.nullable(),
        content: SchemaReport,
        isCommon: z.boolean(),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const record = await ServiceReportProfile.get(c.var, param.id);
    return c.json(record);
  },
);

RouterReportProfile.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        content: SchemaReport,
        description: SchemaPlainOrTranslatableText.nullable(),
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

    const createdId = await ServiceReportProfile.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterReportProfile.openapi(
  createRoute({
    method: "post",
    path: "/item/clone",
    request: UtilOpenApi.genRequestJson(
      z.object({
        id: SchemaUuid,
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

    const rec = await ServiceReportProfile.clone(c.var, json.id);

    return c.json(rec);
  },
);

RouterReportProfile.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          content: SchemaReport,
          description: SchemaPlainOrTranslatableText.nullable(),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");

    await ServiceReportProfile.checkNonCommon(c.var, param.id);

    await ServiceReportProfile.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterReportProfile.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");

    await ServiceReportProfile.checkNonCommon(c.var, param.id);

    await ServiceReportProfile.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
