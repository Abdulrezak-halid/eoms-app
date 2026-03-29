import { EApiFailCode } from "common";
import { Context, Next } from "hono";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IHonoContextUser } from "@m/core/interfaces/IContext";

import { IOrganizationPlanFeature } from "../interfaces/IOrganizationPlanFeature";

export function checkOrganizationPlanFeature(
  orgPlanFeatures: IOrganizationPlanFeature[],
  featureToCheck: IOrganizationPlanFeature,
) {
  if (!orgPlanFeatures.includes(featureToCheck)) {
    throw new ApiException(
      EApiFailCode.PLAN_DISABLED_OP,
      "This operation is not available for current plan.",
    );
  }
}

export function guardOrganizationPlanFeature(
  feature: IOrganizationPlanFeature,
) {
  return async (c: Context<IHonoContextUser>, next: Next) => {
    checkOrganizationPlanFeature(c.var.session.orgPlan.features, feature);
    await next();
  };
}
