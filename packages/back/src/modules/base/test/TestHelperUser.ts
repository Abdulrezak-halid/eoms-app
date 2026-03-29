import { ITestClient } from "@/test/utils/UtilTest";

export namespace TestHelperUser {
  export async function createTestUser(client: ITestClient, name: string) {
    return await client.POST("/u/base/user/item", {
      body: {
        email: `test${name}@example.com`,
        name,
        password: "SuperSecurePassword123",
      },
    });
  }
}
