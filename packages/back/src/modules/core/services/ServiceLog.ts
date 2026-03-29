import { trace } from "@opentelemetry/api";
import pino from "pino";
import pinoLoki from "pino-loki";
import pinoPretty from "pino-pretty";

import { APP_NAME, VERSION } from "@/constants";

import { IEnv } from "../interfaces/IEnv";

export namespace ServiceLog {
  let logger: pino.Logger;

  export function getLogger() {
    if (!logger) {
      throw new Error("Logger not initialized");
    }
    return logger;
  }

  export function init(e: IEnv) {
    // For the tests to suppress logs
    const logLevel = e.LOG_LEVEL || "info";

    if (logLevel === "silent") {
      logger = pino({ level: "silent" });
      return;
    }

    const pinoStreams = [
      {
        stream: pinoPretty({
          translateTime: "yyyy-mm-dd HH:MM:ss",
          ignore: "pid,hostname",
        }),
      },
    ];

    // Add loki stream to pino if available
    if (e.LOG_LOKI_ENDPOINT) {
      const url = e.LOG_LOKI_ENDPOINT;

      pinoStreams.push({
        stream: pinoLoki({
          host: url,
          labels: {
            service: `${APP_NAME}_${VERSION}_${e.ENV_NAME}`,
            app: APP_NAME,
            version: VERSION,
          },
        }),
      });
    }

    logger = pino(
      {
        level: logLevel,
        mixin: () => ({
          TraceID: trace.getActiveSpan()?.spanContext().traceId,
        }),
      },
      pino.multistream(pinoStreams),
    );
  }
}
