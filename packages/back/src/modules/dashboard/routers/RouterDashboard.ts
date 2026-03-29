import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { RouterDashboardWidget } from "./RouterDashboardWidget";

export const RouterDashboard = UtilOpenApi.createRouter<IHonoContextUser>();

RouterDashboard.route("/widget", RouterDashboardWidget);

UtilOpenApi.tag(RouterDashboard, "Module: Dashboard");
