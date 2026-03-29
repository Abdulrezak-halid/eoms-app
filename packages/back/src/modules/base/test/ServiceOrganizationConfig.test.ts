import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { ServiceOrganizationConfig } from "../services/ServiceOrganizationConfig";

describe("E2E - ServiceOrganizationConfig", () => {
  it("Set organization config", async () => {
    const c = await UtilTest.createTestContextUser();
    await ServiceOrganizationConfig.set(c, "Key", "Value");
    const result = await ServiceOrganizationConfig.get(c, "Key");
    expect(result).toStrictEqual("Value");
  });

  it("Update organization config", async () => {
    const c = await UtilTest.createTestContextUser();
    await ServiceOrganizationConfig.set(c, "Key", "Value");
    await ServiceOrganizationConfig.set(c, "Key", "Updated");
    const result = await ServiceOrganizationConfig.get(c, "Key");
    expect(result).toStrictEqual("Updated");
  });
});
