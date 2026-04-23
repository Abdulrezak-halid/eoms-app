import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperSeu } from "./TestHelperSeu";

describe("E2E - RouterASeu", () => {
  it("get seus", async () => {
    const { client: clientUser } = await UtilTest.createClientLoggedIn();
    const seu = await TestHelperSeu.createTestSeu(clientUser, "seu");

    const { client } = await UtilTest.createClientWithAccessToken({
      canListSeus: true,
    });

    const res = await client.GET("/a/seu/names");
    expect(res).toBeApiOk();
    expect(res.data?.records).toStrictEqual([
      {
        energyResource: "ELECTRIC",
        id: seu.id,
        name: "seu",
      },
    ]);
  });

  it("get not permitted seus", async () => {
    const { client: clientUser } = await UtilTest.createClientLoggedIn();
    await TestHelperSeu.createTestSeu(clientUser, "seu");

    const { client } = await UtilTest.createClientWithAccessToken();
    const res = await client.GET("/a/seu/names");
    expect(res).toBeApiError(EApiFailCode.FORBIDDEN);
  });
});
