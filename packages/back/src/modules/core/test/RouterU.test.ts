import { EXAMPLE_USER_EMAIL, EXAMPLE_USER_PASSWORD } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterU", () => {
  const client = UtilTest.createClient();

  it("GET /g/session without login should return null", async () => {
    const res = await client.GET("/g/session");
    expect(res).toBeApiOk();
    expect(res.data).toStrictEqual({
      publicOrganizationInfo: null,
      session: null,
    });
  });

  it("GET /g/session after login should return session information", async () => {
    const res1 = await client.POST("/g/login", {
      body: {
        email: EXAMPLE_USER_EMAIL,
        password: EXAMPLE_USER_PASSWORD,
        token: "DUMMY",
      },
    });
    expect(res1).toBeApiOk();
    const cookie = res1.response.headers.getSetCookie()[0];
    expect(cookie).toBeTypeOf("string");

    const headers = new Headers();
    headers.set("cookie", cookie);
    const res2 = await client.GET("/g/session", { headers });
    expect(res2).toBeApiOk();
    expect(res1.data).toStrictEqual(res2.data!.session);
  });
});
