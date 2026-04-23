import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { zFile } from "@m/core/schemas/SchemaFile";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceReportAttachment } from "../services/ServiceReportAttachment";

export const RouterReportAttachment =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterReportAttachment.openapi(
  createRoute({
    method: "post",
    path: "/upload",
    request: UtilOpenApi.genRequestForm(
      z.object({
        file: zFile(["application/pdf"], 50 * 1024), // 50MB
        name: SchemaString,
      }),
    ),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const form = c.req.valid("form");

    await ServiceReportAttachment.save(
      c.var,
      form.name,
      Buffer.from(await form.file.arrayBuffer()),
      form.file.type,
    );

    return UtilHono.resNull(c);
  },
);

RouterReportAttachment.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            createdBy: SchemaUuid,
            createdAt: SchemaDatetime,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceReportAttachment.getAll(c.var);
    return c.json({ records });
  },
);

RouterReportAttachment.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        createdBy: SchemaUuid,
        createdAt: SchemaDatetime,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const record = await ServiceReportAttachment.get(c.var, param.id);
    return c.json(record);
  },
);

RouterReportAttachment.openapi(
  createRoute({
    method: "get",
    path: "/file/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseFile(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const pdf = await ServiceReportAttachment.getFile(c.var, param.id);

    return UtilHono.resFile(c, pdf, {
      contentType: "application/pdf",
    });
  },
);

RouterReportAttachment.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceReportAttachment.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
