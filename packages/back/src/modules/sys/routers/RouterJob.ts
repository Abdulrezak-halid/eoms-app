import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { ServiceJob } from "@m/core/services/ServiceJob";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { SchemaEJobName } from "../schemas/SchemaEJobName";
import { SchemaJobMeta } from "../schemas/SchemaJobMeta";

export const RouterJob = UtilOpenApi.createRouter<IHonoContextUser>();

RouterJob.openapi(
  createRoute({
    method: "post",
    path: "/run",
    request: UtilOpenApi.genRequestJson(
      z.object({
        name: SchemaEJobName,
        param: z.unknown(),
      }),
    ),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const json = c.req.valid("json");
    await ServiceJob.run(
      {
        ...c.var,
        jobId: "00000000-0000-0000-0000-000000000000",
        orgId: c.var.session.orgId,
      },
      json.name,
      json.param,
    );
    return UtilHono.resNull(c);
  },
);

RouterJob.openapi(
  createRoute({
    method: "post",
    path: "/schedule",
    request: UtilOpenApi.genRequestJson(SchemaJobMeta),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        paused: z.boolean().optional(),
        failed: z.boolean().optional(),
      }),
    ),
  }),
  async (c) => {
    const json = c.req.valid("json");
    const result = await ServiceJob.schedule(c.var, c.var.session.orgId, json);
    return c.json(result);
  },
);

RouterJob.openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            meta: SchemaJobMeta,
            failInfo: z
              .object({
                msg: z.string(),
                datetime: SchemaDatetime,
              })
              .nullable(),
            runCount: z.number(),
            runFailCount: z.number(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceJob.getAll(c.var);
    return c.json({ records });
  },
);

RouterJob.openapi(
  createRoute({
    method: "get",
    path: "/handler-names",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(SchemaEJobName),
      }),
    ),
  }),
  (c) => {
    const records = ServiceJob.getRegisteredHandlerNames();
    return c.json({ records });
  },
);

RouterJob.openapi(
  createRoute({
    method: "delete",
    path: "/remove/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceJob.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
