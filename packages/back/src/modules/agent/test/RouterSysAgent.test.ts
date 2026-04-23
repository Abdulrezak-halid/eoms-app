import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { MqConsumerAgentStat } from "@m/measurement/mq-consumers/MqConsumerAgentStat";

describe("E2E - RouterSysAgent", () => {
  it("create an agent", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: ["SYSTEM"] },
    });

    const payload = {
      name: "Test Agent",
      serialNo: "12345",
      description: "Test agent description",
      assignedOrgId: session.orgId,
    };

    const res = await client.POST("/u/sys/agent/item", {
      body: payload,
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();
  });

  it("list all agents", async () => {
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

    const res = await client.GET("/u/sys/agent/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createRes.data!.id,
          ...payload,
          assignedOrg: {
            id: session.orgId,
            displayName: "Example Org.",
          },
          statType: null,
          datetimeStat: null,
        },
      ],
    });
  });

  it("get a specific agent", async () => {
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

    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const res = await client.GET("/u/sys/agent/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(res.data).toStrictEqual({
      id: createdId,
      ...payload,
      assignedOrg: {
        id: session.orgId,
        displayName: "Example Org.",
      },
    });
  });

  it("get a agent stats", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: ["SYSTEM"] },
    });

    const context = UtilTest.createTestContext();

    const createRes = await client.POST("/u/sys/agent/item", {
      body: {
        name: "Test Agent",
        serialNo: "12345",
        description: "Test agent description",
        assignedOrgId: session.orgId,
      },
    });

    const agentId = createRes.data!.id;

    const mockStats = {
      arch: "x64",
      platform: "linux",
      host: "test-server",
      memoryTotal: 16000000,
      memoryFree: 8000000,
      cpu: [
        {
          model: "Intel Core i7",
          speed: 2500,
          times: { user: 100, nice: 0, sys: 50, idle: 1000, irq: 0 },
        },
      ],
      net: [
        {
          name: "eth0",
          ips: [
            {
              address: "192.168.1.10",
              netmask: "255.255.255.0",
              family: "IPv4",
              mac: "00:00:00:00:00:00",
              internal: false,
              cidr: "192.168.1.10/24",
            },
          ],
        },
      ],
      diskUsage: [
        {
          filesystem: "/dev/sda1",
          size: "500G",
          used: "100G",
          available: "400G",
          usePercentage: "20%",
          mountPoint: "/",
        },
      ],
    };

    const payload = {
      version: "0.1",
      agentId,
      message: {
        type: "STAT",
        stats: mockStats,
      },
    };

    await MqConsumerAgentStat(context, Buffer.from(JSON.stringify(payload)));

    const res = await client.GET("/u/sys/agent/item/{id}/stats", {
      params: { path: { id: agentId } },
    });

    expect(res.data).toStrictEqual({
      id: agentId,
      name: "Test Agent",
      serialNo: "12345",
      description: "Test agent description",
      datetimeStat: expect.any(String),
      statType: "STAT",
      stats: mockStats,
    });
  });

  it("update an agent", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: ["SYSTEM"] },
    });

    const payload = {
      name: "Test Agent",
      serialNo: "12345",
      description: "Test agent description",
      assignedOrgId: session.orgId,
    };

    const createRes = await client.POST("/u/sys/agent/item", {
      body: payload,
    });

    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const updatePayload = {
      name: "Updated Agent",
      serialNo: "54321",
      description: "Updated agent description",
    };

    const updateRes = await client.PUT("/u/sys/agent/item/{id}", {
      params: { path: { id: createdId } },
      body: {
        ...updatePayload,
        assignedOrgId: session.orgId,
      },
    });

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/sys/agent/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      ...updatePayload,
      assignedOrg: {
        id: session.orgId,
        displayName: "Example Org.",
      },
    });
  });

  it("delete an agent", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: ["SYSTEM"] },
    });

    const payload = {
      name: "Test Agent",
      serialNo: "12345",
      description: "Test agent description",
      assignedOrgId: session.orgId,
    };

    const createRes = await client.POST("/u/sys/agent/item", {
      body: payload,
    });

    const createdId = createRes.data!.id;

    const deleteRes = await client.DELETE("/u/sys/agent/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(deleteRes).toBeApiOk();

    const getRes = await client.GET("/u/sys/agent/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });
});
