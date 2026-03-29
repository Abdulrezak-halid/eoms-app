import { guardOrganizationPlanFeature } from "@m/base/middlewares/guardOrganizationPlanFeature";
import { guardPermission } from "@m/base/middlewares/guardPermission";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { RouterComplianceObligation } from "./RouterComplianceObligation";
import { RouterEnergyPolicy } from "./RouterEnergyPolicy";
import { RouterInternalExternalConsideration } from "./RouterInternalExternalConsideration";
import { RouterNeedAndExpectation } from "./RouterNeedAndExpectation";
import { RouterScopeAndLimit } from "./RouterScopeAndLimit";

export const RouterCommitment = UtilOpenApi.createRouter<IHonoContextUser>();

RouterCommitment.use(guardOrganizationPlanFeature("ISO50001"));
RouterCommitment.use(guardPermission("/COMMITMENT"));

RouterCommitment.route("/compliance-obligation", RouterComplianceObligation);
RouterCommitment.route("/energy-policy", RouterEnergyPolicy);
RouterCommitment.route(
  "/internal-external-consideration",
  RouterInternalExternalConsideration,
);
RouterCommitment.route("/need-and-expectation", RouterNeedAndExpectation);
RouterCommitment.route("/scope-and-limit", RouterScopeAndLimit);

UtilOpenApi.tag(RouterCommitment, "Module: Commitment");
