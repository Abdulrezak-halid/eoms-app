/**
 * @file: RouterInboundIntegration.test.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 11.07.2025
 * Last Modified Date: 11.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { EApiFailCode } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperAgent } from "@m/agent/test/TestHelperAgent";

import { TestHelperMetric } from "./TestHelperMetric";

describe("E2E - RouterInboundIntegration", () => {
  it("Create And Get", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const metric = await TestHelperMetric.create(client, "test metric", {
      unitGroup: "VOLTAGE",
    });
    const resCreate = await client.POST(
      "/u/measurement/inbound-integration/item",
      {
        body: {
          name: "Inbound Integration",
          config: { type: "WEBHOOK" },
          outputs: [
            { outputKey: "default", metricId: metric.id, unit: "VOLTAGE" },
          ],
        },
      },
    );
    expect(resCreate).toBeApiOk();
    const createdId = resCreate.data!.id;

    const res = await client.GET(
      "/u/measurement/inbound-integration/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(res).toBeApiOk();
    expect(res.data).toStrictEqual({
      id: createdId,
      name: "Inbound Integration",
      config: {
        type: "WEBHOOK",
      },
      outputs: [
        {
          outputKey: "default",
          metricId: metric.id,
          metricName: "test metric",
          unit: "VOLTAGE",
        },
      ],
      enabled: true,
      lastRunAt: null,
    });
  });

  it("Create Integration With Wrong Unit.", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const metric = await TestHelperMetric.create(client, "test metric");
    const resCreate = await client.POST(
      "/u/measurement/inbound-integration/item",
      {
        body: {
          name: "Inbound Integration",
          config: { type: "WEBHOOK" },
          outputs: [
            { outputKey: "default", metricId: metric.id, unit: "VOLTAGE" },
          ],
        },
      },
    );

    expect(resCreate).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("Create Integration With Multiple Outputs Having Different Units", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const metricVoltage = await TestHelperMetric.create(
      client,
      "Voltage Metric",
      { unitGroup: "VOLTAGE" },
    );
    const metricCurrent = await TestHelperMetric.create(
      client,
      "Current Metric",
      { unitGroup: "CURRENT" },
    );

    const resCreate = await client.POST(
      "/u/measurement/inbound-integration/item",
      {
        body: {
          name: "Inbound Integration - Multi Output",
          config: { type: "WEBHOOK" },
          outputs: [
            {
              outputKey: "voltage",
              metricId: metricVoltage.id,
              unit: "VOLTAGE",
            },
            {
              outputKey: "current",
              metricId: metricCurrent.id,
              unit: "CURRENT_A",
            },
          ],
        },
      },
    );

    expect(resCreate).toBeApiOk();
    const createdId = resCreate.data!.id;

    const resGet = await client.GET(
      "/u/measurement/inbound-integration/item/{id}",
      { params: { path: { id: createdId } } },
    );

    expect(resGet).toBeApiOk();
    expect(resGet.data).toStrictEqual({
      id: createdId,
      name: "Inbound Integration - Multi Output",
      config: {
        type: "WEBHOOK",
      },
      enabled: true,
      outputs: [
        {
          outputKey: "current",
          metricId: metricCurrent.id,
          metricName: "Current Metric",
          unit: "CURRENT_A",
        },
        {
          outputKey: "voltage",
          metricId: metricVoltage.id,
          metricName: "Voltage Metric",
          unit: "VOLTAGE",
        },
      ],
      lastRunAt: null,
    });
  });

  it("Creating integration with non matching metric units should throw error", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const metricVoltage = await TestHelperMetric.create(
      client,
      "Voltage Metric",
      { unitGroup: "VOLTAGE" },
    );

    const resCreate = await client.POST(
      "/u/measurement/inbound-integration/item",
      {
        body: {
          name: "Inbound Integration - Multi Output",
          config: { type: "WEBHOOK" },
          outputs: [
            {
              outputKey: "current",
              metricId: metricVoltage.id,
              unit: "CURRENT_MA",
            },
          ],
        },
      },
    );

    expect(resCreate).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("Get All", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const metric = await TestHelperMetric.create(client, "test metric", {
      unitGroup: "VOLTAGE",
    });
    const resCreate = await client.POST(
      "/u/measurement/inbound-integration/item",
      {
        body: {
          name: "Inbound Integration",
          config: { type: "WEBHOOK" },
          outputs: [
            { outputKey: "default", metricId: metric.id, unit: "VOLTAGE" },
          ],
        },
      },
    );
    expect(resCreate).toBeApiOk();
    const createdId = resCreate.data!.id;

    const res = await client.GET("/u/measurement/inbound-integration/item");
    expect(res).toBeApiOk();
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          name: "Inbound Integration",
          config: {
            type: "WEBHOOK",
          },
          outputs: [
            {
              outputKey: "default",
              metricId: metric.id,
              metricName: "test metric",
              unit: "VOLTAGE",
            },
          ],
          enabled: true,
          lastRunAt: null,
        },
      ],
    });
  });

  it("Update", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const agentId = await TestHelperAgent.createAndAssign(session.orgId);

    const metric = await TestHelperMetric.create(client, "test metric", {
      unitGroup: "VOLTAGE",
    });
    const resCreate = await client.POST(
      "/u/measurement/inbound-integration/item",
      {
        body: {
          name: "Inbound Integration",
          config: { type: "WEBHOOK" },
          outputs: [
            { outputKey: "default", metricId: metric.id, unit: "VOLTAGE" },
          ],
        },
      },
    );
    expect(resCreate).toBeApiOk();
    const createdId = resCreate.data!.id;

    const resUpdate = await client.PUT(
      "/u/measurement/inbound-integration/item/{id}",
      {
        params: { path: { id: createdId } },
        body: {
          name: "Inbound Integration",
          config: { type: "AGENT", agentId },
          outputs: [
            { outputKey: "default", metricId: metric.id, unit: "VOLTAGE" },
          ],
        },
      },
    );
    expect(resUpdate).toBeApiOk();

    const res = await client.GET(
      "/u/measurement/inbound-integration/item/{id}",
      { params: { path: { id: createdId } } },
    );
    expect(res).toBeApiOk();
    expect(res.data).toStrictEqual({
      id: createdId,
      name: "Inbound Integration",
      config: {
        type: "AGENT",
        agent: {
          id: agentId,
          name: "Test Agent",
        },
      },
      outputs: [
        {
          outputKey: "default",
          metricId: metric.id,
          metricName: "test metric",
          unit: "VOLTAGE",
        },
      ],
      enabled: true,
      lastRunAt: null,
    });
  });

  it("Disable the inbound integration.", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const metric = await TestHelperMetric.create(client, "test metric", {
      unitGroup: "VOLTAGE",
    });
    const resCreate = await client.POST(
      "/u/measurement/inbound-integration/item",
      {
        body: {
          name: "Inbound Integration",
          config: { type: "WEBHOOK" },
          outputs: [
            { outputKey: "default", metricId: metric.id, unit: "VOLTAGE" },
          ],
        },
      },
    );
    expect(resCreate).toBeApiOk();
    const createdId = resCreate.data!.id;

    const resUpdate = await client.PUT(
      "/u/measurement/inbound-integration/item/{id}/enable",
      {
        params: { path: { id: createdId } },
        body: {
          enabled: false,
        },
      },
    );
    expect(resUpdate).toBeApiOk();

    const res = await client.GET(
      "/u/measurement/inbound-integration/item/{id}",
      { params: { path: { id: createdId } } },
    );
    expect(res).toBeApiOk();
    expect(res.data).toStrictEqual({
      id: createdId,
      name: "Inbound Integration",
      config: {
        type: "WEBHOOK",
      },
      outputs: [
        {
          outputKey: "default",
          metricId: metric.id,
          metricName: "test metric",
          unit: "VOLTAGE",
        },
      ],
      enabled: false,
      lastRunAt: null,
    });
  });

  it("Delete", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const metric = await TestHelperMetric.create(client, "test metric", {
      unitGroup: "VOLTAGE",
    });
    const resCreate = await client.POST(
      "/u/measurement/inbound-integration/item",
      {
        body: {
          name: "Inbound Integration",
          config: { type: "WEBHOOK" },
          outputs: [
            { outputKey: "default", metricId: metric.id, unit: "VOLTAGE" },
          ],
        },
      },
    );
    expect(resCreate).toBeApiOk();
    const createdId = resCreate.data!.id;

    const resDelete = await client.DELETE(
      "/u/measurement/inbound-integration/item/{id}",
      {
        params: { path: { id: createdId } },
      },
    );
    expect(resDelete).toBeApiOk();

    const res = await client.GET("/u/measurement/inbound-integration/item");
    expect(res).toBeApiOk();
    expect(res.data).toStrictEqual({
      records: [],
    });
  });
});
