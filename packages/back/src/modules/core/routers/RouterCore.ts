/**
 * @file: RouterCore.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 16.03.2025
 * Last Modified Date: 16.03.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IHonoContextUser } from "../interfaces/IContext";
import { UtilOpenApi } from "../utils/UtilOpenApi";
import { RouterCalendar } from "./RouterCalendar";
import { RouterNotification } from "./RouterNotification";

export const RouterCore = UtilOpenApi.createRouter<IHonoContextUser>();

RouterCore.route("/notification", RouterNotification);
RouterCore.route("/calendar", RouterCalendar);

UtilOpenApi.tag(RouterCore, "Module: Core");
