import { AmqplibInstrumentation } from "@opentelemetry/instrumentation-amqplib";
import { PgInstrumentation } from "@opentelemetry/instrumentation-pg";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import { build } from "esbuild";
import fs from "fs";
import { openTelemetryPlugin } from "opentelemetry-esbuild-plugin-node";
// import pg from "pg";

const shieldPlugin = {
  name: "shield-vega-canvas",
  setup(pluginBuild) {
    pluginBuild.onResolve({ filter: /^vega-canvas$/ }, (args) => {
      return { path: args.path, external: true };
    });
  },
};

// Instrumentations
// pg and pg-pool (pg-pool is ignored)
const pgInstrumentation = new PgInstrumentation();
// const [modulePg] = pgInstrumentation.getModuleDefinitions();
// modulePg.patch?.(pg);
// Node fetch
const undiciInstrumentation = new UndiciInstrumentation();
// Amqplib
const amqplibInstrumentation = new AmqplibInstrumentation();

async function run() {
  const result = await build({
    entryPoints: ["./src/index.ts"],
    tsconfig: "tsconfig.app.json",
    platform: "node",
    bundle: true,
    outdir: "dist",
    outExtension: { ".js": ".cjs" },
    logLevel: "info",
    metafile: Boolean(process.env.ESBUILD_METAFILE),
    plugins: [
      shieldPlugin,
      openTelemetryPlugin({
        instrumentations: [
          pgInstrumentation,
          undiciInstrumentation,
          amqplibInstrumentation,
        ],
      }),
    ],
  });

  if (process.env.ESBUILD_METAFILE) {
    fs.writeFileSync(
      process.env.ESBUILD_METAFILE,
      JSON.stringify(result.metafile),
    );
  }
}

void run();
