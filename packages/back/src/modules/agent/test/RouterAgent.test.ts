import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterSysAgent", () => {
  it("list agents", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: ["SYSTEM"] },
    });

    const payload = {
      name: "Test Agent",
      serialNo: "12345",
      description: "Test agent description",
    };

    const createRes = await client.POST("/u/sys/agent/item", {
      body: {
        ...payload,
        assignedOrgId: session.orgId,
      },
    });

    const { client: userClient } = await UtilTest.createClientLoggedIn();

    const res = await userClient.GET("/u/agent/assigned-items");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createRes.data!.id,
          ...payload,
          statType: null,
          datetimeStat: null,
        },
      ],
    });
  });

  it("without agent permission should response FORBIDDEN error", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: [],
    });
    const res = await client.GET("/u/agent/assigned-items");
    expect(res).toBeApiError(EApiFailCode.FORBIDDEN);
  });

  it("with a minimal permission should response ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: ["/AGENT"],
    });
    const res = await client.GET("/u/agent/assigned-items");
    expect(res).toBeApiOk();
  });
});
