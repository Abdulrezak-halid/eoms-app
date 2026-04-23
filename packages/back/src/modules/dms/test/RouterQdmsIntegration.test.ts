import { EApiFailCode } from "common";
import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { ServiceDb } from "@m/core/services/ServiceDb";
import { ServiceStorage } from "@m/core/services/ServiceStorage";

import { TbQdmsEntry } from "../orm/TbQdmsEntry";
import { ServiceQdmsIntegration } from "../services/ServiceQdmsIntegration";

describe("E2E - Qdms", () => {
  beforeAll(() => {
    vi.spyOn(global, "fetch").mockImplementation(
      (url: string | URL | RequestInfo): Promise<Response> => {
        if (typeof url !== "string") {
          throw new Error("Unsupported test fetch usage.");
        }

        if (url !== "http://example.com/design.pdf") {
          throw new Error(`Url response is not found. Url: ${url}`);
        }

        return Promise.resolve(
          new Response("Dummy Pdf Content", {
            headers: {
              "Content-Type": "plain/text",
            },
          }),
        );
      },
    );
  });

  it("should be ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/dms/qdms-integration/item", {
      body: {
        name: "Qdms",
        bindingPage: "DESIGNS",
        endpointUrl: "http://www.qdms.com/qdms-file.pdf",
      },
    });
    expect(res).toBeApiOk();
  });

  it("should return items", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const payload = {
      name: "Qdms",
      bindingPage: "DESIGNS" as const,
      endpointUrl: "http://www.qdms.com/qdms-file.pdf",
    };
    const createResponse = await client.POST("/u/dms/qdms-integration/item", {
      body: payload,
    });
    const createdId = createResponse.data!.id;
    const res = await client.GET("/u/dms/qdms-integration/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          ...payload,
          isEnabled: false,
          lastFetchedAt: null,
        },
      ],
    });
  });

  it("should return item by id", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const payload = {
      name: "Qdms",
      bindingPage: "DESIGNS" as const,
      endpointUrl: "http://www.qdms.com/qdms-file.pdf",
    };

    const createRes = await client.POST("/u/dms/qdms-integration/item", {
      body: payload,
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET("/u/dms/qdms-integration/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...payload,
      isEnabled: false,
      lastFetchedAt: null,
    });
  });

  it("should update", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/dms/qdms-integration/item", {
      body: {
        name: "Qdms",
        bindingPage: "DESIGNS",
        endpointUrl: "http://www.qdms.com/qdms-file.pdf",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBody = {
      name: "Qdms Updated",
      bindingPage: "TRAININGS" as const,
      endpointUrl: "http://www.qdms.com/qdms-new-file.pdf",
    };

    const updateRes = await client.PUT("/u/dms/qdms-integration/item/{id}", {
      params: { path: { id: createdId } },
      body: updateBody,
    });

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/dms/qdms-integration/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updateBody,
      isEnabled: false,
      lastFetchedAt: null,
    });
  });

  it("should set enabled", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/dms/qdms-integration/item", {
      body: {
        name: "Qdms",
        bindingPage: "DESIGNS",
        endpointUrl: "http://www.qdms.com/qdms-file.pdf",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    await ServiceDb.get()
      .update(TbQdmsEntry)
      .set({ lastFetchedAt: "2025-01-01T00:00:00Z" })
      .where(eq(TbQdmsEntry.id, createdId));

    const updateRes = await client.PUT(
      "/u/dms/qdms-integration/item/{id}/set-enabled",
      {
        params: { path: { id: createdId } },
        body: {
          value: true,
        },
      },
    );

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/dms/qdms-integration/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      name: "Qdms",
      bindingPage: "DESIGNS",
      endpointUrl: "http://www.qdms.com/qdms-file.pdf",
      isEnabled: true,
      lastFetchedAt: "2025-01-01T00:00:00.000Z",
    });
  });

  it("should try set enable without fetch", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/dms/qdms-integration/item", {
      body: {
        name: "Qdms",
        bindingPage: "DESIGNS",
        endpointUrl: "http://www.qdms.com/qdms-file.pdf",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateRes = await client.PUT(
      "/u/dms/qdms-integration/item/{id}/set-enabled",
      {
        params: { path: { id: createdId } },
        body: {
          value: true,
        },
      },
    );

    expect(updateRes).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("should set disable other same binding pages.", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/dms/qdms-integration/item", {
      body: {
        name: "Qdms",
        bindingPage: "DESIGNS",
        endpointUrl: "http://www.qdms.com/qdms-file.pdf",
      },
    });

    expect(res).toBeApiOk();

    const res2 = await client.POST("/u/dms/qdms-integration/item", {
      body: {
        name: "Qdms2",
        bindingPage: "DESIGNS",
        endpointUrl: "http://www.qdms.com/qdms-file.pdf",
      },
    });

    expect(res2).toBeApiOk();

    await ServiceDb.get()
      .update(TbQdmsEntry)
      .set({ lastFetchedAt: "2025-01-01T00:00:00Z" })
      .where(eq(TbQdmsEntry.id, res.data!.id));

    const updateRes = await client.PUT(
      "/u/dms/qdms-integration/item/{id}/set-enabled",
      {
        params: { path: { id: res.data!.id } },
        body: {
          value: true,
        },
      },
    );

    expect(updateRes).toBeApiOk();

    await ServiceDb.get()
      .update(TbQdmsEntry)
      .set({ lastFetchedAt: "2025-01-01T00:00:00Z" })
      .where(eq(TbQdmsEntry.id, res2.data!.id));

    await client.PUT("/u/dms/qdms-integration/item/{id}/set-enabled", {
      params: { path: { id: res2.data!.id } },
      body: {
        value: true,
      },
    });

    const getRes = await client.GET("/u/dms/qdms-integration/item/{id}", {
      params: { path: { id: res.data!.id } },
    });

    expect(getRes.data).toStrictEqual({
      id: res.data!.id,
      name: "Qdms",
      bindingPage: "DESIGNS",
      endpointUrl: "http://www.qdms.com/qdms-file.pdf",
      isEnabled: false,
      lastFetchedAt: "2025-01-01T00:00:00.000Z",
    });
  });

  it("should delete ", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/dms/qdms-integration/item", {
      body: {
        name: "Qdms",
        bindingPage: "DESIGNS",
        endpointUrl: "http://www.qdms.com/qdms-file.pdf",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE("/u/dms/qdms-integration/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(deleteRes).toBeApiOk();
  });

  it("should delete fetched file when record is deleted ", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/dms/qdms-integration/item", {
      body: {
        name: "Qdms",
        bindingPage: "DESIGNS",
        endpointUrl: "http://example.com/design.pdf",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const fetchRes = await client.POST(
      "/u/dms/qdms-integration/item/{id}/fetch",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(fetchRes).toBeApiOk();

    const deleteRes = await client.DELETE("/u/dms/qdms-integration/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(deleteRes).toBeApiOk();

    const file = await ServiceStorage.getAdaptor().get(
      ServiceQdmsIntegration.generateQdmsPath(session.orgId, createdId),
    );

    expect(file).toBeNull();
  });

  it("should response error when record is not found", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const invalidId = "00000000-0000-0000-0000-000000000000";
    const errorRes = await client.GET("/u/dms/qdms-integration/item/{id}", {
      params: { path: { id: invalidId } },
    });
    expect(errorRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("should fetch file", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const payload = {
      name: "Qdms",
      bindingPage: "DESIGNS" as const,
      endpointUrl: "http://example.com/design.pdf",
    };

    const createRes = await client.POST("/u/dms/qdms-integration/item", {
      body: payload,
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const fetchRes = await client.POST(
      "/u/dms/qdms-integration/item/{id}/fetch",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(fetchRes).toBeApiOk();

    const file = await ServiceStorage.getAdaptor().get(
      ServiceQdmsIntegration.generateQdmsPath(session.orgId, createdId),
    );

    expect(file?.buffer.toString()).toBe("Dummy Pdf Content");
  });

  it("should get file", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const payload = {
      name: "Qdms",
      bindingPage: "DESIGNS" as const,
      endpointUrl: "http://example.com/design.pdf",
    };

    const createRes = await client.POST("/u/dms/qdms-integration/item", {
      body: payload,
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const fetchRes = await client.POST(
      "/u/dms/qdms-integration/item/{id}/fetch",
      {
        params: { path: { id: createdId } },
      },
    );

    expect(fetchRes).toBeApiOk();

    const fileRes = await client.GET("/u/dms/qdms-integration/item/{id}/file", {
      params: { path: { id: createdId } },
      parseAs: "text",
    });
    expect(fileRes).toBeApiOk();
    expect(fileRes.data).toBe("Dummy Pdf Content");
  });

  it("should return integration id when set enabled true", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    await client.POST("/u/planning/design/item", {
      body: {
        name: "testname",
        no: 2,
        purpose: "purpose",
        impact: "impact",
        estimatedSavings: 2,
        estimatedAdditionalCost: 3,
        estimatedTurnaroundMonths: 4,
        leaderUserId: session.userId,
        potentialNonEnergyBenefits: "test1",
      },
    });
    const payload = {
      name: "Qdms",
      bindingPage: "DESIGNS" as const,
      endpointUrl: "http://www.qdms.com/qdms-file.pdf",
    };
    const createResponse = await client.POST("/u/dms/qdms-integration/item", {
      body: payload,
    });

    await ServiceDb.get()
      .update(TbQdmsEntry)
      .set({ lastFetchedAt: "2025-01-01T00:00:00Z" })
      .where(eq(TbQdmsEntry.id, createResponse.data!.id));

    const updateRes = await client.PUT(
      "/u/dms/qdms-integration/item/{id}/set-enabled",
      {
        params: { path: { id: createResponse.data!.id } },
        body: {
          value: true,
        },
      },
    );

    expect(updateRes).toBeApiOk();

    const design = await client.GET("/u/planning/design/item");
    expect(design.data?.qdmsIntegrationId).toStrictEqual(
      createResponse.data!.id,
    );
  });

  it("should not return integration id when set enabled false", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    await client.POST("/u/planning/design/item", {
      body: {
        name: "testname",
        no: 2,
        purpose: "purpose",
        impact: "impact",
        estimatedSavings: 2,
        estimatedAdditionalCost: 3,
        estimatedTurnaroundMonths: 4,
        leaderUserId: session.userId,
        potentialNonEnergyBenefits: "test1",
      },
    });
    const payload = {
      name: "Qdms",
      bindingPage: "DESIGNS" as const,
      endpointUrl: "http://www.qdms.com/qdms-file.pdf",
    };
    await client.POST("/u/dms/qdms-integration/item", {
      body: payload,
    });

    const design = await client.GET("/u/planning/design/item");
    expect(design.data?.qdmsIntegrationId).toBeUndefined();
  });

  it("should response FORBIDDEN error when it is without permission", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: [],
    });
    const res = await client.GET("/u/dms/qdms-integration/item");
    expect(res).toBeApiError(EApiFailCode.FORBIDDEN);
  });

  it("should response ok when it is with a minimal permission", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: ["/DMS/QDMS_INTEGRATION"],
    });
    const res = await client.GET("/u/dms/qdms-integration/item");
    expect(res).toBeApiOk();
  });

  it("should respond PLAN_DISABLED_OP error without correct organization plan feature", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: [] },
    });
    const res = await client.GET("/u/dms/qdms-integration/item");
    expect(res).toBeApiError(EApiFailCode.PLAN_DISABLED_OP);
  });

  it("should work with correct organization plan feature", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: ["QDMS"] },
    });
    const res = await client.GET("/u/dms/qdms-integration/item");
    expect(res).toBeApiOk();
  });
});
