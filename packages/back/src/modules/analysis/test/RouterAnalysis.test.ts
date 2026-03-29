import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("RouterAnalysis", () => {
  it("should respond FORBIDDEN error without permission", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: [],
    });
    const res = await client.GET("/u/analysis/advanced-regression/result");
    expect(res).toBeApiError(EApiFailCode.FORBIDDEN);
  });

  it("should work with minimal permission", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: ["/ANALYSIS"],
    });
    const res = await client.GET("/u/analysis/advanced-regression/result");
    expect(res).toBeApiOk();
  });

  it("should respond PLAN_DISABLED_OP error without correct organization plan feature", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: [] },
    });
    const res = await client.GET("/u/analysis/advanced-regression/result");
    expect(res).toBeApiError(EApiFailCode.PLAN_DISABLED_OP);
  });

  it("should work with correct organization plan feature", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: ["ANALYSES"] },
    });
    const res = await client.GET("/u/analysis/advanced-regression/result");
    expect(res).toBeApiOk();
  });
});
