import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { ServiceNotification } from "../services/ServiceNotification";

describe("E2E - RouterNotification", () => {
  it("Notify", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const context = await UtilTest.createTestContextUser();
    const notificationId = await ServiceNotification.notifyUser(
      context,
      context.orgId,
      context.session.userId,
      { type: "TEST" },
    );

    const res = await client.GET("/u/core/notification/list");
    const sortedRes = res.data?.records.sort((a, b) =>
      a.content.type.localeCompare(b.content.type),
    );

    expect(sortedRes).toStrictEqual([
      {
        content: {
          type: "TEST",
        },
        read: false,
        createdAt: expect.any(String),
        id: notificationId,
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

  it("Mark as read", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const context = await UtilTest.createTestContextUser();
    const notificationId = await ServiceNotification.notifyUser(
      context,
      context.orgId,
      context.session.userId,
      { type: "TEST" },
    );

    await client.PUT("/u/core/notification/set-read", { body: {} });

    const res = await client.GET("/u/core/notification/list");
    const sortedRes = res.data?.records.sort((a, b) =>
      a.content.type.localeCompare(b.content.type),
    );

    expect(sortedRes).toStrictEqual([
      {
        content: {
          type: "TEST",
        },
        read: true,
        createdAt: expect.any(String),
        id: notificationId,
      },
      {
        content: {
          type: "WELCOME",
        },
        read: true,
        createdAt: expect.any(String),
        id: expect.any(String),
      },
    ]);
  });

  it("Mark as read by id", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const context = await UtilTest.createTestContextUser();
    const notificationId = await ServiceNotification.notifyUser(
      context,
      context.orgId,
      context.session.userId,
      { type: "TEST" },
    );

    await ServiceNotification.notifyUser(
      context,
      context.orgId,
      context.session.userId,
      { type: "TEST" },
    );

    await client.PUT("/u/core/notification/set-read", {
      body: { id: notificationId },
    });

    const res = await client.GET("/u/core/notification/list");
    const sortedRes = res.data?.records.sort((a, b) =>
      a.content.type.localeCompare(b.content.type),
    );

    expect(sortedRes).toStrictEqual([
      {
        content: {
          type: "TEST",
        },
        read: false,
        createdAt: expect.any(String),
        id: expect.any(String),
      },
      {
        content: {
          type: "TEST",
        },
        read: true,
        createdAt: expect.any(String),
        id: notificationId,
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
});
