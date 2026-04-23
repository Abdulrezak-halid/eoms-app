import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceDesign } from "../services/ServiceDesign";
import { ServiceDesignIdea } from "../services/ServiceDesignIdea";

export const RouterDesignIdea = UtilOpenApi.createRouter<IHonoContextUser>();

RouterDesignIdea.openapi(
  createRoute({
    method: "get",
    path: "/item/{designId}/idea",
    request: UtilOpenApi.genRequestParam({ designId: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            no: SchemaString,
            risks: SchemaStringLong,
            reduction: SchemaStringLong,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const records = await ServiceDesignIdea.getAll(c.var, param.designId);
    return c.json({ records });
  },
);

RouterDesignIdea.openapi(
  createRoute({
    method: "get",
    path: "/item/{designId}/idea/{id}",
    request: UtilOpenApi.genRequestParam({
      id: SchemaUuid,
      designId: SchemaUuid,
    }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        no: SchemaString,
        risks: SchemaStringLong,
        reduction: SchemaStringLong,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const planningDesign = await ServiceDesignIdea.get(
      c.var,
      param.designId,
      param.id,
    );
    return c.json(planningDesign);
  },
);

RouterDesignIdea.openapi(
  createRoute({
    method: "post",
    path: "/item/{designId}/idea",
    request: {
      params: UtilOpenApi.genRequestParamSub({
        designId: SchemaUuid,
      }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
          no: SchemaString,
          risks: SchemaStringLong,
          reduction: SchemaStringLong,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceDesign.checkOrgOwnership(c.var, [param.designId]);
    const createdId = await ServiceDesignIdea.create(
      c.var,
      param.designId,
      json,
    );
    return c.json({ id: createdId });
  },
);

RouterDesignIdea.openapi(
  createRoute({
    method: "put",
    path: "/item/{designId}/idea/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({
        id: SchemaUuid,
        designId: SchemaUuid,
      }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
          no: SchemaString,
          risks: SchemaStringLong,
          reduction: SchemaStringLong,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceDesign.checkOrgOwnership(c.var, [param.designId]);
    await ServiceDesignIdea.update(c.var, param.designId, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterDesignIdea.openapi(
  createRoute({
    method: "delete",
    path: "/item/{designId}/idea/{id}",
    request: UtilOpenApi.genRequestParam({
      id: SchemaUuid,
      designId: SchemaUuid,
    }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceDesignIdea.remove(c.var, param.designId, param.id);
    return UtilHono.resNull(c);
  },
);
