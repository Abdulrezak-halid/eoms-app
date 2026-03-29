import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("RouterAnalysis", () => {
  it("Throw forbidden for permission", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: [],
    });
    const res = await client.GET("/u/support/training/item");
    expect(res).toBeApiError(EApiFailCode.FORBIDDEN);
  });

  it("with a minimal permission should response ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: ["/SUPPORT"],
    });
    const res = await client.GET("/u/support/training/item");
    expect(res).toBeApiOk();
  });

  it("should respond PLAN_DISABLED_OP error without correct organization plan feature", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: [] },
    });
    const res = await client.GET("/u/support/training/item");
    expect(res).toBeApiError(EApiFailCode.PLAN_DISABLED_OP);
  });

  it("should work with correct organization plan feature", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: ["ISO50001"] },
    });
    const res = await client.GET("/u/support/training/item");
    expect(res).toBeApiOk();
  });
});
