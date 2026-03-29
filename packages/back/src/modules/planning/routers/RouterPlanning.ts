import { guardOrganizationPlanFeature } from "@m/base/middlewares/guardOrganizationPlanFeature";
import { guardPermission } from "@m/base/middlewares/guardPermission";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { RouterTarget } from "@m/planning/routers/RouterTarget";

import { RouterActionPlan } from "./RouterActionPlan";
import { RouterDesign } from "./RouterDesign";
import { RouterEnergySavingOpportunity } from "./RouterEnergySavingOpportunity";
import { RouterRiskForceFieldAnalysis } from "./RouterRiskForceFieldAnalysis";
import { RouterRiskGapAnalysis } from "./RouterRiskGapAnalysis";
import { RouterRiskSwotAnalysis } from "./RouterRiskSwotAnalysis";

export const RouterPlanning = UtilOpenApi.createRouter<IHonoContextUser>();

RouterPlanning.use(guardOrganizationPlanFeature("ISO50001"));
RouterPlanning.use(guardPermission("/PLANNING"));

RouterPlanning.route("/risk-swot-analysis", RouterRiskSwotAnalysis);
RouterPlanning.route("/risk-gap-analysis", RouterRiskGapAnalysis);
RouterPlanning.route("/action-plan", RouterActionPlan);
RouterPlanning.route(
  "/energy-saving-opportunity",
  RouterEnergySavingOpportunity,
);
RouterPlanning.route(
  "/risk-force-field-analysis",
  RouterRiskForceFieldAnalysis,
);
RouterPlanning.route("/design", RouterDesign);
RouterPlanning.route("/target", RouterTarget);

UtilOpenApi.tag(RouterPlanning, "Module: Planning");
