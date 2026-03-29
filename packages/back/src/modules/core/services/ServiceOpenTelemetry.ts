/**
 * @file: ServiceOpenTelemetry.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 01.03.2025
 * Last Modified Date: 02.05.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  AlwaysOnSampler,
  ParentBasedSampler,
  SamplingDecision,
} from "@opentelemetry/sdk-trace-base";
import { Logger } from "pino";

import { APP_NAME, VERSION } from "@/constants";

import { IEnv } from "../interfaces/IEnv";
import { errorToObject } from "../middlewares/ErrorHandler";
import { ServiceLog } from "./ServiceLog";

export namespace ServiceOpenTelemetry {
  let sdk: NodeSDK;
  let logger: Logger | undefined;

  export function init(e: IEnv) {
    if (!e.OTEL_TRACE_EXPORT_URL) {
      return;
    }

    logger = ServiceLog.getLogger().child({ name: "ServiceOpenTelemetry" });

    const rootSampler = new ParentBasedSampler({
      root: new AlwaysOnSampler(),
    });

    sdk = new NodeSDK({
      serviceName: `${APP_NAME}_${VERSION}_${e.ENV_NAME}`,
      traceExporter: new OTLPTraceExporter({
        url: e.OTEL_TRACE_EXPORT_URL,
      }),
      sampler: {
        // Do sample Loki http traces
        shouldSample: (...args) => {
          const url = args[4]?.["http.url"] || args[4]?.["url.full"];

          if (
            typeof url === "string" &&
            url.includes(e.LOG_LOKI_ENDPOINT || "loki")
          ) {
            return { decision: SamplingDecision.NOT_RECORD };
          }

          return rootSampler.shouldSample(...args);
        },
      },
    });

    sdk.start();

    logger.info("Service is inited.");
  }

  export async function shutdown() {
    try {
      await sdk?.shutdown();
      logger?.info("Service is shutdown.");
    } catch (e) {
      logger?.error({ error: errorToObject(e) }, "Service shutdown is failed.");
    }
  }
}
