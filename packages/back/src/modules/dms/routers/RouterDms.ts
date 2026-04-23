import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { RouterQdmsIntegration } from "./RouterQdmsIntegration";

export const RouterDms = UtilOpenApi.createRouter<IHonoContextUser>();

// RouterQdmsIntegration has its own organization plan guard
RouterDms.route("/qdms-integration", RouterQdmsIntegration);

UtilOpenApi.tag(RouterDms, "Module: Dms");
