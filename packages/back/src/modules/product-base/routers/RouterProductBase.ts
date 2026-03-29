import { guardOrganizationPlanFeature } from "@m/base/middlewares/guardOrganizationPlanFeature";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { RouterProduct } from "./RouterProduct";

export const RouterProductBase = UtilOpenApi.createRouter<IHonoContextUser>();

RouterProductBase.use(guardOrganizationPlanFeature("PRODUCT"));

RouterProductBase.route("/product", RouterProduct);

UtilOpenApi.tag(RouterProductBase, "Module: Product Base");
