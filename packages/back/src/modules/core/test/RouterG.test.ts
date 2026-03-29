/**
 * @file: RouterG.test.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.01.2025
 * Last Modified Date: 09.01.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import {
  EApiFailCode,
  EXAMPLE_USER_EMAIL,
  EXAMPLE_USER_PASSWORD,
} from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterG", () => {
  const client = UtilTest.createClient();

  it("GET /g/login", async () => {
    const res = await client.POST("/g/login", {
      body: {
        email: EXAMPLE_USER_EMAIL,
        password: EXAMPLE_USER_PASSWORD,
        token: "DUMMY",
      },
    });
    expect(res).toBeApiOk();
    const cookie = res.response.headers.getSetCookie()[0];
    expect(cookie).toBeTypeOf("string");
  });

  it("Login with subdomain", async () => {
    const res = await client.POST("/g/login", {
      headers: {
        Referer: "http://example.localhost",
      },
      body: {
        email: EXAMPLE_USER_EMAIL,
        password: EXAMPLE_USER_PASSWORD,
        token: "DUMMY",
      },
    });
    expect(res).toBeApiOk();
    const cookie = res.response.headers.getSetCookie()[0];
    expect(cookie).toBeTypeOf("string");
  });

  it("Subdomain workspace mismatch", async () => {
    const res = await client.POST("/g/login", {
      headers: {
        Referer: "https://wrongsubdomain.localhost",
      },
      body: {
        email: EXAMPLE_USER_EMAIL,
        password: EXAMPLE_USER_PASSWORD,
        token: "DUMMY",
      },
    });
    expect(res).toBeApiError(EApiFailCode.BAD_REQUEST); // BAD_REQUEST
  });

  it("Missing Referer header", async () => {
    const res = await client.POST("/g/login", {
      body: {
        email: EXAMPLE_USER_EMAIL,
        password: EXAMPLE_USER_PASSWORD,
        token: "DUMMY",
      },
    });
    expect(res).toBeApiOk();
    const cookie = res.response.headers.getSetCookie()[0];
    expect(cookie).toBeTypeOf("string");
  });

  it("login without subdomain", async () => {
    const res = await client.POST("/g/login", {
      headers: {
        Referer: "https://localhost",
      },
      body: {
        email: EXAMPLE_USER_EMAIL,
        password: EXAMPLE_USER_PASSWORD,
        token: "DUMMY",
      },
    });
    expect(res).toBeApiOk();
    const cookie = res.response.headers.getSetCookie()[0];
    expect(cookie).toBeTypeOf("string");
  });
});
