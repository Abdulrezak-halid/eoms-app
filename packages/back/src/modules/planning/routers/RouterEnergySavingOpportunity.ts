import { createRoute, z } from "@hono/zod-openapi";
import { MAX_API_NUMBER_VALUE } from "common";

import { SchemaEEnergyResource } from "@m/base/schemas/SchemaEEnergyResource";
import { ServiceOrganization } from "@m/base/services/ServiceOrganization";
import { ServiceUser } from "@m/base/services/ServiceUser";
import type { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilArray } from "@m/core/utils/UtilArray";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { ServiceSeu } from "@m/measurement/services/ServiceSeu";
import { SchemaEDocumentApprovementStatus } from "@m/planning/schemas/SchemaEDocumentApprovementStatus";

import { ServiceEnergySavingOpportunity } from "../services/ServiceEnergySavingOpportunity";

export const RouterEnergySavingOpportunity =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterEnergySavingOpportunity.openapi(
  createRoute({
    method: "get",
    request: UtilOpenApi.genRequestQuery({
      datetimeMin: SchemaDatetime.optional(),
      datetimeMax: SchemaDatetime.optional(),
    }),
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            notes: SchemaStringLong.nullable(),
            investmentApplicationPeriodMonth: z.number(),
            approvementStatus: SchemaEDocumentApprovementStatus,
            responsibleUser: z.object({
              id: SchemaUuid,
              displayName: SchemaString,
            }),
            investmentBudget: z.number(),
            estimatedBudgetSaving: z.number(),
            paybackMonth: z.number(),
            calculationMethodOfPayback: SchemaString,
            estimatedSavings: z.array(
              z.object({
                energyResource: SchemaEEnergyResource,
                value: z.number(),
              }),
            ),
            seus: z.array(
              z.object({
                id: SchemaUuid,
                name: SchemaString,
              }),
            ),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const query = c.req.valid("query");
    const records = await ServiceEnergySavingOpportunity.getAll(
      c.var,
      c.var.session.orgId,
      query,
    );
    return c.json({ records });
  },
);

RouterEnergySavingOpportunity.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        name: SchemaString,
        notes: SchemaStringLong.nullable(),
        investmentApplicationPeriodMonth: z
          .number()
          .min(0)
          .max(MAX_API_NUMBER_VALUE),
        investmentBudget: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        estimatedBudgetSaving: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        paybackMonth: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        calculationMethodOfPayback: SchemaString,
        estimatedSavings: UtilArray.zUniqueArray(
          z.object({
            energyResource: SchemaEEnergyResource,
            value: z.number().gt(0).max(MAX_API_NUMBER_VALUE),
          }),
          { key: "energyResource", min: 1 },
        ),
        approvementStatus: SchemaEDocumentApprovementStatus,
        responsibleUserId: SchemaUuid,
        seuIds: UtilArray.zUniqueArray(SchemaUuid),
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
    const energyResources = json.estimatedSavings.map(
      (es) => es.energyResource,
    );

    await ServiceUser.checkOrgOwnership(c.var, [json.responsibleUserId]);
    await ServiceSeu.checkOrgOwnership(c.var, json.seuIds);

    await ServiceOrganization.hasEnergyResource(c.var, energyResources);

    const createdId = await ServiceEnergySavingOpportunity.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterEnergySavingOpportunity.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        notes: SchemaStringLong.nullable(),
        investmentApplicationPeriodMonth: z.number(),
        approvementStatus: SchemaEDocumentApprovementStatus,
        investmentBudget: z.number(),
        estimatedBudgetSaving: z.number(),
        paybackMonth: z.number(),
        calculationMethodOfPayback: SchemaString,
        estimatedSavings: z.array(
          z.object({
            energyResource: SchemaEEnergyResource,
            value: z.number(),
          }),
        ),
        responsibleUser: z.object({
          id: SchemaUuid,
          displayName: SchemaString,
        }),
        seus: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceEnergySavingOpportunity.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterEnergySavingOpportunity.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
          notes: SchemaStringLong.nullable(),
          investmentApplicationPeriodMonth: z
            .number()
            .min(0)
            .max(MAX_API_NUMBER_VALUE),
          approvementStatus: SchemaEDocumentApprovementStatus,
          investmentBudget: z.number().min(0).max(MAX_API_NUMBER_VALUE),
          estimatedBudgetSaving: z.number().min(0).max(MAX_API_NUMBER_VALUE),
          paybackMonth: z.number().min(0).max(MAX_API_NUMBER_VALUE),
          calculationMethodOfPayback: SchemaString,
          estimatedSavings: UtilArray.zUniqueArray(
            z.object({
              energyResource: SchemaEEnergyResource,
              value: z.number().gt(0).max(MAX_API_NUMBER_VALUE),
            }),
            { key: "energyResource", min: 1 },
          ),
          responsibleUserId: SchemaString,
          seuIds: UtilArray.zUniqueArray(SchemaUuid),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    const energyResources = json.estimatedSavings.map(
      (es) => es.energyResource,
    );

    await ServiceUser.checkOrgOwnership(c.var, [json.responsibleUserId]);
    await ServiceSeu.checkOrgOwnership(c.var, json.seuIds);
    await ServiceOrganization.hasEnergyResource(c.var, energyResources);
    await ServiceEnergySavingOpportunity.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterEnergySavingOpportunity.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceEnergySavingOpportunity.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
