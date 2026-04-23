/**
 * @file: SchemaAdvancedRegressionResult.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 25.07.2025
 * Last Modified Date: 25.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { SchemaEMetricResourceValuePeriod } from "@m/measurement/schemas/SchemaEMetricResourceValuePeriod";
import { SchemaEUnitGroup } from "@m/measurement/schemas/SchemaEUnitGroup";
import { SchemaTimedValue } from "@m/measurement/schemas/SchemaTimedValueList";

export const SchemaAdvancedRegressionResult = z.object({
  id: SchemaUuid,
  seu: z
    .object({
      id: SchemaUuid,
      name: SchemaString,
    })
    .nullable(),
  drivers: z.array(
    z.object({
      id: SchemaUuid,
      name: SchemaString,
      unitGroup: SchemaEUnitGroup,
    }),
  ),
  slices: z.array(
    z.object({
      id: SchemaUuid,
      name: SchemaString,
    }),
  ),
  primary: z.boolean(),
  dateTrainStart: SchemaDatetime,
  dateTrainEnd: SchemaDatetime,
  datePredictStart: SchemaDatetime,
  datePredictEnd: SchemaDatetime,
  period: SchemaEMetricResourceValuePeriod,
  rSquared: z.number().nullable(),
  rmse: z.number(),
  trainRecordIgnoredCount: z.number(),
  // trainRecordInterpolateRate: z.number(),
  // trainRecordInterpolatedCount: z.number(),

  expectedValues: z.array(
    z.object({
      value: z.number(),
      datetime: SchemaDatetime,
    }),
  ),
  observedValues: z.array(
    z.object({
      value: z.number(),
      datetime: SchemaDatetime,
    }),
  ),
  differenceValues: z.array(
    z.object({
      value: z.number(),
      datetime: SchemaDatetime,
    }),
  ),
  cumulativeDifferenceValues: z.array(
    z.object({
      value: z.number(),
      datetime: SchemaDatetime,
    }),
  ),

  sourceDrivers: z.array(
    z.object({
      id: SchemaUuid,
      values: SchemaTimedValue.array(),
    }),
  ),
  sourceMeterSlices: z.array(
    z.object({
      id: SchemaUuid,
      values: SchemaTimedValue.array(),
    }),
  ),
  createdAt: SchemaDatetime,
});
