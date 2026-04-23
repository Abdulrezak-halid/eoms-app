/**
 * @file: SchemaOutboundIntegrationConfig.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.07.2025
 * Last Modified Date: 09.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUrl } from "@m/core/schemas/SchemaUrl";

import { SchemaEMetricIntegrationPeriod } from "./SchemaEMetricIntegrationPeriod";
import { SchemaEWeatherQueryType } from "./SchemaEWeatherQueryType";

export const SchemaOutboundIntegrationConfig = z
  .object({
    period: SchemaEMetricIntegrationPeriod,
  })
  .and(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("MOCK_SOURCE"),
        param: z.object({
          waves: z.array(
            z.object({
              vMul: z.number(),
              hMul: z.number(),
            }),
          ),
        }),
      }),

      z.object({
        type: z.literal("WEATHER_API"),
        param: z.object({
          queryType: SchemaEWeatherQueryType,
          query: SchemaString,
          baseTemp: z.number(),
        }),
      }),

      z.object({
        type: z.literal("AVEVA_PI"),
        param: z.object({
          baseUrl: SchemaUrl,
          username: SchemaString,
          password: SchemaString,
        }),
      }),
      z.object({
        type: z.literal("OPEN_WEATHER"),
        param: z.object({
          queryType: SchemaEWeatherQueryType,
          query: SchemaString,
          baseTemp: z.number(),
        }),
      }),
    ]),
  );
