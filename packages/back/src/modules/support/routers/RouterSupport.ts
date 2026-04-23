import { guardOrganizationPlanFeature } from "@m/base/middlewares/guardOrganizationPlanFeature";
import { guardPermission } from "@m/base/middlewares/guardPermission";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { RouterCopMeasurementPlan } from "@m/support/routers/RouterCopMeasurementPlan";
import { RouterMaintenanceActivity } from "@m/support/routers/RouterMaintenanceActivity";

import { RouterCalibrationPlan } from "./RouterCalibrationPlan";
import { RouterCommunicationAwarenessPlan } from "./RouterCommunicationAwarenessPlan";
import { RouterCriticalOperationalParameter } from "./RouterCriticalOperationalParameter";
import { RouterEnpiMeasurementPlan } from "./RouterEnpiMeasurementPlan";
import { RouterProcurement } from "./RouterProcurement";
import { RouterProcurementProcedure } from "./RouterProcurementProcedure";
import { RouterTraining } from "./RouterTraining";

export const RouterSupport = UtilOpenApi.createRouter<IHonoContextUser>();

RouterSupport.use(guardOrganizationPlanFeature("ISO50001"));
RouterSupport.use(guardPermission("/SUPPORT"));

RouterSupport.route("/calibration-plan", RouterCalibrationPlan);
RouterSupport.route(
  "/communication-awareness-plan",
  RouterCommunicationAwarenessPlan,
);
RouterSupport.route("/procurement", RouterProcurement);
RouterSupport.route("/procurement-procedure", RouterProcurementProcedure);
RouterSupport.route("/maintenance-activity", RouterMaintenanceActivity);
RouterSupport.route(
  "/critical-operational-parameter",
  RouterCriticalOperationalParameter,
);
RouterSupport.route("/enpi-measurement-plan", RouterEnpiMeasurementPlan);
RouterSupport.route("/cop-measurement-plan", RouterCopMeasurementPlan);

RouterSupport.route("/training", RouterTraining);

UtilOpenApi.tag(RouterSupport, "Module: Support");
