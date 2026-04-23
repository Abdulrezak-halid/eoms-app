import { ServiceMessageQueue } from "@m/core/services/ServiceMessageQueue";

export namespace ServiceSystemInfo {
  export function get() {
    return { services: { messageQueue: ServiceMessageQueue.getStatus() } };
  }
}
