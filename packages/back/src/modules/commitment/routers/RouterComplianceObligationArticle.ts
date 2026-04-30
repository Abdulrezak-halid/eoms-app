import { createRoute, z } from "@hono/zod-openapi";

import { SchemaEPeriod } from "@m/commitment/schemas/SchemaEPeriod";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceComplianceObligation } from "../services/ServiceComplianceObligation";
import { ServiceComplianceObligationeomscle } from "../services/ServiceComplianceObligationeomscle";

export const RouterComplianceObligationeomscle =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterComplianceObligationeomscle.openapi(
  createRoute({
    method: "get",
    path: "/item/{subjectId}/eomscle",
    request: UtilOpenApi.genRequestParam({ subjectId: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            relatedeomscleNo: SchemaString,
            currentApplication: SchemaString,
            conformityAssessment: SchemaString,
            conformityAssessmentPeriod: SchemaEPeriod,
            lastConformityAssessment: SchemaString,
            description: SchemaStringLong.nullable(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceComplianceObligationeomscle.getAll(
      c.var,
      c.req.param("subjectId"),
    );
    return c.json({ records });
  },
);

RouterComplianceObligationeomscle.openapi(
  createRoute({
    method: "get",
    path: "/item/{subjectId}/eomscle/{id}",
    request: UtilOpenApi.genRequestParam({
      id: SchemaUuid,
      subjectId: SchemaUuid,
    }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        relatedeomscleNo: SchemaString,
        currentApplication: SchemaString,
        conformityAssessment: SchemaString,
        conformityAssessmentPeriod: SchemaEPeriod,
        lastConformityAssessment: SchemaString,
        description: SchemaStringLong.nullable(),
      }),
    ),
  }),
  async (c) => {
    const commitmentCompliance = await ServiceComplianceObligationeomscle.get(
      c.var,
      c.req.param("subjectId"),
      c.req.param("id"),
    );
    return c.json(commitmentCompliance);
  },
);

RouterComplianceObligationeomscle.openapi(
  createRoute({
    method: "post",
    path: "/item/{subjectId}/eomscle",
    request: {
      params: UtilOpenApi.genRequestParamSub({
        subjectId: SchemaUuid,
      }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          relatedeomscleNo: SchemaString,
          currentApplication: SchemaString,
          conformityAssessment: SchemaString,
          conformityAssessmentPeriod: SchemaEPeriod,
          lastConformityAssessment: SchemaString,
          description: SchemaStringLong.nullable(),
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
    const json = c.req.valid("json");
    const param = c.req.valid("param");
    await ServiceComplianceObligation.checkOrgOwnership(c.var, [
      param.subjectId,
    ]);
    const createdId = await ServiceComplianceObligationeomscle.create(
      c.var,
      param.subjectId,
      json,
    );
    return c.json({ id: createdId });
  },
);
RouterComplianceObligationeomscle.openapi(
  createRoute({
    method: "put",
    path: "/item/{subjectId}/eomscle/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({
        subjectId: SchemaUuid,
        id: SchemaUuid,
      }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          relatedeomscleNo: SchemaString,
          currentApplication: SchemaString,
          conformityAssessment: SchemaString,
          conformityAssessmentPeriod: SchemaEPeriod,
          lastConformityAssessment: SchemaString,
          description: SchemaStringLong.nullable(),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceComplianceObligation.checkOrgOwnership(c.var, [
      param.subjectId,
    ]);
    await ServiceComplianceObligationeomscle.update(
      c.var,
      param.subjectId,
      param.id,
      json,
    );
    return UtilHono.resNull(c);
  },
);

RouterComplianceObligationeomscle.openapi(
  createRoute({
    method: "delete",
    path: "/item/{subjectId}/eomscle/{id}",
    request: UtilOpenApi.genRequestParam({
      subjectId: SchemaUuid,
      id: SchemaUuid,
    }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceComplianceObligationeomscle.remove(
      c.var,
      param.subjectId,
      param.id,
    );
    return UtilHono.resNull(c);
  },
);
