import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperMeter } from "./TestHelperMeter";

describe("E2E - RouterAMeter", () => {
  it("get meters", async () => {
    const { client: clientUser } = await UtilTest.createClientLoggedIn();
    const meter = await TestHelperMeter.create(clientUser, "test");

    const { client } = await UtilTest.createClientWithAccessToken({
      canListMeters: true,
    });

    const res = await client.GET("/a/meter/names");
    expect(res).toBeApiOk();
    expect(res.data?.records).toStrictEqual([
      {
        energyResource: "ELECTRIC",
        id: meter.id,
        name: "test",
      },
    ]);
  });

  it("get not permitted meters", async () => {
    const { client: clientUser } = await UtilTest.createClientLoggedIn();
    await TestHelperMeter.create(clientUser, "test");

    const { client } = await UtilTest.createClientWithAccessToken();
    const res = await client.GET("/a/meter/names");
    expect(res).toBeApiError(EApiFailCode.FORBIDDEN);
  });
});
