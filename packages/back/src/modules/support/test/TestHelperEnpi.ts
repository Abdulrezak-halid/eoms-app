import { UtilDate } from "common";

import { ITestClient } from "@/test/utils/UtilTest";

import { TestHelperSeu } from "@m/measurement/test/TestHelperSeu";

export namespace TestHelperEnpi {
  export async function createTestEnpi(client: ITestClient) {
    const seu = await TestHelperSeu.createTestSeu(client, "EnpiTest");
    const createRes = await client.POST("/u/analysis/enpi/item", {
      body: {
        seuId: seu.id,
        equipment: "test equipment",
        targetedDate: UtilDate.getNowUtcIsoDate(),
        targetedImprovement: 10,
      },
    });

    return createRes.data!.id;
  }
}
