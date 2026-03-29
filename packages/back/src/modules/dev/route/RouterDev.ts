import { IHonoContextCore } from "@m/core/interfaces/IContext";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { RouterDevMockSource } from "./RouterDevMockSource";
import { RouterDevReport } from "./RouterDevReport";
import { RouterDevWsNotification } from "./RouterDevWsNotification";

export const RouterDev = UtilOpenApi.createRouter<IHonoContextCore>();

RouterDev.route("/mock-source", RouterDevMockSource);
RouterDev.route("/report", RouterDevReport);
RouterDev.route("/ws-notification", RouterDevWsNotification);

UtilOpenApi.tag(RouterDev, "Module: Dev");
