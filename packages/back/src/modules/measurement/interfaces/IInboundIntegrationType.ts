export const DataInboundIntegrationType = ["WEBHOOK", "AGENT"] as const;
export type IInboundIntegrationType =
  (typeof DataInboundIntegrationType)[number];
