export const DataPlanType = ["INTERNAL", "EXTERNAL"] as const;
export type IPlanType = (typeof DataPlanType)[number];
