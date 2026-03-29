/**
 * @file: RouterRoot.test.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 08.01.2025
 * Last Modified Date: 09.01.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterRoot", () => {
  const client = UtilTest.createClient();

  it("GET /", async () => {
    const res = await client.GET("/");
    expect(res.data).toMatchObject({
      name: "eoms",
    });
  });
});
