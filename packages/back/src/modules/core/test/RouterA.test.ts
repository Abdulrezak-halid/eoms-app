import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { APP_NAME } from "@/constants";
import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperMetric } from "@m/measurement/test/TestHelperMetric";

describe("E2E - RouterA", () => {
  it("Reject with invalid access token", async () => {
    const invalidToken = "invalid_token_string";
    const headers = new Headers();
    headers.set("X-Token", invalidToken);

    const client = UtilTest.createClient(headers);

    const res = await client.GET("/a");

    expect(res).toBeApiError(EApiFailCode.UNAUTHORIZED);
  });

  it("Work with valid access token", async () => {
    const { client } = await UtilTest.createClientWithAccessToken();

    const { client: clientUser } = await UtilTest.createClientLoggedIn();
    const createdMetric = await TestHelperMetric.create(
      clientUser,
      "test_metric",
    );

    expect(createdMetric).toBeApiOk();

    const res = await client.GET("/a");

    expect(res).toBeApiOk();
    expect(res.data).toStrictEqual({
      name: APP_NAME,
      env: "test",
    });
  });
});
