import { RouterDepartment } from "@m/base/routers/RouterDepartment";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { RouterUser } from "./RouterUser";
import { RouterUserToken } from "./RouterUserToken";

export const RouterBase = UtilOpenApi.createRouter<IHonoContextUser>();

RouterBase.route("/user", RouterUser);
RouterBase.route("/user-token", RouterUserToken);
RouterBase.route("/department", RouterDepartment);

UtilOpenApi.tag(RouterBase, "Module: Base");
