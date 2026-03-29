export const DataQdmsIntegrationBindingPage = [
  "PROCUREMENTS",
  "SCOPE_AND_LIMITS",
  "ENERGY_POLICIES",
  "TRAININGS",
  "COMMUNICATION_AND_AWARENESS_PLANS",
  "DESIGNS",
] as const;

export type IQdmsIntegrationBindingPage =
  (typeof DataQdmsIntegrationBindingPage)[number];
