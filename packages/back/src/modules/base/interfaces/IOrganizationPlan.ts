/**
 * @file: IOrganizationPlan.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 10.12.2024
 * Last Modified Date: 10.12.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IOrganizationPlanFeature } from "./IOrganizationPlanFeature";

export interface IOrganizationPlan {
  features: IOrganizationPlanFeature[];
  maxUserCount?: number;
}
