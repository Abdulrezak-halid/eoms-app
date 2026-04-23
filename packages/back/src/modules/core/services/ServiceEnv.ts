import { config } from "dotenv";

import { type IEnv } from "../interfaces/IEnv";

let env: IEnv | undefined;

export namespace ServiceEnv {
  export function init() {
    const file = config();
    const e = { ...file.parsed, ...process.env };
    if (
      !e.MODE_EXPORT_API_SCHEMA &&
      (!e ||
        !e.PORT ||
        !e.DB_HOST ||
        !e.DB_USER ||
        !e.DB_PASSWORD ||
        !e.DB_NAME ||
        !e.COOKIE_SECRET)
    ) {
      throw new Error("Env file is not set or some env fields are missing.");
    }

    env = {
      ...(e as unknown as IEnv),
      ENV_NAME: e.ENV_NAME || "dev",

      // Note: Same default values must be added to drizzle.config.ts
      DB_PORT: e.DB_PORT ? parseInt(e.DB_PORT) : 5432,
      DB_MIG_DIR: e.DB_MIG_DIR || "migrations.dev",
      DB_RESET_EACH_RUN: e.DB_RESET_EACH_RUN === "true",

      AMQP_PORT: e.AMQP_PORT ? parseInt(e.AMQP_PORT) : undefined,

      SECURE_COOKIE: e.SECURE_COOKIE === "true",
      WORKSPACE_ROOT_DOMAINS: e.WORKSPACE_ROOT_DOMAINS?.split(",") || [
        "localhost",
      ],
    };

    // Extra checks
    if (isProd() && !env.HCAPTCHA_SECRET_KEY) {
      throw new Error("Captcha is not configured on production environment");
    }
  }

  export function get() {
    if (!env) {
      throw new Error("Env file is not loaded yet.");
    }
    return env;
  }

  export function isProd() {
    // It is important to use ServiceEnv for tests that mocks this service
    const e = ServiceEnv.get();
    return (
      e.ENV_NAME === "alpha" ||
      e.ENV_NAME === "beta" ||
      e.ENV_NAME === "staging" ||
      e.ENV_NAME === "prod"
    );
  }

  export function isTest() {
    // It is important to use ServiceEnv for tests that mocks this service
    const e = ServiceEnv.get();
    // development_test is for PatchDevSeed
    return e.ENV_NAME === "test" || e.ENV_NAME === "development_test";
  }
}
