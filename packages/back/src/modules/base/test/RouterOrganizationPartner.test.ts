import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { ApiException } from "@m/core/exceptions/ApiException";

import { ServiceOrganizationPartner } from "../services/ServiceOrganizationPartner";

describe("E2E - RouterOrganizationPartner", () => {
  it("Create Partner", async () => {
    const org1 = await UtilTest.createClientLoggedIn();
    const partnerToken = await org1.client.PUT("/u/organization/partner/token");

    const org2 = await UtilTest.createClientLoggedIn({
      username: "admin@example2.com",
    });

    const partner = await org2.client.POST("/u/organization/partner/item", {
      body: { token: partnerToken.data!.token },
    });

    expect(partner).toBeApiOk();
  });

  it("Get Token User Partner", async () => {
    const org1 = await UtilTest.createClientLoggedIn();
    const partnerToken = await org1.client.PUT("/u/organization/partner/token");

    const org2 = await UtilTest.createClientLoggedIn({
      username: "admin@example2.com",
    });

    const partner = await org2.client.POST("/u/organization/partner/item", {
      body: { token: partnerToken.data!.token },
    });

    expect(partner).toBeApiOk();

    const partnerRec = await org1.client.GET(
      "/u/organization/partner/item/{partnerId}",
      { params: { path: { partnerId: org2.session.orgId } } },
    );

    expect(partnerRec.data).toStrictEqual({
      address: "Example Address",
      createdAt: expect.any(String),
      displayName: "Example Org 2",
      email: "example2@example.com",
      fullName: "Example Organization 2",
      hasBanner: false,
      partnerId: org2.session.orgId,
      phones: ["+1234567890"],
      relationType: "TOKEN_USER",
    });

    // Get partner from otherside
    const partnerRec2 = await org2.client.GET(
      "/u/organization/partner/item/{partnerId}",
      { params: { path: { partnerId: org1.session.orgId } } },
    );

    expect(partnerRec2.data).toStrictEqual({
      address: "Example Address",
      createdAt: expect.any(String),
      displayName: "Example Org.",
      email: "example@example.com",
      fullName: "Example Organization",
      hasBanner: false,
      partnerId: org1.session.orgId,
      phones: ["+1234567890"],
      relationType: "TOKEN_OWNER",
    });
  });

  it("Get Partners", async () => {
    const org1 = await UtilTest.createClientLoggedIn();
    const partnerToken = await org1.client.PUT("/u/organization/partner/token");

    const org2 = await UtilTest.createClientLoggedIn({
      username: "admin@example2.com",
    });

    const partner = await org2.client.POST("/u/organization/partner/item", {
      body: { token: partnerToken.data!.token },
    });

    expect(partner).toBeApiOk();

    const partnersRec = await org1.client.GET("/u/organization/partner/item");

    expect(partnersRec.data).toStrictEqual({
      records: [
        {
          displayName: "Example Org 2",
          hasBanner: false,
          partnerId: org2.session.orgId,
          relationType: "TOKEN_USER",
        },
      ],
    });
  });

  it("Remove Partner", async () => {
    const org1 = await UtilTest.createClientLoggedIn({});
    const partnerToken = await org1.client.PUT("/u/organization/partner/token");

    const org2 = await UtilTest.createClientLoggedIn({
      username: "admin@example2.com",
    });

    const partner = await org2.client.POST("/u/organization/partner/item", {
      body: { token: partnerToken.data!.token },
    });

    expect(partner).toBeApiOk();

    await org2.client.DELETE("/u/organization/partner/item/{partnerId}", {
      params: { path: { partnerId: org1.session.orgId } },
    });

    const partnersRec = await org1.client.GET("/u/organization/partner/item");

    expect(partnersRec.data).toStrictEqual({ records: [] });
  });

  it("Organization Partner Created Notification", async () => {
    const org1 = await UtilTest.createClientLoggedIn();
    const partnerToken = await org1.client.PUT("/u/organization/partner/token");

    const org2 = await UtilTest.createClientLoggedIn({
      username: "admin@example2.com",
    });

    const partner = await org2.client.POST("/u/organization/partner/item", {
      body: { token: partnerToken.data!.token },
    });

    expect(partner).toBeApiOk();

    const res = await org1.client.GET("/u/core/notification/list");
    const sortedRes = res.data?.records.sort((a, b) =>
      a.content.type.localeCompare(b.content.type),
    );

    expect(sortedRes).toStrictEqual([
      {
        content: {
          type: "PARTNERSHIP_CREATED",
          organizationName: "Example Org.",
        },
        read: false,
        createdAt: expect.any(String),
        id: expect.any(String),
      },
      {
        content: {
          type: "WELCOME",
        },
        read: false,
        createdAt: expect.any(String),
        id: expect.any(String),
      },
    ]);
  });

  it("should resolve if organization is a valid partner", async () => {
    const contextU = await UtilTest.createTestContextUser();
    const org1 = await UtilTest.createClientLoggedIn();
    const partnerToken = await org1.client.PUT("/u/organization/partner/token");

    const org2 = await UtilTest.createClientLoggedIn({
      username: "admin@example2.com",
    });

    const partnerRes = await org2.client.POST("/u/organization/partner/item", {
      body: { token: partnerToken.data!.token },
    });
    expect(partnerRes).toBeApiOk();

    await expect(
      ServiceOrganizationPartner.checkOrgPartnerShip(contextU, [
        org2.session.orgId,
      ]),
    ).resolves.not.toThrow();
  });

  it("should throw FOREIGN_KEY_NOT_FOUND if organization is not a partner", async () => {
    const contextU = await UtilTest.createTestContextUser();
    const org2 = await UtilTest.createClientLoggedIn({
      username: "admin@example2.com",
    });

    await expect(
      ServiceOrganizationPartner.checkOrgPartnerShip(contextU, [
        org2.session.orgId,
      ]),
    ).rejects.toThrowError(new ApiException(EApiFailCode.BAD_REQUEST));
  });

  it("should respond FORBIDDEN error without permission", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: [],
    });
    const res = await client.GET("/u/organization/partner/item");
    expect(res).toBeApiError(EApiFailCode.FORBIDDEN);
  });

  it("should work with minimal permission", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: ["/BASE/ORGANIZATION_PARTNER"],
    });
    const res = await client.GET("/u/organization/partner/item");
    expect(res).toBeApiOk();
  });

  it("should respond PLAN_DISABLED_OP error without correct organization plan feature", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: [] },
    });
    const res = await client.GET("/u/organization/partner/item");
    expect(res).toBeApiError(EApiFailCode.PLAN_DISABLED_OP);
  });

  it("should work with correct organization plan feature", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: ["ORGANIZATION_PARTNER"] },
    });
    const res = await client.GET("/u/organization/partner/item");
    expect(res).toBeApiOk();
  });
});
