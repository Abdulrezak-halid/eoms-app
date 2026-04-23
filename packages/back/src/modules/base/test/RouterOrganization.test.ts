import { describe, expect, it } from "vitest";

import { SYSADMIN_EMAIL, SYSADMIN_PASSWORD } from "@/constants";
import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterOrganization", () => {
  it("should return organization energy resources", async () => {
    {
      const { client } = await UtilTest.createClientLoggedIn({
        overwrittenOrganizationPlan: { features: ["SYSTEM"] },
      });
      const res = await client.GET("/u/organization/energy-resources");
      expect(res).toBeApiOk();
      expect(res.data).toStrictEqual({
        energyResources: ["ELECTRIC", "GAS", "DIESEL", "WATER", "SOLID_FUEL"],
      });
    }

    {
      const { client } = await UtilTest.createClientLoggedIn({
        username: SYSADMIN_EMAIL,
        password: SYSADMIN_PASSWORD,
      });
      const res = await client.GET("/u/organization/energy-resources");
      expect(res).toBeApiOk();
      expect(res.data).toStrictEqual({ energyResources: [] });
    }
  });

  it("should return my organization", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn({});

    const res = await client.GET("/u/organization");
    expect(res).toBeApiOk();
    expect(res.data).toStrictEqual({
      id: session.orgId,
      address: "Example Address",
      config: {
        energyResources: ["ELECTRIC", "GAS", "DIESEL", "WATER", "SOLID_FUEL"],
      },
      displayName: "Example Org.",
      email: "example@example.com",
      fullName: "Example Organization",
      phones: ["+1234567890"],
      plan: {
        features: [
          "ACCESS_TOKEN",
          "ANALYSES",
          "ISO50001",
          "MEASUREMENT",
          "ORGANIZATION_PARTNER",
          "PRODUCT",
          "QDMS",
          "RENERYO_AGENT",
          "REPORT",
          "SUPPLY_CHAIN",
          "UNCATEGORIZED",
          "USER_MANAGEMENT",
          "USER_TOKEN",
        ],
        maxUserCount: 10,
      },
      workspace: "example",
      hasBanner: false,
    });
  });
});
