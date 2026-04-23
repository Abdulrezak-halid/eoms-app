import { IOrganizationPlan } from "./IOrganizationPlan";

export interface ISessionAccessToken {
  orgId: string;
  orgPlan: IOrganizationPlan;
  permissions: {
    metricResourceValueMetricIds: string[];
    canListMetrics: boolean;
    canListMeters: boolean;
    canListSeus: boolean;
  };
}
