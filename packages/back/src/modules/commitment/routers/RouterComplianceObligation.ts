import { createRoute, z } from "@hono/zod-openapi";

import { SchemaEPeriod } from "@m/commitment/schemas/SchemaEPeriod";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceComplianceObligation } from "../services/ServiceComplianceObligation";
import { RouterComplianceObligationeomscle } from "./RouterComplianceObligationeomscle";

export const RouterComplianceObligation =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterComplianceObligation.route("/", RouterComplianceObligationeomscle);

RouterComplianceObligation.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            complianceObligation: SchemaString,
            officialNewspaperNo: SchemaString,
            officialNewspaperPublicationDate: SchemaDate,
            reviewPeriod: SchemaEPeriod,
            reviewDate: SchemaDate,
            revisionNo: SchemaString,
            revisionDate: SchemaDate,
            isLegalActive: z.boolean(),
            eomscleCount: z.number(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceComplianceObligation.getAll(c.var);
    return c.json({ records });
  },
);

RouterComplianceObligation.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        complianceObligation: SchemaString,
        officialNewspaperNo: SchemaString,
        officialNewspaperPublicationDate: SchemaDate,
        reviewPeriod: SchemaEPeriod,
        reviewDate: SchemaDate,
        revisionNo: SchemaString,
        revisionDate: SchemaDate,
        isLegalActive: z.boolean(),
        eomscleCount: z.number(),
      }),
    ),
  }),
  async (c) => {
    const commitmentCompliance = await ServiceComplianceObligation.get(
      c.var,
      c.req.param("id"),
    );
    return c.json(commitmentCompliance);
  },
);

RouterComplianceObligation.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        complianceObligation: SchemaString,
        officialNewspaperNo: SchemaString,
        officialNewspaperPublicationDate: SchemaDate,
        reviewPeriod: SchemaEPeriod,
        reviewDate: SchemaDate,
        revisionNo: SchemaString,
        revisionDate: SchemaDate,
        isLegalActive: z.boolean(),
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
    const createdId = await ServiceComplianceObligation.create(c.var, json);
    return c.json({ id: createdId });
  },
);
RouterComplianceObligation.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          complianceObligation: SchemaString,
          officialNewspaperNo: SchemaString,
          officialNewspaperPublicationDate: SchemaDate,
          reviewPeriod: SchemaEPeriod,
          reviewDate: SchemaDate,
          revisionNo: SchemaString,
          revisionDate: SchemaDate,
          isLegalActive: z.boolean(),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceComplianceObligation.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterComplianceObligation.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceComplianceObligation.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
