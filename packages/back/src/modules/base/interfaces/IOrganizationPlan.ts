import { IOrganizationPlanFeature } from "./IOrganizationPlanFeature";

export interface IOrganizationPlan {
  features: IOrganizationPlanFeature[];
  maxUserCount?: number;
}
