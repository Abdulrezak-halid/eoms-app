import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { zFile } from "@m/core/schemas/SchemaFile";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { UtilTimezone } from "@m/core/utils/UtilTimezone";

import { SchemaEMetricType } from "../schemas/SchemaEMetricType";
import { SchemaEUnit } from "../schemas/SchemaEUnit";
import { SchemaEUnitGroup } from "../schemas/SchemaEUnitGroup";
import { SchemaMetricFileDraftContentRecord } from "../schemas/SchemaMetricFileDraftContentRecord";
import { ServiceMetric } from "../services/ServiceMetric";
import { ServiceMetricFileDraft } from "../services/ServiceMetricFileDraft";

export const RouterMetricFileDraft =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterMetricFileDraft.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            content: SchemaMetricFileDraftContentRecord.array(),
            metric: z.object({
              id: SchemaUuid,
              name: SchemaString,
              type: SchemaEMetricType,
              unitGroup: SchemaEUnitGroup,
            }),
            createdAt: SchemaDatetime,
            createdBy: SchemaUuid,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceMetricFileDraft.getAll(c.var);
    return c.json({ records });
  },
);

RouterMetricFileDraft.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        content: SchemaMetricFileDraftContentRecord.array(),
        createdAt: SchemaDatetime,
        createdBy: SchemaUuid,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const record = await ServiceMetricFileDraft.get(c.var, param.id);
    return c.json(record);
  },
);

RouterMetricFileDraft.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}/upload",
    request: {
      params: UtilOpenApi.genRequestParamSub({
        id: SchemaUuid,
      }),
      body: UtilOpenApi.genRequestFormSub(
        z.object({
          file: zFile(
            [
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "application/vnd.ms-excel",
              "application/octet-stream",
            ],
            5 * 1024 * 1024, // 5 MiB
          ),
          tz: z.string(),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),

  async (c) => {
    const { id } = c.req.valid("param");
    const { file, tz } = c.req.valid("form");
    const tzOffset = UtilTimezone.getTimezoneOffset(tz);

    await ServiceMetric.checkOrgOwnership(c.var, [id]);
    const arrayBuffer = await file.arrayBuffer();
    await ServiceMetricFileDraft.upload(c.var, id, arrayBuffer, tzOffset);

    return UtilHono.resNull(c);
  },
);

RouterMetricFileDraft.openapi(
  createRoute({
    method: "post",
    path: "/item/{id}/save",
    request: {
      params: UtilOpenApi.genRequestParamSub({
        id: SchemaUuid,
      }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          unit: SchemaEUnit,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        resourceIds: SchemaUuid.array(),
      }),
    ),
  }),

  async (c) => {
    const { id } = c.req.valid("param");
    const { unit } = c.req.valid("json");

    await ServiceMetric.checkOrgOwnership(c.var, [id]);
    const resourceIds = await ServiceMetricFileDraft.save(c.var, id, unit);

    return c.json({ resourceIds });
  },
);

RouterMetricFileDraft.openapi(
  createRoute({
    method: "post",
    path: "/item/{id}/cancel",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),

  async (c) => {
    const { id } = c.req.valid("param");

    await ServiceMetric.checkOrgOwnership(c.var, [id]);
    await ServiceMetricFileDraft.cancel(c.var, id);

    return UtilHono.resNull(c);
  },
);
