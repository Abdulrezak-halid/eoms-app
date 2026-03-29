import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterOrganizationPartnerToken", () => {
  it("Create Token", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const token = await client.PUT("/u/organization/partner/token");

    expect(token).toBeApiOk();
    expect(token.data?.token).toBeTypeOf("string");
    expect(token.data?.token).toHaveLength(16);
  });

  it("Get Token", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    await client.PUT("/u/organization/partner/token");

    const token = await client.GET("/u/organization/partner/token");
    expect(token).toBeApiOk();
    expect(token.data?.token).toBeTypeOf("string");
    expect(token.data?.token).toHaveLength(16);
    expect(token.data).toStrictEqual({
      createdAt: expect.any(String),
      token: expect.any(String),
      createdBy: {
        id: session.userId,
        name: session.userDisplayName,
      },
    });
  });

  it("Delete Token", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    await client.PUT("/u/organization/partner/token");

    await client.DELETE("/u/organization/partner/token");

    const token = await client.GET("/u/organization/partner/token");

    expect(token).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
