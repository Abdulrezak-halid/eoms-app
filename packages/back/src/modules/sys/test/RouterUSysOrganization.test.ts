import { EApiFailCode, EXAMPLE_USER_PASSWORD } from "common";
import { describe, expect, it } from "vitest";

import { SYSADMIN_EMAIL, SYSADMIN_PASSWORD } from "@/constants";
import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperOrganization } from "./TestHelperOrganization";

describe("E2E - RouterUSysOrganization", () => {
  it("should create an organization", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      username: SYSADMIN_EMAIL,
      password: SYSADMIN_PASSWORD,
    });

    const payload = TestHelperOrganization.genCreatePayload();

    const res = await client.POST("/u/sys/organization/item", {
      body: payload,
    });
    expect(res).toBeApiOk();
    expect(res.data!.id).toBeDefined();
  });

  it("should list organizations", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      username: SYSADMIN_EMAIL,
      password: SYSADMIN_PASSWORD,
    });

    const payload = TestHelperOrganization.genCreatePayload();

    const createRes = await client.POST("/u/sys/organization/item", {
      body: payload,
    });
    const createdId = createRes.data!.id;

    const res = await client.GET("/u/sys/organization/item");
    expect(res).toBeApiOk();
    // There are another organizations added out of test, that's why toContainEqual is used.
    expect(res.data!.records).toContainEqual({
      id: createdId,
      displayName: payload.displayName,
      fullName: payload.fullName,
      address: payload.address,
      phones: payload.phones,
      email: payload.email,
      config: payload.config,
      workspace: payload.workspace,
      plan: payload.plan,
      hasBanner: false,
      createdAt: expect.any(String),
      userCount: 1,
      lastSessionAt: null,
    });
  });

  it("should return the organization by id", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      username: SYSADMIN_EMAIL,
      password: SYSADMIN_PASSWORD,
    });

    const payload = TestHelperOrganization.genCreatePayload();

    const createRes = await client.POST("/u/sys/organization/item", {
      body: payload,
    });
    const createdId = createRes.data?.id;

    const res = await client.GET("/u/sys/organization/item/{id}", {
      params: { path: { id: createdId! } },
    });
    expect(res).toBeApiOk();
    expect(res.data).toStrictEqual({
      id: createdId,
      displayName: payload.displayName,
      fullName: payload.fullName,
      address: payload.address,
      phones: payload.phones,
      email: payload.email,
      config: payload.config,
      workspace: payload.workspace,
      plan: payload.plan,
      hasBanner: false,
    });
  });

  it("should update the organization", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      username: SYSADMIN_EMAIL,
      password: SYSADMIN_PASSWORD,
    });

    const payload = TestHelperOrganization.genCreatePayload();

    const createRes = await client.POST("/u/sys/organization/item", {
      body: payload,
    });
    const createdId = createRes.data!.id;

    const updateRes = await client.PUT("/u/sys/organization/item/{id}", {
      params: { path: { id: createdId } },
      body: {
        ...payload,
        displayName: "New Test Org.",
        fullName: "New Test Organization",
      },
    });
    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/sys/organization/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(getRes.data).toStrictEqual({
      id: createdId,
      displayName: "New Test Org.",
      fullName: "New Test Organization",
      address: payload.address,
      phones: payload.phones,
      email: payload.email,
      config: payload.config,
      workspace: payload.workspace,
      plan: payload.plan,
      hasBanner: false,
    });
  });

  it("should delete the organization", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      username: SYSADMIN_EMAIL,
      password: SYSADMIN_PASSWORD,
    });

    const payload = TestHelperOrganization.genCreatePayload();

    const createRes = await client.POST("/u/sys/organization/item", {
      body: payload,
    });
    const createdId = createRes.data!.id;

    const deleteRes = await client.DELETE("/u/sys/organization/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET("/u/sys/organization/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("should not allow deletion of own organization", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn({
      username: SYSADMIN_EMAIL,
      password: SYSADMIN_PASSWORD,
    });

    const ownOrgId = session.orgId;

    const deleteRes = await client.DELETE("/u/sys/organization/item/{id}", {
      params: { path: { id: ownOrgId } },
    });
    expect(deleteRes).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("User sessions should be invalidated after organization update", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      username: SYSADMIN_EMAIL,
      password: SYSADMIN_PASSWORD,
    });

    const payload = TestHelperOrganization.genCreatePayload();

    const res = await client.POST("/u/sys/organization/item", {
      body: payload,
    });

    const orgId = res.data!.id;

    const { client: client2, session: session2 } =
      await UtilTest.createClientLoggedIn({
        username: "test@hotmail.com",
        password: EXAMPLE_USER_PASSWORD,
      });

    expect(session2.orgPlan).toStrictEqual({
      features: [],
      maxUserCount: 4,
    });

    await client.PUT("/u/sys/organization/item/{id}", {
      params: { path: { id: orgId } },
      body: payload,
    });

    const sessionCheck = await client2.GET("/g/session");
    expect(sessionCheck).toBeApiOk();
    expect(sessionCheck.data).toStrictEqual({
      publicOrganizationInfo: null,
      session: null,
    });
  });

  it("should return organization names", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn({
      username: SYSADMIN_EMAIL,
      password: SYSADMIN_PASSWORD,
    });

    const org1 = await UtilTest.createClientLoggedIn();

    const org2 = await UtilTest.createClientLoggedIn({
      username: "admin@example2.com",
    });

    const res = await client.GET("/u/sys/organization/names");
    expect(res).toBeApiOk();

    expect(res.data).toStrictEqual({
      records: [
        {
          id: session.orgId,
          displayName: "System",
        },
        {
          id: org1.session.orgId,
          displayName: "Example Org.",
        },
        {
          displayName: "Example Org 2",
          id: org2.session.orgId,
        },
      ],
    });
  });
});
