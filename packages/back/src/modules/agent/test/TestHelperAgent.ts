import { expect } from "vitest";

import { SYSADMIN_EMAIL, SYSADMIN_PASSWORD } from "@/constants";
import { UtilTest } from "@/test/utils/UtilTest";

export namespace TestHelperAgent {
  export async function createAndAssign(orgId: string) {
    const { client: clientSys } = await UtilTest.createClientLoggedIn({
      username: SYSADMIN_EMAIL,
      password: SYSADMIN_PASSWORD,
    });

    const res = await clientSys.POST("/u/sys/agent/item", {
      body: {
        name: "Test Agent",
        serialNo: "Dummy Serial",
        description: "Test Agent",
        assignedOrgId: orgId,
      },
    });

    expect(res).toBeApiOk();

    return res.data!.id;
  }
}
