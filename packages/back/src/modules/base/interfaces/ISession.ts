/**
 * @file: ISession.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.11.2024
 * Last Modified Date: 06.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IOrganizationPlan } from "./IOrganizationPlan";
import { IPermission } from "./IPermission";

export interface ISession {
  isUserToken?: boolean;
  token: string;
  orgId: string; // TODO deprecated, use c.orgId instead
  userId: string;
  permissions: IPermission[];
  orgPlan: IOrganizationPlan;
}
