import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { SchemaEMetricResourceValuePeriod } from "../../measurement/schemas/SchemaEMetricResourceValuePeriod";
import { SchemaEUnitGroup } from "../../measurement/schemas/SchemaEUnitGroup";
import { ServiceDataView } from "../services/ServiceDataView";
import { RouterDataViewProfile } from "./RouterDataViewProfile";

export const RouterDataView = UtilOpenApi.createRouter<IHonoContextUser>();

RouterDataView.route("/profile", RouterDataViewProfile);

RouterDataView.openapi(
  createRoute({
    method: "get",
    path: "/values/{profileId}",
    request: {
      params: UtilOpenApi.genRequestParamSub({
        profileId: SchemaUuid,
      }),
      query: UtilOpenApi.genRequestQuerySub({
        datetimeMin: SchemaDatetime,
        datetimeMax: SchemaDatetime,
      }),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        period: SchemaEMetricResourceValuePeriod,
        series: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            unit: SchemaEUnitGroup,
            values: z.array(
              z.object({
                value: z.number(),
                datetime: SchemaDate,
              }),
            ),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const query = c.req.valid("query");
    const result = await ServiceDataView.getValues(
      c.var,
      param.profileId,
      query,
    );
    return c.json(result);
  },
);

RouterDataView.openapi(
  createRoute({
    method: "get",
    path: "/names",
    responses: UtilOpenApi.genResponseJson(
      z.array(
        z.object({
          id: SchemaUuid,
          name: SchemaString,
        }),
      ),
    ),
  }),
  async (c) => {
    const result = await ServiceDataView.getNames(c.var);
    return c.json(result);
  },
);
