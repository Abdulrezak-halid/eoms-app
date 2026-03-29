import { afterAll, beforeEach, describe, it } from "vitest";
import { expect } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { ServiceEnpi } from "@m/analysis/services/ServiceEnpi";
import { IContextCore, IContextUser } from "@m/core/interfaces/IContext";
import { ServiceJob } from "@m/core/services/ServiceJob";

import {
  PatchDevSeedStage1,
  PatchDevSeedStage2,
} from "../patches/PatchDevSeed";

describe("PatchDevSeed", () => {
  let c: IContextCore;
  let cu: IContextUser;

  beforeEach(async () => {
    c = UtilTest.createTestContext();
    cu = await UtilTest.createTestContextUser();
  });

  afterAll(async () => {
    // Shutdown the job service to ensure no open handles or active connections prevent the test runner from exiting.
    await ServiceJob.shutdown();
  });

  it("must run successfully", async () => {
    // PatchDevSeed do not run test environment, that's why env name is changed
    c.env.ENV_NAME = "development_test";
    await expect(PatchDevSeedStage1.handler(c)).resolves.not.toThrow();
    await expect(PatchDevSeedStage2.handler(c)).resolves.not.toThrow();

    // Check that if dev seed was actually added some records.
    const enpi = await ServiceEnpi.getAll(cu);
    expect(enpi.length).toBeGreaterThan(0);
  });
});
