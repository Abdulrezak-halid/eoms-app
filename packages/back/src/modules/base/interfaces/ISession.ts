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
