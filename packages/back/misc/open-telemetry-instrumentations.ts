import { AmqplibInstrumentation } from "@opentelemetry/instrumentation-amqplib";
import { PgInstrumentation } from "@opentelemetry/instrumentation-pg";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import pg from "pg";

// Note: hono instrumentation is done via otel middleware in RouterRoot file

// pg and pg-pool (pg-pool is ignored)
const pgInstrumentation = new PgInstrumentation();

const [modulePg] = pgInstrumentation.getModuleDefinitions();
modulePg.patch?.(pg);

// Node fetch
new UndiciInstrumentation();

// Amqplib
new AmqplibInstrumentation();
