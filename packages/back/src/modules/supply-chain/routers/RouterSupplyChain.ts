import { guardOrganizationPlanFeature } from "@m/base/middlewares/guardOrganizationPlanFeature";
import { guardPermission } from "@m/base/middlewares/guardPermission";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { RouterPipeline } from "./RouterPipeline";

export const RouterSupplyChain = UtilOpenApi.createRouter<IHonoContextUser>();

RouterSupplyChain.use(guardOrganizationPlanFeature("SUPPLY_CHAIN"));
RouterSupplyChain.use(guardPermission("/SUPPLY_CHAIN"));

RouterSupplyChain.route("/pipeline", RouterPipeline);

UtilOpenApi.tag(RouterSupplyChain, "Module: Supply Chain");
