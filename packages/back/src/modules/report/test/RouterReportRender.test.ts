import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperAdvancedRegressionAnalysis } from "@m/analysis/test/TestHelperAdvancedRegressionAnalysis";
import { TestHelperDepartment } from "@m/base/test/TestHelperDepartment";
import { TestHelperUser } from "@m/base/test/TestHelperUser";
import { TestHelperMeter } from "@m/measurement/test/TestHelperMeter";
import { TestHelperSeu } from "@m/measurement/test/TestHelperSeu";

import { TestHelperReportRender } from "./TestHelperReportRender";

describe("E2E - RouterReportRender", () => {
  it("report layout", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: { type: "PLAIN", value: "Factory Energy Consumption Report" },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
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
            depth: 2,
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
            title: {
              type: "PLAIN",
              value: "Energy Efficiency Measures",
            },
            content: {
              type: "TEXT",
              value: {
                type: "PLAIN",
                value:
                  "Several measures were implemented to reduce energy consumption, including upgrading lighting systems and optimizing machinery operation schedules.",
              },
            },
          },
          {
            title: { type: "PLAIN", value: "Lighting Upgrade" },
            depth: 1,
            content: {
              type: "TEXT",
              value: {
                type: "PLAIN",
                value:
                  "Replaced all high-consumption bulbs with LED alternatives, reducing electricity use in production halls by 12%.",
              },
            },
          },
          {
            title: { type: "PLAIN", value: "Expected Savings" },
            depth: 2,
            content: {
              type: "TEXT",
              value: {
                type: "PLAIN",
                value: "Projected annual savings: 50,000 kWh and $6,000.",
              },
            },
          },

          {
            title: { type: "PLAIN", value: "Recommendations" },
            content: {
              type: "TEXT",
              value: {
                type: "PLAIN",
                value:
                  "Further efficiency improvements can be achieved through automated energy monitoring, employee training, and investment in renewable energy sources.",
              },
            },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("Change language using header", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      headers: {
        "accept-language": "tr-TR",
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Test Raporu",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("Header section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Header Test Report",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Intro",
            },
            content: {
              type: "HEADER",
            },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("TEXT section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "TEXT Test Report",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Intro",
            },
            content: {
              type: "TEXT",
              value: {
                type: "PLAIN",
                value: "This is a simple text.",
              },
            },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("COMPANY_INFO section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Company Info Test",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Company Overview",
            },
            content: { type: "COMPANY_INFO" },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("TABLE_HORIZONTAL section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Horizontal Table Test",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "KPI Table",
            },
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
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("TABLE_VERTICAL section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: { type: "PLAIN", value: "Vertical Table Test" },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: { type: "PLAIN", value: "Production Data" },
            content: {
              type: "TABLE_VERTICAL",
              data: {
                headers: [
                  {
                    title: { type: "PLAIN", value: "Month" },
                    valueType: "TEXT",
                  },
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
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("TABLE_VERTICAL section must throw error.", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: { type: "PLAIN", value: "Vertical Table Test" },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: { type: "PLAIN", value: "Production Data" },
            content: {
              type: "TABLE_VERTICAL",
              data: {
                headers: [
                  {
                    title: { type: "PLAIN", value: "Month" },
                    valueType: "TEXT",
                  },
                  {
                    title: { type: "PLAIN", value: "Output" },
                    valueType: "NUMBER",
                  },
                ],
                rows: [
                  [{ type: "PLAIN", value: "August" }, 1200],
                  [{ type: "PLAIN", value: "September" }, 1400, 1000],
                ],
              },
            },
          },
        ],
      },
      parseAs: "text",
    });

    expect(res).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("ENERGY_POLICIES section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    await client.POST("/u/commitment/energy-policy/item", {
      body: {
        content: "Content of the energy policy item",
        period: "WEEKLY",
        target: null,
        type: "type",
      },
    });

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: { type: "PLAIN", value: "Energy Policies Section" },
        dateStart: "1970-01-01",
        dateEnd: "2042-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: { type: "PLAIN", value: "Policy Overview" },
            content: { type: "ENERGY_POLICIES" },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("Scope and limits section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const departmentId = await TestHelperDepartment.create(
      client,
      "Department",
    );

    const scopeAndLimits = await client.POST(
      "/u/commitment/scope-and-limit/item",
      {
        body: {
          physicalLimits: "Building A",
          products: ["Product A", "Product B"],
          excludedResources: ["ELECTRIC"],
          excludedResourceReason: "Air conditioner",
          departmentIds: [departmentId],
        },
      },
    );
    expect(scopeAndLimits).toBeApiOk();

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: { type: "PLAIN", value: "Scope and limits Test" },
        dateStart: "1970-01-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: { type: "PLAIN", value: "Scope and limits Overview" },
            content: { type: "SCOPE_AND_LIMITS" },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("ENERGY_SAVING_OPPORTUNITIES section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const seuId = await TestHelperSeu.createTestSeu(client, "Test SEU");

    const abc = await client.POST(
      "/u/planning/energy-saving-opportunity/item",
      {
        body: {
          name: "Test Energy Saving Opportunity",
          notes: "Test Note",
          responsibleUserId: session.userId,
          approvementStatus: "APPROVED",
          investmentApplicationPeriodMonth: 5,
          investmentBudget: 10000,
          estimatedBudgetSaving: 5000,
          paybackMonth: 24,
          calculationMethodOfPayback: "Simple Payback",
          estimatedSavings: [
            { energyResource: "ELECTRIC", value: 5000 },
            { energyResource: "GAS", value: 2000 },
          ],
          seuIds: [seuId.id],
        },
      },
    );
    expect(abc).toBeApiOk();

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Energy Saving Opportunities section Test",
        },
        dateStart: "1970-01-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Energy Saving Opportunities Overview",
            },
            content: { type: "ENERGY_SAVING_OPPORTUNITIES" },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("ACTION_PLANS section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    await client.POST("/u/planning/action-plan/item", {
      body: {
        name: "Test Action Plan",
        reasonsForStatus: "Test Reasons for Status",
        actualSavingsVerifications: "Test Actual Savings Verifications",
        actualSavings: "Test Actual Savings",
        startDate: "2025-08-01",
        targetIdentificationDate: "2025-08-01",
        actualIdentificationDate: "2025-08-01",
        responsibleUserId: session.userId,
        approvementStatus: "APPROVED",
      },
    });

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: { type: "PLAIN", value: "Action Plans Test" },
        dateStart: "1970-01-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: { type: "PLAIN", value: "Action Plans Overview" },
            content: { type: "ACTION_PLANS" },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("CRITICAL_OPERATIONAL_PARAMETERS section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const seu1 = await TestHelperSeu.createTestSeu(client, "seu1");
    const resUser = await TestHelperUser.createTestUser(client, "User1");
    const resUser2 = await TestHelperUser.createTestUser(client, "User2");

    await client.POST("/u/support/critical-operational-parameter/item", {
      body: {
        seuId: seu1.id,
        energyResource: "DIESEL",
        parameter: "Test Parameter",
        period: "MONTHLY",
        unit: "PIECE",
        normalSettingValue: 10,
        lowerLimit: 2,
        upperLimit: 20,
        accuracyCalibrationFrequency: 5,
        measurementTool: "Test Measurement Tool",
        valueResponsibleUserId: resUser.data!.id,
        deviationResponsibleUserId: resUser2.data!.id,
        note: "Test Note",
        controlDate: "2021-10-10",
      },
    });

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Critical Operational Parameters section Test",
        },
        dateStart: "1970-01-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Critical Operational Parameters Overview",
            },
            content: { type: "CRITICAL_OPERATIONAL_PARAMETERS" },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("TARGETS section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    await client.POST("/u/planning/target/item", {
      body: {
        year: 2025,
        energyResource: "GAS",
        consumption: 2000,
        percentage: 75,
      },
    });

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Targets section Test",
        },
        dateStart: "1970-01-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Targets Overview",
            },
            content: { type: "TARGETS" },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("TARGETS with empty title", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    await client.POST("/u/planning/target/item", {
      body: {
        year: 2025,
        energyResource: "GAS",
        consumption: 2000,
        percentage: 75,
      },
    });

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Targets section Test",
        },
        dateStart: "1970-01-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: { type: "TRANSLATED", value: "targets" },
            content: { type: "TARGETS" },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("Regression driver list section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    await TestHelperAdvancedRegressionAnalysis.createAdvancedRegression(
      client,
      { primary: true },
    );

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Regression driver list section Test",
        },
        dateStart: "1970-01-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Regression driver list section Overview",
            },
            content: { type: "PRIMARY_REGRESSION_DRIVER_LIST" },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("Seu consumption table section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const seu = await TestHelperSeu.createSeuWithValues(client, {
      name: "Seu",
      hasMain: true,
    });

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Seu consumption table section Test",
        },
        dateStart: "2024-01-01",
        dateEnd: "2026-01-01",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Seu consumption table section Overview",
            },
            content: { type: "SEU_CONSUMPTION_TABLE", seuIds: [seu.id] },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("Total consumption cost table section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    await TestHelperSeu.createTestSeu(client, "Seu");

    await TestHelperAdvancedRegressionAnalysis.createAdvancedRegression(
      client,
      { primary: true, hasMain: true },
    );

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Total consumption cost table section Test",
        },
        dateStart: "2024-12-01",
        dateEnd: "2026-01-01",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Total consumption cost table section Overview",
            },
            content: { type: "TOTAL_ENERGY_CONSUMPTION_COST_TABLE" },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("Energy Consumption Table", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    await TestHelperMeter.createMainMetersWithValues(client, session.orgId);

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Energy Consumption Table Test",
        },
        dateStart: "2024-01-01",
        dateEnd: "2026-01-01",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Energy Consumption Table",
            },
            content: { type: "TOTAL_MONTHLY_ENERGY_CONSUMPTION_COST_TABLE" },
          },
        ],
      },
      parseAs: "text",
    });

    expect(res).toBeApiOk();

    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("Energy Consumption Pie Chart", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    await TestHelperSeu.createTestSeu(client, "Seu");

    await TestHelperAdvancedRegressionAnalysis.createAdvancedRegression(
      client,
      { primary: true, hasMain: true },
    );

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Energy Consumption Pie Chart Test",
        },
        dateStart: "2024-01-01",
        dateEnd: "2026-01-01",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Energy Consumption Pie Chart",
            },
            content: { type: "ENERGY_CONSUMPTION_PIE_CHART" },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("Primary Seu consumption table section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    await TestHelperSeu.createTestSeu(client, "Seu");

    await TestHelperAdvancedRegressionAnalysis.createAdvancedRegression(
      client,
      { primary: true, hasMain: true },
    );

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Primary Seu consumption table section Test",
        },
        dateStart: "2024-01-01",
        dateEnd: "2026-01-01",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Primary Seu consumption table section Overview",
            },
            content: { type: "SEU_CONSUMPTION_TABLE", primary: true },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("Primary Seu consumption table section with specific datetime.", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    await TestHelperSeu.createTestSeu(client, "Seu");

    await TestHelperAdvancedRegressionAnalysis.createAdvancedRegression(
      client,
      { primary: true, hasMain: true },
    );

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Primary Seu consumption table section Test",
        },
        dateStart: "2024-01-01",
        dateEnd: "2026-01-01",
        authorIds: [session.userId],
        sections: [
          {
            customDate: {
              start: "2025-01-01",
              end: "2025-05-01",
            },
            title: {
              type: "PLAIN",
              value: "Primary Seu consumption table section Overview",
            },
            content: { type: "SEU_CONSUMPTION_TABLE", primary: true },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    // Total consumption without custom range is 200,
    //   and with custom range is 120
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("Primary Regression Analysis Table ", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    await TestHelperAdvancedRegressionAnalysis.createAdvancedRegression(
      client,
      { primary: true },
    );

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Primary Regression Analysis Table Overview",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Primary Regression Analysis Table Section Overview",
            },
            content: { type: "REGRESSION_ANALYSIS_TABLE", primary: true },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("Regression Analysis Table ", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    await TestHelperAdvancedRegressionAnalysis.createAdvancedRegression(
      client,
      { primary: true },
    );

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Regression Analysis Table Overview",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Regression Analysis Table Section Overview",
            },
            content: { type: "REGRESSION_ANALYSIS_TABLE" },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("seu primary graph section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    await TestHelperAdvancedRegressionAnalysis.createAdvancedRegression(
      client,
      { primary: true },
    );

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Seu primary graph section",
        },
        dateStart: "2024-01-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Primary Seus graph.",
            },
            content: { type: "SEU_GRAPH", primary: true },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("Primary Seu Consumption Table Section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    await TestHelperAdvancedRegressionAnalysis.createAdvancedRegression(
      client,
      { primary: true, hasMain: true },
    );

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Primary Seu Consumption Table",
        },
        dateStart: "2024-12-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Primary Seu Consumption Overview",
            },
            content: { type: "SEU_CONSUMPTION_TABLE", primary: true },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("Primary Seu Total Consumption Pie Chart Section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    await TestHelperAdvancedRegressionAnalysis.createAdvancedRegression(
      client,
      { primary: true },
    );

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Primary Seu Total Consumption Pie Chart",
        },
        dateStart: "2024-12-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Primary Seu Total Consumption Overview",
            },
            content: {
              type: "SEU_TOTAL_CONSUMPTION_PIE_CHART",
              primary: true,
            },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("Seu Total Consumption Pie Chart Section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const seu = await TestHelperSeu.createTestSeu(client, "Test SEU");

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Seu Total Consumption Pie Chart",
        },
        dateStart: "2025-01-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Seu Total Consumption Overview",
            },
            content: {
              type: "SEU_TOTAL_CONSUMPTION_PIE_CHART",
              seuIds: [seu.id],
            },
          },
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });
});
