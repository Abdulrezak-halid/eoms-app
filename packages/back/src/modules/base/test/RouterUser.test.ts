import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

describe("E2E - RouterUser", () => {
  it("Create", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/base/user/item", {
      body: {
        email: "frodo@gmail.com",
        name: "Frodo",
        surname: "Baggins",
        phone: "0000000000",
        position: "Ring Disposal Project Manager",
        password: "Shire2Mordor",
      },
    });
    expect(res).toBeApiOk();
  });

  it("Get Display Names", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const payload = {
      email: "gandalf@gmail.com",
      name: "Gandalf",
      surname: "The White",
      phone: "0000000000",
      position: "Chief Strategy Officer",
      password: "YouShallNotPass!",
    };
    const createRes = await client.POST("/u/base/user/item", {
      body: payload,
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const res = await client.GET("/u/base/user/display-names");

    expect(res.data!.records).toContainEqual({
      id: createdId,
      displayName: `${payload.name} ${payload.surname}`,
    });
  });

  it("User Session must be clean after the set permission!", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const payload = {
      email: "samwise@gmail.com",
      name: "Samwise",
      surname: "Gamgee",
      phone: "0000000000",
      position: "Ring Disposal Project Manager Assistant",
      password: "Potatoes123",
    };

    const createRes = await client.POST("/u/base/user/item", {
      body: payload,
    });
    expect(createRes).toBeApiOk();

    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const client2 = await UtilTest.createClientLoggedIn({
      username: payload.email,
      password: payload.password,
    });
    const session = await client2.client.GET("/g/session");
    expect(session).toBeApiOk();

    const setPermRes = await client.PUT("/u/base/user/permission/{userId}", {
      params: { path: { userId: createdId } },
      body: {
        value: true,
        permission: "/",
      },
    });
    expect(setPermRes).toBeApiOk();

    const session2 = await client2.client.GET("/g/session");
    expect(session2).toBeApiOk();
    expect(session2.data).toStrictEqual({
      publicOrganizationInfo: null,
      session: null,
    });
  });

  it("If user updates its permission, it must be updated without drop", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const setPermRes = await client.PUT("/u/base/user/permission/{userId}", {
      params: { path: { userId: session.userId } },
      body: {
        value: true,
        permission: "/COMMITMENT",
      },
    });
    expect(setPermRes).toBeApiOk();

    // Old session is still valid with new permissions
    const session2 = await client.GET("/g/session");
    expect(session2).toBeApiOk();
    expect(session2.data).toStrictEqual({
      publicOrganizationInfo: null,
      session: {
        ...session,
        permissions: [...session.permissions, "/COMMITMENT"],
      },
    });

    // // New session is created
    // const client2 = UtilTest.createClientWithCookie(setPermRes);
    // const session3 = await client2.GET("/g/session");
    // expect(session3).toBeApiOk();
  });

  it("Set and remove permission should work correctly", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const payload = {
      email: "legolas@gmail.com",
      name: "Legolas",
      surname: "Greenleaf",
      phone: "0000000000",
      position: "Lead Performance Engineer",
      password: "1Shot10rc",
    };

    const createRes = await client.POST("/u/base/user/item", {
      body: payload,
    });
    const createdId = createRes.data!.id;

    const getPermRes = await client.GET("/u/base/user/permissions/{userId}", {
      params: { path: { userId: createdId } },
    });
    expect(getPermRes.data).toStrictEqual({
      displayName: `${payload.name} ${payload.surname}`,
      permissions: [],
    });
    expect(getPermRes.data!.permissions).toEqual([]);

    const setPermRes = await client.PUT("/u/base/user/permission/{userId}", {
      params: { path: { userId: createdId } },
      body: {
        value: true,
        permission: "/",
      },
    });
    expect(setPermRes).toBeApiOk();

    const getPermRes2 = await client.GET("/u/base/user/permissions/{userId}", {
      params: { path: { userId: createdId } },
    });
    expect(getPermRes2.data!.permissions).toContain("/");

    const remove = await client.PUT("/u/base/user/permission/{userId}", {
      params: { path: { userId: createdId } },
      body: {
        value: false,
        permission: "/",
      },
    });
    expect(remove).toBeApiOk();

    const getPermRes3 = await client.GET("/u/base/user/permissions/{userId}", {
      params: { path: { userId: createdId } },
    });
    expect(getPermRes3.data!.permissions).not.toContain("/");
  });

  it("Getting not existing user permission should return NOT_FOUND error", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.GET("/u/base/user/permissions/{userId}", {
      params: { path: { userId: "00000000-0000-0000-0000-000000000000" } },
    });
    expect(res).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("GET /u/core/user/display-names without permission should response FORBIDDEN error", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: [],
    });
    const res = await client.GET("/u/base/user/display-names");
    expect(res).toBeApiError(EApiFailCode.FORBIDDEN);
  });

  it("GET /u/core/user/display-names with a minimal permission should response ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: ["/BASE/USER"],
    });
    const res = await client.GET("/u/base/user/display-names");
    expect(res).toBeApiOk();
  });

  it("GET /u/core/user/display-names without organization plan should response PLAN_DISABLED_OP error", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: [] },
    });
    const res = await client.GET("/u/base/user/display-names");
    expect(res).toBeApiError(EApiFailCode.PLAN_DISABLED_OP);
  });

  it("GET /u/core/user/display-names with a minimal organization plan should response ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: ["USER_MANAGEMENT"] },
    });
    const res = await client.GET("/u/base/user/display-names");
    expect(res).toBeApiOk();
  });

  it("PUT /u/core/user/permissions user should not be able to delete his own permission", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const setPermRes = await client.PUT("/u/base/user/permission/{userId}", {
      params: { path: { userId: session.userId } },
      body: {
        value: false,
        permission: "/BASE/USER",
      },
    });
    expect(setPermRes).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("PUT /u/core/user/permissions when root permission deleted user must take core/user permission", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const setPermRes = await client.PUT("/u/base/user/permission/{userId}", {
      params: { path: { userId: session.userId } },
      body: {
        value: false,
        permission: "/",
      },
    });
    expect(setPermRes).toBeApiOk();

    const getPerm = await client.GET("/u/base/user/permissions/{userId}", {
      params: { path: { userId: session.userId } },
    });
    expect(getPerm.data!.permissions).toContain("/BASE/USER");
  });
});
