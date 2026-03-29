import { EApiFailCode, EXAMPLE_USER_EMAIL } from "common";
import { eq } from "drizzle-orm";

import { TbAdvancedRegressionResult } from "@m/analysis/orm/TbAdvancedRegressionResult";
import { TbUser } from "@m/base/orm/TbUser";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextCore, IContextUser } from "@m/core/interfaces/IContext";
import { UtilLanguage } from "@m/core/utils/UtilLanguage";
import { TbMeterSlice } from "@m/measurement/orm/TbMeterSlice";
import { TbSeu } from "@m/measurement/orm/TbSeu";
import { IContextReport } from "@m/report/interfaces/IContextReport";
import { IReport } from "@m/report/interfaces/IReport";
import { UtilReport } from "@m/report/utils/UtilReport";

export namespace UtilDevReport {
  export async function generateReport(
    c: IContextCore,
    tzOffset: number,
    lang?: string,
  ) {
    const [user] = await c.db
      .select({ orgId: TbUser.orgId, id: TbUser.id })
      .from(TbUser)
      .where(eq(TbUser.email, EXAMPLE_USER_EMAIL));

    if (!user) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Example user is not found.",
      );
    }

    const seuIds = await c.db
      .select({ id: TbSeu.id })
      .from(TbSeu)
      .where(eq(TbSeu.orgId, user.orgId));

    const [regressionResultId] = await c.db
      .select({ id: TbAdvancedRegressionResult.id })
      .from(TbAdvancedRegressionResult)
      .where(eq(TbAdvancedRegressionResult.orgId, user.orgId))
      .limit(1);

    if (!regressionResultId) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Regression result is not found.",
      );
    }

    const meterSlices = await c.db
      .select({ id: TbMeterSlice.id })
      .from(TbMeterSlice)
      .where(eq(TbMeterSlice.orgId, user.orgId));

    const contextReport: IContextReport = {
      ...c,
      orgId: user.orgId,
      i18n: await UtilLanguage.create(c, lang),
      tzOffset,
      config: UtilReport.convertDateRangeToDatetimeRange(
        "2025-08-01",
        c.nowDate,
      ),
    };

    const contextUser: IContextUser = {
      ...c,
      orgId: user.orgId,
      session: {
        orgId: user.orgId,
        token: "example_token",
        orgPlan: { features: ["UNCATEGORIZED"], maxUserCount: 1 },
        permissions: ["/REPORT"],
        userId: user.id,
      },
    };

    const report: IReport = {
      title: { type: "PLAIN", value: "Factory Energy Consumption Report" },
      dateStart: "2025-08-01",
      dateEnd: c.nowDate,
      authorIds: [user.id],
      sections: [
        {
          title: { type: "PLAIN", value: "Header" },
          content: { type: "HEADER" },
        },
        {
          title: { type: "PLAIN", value: "Header Content" },
          content: { type: "TEXT", value: { type: "PLAIN", value: "Content" } },
          depth: 1,
        },
        {
          title: { type: "PLAIN", value: "Electricity Consumption" },
          content: {
            type: "CHART_CUSTOM",
            data: {
              type: "line",
              series: [
                {
                  name: "Household A",
                  color: "blue",
                  unit: "ENERGY_KWH",
                  data: [
                    { x: 1, y: 32 },
                    { x: 2, y: 28 },
                    { x: 3, y: 35 },
                    { x: 4, y: 30 },
                    { x: 5, y: 33 },
                    { x: 6, y: 31 },
                    { x: 7, y: 29 },
                    { x: 8, y: 34 },
                    { x: 9, y: 36 },
                    { x: 10, y: 32 },
                  ],
                },
                {
                  name: "Household B",
                  color: "red",
                  unit: "ENERGY_KWH",
                  data: [
                    { x: 1, y: 25 },
                    { x: 2, y: 29 },
                    { x: 3, y: 31 },
                    { x: 4, y: 27 },
                    { x: 5, y: 30 },
                    { x: 6, y: 28 },
                    { x: 7, y: 26 },
                    { x: 8, y: 32 },
                    { x: 9, y: 33 },
                    { x: 10, y: 29 },
                  ],
                },
              ],
            },
          },
        },
        {
          title: { type: "PLAIN", value: "Electricity Consumption with date" },
          content: {
            type: "CHART_CUSTOM",
            data: {
              type: "line",
              series: [
                {
                  name: "Household A",
                  color: "blue",
                  unit: "ENERGY_KWH",
                  data: [
                    { x: "2025-09-01T00:00:00.000Z", y: 35 },
                    { x: "2025-09-02T00:00:00.000Z", y: 25 },
                    { x: "2025-09-03T00:00:00.000Z", y: 33 },
                    { x: "2025-09-04T00:00:00.000Z", y: 36 },
                    { x: "2025-09-05T00:00:00.000Z", y: 34 },
                    { x: "2025-09-06T00:00:00.000Z", y: 31 },
                    { x: "2025-09-07T00:00:00.000Z", y: 29 },
                    { x: "2025-09-08T00:00:00.000Z", y: 34 },
                    { x: "2025-09-09T00:00:00.000Z", y: 36 },
                    { x: "2025-09-10T00:00:00.000Z", y: 32 },
                  ],
                },
                {
                  name: "Household B",
                  unit: "ENERGY_KWH",
                  color: "red",
                  data: [
                    { x: "2025-09-01T00:00:00.000Z", y: 25 },
                    { x: "2025-09-02T00:00:00.000Z", y: 29 },
                    { x: "2025-09-03T00:00:00.000Z", y: 31 },
                    { x: "2025-09-04T00:00:00.000Z", y: 27 },
                    { x: "2025-09-05T00:00:00.000Z", y: 30 },
                    { x: "2025-09-06T00:00:00.000Z", y: 28 },
                    { x: "2025-09-07T00:00:00.000Z", y: 26 },
                    { x: "2025-09-08T00:00:00.000Z", y: 32 },
                    { x: "2025-09-09T00:00:00.000Z", y: 33 },
                    { x: "2025-09-10T00:00:00.000Z", y: 29 },
                  ],
                },
                {
                  name: "Household C",
                  unit: "ENERGY_KWH",
                  color: "green",
                  data: [
                    { x: "2025-09-01T00:00:00.000Z", y: 28 },
                    { x: "2025-09-02T00:00:00.000Z", y: 27 },
                    { x: "2025-09-03T00:00:00.000Z", y: 30 },
                    { x: "2025-09-04T00:00:00.000Z", y: 32 },
                    { x: "2025-09-05T00:00:00.000Z", y: 29 },
                    { x: "2025-09-06T00:00:00.000Z", y: 31 },
                    { x: "2025-09-07T00:00:00.000Z", y: 28 },
                    { x: "2025-09-08T00:00:00.000Z", y: 33 },
                    { x: "2025-09-09T00:00:00.000Z", y: 34 },
                    { x: "2025-09-10T00:00:00.000Z", y: 30 },
                  ],
                },
              ],
            },
          },
        },

        {
          title: {
            type: "PLAIN",
            value: "Electricity Consumption with minutely data",
          },
          content: {
            type: "CHART_CUSTOM",
            data: {
              type: "line",
              series: [
                {
                  name: "Household C",
                  unit: "ENERGY_KWH",
                  color: "green",
                  data: [
                    { x: "2025-09-01T22:00:00.000Z", y: 28 },
                    { x: "2025-09-01T23:00:00.000Z", y: 27 },
                    { x: "2025-09-02T00:00:00.000Z", y: 30 },
                    { x: "2025-09-02T01:00:00.000Z", y: 32 },
                    { x: "2025-09-02T02:00:00.000Z", y: 29 },
                    { x: "2025-09-02T03:00:00.000Z", y: 31 },
                    { x: "2025-09-02T05:00:00.000Z", y: 28 },
                    { x: "2025-09-02T08:00:00.000Z", y: 33 },
                    { x: "2025-09-02T09:00:00.000Z", y: 34 },
                    { x: "2025-09-02T10:00:00.000Z", y: 30 },
                  ],
                },
              ],
            },
          },
        },

        {
          title: {
            type: "PLAIN",
            value: "Electricity Consumption with missing data",
          },
          content: {
            type: "CHART_CUSTOM",
            data: {
              type: "line",
              series: [
                {
                  name: "Household C",
                  unit: "ENERGY_KWH",
                  color: "green",
                  data: [
                    { x: "2025-09-01T00:00:00.000Z", y: 28 },
                    { x: "2025-09-02T00:00:00.000Z", y: 27 },
                    { x: "2025-09-03T00:00:00.000Z", y: 30 },
                    { x: "2025-09-04T00:00:00.000Z", y: 32 },
                    { x: "2025-09-05T00:00:00.000Z", y: 29 },
                    { x: "2025-09-06T00:00:00.000Z", y: 31 },
                    { x: "2025-09-07T00:00:00.000Z", y: 28 },
                    { x: "2025-09-08T00:00:00.000Z", y: 33 },
                    { x: "2025-09-09T00:00:00.000Z", y: 34 },
                    { x: "2025-09-13T00:00:00.000Z", y: 30 },
                  ],
                },
              ],
            },
          },
        },

        {
          title: { type: "PLAIN", value: "Device Power Consumption (Scatter)" },
          content: {
            type: "CHART_CUSTOM",
            data: {
              type: "scatter",
              series: [
                {
                  name: "Kitchen Appliances",
                  unit: "ENERGY_KWH",
                  color: "yellow",
                  data: [
                    { x: 100, y: 1.2 },
                    { x: 150, y: 1.5 },
                    { x: 200, y: 2.0 },
                    { x: 120, y: 1.3 },
                    { x: 180, y: 1.8 },
                    { x: 140, y: 1.4 },
                    { x: 160, y: 1.6 },
                    { x: 170, y: 1.7 },
                    { x: 130, y: 1.3 },
                    { x: 190, y: 1.9 },
                  ],
                },
                {
                  name: "Entertainment Devices",
                  unit: "ENERGY_KWH",
                  color: "red",
                  data: [
                    { x: 75, y: 0.8 },
                    { x: 120, y: 1.1 },
                    { x: 180, y: 1.6 },
                    { x: 90, y: 0.9 },
                    { x: 150, y: 1.4 },
                    { x: 110, y: 1.0 },
                    { x: 130, y: 1.3 },
                    { x: 160, y: 1.5 },
                    { x: 140, y: 1.2 },
                    { x: 170, y: 1.6 },
                  ],
                },
              ],
            },
          },
        },

        {
          title: {
            type: "PLAIN",
            value: "Device Power Consumption (Scatter and Line)",
          },
          content: {
            type: "CHART_CUSTOM",
            data: {
              series: [
                {
                  type: "scatter",
                  name: "Kitchen Appliances",
                  unit: "ENERGY_KWH",
                  color: "blue",
                  data: [
                    { x: 100, y: 1.0 },
                    { x: 120, y: 1.2 },
                    { x: 140, y: 1.4 },
                    { x: 160, y: 1.6 },
                    { x: 180, y: 1.8 },
                    { x: 200, y: 2.0 },
                    { x: 220, y: 2.2 },
                    { x: 240, y: 2.4 },
                    { x: 260, y: 2.6 },
                    { x: 280, y: 2.8 },
                  ],
                },
                {
                  type: "line",
                  name: "Entertainmen Devices",
                  unit: "ENERGY_KWH",
                  color: "red",
                  data: [
                    { x: 80, y: 0.8 },
                    { x: 100, y: 0.6 },
                    { x: 120, y: 0.4 },
                    { x: 140, y: 0.2 },
                    { x: 160, y: 0.5 },
                    { x: 180, y: 0.8 },
                    { x: 200, y: 1.0 },
                    { x: 220, y: 1.2 },
                    { x: 240, y: 2.4 },
                    { x: 260, y: 1.6 },
                  ],
                },
              ],
            },
          },
        },

        {
          title: { type: "PLAIN", value: "Heatmap" },
          content: {
            type: "HEATMAP_CUSTOM",
            data: {
              name: "Energy Consumption",
              columnLabels: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
              ],
              serie: [
                {
                  label: "New York",
                  columns: [
                    {
                      value: 120,
                      description: "NY Jan desc",
                    },
                    {
                      value: 130,
                      description: "NY Feb desc",
                    },
                    {
                      value: 125,
                      description: "NY Mar desc",
                    },
                    {
                      value: 140,
                      description: "NY Apr desc",
                    },
                    {
                      value: 150,
                      description: "NY May desc",
                    },
                    {
                      value: 160,
                      description: "NY Jun desc",
                    },
                  ],
                },
                {
                  label: "Los Angeles",
                  columns: [
                    {
                      value: 100,
                      description: "LA Jan desc",
                    },
                    {
                      value: 110,
                      description: "LA Feb desc",
                    },
                    {
                      value: 115,
                      description: "LA Mar desc",
                    },
                    {
                      value: 120,
                      description: "LA Apr desc",
                    },
                    {
                      value: 125,
                      description: "LA May desc",
                    },
                    {
                      value: 130,
                      description: "LA Jun desc",
                    },
                  ],
                },
                {
                  label: "Chicago",
                  columns: [
                    {
                      value: 90,
                      description: "CHI Jan desc",
                    },
                    {
                      value: 95,
                      description: "CHI Feb desc",
                    },
                    {
                      value: 100,
                      description: "CHI Mar desc",
                    },
                    {
                      value: 105,
                      description: "CHI Apr desc",
                    },
                    {
                      value: 110,
                      description: "CHI May desc",
                    },
                    {
                      value: 115,
                      description: "CHI Jun desc",
                    },
                  ],
                },
                {
                  label: "Houston",
                  columns: [
                    {
                      value: 80,
                      description: "HOU Jan desc",
                    },
                    {
                      value: 85,
                      description: "HOU Feb desc",
                    },
                    {
                      value: 90,
                      description: "HOU Mar desc",
                    },
                    {
                      value: 95,
                      description: "HOU Apr desc",
                    },
                    {
                      value: 100,
                      description: "HOU May desc",
                    },
                    {
                      value: 155,
                      description: "HOU Jun desc",
                    },
                  ],
                },
                {
                  label: "Miami",
                  columns: [
                    {
                      value: 70,
                      description: "MIA Jan desc",
                    },
                    {
                      value: 75,
                      description: "MIA Feb desc",
                    },
                    {
                      value: 80,
                      description: "No desc after this record.",
                    },
                    { value: 85 },
                    {
                      value: 90,
                      description: "MIA May desc",
                    },
                    {
                      value: 95,
                      description: "MIA Jun desc",
                    },
                  ],
                },
              ],
            },
          },
        },

        {
          title: { type: "PLAIN", value: "Pie Chart Overview" },
          content: {
            type: "PIE_CHART_CUSTOM",
            data: {
              unit: "ENERGY_KWH",
              records: [
                {
                  label: "Coal",
                  value: 35,
                  color: "cyan",
                },
                {
                  label: "Natural Gas",
                  value: 25,
                  color: "blue",
                },
                {
                  label: "Oil",
                  value: 20,
                  color: "yellow",
                },
                {
                  label: "Nuclear",
                  value: 10,
                  color: "purple",
                },
                {
                  label: "Hydropower",
                  value: 5,
                  color: "teal",
                },
                {
                  label: "Solar",
                  value: 4,
                  color: "green",
                },
                {
                  label: "Wind",
                  value: 9,
                  color: "red",
                },
              ],
            },
          },
        },
        {
          title: {
            type: "PLAIN",
            value: "Grouped Seu Total Consumption Pie Chart",
          },
          content: {
            type: "SEU_TOTAL_CONSUMPTION_PIE_CHART",
            seuIds: seuIds.map((seu) => seu.id),
          },
        },
        {
          title: {
            type: "PLAIN",
            value: "Non Grouped Seu Total Consumption Pie Chart",
          },
          content: {
            type: "SEU_TOTAL_CONSUMPTION_PIE_CHART",
            seuIds: seuIds.map((seu) => seu.id),
            noGroup: true,
          },
        },
        {
          title: {
            type: "PLAIN",
            value: "Primary Seu Total Consumption Pie Chart",
          },
          content: {
            type: "SEU_TOTAL_CONSUMPTION_PIE_CHART",
            primary: true,
          },
        },
        {
          title: {
            type: "PLAIN",
            value: "Grouped Seu Graph Overview",
          },
          content: {
            type: "SEU_GRAPH",
            seuIds: seuIds.map((seu) => seu.id),
          },
        },
        {
          title: {
            type: "PLAIN",
            value: "Non Grouped Seu Graph Overview",
          },
          content: {
            type: "SEU_GRAPH",
            seuIds: seuIds.map((seu) => seu.id),
            noGroup: true,
          },
        },
        {
          title: {
            type: "PLAIN",
            value: "Primary Seu Graph Overview",
          },
          content: {
            type: "SEU_GRAPH",
            primary: true,
          },
        },
        {
          title: {
            type: "PLAIN",
            value: "Primary Seu Consumption Table Overview",
          },
          content: {
            type: "SEU_CONSUMPTION_TABLE",
            primary: true,
          },
        },
        {
          title: { type: "PLAIN", value: "Regression Result Overview" },
          content: {
            type: "REGRESSION_RESULT",
            resultId: regressionResultId.id,
          },
        },
        {
          title: {
            type: "PLAIN",
            value: "Primary Regression Analysis Table Overview",
          },
          content: {
            type: "REGRESSION_ANALYSIS_TABLE",
            primary: true,
          },
        },
        {
          title: { type: "PLAIN", value: "Regression Analysis Table Overview" },
          content: {
            type: "REGRESSION_ANALYSIS_TABLE",
          },
        },
        {
          title: { type: "PLAIN", value: "Meter Slice Graph Overview Grouped" },
          content: {
            type: "METER_SLICE_GRAPH",
            sliceIds: meterSlices.map((slice) => slice.id),
          },
        },
        {
          title: {
            type: "PLAIN",
            value: "Meter Slice Graph Overview Non Grouped",
          },
          content: {
            type: "METER_SLICE_GRAPH",
            sliceIds: meterSlices.map((slice) => slice.id),
            noGroup: true,
          },
        },
        {
          title: { type: "PLAIN", value: "Overview" },
          content: {
            type: "TEXT",
            value: {
              type: "PLAIN",
              value:
                "This report provides a detailed overview of the energy consumption and efficiency of our main manufacturing plant for August 2025.",
            },
          },
        },
        {
          title: { type: "PLAIN", value: "Total Energy Consumption" },
          depth: 1,
          content: {
            type: "TEXT",
            value: {
              type: "PLAIN",
              value:
                "The factory consumed a total of 1,250,000 kWh during the reporting period, representing a 5% increase compared to July 2025.",
            },
          },
        },
        {
          title: { type: "PLAIN", value: "Breakdown by Source" },
          depth: 1,
          content: {
            type: "TEXT",
            value: {
              type: "PLAIN",
              value:
                "Electricity: 800,000 kWh, Natural Gas: 350,000 kWh, Solar: 100,000 kWh.",
            },
          },
        },
        {
          title: { type: "PLAIN", value: "Intro" },
          content: {
            type: "TEXT",
            value: { type: "PLAIN", value: "This is a simple text." },
          },
        },
        {
          title: { type: "PLAIN", value: "KPI Table" },
          content: {
            type: "TABLE_HORIZONTAL",
            rows: [
              {
                title: { type: "PLAIN", value: "Energy" },
                value: { type: "PLAIN", value: "1000 kWh" },
              },
              {
                title: { type: "PLAIN", value: "Cost" },
                value: { type: "PLAIN", value: "$500" },
              },
            ],
          },
        },
        {
          title: { type: "PLAIN", value: "Production Data" },
          content: {
            type: "TABLE_VERTICAL",
            data: {
              headers: [
                { title: { type: "PLAIN", value: "Month" }, valueType: "TEXT" },
                {
                  title: { type: "PLAIN", value: "Output" },
                  valueType: "NUMBER",
                },
              ],
              rows: [
                [{ type: "PLAIN", value: "August" }, 1200],
                [{ type: "PLAIN", value: "September" }, 1400],
              ],
            },
          },
        },
        {
          title: { type: "PLAIN", value: "Company Overview" },
          content: { type: "COMPANY_INFO" },
        },
        {
          title: { type: "PLAIN", value: "Policy Overview" },
          content: { type: "ENERGY_POLICIES" },
        },
        {
          title: { type: "PLAIN", value: "Scope and limits Overview" },
          content: { type: "SCOPE_AND_LIMITS" },
        },
        {
          title: {
            type: "PLAIN",
            value: "Energy Saving Opportunities Overview",
          },
          content: { type: "ENERGY_SAVING_OPPORTUNITIES" },
        },
        {
          title: { type: "PLAIN", value: "Action Plans Overview" },
          content: { type: "ACTION_PLANS" },
        },
        {
          title: {
            type: "PLAIN",
            value: "Critical Operational Parameters Overview",
          },
          content: { type: "CRITICAL_OPERATIONAL_PARAMETERS" },
        },
        {
          title: {
            type: "PLAIN",
            value: "Targets Overview",
          },
          content: { type: "TARGETS" },
        },
        {
          title: {
            type: "PLAIN",
            value: "Drivers And Evaluation of Consumption Effects",
          },
          content: { type: "PRIMARY_REGRESSION_DRIVER_LIST" },
        },
        {
          title: { type: "PLAIN", value: "Seu Consumption Table Overview" },
          content: {
            type: "SEU_CONSUMPTION_TABLE",
            seuIds: seuIds.map((d) => d.id),
          },
        },
        {
          title: {
            type: "PLAIN",
            value: "Primary Seu Consumption Table Overview",
          },
          content: { type: "SEU_CONSUMPTION_TABLE", primary: true },
        },
        {
          title: {
            type: "PLAIN",
            value: "Total Consumption Cost Table Overview",
          },
          content: { type: "TOTAL_MONTHLY_ENERGY_CONSUMPTION_COST_TABLE" },
        },
        {
          title: {
            type: "PLAIN",
            value: "Energy Consumption Pie Chart Overview",
          },
          content: { type: "ENERGY_CONSUMPTION_PIE_CHART" },
        },
        {
          title: {
            type: "PLAIN",
            value: "Energy Consumption Table Overview",
          },
          content: { type: "TOTAL_ENERGY_CONSUMPTION_COST_TABLE" },
        },
      ],
    };

    return { report, contextReport, contextUser };
  }
}
