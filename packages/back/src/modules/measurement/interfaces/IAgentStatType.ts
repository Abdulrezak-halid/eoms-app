
export const DataAgentStatType = ["INIT", "STAT", "SHUTDOWN"] as const;

export type IAgentStatType = (typeof DataAgentStatType)[number];
