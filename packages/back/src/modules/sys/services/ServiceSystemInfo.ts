/**
 * @file: ServiceSystemInfo.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.11.2025
 * Last Modified Date: 06.11.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { ServiceMessageQueue } from "@m/core/services/ServiceMessageQueue";

export namespace ServiceSystemInfo {
  export function get() {
    return { services: { messageQueue: ServiceMessageQueue.getStatus() } };
  }
}
