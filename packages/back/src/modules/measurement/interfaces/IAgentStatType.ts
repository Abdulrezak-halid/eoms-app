/**
 * @file: IAgentStatType.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 02.10.2025
 * Last Modified Date: 02.10.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */

export const DataAgentStatType = ["INIT", "STAT", "SHUTDOWN"] as const;

export type IAgentStatType = (typeof DataAgentStatType)[number];
