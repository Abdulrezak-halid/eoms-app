import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterRoot", () => {
  const client = UtilTest.createClient();

  it("GET /", async () => {
    const res = await client.GET("/");
    expect(res.data).toMatchObject({
      name: "Reneryo",
    });
  });
});
