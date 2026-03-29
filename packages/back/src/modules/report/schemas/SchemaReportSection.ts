import { z } from "@hono/zod-openapi";
import {
  MAX_REPORT_TABLE_COLUMN_LENGTH,
  MAX_REPORT_TABLE_ROW_LENGTH,
} from "common";

import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilArray } from "@m/core/utils/UtilArray";
import { SchemaEUnit } from "@m/measurement/schemas/SchemaEUnit";

import { SchemaReportChartColor } from "./SchemaReportChartColor";
import { SchemaPlainOrTranslatableText } from "./SchemaTranslatableKeys";

export const SchemaReportSection = z.object({
  title: SchemaPlainOrTranslatableText,
  customDate: z
    .object({
      start: SchemaDate,
      end: SchemaDate,
    })
    .optional(),
  depth: z.number().optional(),
  content: z
    .union([
      z.object({
        type: z.literal("HEADER"),
      }),
      z.object({
        type: z.literal("TEXT"),
        value: SchemaPlainOrTranslatableText.optional(),
      }),
      z.object({
        type: z.literal("TABLE_HORIZONTAL"),
        rows: z
          .array(
            z.object({
              title: SchemaPlainOrTranslatableText,
              value: SchemaPlainOrTranslatableText,
            }),
          )
          .max(MAX_REPORT_TABLE_ROW_LENGTH)
          .optional(),
      }),
      z.object({
        type: z.literal("TABLE_VERTICAL"),
        data: z
          .object({
            headers: z
              .array(
                z.object({
                  title: SchemaPlainOrTranslatableText,
                  valueType: z.union([z.literal("TEXT"), z.literal("NUMBER")]),
                  unit: SchemaEUnit.optional(),
                }),
              )
              .max(MAX_REPORT_TABLE_COLUMN_LENGTH),
            rows: z
              .array(
                z
                  .array(z.union([SchemaPlainOrTranslatableText, z.number()]))
                  .max(MAX_REPORT_TABLE_COLUMN_LENGTH),
              )
              .max(MAX_REPORT_TABLE_ROW_LENGTH),
          })
          .superRefine((data, ctx) => {
            const headerCount = data.headers.length;

            data.rows.forEach((row, index) => {
              if (row.length > headerCount) {
                ctx.addIssue({
                  code: "custom",
                  message: `Row length (${row.length}) cannot exceed header count (${headerCount}).`,
                  path: ["rows", index],
                });
              }
            });
          })
          .optional(),
      }),
      z.object({
        type: z.literal("COMPANY_INFO"),
      }),
      z.object({
        type: z.literal("ENERGY_POLICIES"),
      }),
      z.object({
        type: z.literal("SCOPE_AND_LIMITS"),
      }),
      z.object({
        type: z.literal("ENERGY_SAVING_OPPORTUNITIES"),
      }),
      z.object({
        type: z.literal("ACTION_PLANS"),
      }),
      z.object({
        type: z.literal("CRITICAL_OPERATIONAL_PARAMETERS"),
      }),
      z.object({
        type: z.literal("TARGETS"),
      }),
      z.object({
        type: z.literal("SEU_GRAPH"),
        seuIds: UtilArray.zUniqueArray(SchemaUuid).optional(),
        primary: z.boolean().optional(),
        noGroup: z.boolean().optional(),
      }),
      z.object({
        type: z.literal("SEU_TOTAL_CONSUMPTION_PIE_CHART"),
        seuIds: UtilArray.zUniqueArray(SchemaUuid).optional(),
        primary: z.boolean().optional(),
        noGroup: z.boolean().optional(),
      }),
      z.object({
        type: z.literal("SEU_CONSUMPTION_TABLE"),
        seuIds: UtilArray.zUniqueArray(SchemaUuid).optional(),
        primary: z.boolean().optional(),
      }),
      z.object({
        type: z.literal("TOTAL_ENERGY_CONSUMPTION_COST_TABLE"),
      }),
      z.object({
        type: z.literal("REGRESSION_RESULT"),
        resultId: SchemaUuid.optional(),
      }),
      z.object({
        type: z.literal("METER_SLICE_GRAPH"),
        sliceIds: UtilArray.zUniqueArray(SchemaUuid).optional(),
        noGroup: z.boolean().optional(),
      }),
      z.object({
        type: z.literal("REGRESSION_ANALYSIS_TABLE"),
        primary: z.boolean().optional(),
      }),
      z.object({
        type: z.literal("ENERGY_CONSUMPTION_PIE_CHART"),
      }),
      z.object({
        type: z.literal("TOTAL_MONTHLY_ENERGY_CONSUMPTION_COST_TABLE"),
      }),
      // Drivers
      z.object({
        type: z.literal("PRIMARY_REGRESSION_DRIVER_LIST"),
      }),

      // Custom sections for dev purposes
      // -------------------------------------------------------------
      z.object({
        type: z.literal("CHART_CUSTOM"),
        data: z.object({
          type: z.union([z.literal("line"), z.literal("scatter")]).optional(),
          series: z.array(
            z.object({
              type: z
                .union([z.literal("line"), z.literal("scatter")])
                .optional(),
              name: SchemaString,
              unit: SchemaEUnit,
              color: SchemaReportChartColor.optional(),
              data: z.array(
                z
                  .object({
                    x: z.number(),
                    y: z.number(),
                  })
                  .or(
                    z.object({
                      x: SchemaString,
                      y: z.number(),
                    }),
                  ),
              ),
            }),
          ),
        }),
      }),
      z.object({
        type: z.literal("HEATMAP_CUSTOM"),
        data: z.object({
          name: SchemaString,
          serie: z.array(
            z.object({
              label: SchemaString,
              columns: z.array(
                z.object({
                  value: z.number(),
                  description: SchemaStringLong.optional(),
                }),
              ),
            }),
          ),
          columnLabels: z.array(SchemaString),
        }),
      }),
      z.object({
        type: z.literal("PIE_CHART_CUSTOM"),
        data: z.object({
          title: SchemaString.optional(),
          unit: SchemaEUnit,
          records: z.array(
            z.object({
              label: SchemaString,
              value: z.number(),
              color: SchemaReportChartColor.optional(),
            }),
          ),
        }),
      }),
    ])
    .optional(),
});
