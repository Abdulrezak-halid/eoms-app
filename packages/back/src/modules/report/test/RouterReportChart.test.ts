import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperAdvancedRegressionAnalysis } from "@m/analysis/test/TestHelperAdvancedRegressionAnalysis";
import { ServiceMetric } from "@m/measurement/services/ServiceMetric";
import { TestHelperMetric } from "@m/measurement/test/TestHelperMetric";
import { TestHelperSeu } from "@m/measurement/test/TestHelperSeu";

import { TestHelperReportRender } from "./TestHelperReportRender";

describe("E2E - RouterReportChart", () => {
  it("CHART_CUSTOM section", async () => {
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
          value: "Chart Custom section Test",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Chart Overview",
            },
            content: {
              type: "CHART_CUSTOM",
              data: {
                type: "line",
                series: [
                  {
                    color: "red",
                    name: "Series 1",
                    unit: "ENERGY_KWH",
                    data: [
                      { x: 0.5, y: 10 },
                      { x: 0.7, y: 10 },
                      { x: 0.9, y: 10 },
                      { x: 1, y: 10 },
                      { x: 1.1, y: 10 },
                      { x: 1.2, y: 10 },
                    ],
                  },
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

  it("CHART_CUSTOM Line section", async () => {
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
          value: "Chart Custom section Test",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Electricity Consumption",
            },
            content: {
              type: "CHART_CUSTOM",
              data: {
                type: "line",
                series: [
                  {
                    name: "Household A",
                    unit: "ENERGY_KWH",
                    color: "blue",
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
                    unit: "ENERGY_KWH",
                    color: "red",
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
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("CHART_CUSTOM line section with date", async () => {
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
          value: "Chart Custom section Test",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Electricity Consumption with date",
            },
            content: {
              type: "CHART_CUSTOM",
              data: {
                type: "line",
                series: [
                  {
                    name: "Household A",
                    unit: "ENERGY_KWH",
                    color: "blue",
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
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("CHART_CUSTOM line section with date and translation", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/report/render", {
      headers: {
        "accept-language": "tr-TR",
      },
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Chart Custom section Test",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Electricity Consumption with date",
            },
            content: {
              type: "CHART_CUSTOM",
              data: {
                type: "line",
                series: [
                  {
                    name: "Household A",
                    unit: "ENERGY_KWH",
                    color: "blue",
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
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("CHART_CUSTOM line section with minutely data", async () => {
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
          value: "Chart Custom section Test",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
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
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("CHART_CUSTOM line section with minutely data with different timezone", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Asia/Tashkent",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Chart Custom section Test",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
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
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("CHART_CUSTOM line section with missing data", async () => {
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
          value: "Chart Custom section Test",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
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
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("CHART_CUSTOM Scatter section", async () => {
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
          value: "Chart Custom section Test",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Device Power Consumption (Scatter)",
            },
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
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("CHART_CUSTOM Scatter and line section", async () => {
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
          value: "Chart Custom section Test",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
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
                    name: "Entertainment Devices",
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
        ],
      },
      parseAs: "text",
    });
    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("HEATMAP section", async () => {
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
          value: "Heatmap section Test",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Energy Consumption Heatmap",
            },
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
        ],
      },
      parseAs: "text",
    });

    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("Create PIE_CHART", async () => {
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
          value: "Pie chart section Test",
        },
        dateStart: "2025-08-01",
        dateEnd: "2025-08-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Device Power Consumption (Pie)",
            },
            content: {
              type: "PIE_CHART_CUSTOM",
              data: {
                unit: "ENERGY_KWH",
                records: [
                  {
                    label: "Kitchen Appliances",
                    value: 100,
                    color: "blue",
                  },
                  {
                    label: "Entertainment Devices",
                    value: 80,
                    color: "green",
                  },
                  {
                    label: "Office Equipment",
                    value: 60,
                    color: "red",
                  },
                  {
                    label: "Home Appliances",
                    value: 40,
                    color: "yellow",
                  },
                  {
                    label: "Other Devices",
                    value: 20,
                    color: "purple",
                  },
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

  it("Seu Graph Section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const seu = await TestHelperSeu.createSeuWithValues(client);

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Seu Graph section Test",
        },
        dateStart: "2024-12-01",
        dateEnd: "2025-03-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Seu graph",
            },
            content: {
              type: "SEU_GRAPH",
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

  it("Regression Result Section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const regression =
      await TestHelperAdvancedRegressionAnalysis.createAdvancedRegression(
        client,
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
          value: "Regression Result section Test",
        },
        dateStart: "2024-12-01",
        dateEnd: "2025-03-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Seu graph",
            },
            content: {
              type: "REGRESSION_RESULT",
              resultId: regression.id,
            },
          },
        ],
      },
      parseAs: "text",
    });

    expect(res).toBeApiOk();
    expect(await TestHelperReportRender.prettyHtml(res.data)).toMatchSnapshot();
  });

  it("Meter Slice Graph Section", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const metric = await TestHelperMetric.create(client, "Test Metric", {
      type: "COUNTER",
      unitGroup: "ENERGY",
    });
    const c = await UtilTest.createTestContextUser();

    await ServiceMetric.addValues(
      c,
      c.session.orgId,
      metric.id,
      "ENERGY_KWH",
      [
        { value: 0, datetime: "2024-12-31T00:00:00.000Z" },
        { value: 100, datetime: "2025-01-01T00:00:00.000Z" },
        { value: 250, datetime: "2025-01-02T00:00:00.000Z" },
        { value: 450, datetime: "2025-01-03T00:00:00.000Z" },
      ],
      TestHelperMetric.getTestResourceLabels(),
    );

    const department = await client.POST("/u/base/department/item", {
      body: {
        name: "Test Department",
        description: "Test Department Description",
      },
    });
    expect(department).toBeApiOk();

    const meter = await client.POST("/u/measurement/meter/item", {
      body: {
        name: "Test Meter",
        metricId: metric.id,
        energyResource: "ELECTRIC",
        departmentId: department.data!.id,
        energyConversionRate: 1,
        isMain: false,
      },
    });
    expect(meter).toBeApiOk();

    const meterSlices = await client.GET("/u/measurement/meter/slice", {
      params: { query: TestHelperMetric.getFullDatetimeRangeQuery() },
    });
    expect(meterSlices).toBeApiOk();

    const res = await client.POST("/u/report/render", {
      params: {
        query: {
          tz: "Europe/Istanbul",
        },
      },
      body: {
        title: {
          type: "PLAIN",
          value: "Meter Slice Graph section Test",
        },
        dateStart: "2024-12-01",
        dateEnd: "2025-03-31",
        authorIds: [session.userId],
        sections: [
          {
            title: {
              type: "PLAIN",
              value: "Meter slice graph",
            },
            content: {
              type: "METER_SLICE_GRAPH",
              sliceIds: meterSlices.data!.records.map((slice) => slice.id),
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
