import { guardOrganizationPlanFeature } from "@m/base/middlewares/guardOrganizationPlanFeature";
import { guardPermission } from "@m/base/middlewares/guardPermission";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { RouterSeu } from "@m/measurement/routers/RouterSeu";

import { RouterDataView } from "./RouterDataView";
import { RouterInboundIntegration } from "./RouterInboundIntegration";
import { RouterMeter } from "./RouterMeter";
import { RouterMetric } from "./RouterMetric";
import { RouterOutboundIntegration } from "./RouterOutboundIntegration";

export const RouterMeasurement = UtilOpenApi.createRouter<IHonoContextUser>();

RouterMeasurement.use(guardOrganizationPlanFeature("MEASUREMENT"));
RouterMeasurement.use(guardPermission("/MEASUREMENT"));

RouterMeasurement.route("/seu", RouterSeu);
RouterMeasurement.route("/metric", RouterMetric);
RouterMeasurement.route("/meter", RouterMeter);
RouterMeasurement.route("/outbound-integration", RouterOutboundIntegration);
RouterMeasurement.route("/inbound-integration", RouterInboundIntegration);
RouterMeasurement.route("/data-view", RouterDataView);

UtilOpenApi.tag(RouterMeasurement, "Module: Measurement");
