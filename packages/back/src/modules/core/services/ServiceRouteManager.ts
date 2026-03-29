import type { OpenAPIHono } from "@hono/zod-openapi";

import type { IHonoContextUser } from "../interfaces/IContext";
import { RouterG } from "../routers/RouterG";
import { RouterRoot } from "../routers/RouterRoot";
import { RouterU } from "../routers/RouterU";
import { UtilOpenApi } from "../utils/UtilOpenApi";

type IRouteMapList = { path: string; router: OpenAPIHono<IHonoContextUser> }[];

const guestRouters: IRouteMapList = [];
const userRouters: IRouteMapList = [];

export namespace ServiceRouteManager {
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function addGuestRoute(path: string, router: OpenAPIHono<any>) {
    guestRouters.push({
      path,
      router,
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function addUserRoute(path: string, router: OpenAPIHono<any>) {
    userRouters.push({
      path,
      router,
    });
  }
  
  export function assignRootRoutes() {
    for (const { path, router } of guestRouters) {
      RouterG.route(path, router);
    }
    UtilOpenApi.tag(RouterG, "Guest");

    for (const { path, router } of userRouters) {
      RouterU.route(path, router);
    }
    RouterRoot.route("/g", RouterG);
    RouterRoot.route("/u", RouterU);
  }
}
