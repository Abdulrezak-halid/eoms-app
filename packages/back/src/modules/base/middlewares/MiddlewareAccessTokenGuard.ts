import { EApiFailCode } from "common";
import { Context, Next } from "hono";

import { ServiceAccessToken } from "@m/base/services/ServiceAccessToken";
import { ApiException } from "@m/core/exceptions/ApiException";
import type { IHonoContextAccessToken } from "@m/core/interfaces/IContext";
import { ServiceMaintenance } from "@m/core/services/ServiceMaintenance";

export async function MiddlewareAccessTokenGuard(
  c: Context<IHonoContextAccessToken>,
  next: Next,
) {
  const token = c.req.header("X-Token");
  if (!token) {
    throw new ApiException(EApiFailCode.UNAUTHORIZED, "Token is missing.");
  }
  const session = await ServiceAccessToken.getSession(c.var, token);
  c.set("session", session);
  c.set("orgId", session.orgId);
  c.set(
    "logger",
    c.var.logger.child({
      orgId: session.orgId,
      permissions: session.permissions,
    }),
  );

  const maintenance = await ServiceMaintenance.get(c.var);
  if (maintenance) {
    throw new ApiException(
      EApiFailCode.MAINTENANCE,
      "The system is under maintenance. Please try again later.",
    );
  }

  return await next();
}
