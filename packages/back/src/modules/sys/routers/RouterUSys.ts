import { guardOrganizationPlanFeature } from "@m/base/middlewares/guardOrganizationPlanFeature";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { RouterSystemInfo } from "./RouterSystemInfo";
import { RouterUSysIssue } from "./RouterUSysIssue";
import { RouterUSysMaintenance } from "./RouterUSysMaintenance";
import { RouterUSysOrganization } from "./RouterUSysOrganization";
import { RouterRuntimePatcher } from "./RouterUSysRuntimePatcher";
import { RouterUSysUser } from "./RouterUSysUser";

export const RouterUSys = UtilOpenApi.createRouter<IHonoContextUser>();

RouterUSys.use(guardOrganizationPlanFeature("SYSTEM"));

RouterUSys.route("/system-info", RouterSystemInfo);
RouterUSys.route("/runtime-patcher", RouterRuntimePatcher);
RouterUSys.route("/organization", RouterUSysOrganization);
RouterUSys.route("/user", RouterUSysUser);
RouterUSys.route("/maintenance", RouterUSysMaintenance);
RouterUSys.route("/issue", RouterUSysIssue);

UtilOpenApi.tag(RouterUSys, "System User");
