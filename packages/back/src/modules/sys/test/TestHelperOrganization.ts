export namespace TestHelperOrganization {
  export function createPlan() {
    return {
      features: [],
      maxUserCount: 4,
    };
  }

  export function genDbInsertPayload() {
    const plan = TestHelperOrganization.createPlan();

    return {
      displayName: "Test Org.",
      fullName: "Test Organization",
      address: "123 Test St, Test City, Test Country",
      phones: ["+1234567890"],
      email: "test@test.com",
      config: {
        energyResources: ["ELECTRIC" as const, "GAS" as const],
      },
      workspace: "testorg",
      plan,
    };
  }

  export function genCreatePayload() {
    return {
      ...genDbInsertPayload(),
      adminEmail: "test@hotmail.com",
      adminName: "Test Admin",
    };
  }
}
