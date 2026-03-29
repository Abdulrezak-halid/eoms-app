import { expect } from "vitest";

import { ITestClient } from "@/test/utils/UtilTest";

export namespace TestHelperDepartment {
  export async function create(client: ITestClient, name: string) {
    const dep = await client.POST("/u/base/department/item", {
      body: {
        name,
        description: name,
      },
    });
    expect(dep).toBeApiOk();
    return dep.data!.id;
  }
}
