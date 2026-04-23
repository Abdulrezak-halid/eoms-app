import { RouterEnpi } from "@m/analysis/routers/RouterEnpi";
import { guardOrganizationPlanFeature } from "@m/base/middlewares/guardOrganizationPlanFeature";
import { guardPermission } from "@m/base/middlewares/guardPermission";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { RouterAdvancedRegression } from "./RouterAdvancedRegression";
import { RouterDataView } from "./RouterDataView";
import { RouterCorrelation } from "./RouterCorrelation";
import { RouterLinearRegression } from "./RouterLinearRegression";

export const RouterAnalysis = UtilOpenApi.createRouter<IHonoContextUser>();

RouterAnalysis.use(guardOrganizationPlanFeature("ANALYSES"));
RouterAnalysis.use(guardPermission("/ANALYSIS"));

RouterAnalysis.route("/enpi", RouterEnpi);
RouterAnalysis.route("/data-view", RouterDataView);
RouterAnalysis.route("/correlation", RouterCorrelation);
RouterAnalysis.route("/linear-regression", RouterLinearRegression);
RouterAnalysis.route("/advanced-regression", RouterAdvancedRegression);

UtilOpenApi.tag(RouterAnalysis, "Module: Analysis");
