import { guardOrganizationPlanFeature } from "@m/base/middlewares/guardOrganizationPlanFeature";
import { guardPermission } from "@m/base/middlewares/guardPermission";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { RouterNonconformity } from "@m/internal-audit/routers/RouterNonconformity";

import { RouterPlan } from "./RouterPlan";
import { RouterWorkflow } from "./RouterWorkflow";

export const RouterInternalAudit = UtilOpenApi.createRouter<IHonoContextUser>();

RouterInternalAudit.use(guardOrganizationPlanFeature("ISO50001"));
RouterInternalAudit.use(guardPermission("/INTERNAL_AUDIT"));

RouterInternalAudit.route("/plan", RouterPlan);
RouterInternalAudit.route("/nonconformity", RouterNonconformity);
RouterInternalAudit.route("/workflow", RouterWorkflow);

UtilOpenApi.tag(RouterInternalAudit, "Module: Internal Audit");
