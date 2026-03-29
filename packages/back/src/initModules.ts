import { PatchExampleOrgAndUser } from "@m/base/patches/PatchExampleOrgAndUser";
import { PatchSysOrgAndUser } from "@m/base/patches/PatchSysOrgAndUser";
import { RouterBase } from "@m/base/routers/RouterBase";
import { RouterGOrganizationBanner } from "@m/base/routers/RouterGOrganizationBanner";
import { RouterOrganization } from "@m/base/routers/RouterOrganization";
import { IEnv } from "@m/core/interfaces/IEnv";
import { RouterCore } from "@m/core/routers/RouterCore";
import { SchemaWsServerMessage } from "@m/core/schemas/SchemaWsServerMessage";
import { ServiceEnv } from "@m/core/services/ServiceEnv";
import { ServiceRouteManager } from "@m/core/services/ServiceRouteManager";
import { ServiceRuntimePatcher } from "@m/core/services/ServiceRuntimePatcher";
import { ServiceOpenApiDoc } from "@m/dev/services/ServiceOpenApiDoc";
import { RouterUSys } from "@m/sys/routers/RouterUSys";

export function initModules(env: IEnv) {
  ServiceRuntimePatcher.register(PatchSysOrgAndUser);
  if (!ServiceEnv.isProd()) {
    ServiceRuntimePatcher.register(PatchExampleOrgAndUser);
  }

  ServiceRouteManager.addGuestRoute(
    "/organization-banner",
    RouterGOrganizationBanner,
  );
  ServiceRouteManager.addUserRoute("/sys", RouterUSys);

  ServiceRouteManager.addUserRoute("/core", RouterCore);
  ServiceRouteManager.addUserRoute("/base", RouterBase);
  ServiceRouteManager.addUserRoute("/organization", RouterOrganization);

  ServiceOpenApiDoc.registerSchema(
    "IDtoWsServerMessage",
    SchemaWsServerMessage,
  );
}
