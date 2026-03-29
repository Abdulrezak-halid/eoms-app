import { EXAMPLE_USER_EMAIL } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterUProfile", () => {
  it("GET /u/profile/password", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/profile/password", {
      body: { password: "NEW_PASSWORD" },
    });
    expect(res).toBeApiOk();
  });

  it("After changing password, session should be dropped", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    await client.POST("/u/profile/password", {
      body: { password: "NEW_PASSWORD" },
    });

    const res = await client.GET("/g/session");
    expect(res).toBeApiOk();
    expect(res.data).toStrictEqual({
      publicOrganizationInfo: null,
      session: null,
    });
  });

  it("After changing password, next login should work with new password", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    await client.POST("/u/profile/password", {
      body: { password: "NEW_PASSWORD" },
    });

    const client2 = await UtilTest.createClientLoggedIn({
      username: EXAMPLE_USER_EMAIL,
      password: "NEW_PASSWORD",
    });
    const res = await client2.client.GET("/g/session");
    expect(res).toBeApiOk();
  });
});
