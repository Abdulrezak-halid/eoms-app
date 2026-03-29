/**
 * @file: SchemaAgentStat.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 02.10.2025
 * Last Modified Date: 02.10.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

// Schema is the same as eoms-agent-worker
export const SchemaAgentStat = z.object({
  arch: z.string(),
  memoryTotal: z.number(),
  memoryFree: z.number(),
  host: z.string(),
  platform: z.string(),
  cpu: z.array(
    z.object({
      model: z.string(),
      speed: z.number(),
      times: z.object({
        user: z.number(),
        nice: z.number(),
        sys: z.number(),
        idle: z.number(),
        irq: z.number(),
      }),
    }),
  ),
  net: z.array(
    z.object({
      name: z.string(),
      ips: z.array(
        z.object({
          address: z.string(),
          netmask: z.string(),
          family: z.union([z.literal("IPv4"), z.literal("IPv6")]),
          mac: z.string(),
          internal: z.boolean(),
          cidr: z.nullable(z.string()),
          scopeid: z.optional(z.number()),
        }),
      ),
    }),
  ),
  diskUsage: z.array(
    z.object({
      filesystem: z.string(),
      size: z.string(),
      used: z.string(),
      available: z.string(),
      usePercentage: z.string(),
      mountPoint: z.string(),
    }),
  ),
});
