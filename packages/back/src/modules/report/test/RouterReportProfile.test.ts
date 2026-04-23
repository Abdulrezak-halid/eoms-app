import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { ServiceReportProfile } from "../services/ServiceReportProfile";

describe("E2E - RouterReportProfile", () => {
  it("Create", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/report/profile/item", {
      body: {
        description: { type: "PLAIN", value: "test description" },
        content: {
          title: {
            type: "PLAIN",
            value: "test title",
          },
          dateStart: "2025-08-01",
          dateEnd: "2025-08-31",
          authorIds: [],
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
                    title: {
                      type: "PLAIN",
                      value: "Energy",
                    },
                    value: {
                      type: "PLAIN",
                      value: "1000 kWh",
                    },
                  },
                  {
                    title: {
                      type: "PLAIN",
                      value: "Cost",
                    },
                    value: {
                      type: "PLAIN",
                      value: "$500",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });
    expect(createRes).toBeApiOk();
  });

  it("Get", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/report/profile/item", {
      body: {
        description: { type: "PLAIN", value: "test description" },
        content: {
          title: {
            type: "PLAIN",
            value: "test title",
          },
          dateStart: "2025-08-01",
          dateEnd: "2025-08-31",
          authorIds: [],
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
                    title: {
                      type: "PLAIN",
                      value: "Energy",
                    },
                    value: {
                      type: "PLAIN",
                      value: "1000 kWh",
                    },
                  },
                  {
                    title: {
                      type: "PLAIN",
                      value: "Cost",
                    },
                    value: {
                      type: "PLAIN",
                      value: "$500",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });

    const id = createRes.data!.id;

    const getRes = await client.GET("/u/report/profile/item/{id}", {
      params: { path: { id } },
    });

    expect(getRes.data).toStrictEqual({
      id,
      isCommon: false,
      commonLabel: null,
      title: { type: "PLAIN", value: "test title" },
      description: { type: "PLAIN", value: "test description" },
      content: {
        authorIds: [],
        dateEnd: "2025-08-31",
        dateStart: "2025-08-01",
        sections: [
          {
            content: {
              rows: [
                {
                  title: {
                    type: "PLAIN",
                    value: "Energy",
                  },
                  value: {
                    type: "PLAIN",
                    value: "1000 kWh",
                  },
                },
                {
                  title: {
                    type: "PLAIN",
                    value: "Cost",
                  },
                  value: {
                    type: "PLAIN",
                    value: "$500",
                  },
                },
              ],
              type: "TABLE_HORIZONTAL",
            },
            title: {
              type: "PLAIN",
              value: "KPI Table",
            },
          },
        ],
        title: {
          type: "PLAIN",
          value: "test title",
        },
      },
    });
  });

  it("Get All", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/report/profile/item", {
      body: {
        description: { type: "PLAIN", value: "test description" },
        content: {
          title: {
            type: "PLAIN",
            value: "test title",
          },
          dateStart: "2025-08-01",
          dateEnd: "2025-08-31",
          authorIds: [],
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
                    title: {
                      type: "PLAIN",
                      value: "Energy",
                    },
                    value: {
                      type: "PLAIN",
                      value: "1000 kWh",
                    },
                  },
                  {
                    title: {
                      type: "PLAIN",
                      value: "Cost",
                    },
                    value: {
                      type: "PLAIN",
                      value: "$500",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });

    const id = createRes.data!.id;

    const getRes = await client.GET("/u/report/profile/item");

    expect(getRes.data?.records).toStrictEqual([
      {
        description: null,
        commonLabel: { type: "PLAIN", value: "ISO 50001" },
        id: expect.any(String),
        isCommon: true,
        title: {
          type: "TRANSLATED",
          value: "energyReview",
        },
      },
      {
        description: null,
        commonLabel: {
          type: "PLAIN",
          value: "ISO 50001",
        },
        id: expect.any(String),
        isCommon: true,
        title: {
          type: "TRANSLATED",
          value: "industrialBusinessNotification",
        },
      },
      {
        description: null,
        commonLabel: {
          type: "PLAIN",
          value: "ISO 50001",
        },
        id: expect.any(String),
        isCommon: true,
        title: {
          type: "TRANSLATED",
          value: "managementReview",
        },
      },
      {
        description: null,
        commonLabel: {
          type: "PLAIN",
          value: "ISO 50001",
        },
        id: expect.any(String),
        isCommon: true,
        title: {
          type: "TRANSLATED",
          value: "preliminaryAudit",
        },
      },
      {
        description: {
          type: "PLAIN",
          value: "test description",
        },
        commonLabel: null,
        id,
        isCommon: false,
        title: {
          type: "PLAIN",
          value: "test title",
        },
      },
    ]);
  });

  it("Update", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/report/profile/item", {
      body: {
        description: { type: "PLAIN", value: "test description" },
        content: {
          title: {
            type: "PLAIN",
            value: "test title",
          },
          dateStart: "2025-08-01",
          dateEnd: "2025-08-31",
          authorIds: [],
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
                    title: {
                      type: "PLAIN",
                      value: "Energy",
                    },
                    value: {
                      type: "PLAIN",
                      value: "1000 kWh",
                    },
                  },
                  {
                    title: {
                      type: "PLAIN",
                      value: "Cost",
                    },
                    value: {
                      type: "PLAIN",
                      value: "$500",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });

    const id = createRes.data!.id;

    const update = await client.PUT("/u/report/profile/item/{id}", {
      params: { path: { id } },
      body: {
        description: { type: "PLAIN", value: "updated description" },
        content: {
          title: {
            type: "PLAIN",
            value: "updated title",
          },
          dateStart: "2025-08-01",
          dateEnd: "2025-08-31",
          authorIds: [],
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
                    title: {
                      type: "PLAIN",
                      value: "Energy",
                    },
                    value: {
                      type: "PLAIN",
                      value: "1000 kWh",
                    },
                  },
                  {
                    title: {
                      type: "PLAIN",
                      value: "Cost",
                    },
                    value: {
                      type: "PLAIN",
                      value: "$500",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });

    expect(update).toBeApiOk();

    const getRes = await client.GET("/u/report/profile/item/{id}", {
      params: { path: { id } },
    });

    expect(getRes.data).toStrictEqual({
      id,
      isCommon: false,
      title: { type: "PLAIN", value: "updated title" },
      commonLabel: null,
      description: { type: "PLAIN", value: "updated description" },
      content: {
        authorIds: [],
        dateEnd: "2025-08-31",
        dateStart: "2025-08-01",
        sections: [
          {
            content: {
              rows: [
                {
                  title: {
                    type: "PLAIN",
                    value: "Energy",
                  },
                  value: {
                    type: "PLAIN",
                    value: "1000 kWh",
                  },
                },
                {
                  title: {
                    type: "PLAIN",
                    value: "Cost",
                  },
                  value: {
                    type: "PLAIN",
                    value: "$500",
                  },
                },
              ],
              type: "TABLE_HORIZONTAL",
            },
            title: {
              type: "PLAIN",
              value: "KPI Table",
            },
          },
        ],
        title: {
          type: "PLAIN",
          value: "updated title",
        },
      },
    });
  });

  it("Clone the profile", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/report/profile/item", {
      body: {
        description: { type: "PLAIN", value: "test description" },
        content: {
          title: { type: "PLAIN", value: "test title" },
          dateStart: "2025-08-01",
          dateEnd: "2025-08-31",
          authorIds: [],
          sections: [
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
          ],
        },
      },
    });
    expect(createRes).toBeApiOk();
    const id = createRes.data!.id;

    const clone = await client.POST("/u/report/profile/item/clone", {
      body: { id },
    });
    expect(clone).toBeApiOk();

    const getRes = await client.GET("/u/report/profile/item");
    expect(getRes).toBeApiOk();

    expect(getRes.data).toStrictEqual({
      records: [
        {
          description: null,
          id: expect.any(String),
          isCommon: true,
          commonLabel: { type: "PLAIN", value: "ISO 50001" },
          title: {
            type: "TRANSLATED",
            value: "energyReview",
          },
        },
        {
          description: null,
          id: expect.any(String),
          isCommon: true,
          commonLabel: { type: "PLAIN", value: "ISO 50001" },
          title: {
            type: "TRANSLATED",
            value: "industrialBusinessNotification",
          },
        },
        {
          description: null,
          id: expect.any(String),
          isCommon: true,
          commonLabel: { type: "PLAIN", value: "ISO 50001" },
          title: {
            type: "TRANSLATED",
            value: "managementReview",
          },
        },
        {
          description: null,
          id: expect.any(String),
          isCommon: true,
          commonLabel: { type: "PLAIN", value: "ISO 50001" },
          title: {
            type: "TRANSLATED",
            value: "preliminaryAudit",
          },
        },
        {
          description: {
            type: "PLAIN",
            value: "test description",
          },
          id,
          isCommon: false,
          commonLabel: null,
          title: {
            type: "PLAIN",
            value: "test title",
          },
        },
        {
          description: {
            type: "TRANSLATED",
            value: "clonedTemplate",
          },
          id: clone.data?.id,
          isCommon: false,
          commonLabel: null,
          title: {
            type: "PLAIN",
            value: "test title",
          },
        },
      ],
    });
  });

  it("Clone should throw error if record is not exists", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const clone = await client.POST("/u/report/profile/item/clone", {
      body: { id: "00000000-0000-0000-0000-000000000000" },
    });
    expect(clone).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("Remove", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/report/profile/item", {
      body: {
        description: { type: "PLAIN", value: "test description" },
        content: {
          title: { type: "PLAIN", value: "test title" },
          dateStart: "2025-08-01",
          dateEnd: "2025-08-31",
          authorIds: [],
          sections: [
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
          ],
        },
      },
    });

    const id = createRes.data!.id;

    const remove = await client.DELETE("/u/report/profile/item/{id}", {
      params: { path: { id } },
    });

    expect(remove).toBeApiOk();

    const getRes = await client.GET("/u/report/profile/item/{id}", {
      params: { path: { id } },
    });

    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("Do not let remove common report templates", async () => {
    const context = UtilTest.createTestContext();
    const reportTemplateId = await ServiceReportProfile.createCommon(context, {
      commonLabel: { type: "PLAIN", value: "test" },
      description: { type: "PLAIN", value: "Test Template" },
      content: {
        title: { type: "PLAIN", value: "Test Title" },
        authorIds: [],
        sections: [],
      },
    });

    const { client } = await UtilTest.createClientLoggedIn();

    const resDelete = await client.DELETE("/u/report/profile/item/{id}", {
      params: { path: { id: reportTemplateId } },
    });
    expect(resDelete).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("Do not let modify common report templates", async () => {
    const context = UtilTest.createTestContext();
    const reportTemplateId = await ServiceReportProfile.createCommon(context, {
      commonLabel: { type: "PLAIN", value: "test" },
      description: { type: "PLAIN", value: "Test Template" },
      content: {
        title: { type: "PLAIN", value: "Test Title" },
        authorIds: [],
        sections: [],
      },
    });

    const { client } = await UtilTest.createClientLoggedIn();

    const resUpdate = await client.PUT("/u/report/profile/item/{id}", {
      body: {
        description: { type: "PLAIN", value: "Test Template" },
        content: {
          title: { type: "PLAIN", value: "Test Title" },
          authorIds: [],
          sections: [],
        },
      },
      params: { path: { id: reportTemplateId } },
    });

    expect(resUpdate).toBeApiError(EApiFailCode.BAD_REQUEST);
  });
});
