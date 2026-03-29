import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SYSADMIN_EMAIL, SYSADMIN_PASSWORD } from "@/constants";
import { UtilTest } from "@/test/utils/UtilTest";

import * as ServiceMessageQueueModule from "@m/core/services/ServiceMessageQueue";

describe("E2E - RouterMaintenance", () => {
  let shutdownSpy: ReturnType<typeof vi.spyOn>;
  let initSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    shutdownSpy = vi.spyOn(
      ServiceMessageQueueModule.ServiceMessageQueue,
      "shutdown",
    );
    initSpy = vi.spyOn(ServiceMessageQueueModule.ServiceMessageQueue, "init");
  });

  afterEach(() => {
    shutdownSpy.mockRestore();
    initSpy.mockRestore();
  });

  it("should get state", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      username: SYSADMIN_EMAIL,
      password: SYSADMIN_PASSWORD,
    });
    const res = await client.GET("/u/sys/maintenance");
    expect(res.data).toMatchObject({ value: false });
  });

  it("should set state", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      username: SYSADMIN_EMAIL,
      password: SYSADMIN_PASSWORD,
    });
    await client.POST("/u/sys/maintenance", {
      body: {
        value: true,
      },
    });
    const res = await client.GET("/u/sys/maintenance");
    expect(res.data).toMatchObject({ value: true });
  });

  it("should shutdown ServiceMessageQueue when maintenance is enabled", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      username: SYSADMIN_EMAIL,
      password: SYSADMIN_PASSWORD,
    });

    await client.POST("/u/sys/maintenance", {
      body: {
        value: true,
      },
    });

    expect(shutdownSpy).toHaveBeenCalledTimes(1);
    expect(initSpy).not.toHaveBeenCalled();
  });

  it("should init ServiceMessageQueue when maintenance is disabled", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      username: SYSADMIN_EMAIL,
      password: SYSADMIN_PASSWORD,
    });

    await client.POST("/u/sys/maintenance", {
      body: {
        value: true,
      },
    });

    shutdownSpy.mockClear();
    initSpy.mockClear();

    await client.POST("/u/sys/maintenance", {
      body: {
        value: false,
      },
    });

    expect(initSpy).toHaveBeenCalledTimes(1);
    expect(shutdownSpy).not.toHaveBeenCalled();
  });

  // Note: See ServiceMaintenance set method
  // it("should skip setting state, if the state is the same", async () => {
  //   const { client } = await UtilTest.createClientLoggedIn({
  //     username: SYSADMIN_EMAIL,
  //     password: SYSADMIN_PASSWORD,
  //   });

  //   {
  //     const res = await client.GET("/u/sys/maintenance");
  //     expect(res.data).toMatchObject({ value: false });
  //   }

  //   await client.POST("/u/sys/maintenance", {
  //     body: { value: false },
  //   });

  //   expect(initSpy).toHaveBeenCalledTimes(0);
  //   expect(shutdownSpy).toHaveBeenCalledTimes(0);

  //   shutdownSpy.mockClear();
  //   initSpy.mockClear();

  //   {
  //     const res = await client.POST("/u/sys/maintenance", {
  //       body: { value: true },
  //     });
  //     expect(res).toBeApiOk();
  //   }
  //   {
  //     const res = await client.POST("/u/sys/maintenance", {
  //       body: { value: true },
  //     });
  //     expect(res).toBeApiOk();
  //   }
  //   {
  //     const res = await client.GET("/u/sys/maintenance");
  //     expect(res.data).toMatchObject({ value: true });
  //   }

  //   expect(initSpy).toHaveBeenCalledTimes(0);
  //   expect(shutdownSpy).toHaveBeenCalledTimes(1);

  //   shutdownSpy.mockClear();
  //   initSpy.mockClear();

  //   {
  //     const res = await client.POST("/u/sys/maintenance", {
  //       body: { value: false },
  //     });
  //     expect(res).toBeApiOk();
  //   }
  //   {
  //     const res = await client.POST("/u/sys/maintenance", {
  //       body: { value: false },
  //     });
  //     expect(res).toBeApiOk();
  //   }
  //   {
  //     const res = await client.GET("/u/sys/maintenance");
  //     expect(res.data).toMatchObject({ value: false });
  //   }

  //   expect(initSpy).toHaveBeenCalledTimes(1);
  //   expect(shutdownSpy).toHaveBeenCalledTimes(0);
  // });
});
