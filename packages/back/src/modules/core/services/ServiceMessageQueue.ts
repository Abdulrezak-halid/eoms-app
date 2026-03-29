import {
  Channel,
  ChannelModel,
  ConsumeMessage,
  connect as connectAmqp,
} from "amqplib";
import { Logger } from "pino";

import { ConnectionManager } from "@m/core/utils/ConnectionManager";
import { ISystemServiceStatus } from "@m/sys/interfaces/ISystemServiceStatus";

import { IContextCore } from "../interfaces/IContext";
import { MaybePromise } from "../interfaces/MaybePromise";
import { errorToObject } from "../middlewares/ErrorHandler";
import { UtilContext } from "../utils/UtilContext";
import { ServiceEnv } from "./ServiceEnv";
import { ServiceLog } from "./ServiceLog";

type IMqConsumerHandler = (
  context: IContextCore,
  message: Buffer,
) => MaybePromise<void>;

interface IOptions {
  isTopic?: boolean;
  isTransient?: boolean;
}

const consumers: {
  queue: string;
  handler: IMqConsumerHandler;
  options?: IOptions;
}[] = [];

export namespace ServiceMessageQueue {
  let logger: Logger | undefined;

  let connection: ChannelModel | undefined;
  let channel: Channel | undefined;

  let connectionManager: ConnectionManager | undefined;

  // For status reporting
  export function getStatus(): ISystemServiceStatus {
    return !connectionManager
      ? "NOT_INITED"
      : connectionManager.isConnecting()
        ? "CONNECTING"
        : connectionManager.isConnected()
          ? "CONNECTED"
          : "CLOSED";
  }

  export function registerConsumer(
    queue: string,
    handler: IMqConsumerHandler,
    options?: IOptions,
  ) {
    if (connection) {
      throw new Error("Cannot register consumer after init.");
    }

    consumers.push({ queue, handler, options });
    logger?.info({ queue }, "Registered message queue consumer.");
  }

  async function handleUnexpectedClose() {
    logger?.error("Message broker connection is closed unexpectedly.");
    await connectionManager?.reconnect();
  }
  async function handleError(e: unknown) {
    logger?.error(
      { error: errorToObject(e) },
      "Message broker connection is errored.",
    );
    await connectionManager?.reconnect();
  }

  async function handleConnect() {
    const env = ServiceEnv.get();
    connection = await connectAmqp({
      hostname: env.AMQP_HOST,
      port: env.AMQP_PORT,
      username: env.AMQP_USER,
      password: env.AMQP_PASSWORD,
    });

    connection.on("close", handleUnexpectedClose);
    connection.on("error", handleError);

    channel = await connection.createChannel();

    logger?.info("Connected to message broker.");

    await channel.prefetch(1);

    for (const consumer of consumers) {
      const queue = consumer.queue;
      await channel.assertQueue(
        queue,
        consumer.options?.isTransient
          ? { exclusive: true, durable: false }
          : { durable: true },
      );
      if (consumer.options?.isTopic) {
        await channel.bindQueue(queue, "amq.topic", queue);
      }

      // Keep channel to benefit inside handler.
      const ch = channel;
      await ch.consume(queue, async (message: ConsumeMessage | null) => {
        const context = UtilContext.createContext("AMQP_CONSUMER", { queue });

        if (!message) {
          context.logger.warn("Consumed null message.");
          return;
        }

        if (message.content.length < 1000) {
          context.logger.info(
            { message: message.content.toString() },
            "Consumed a message.",
          );
        } else {
          context.logger.info(
            { messageLength: message.content.length },
            "Consumed a big message.",
          );
        }

        try {
          await consumer.handler(context, message.content);

          ch.ack(message);
        } catch (err) {
          // TODO
          context.logger.error(
            { error: errorToObject(err) },
            "Handler is failed.",
          );

          ch.nack(message, false, false);
        }
      });

      logger?.info({ queue, options: consumer.options }, "Setup consumer.");
    }
  }

  async function handleCleanup() {
    if (connection) {
      connection.off("close", handleUnexpectedClose);
      connection.off("error", handleError);
      try {
        await connection.close();
      } catch (e) {
        void e;
      }
      connection = undefined;
      channel = undefined;
    }
  }

  export async function init() {
    logger = ServiceLog.getLogger().child({
      name: "ServiceMessageQueue",
    });
    if (!ServiceEnv.get().AMQP_HOST) {
      logger.warn(
        "Message broker configuration is not set. Skipped connection.",
      );
      return;
    }

    connectionManager = new ConnectionManager(handleConnect, {
      logger,
      cbCleanup: handleCleanup,
    });
    await connectionManager.open();

    logger.info("Message queue service is inited.");
  }

  export async function shutdown() {
    await connectionManager?.close();
    logger?.info("Message queue service is shutdown.");
  }

  function getChannel() {
    if (!channel) {
      throw new Error("Tried to get channel before message queue init.");
    }

    return channel;
  }

  export async function produce(queue: string, message: Buffer) {
    const ch = getChannel();
    await ch.assertQueue(queue, { durable: true });
    ch.sendToQueue(queue, message);
    logger?.info({ queue }, "Produced a message");
  }

  export function publishToTopic(topic: string, message: Buffer) {
    getChannel().publish("amq.topic", topic, message);
    logger?.info({ topic }, "Published a message to a topic.");
  }
}
