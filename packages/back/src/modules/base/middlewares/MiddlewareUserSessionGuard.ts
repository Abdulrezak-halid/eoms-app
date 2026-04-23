/**
 * @file: MiddlewareUserSessionGuard.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 07.01.2025
 * Last Modified Date: 07.01.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import type { Context, Next } from "hono";

import { IHonoContextUser } from "@m/core/interfaces/IContext";

import { ServiceSession } from "../services/ServiceSession";

export async function MiddlewareUserSessionGuard(
  c: Context<IHonoContextUser>,
  next: Next,
) {
  const session = await ServiceSession.validateAndGetSession(c);
  c.set("session", session);
  c.set("orgId", session.orgId);
  c.set(
    "logger",
    c.var.logger.child({
      orgId: session.orgId,
      userId: session.userId,
    }),
  );

  return await next();
}
